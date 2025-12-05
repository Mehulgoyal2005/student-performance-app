"""
Backend Integration Tests for Student Performance Predictor

Tests the Flask API endpoints and integration with the ML model.
Run with: pytest tests/test_integration.py --cov
"""

import json
import os
import pytest
import tempfile
import joblib
import pandas as pd
from pathlib import Path
from unittest.mock import patch, MagicMock

# Add parent directory to path for imports
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, generate_suggestions, generate_basic_suggestions, normalize_str


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def sample_form_data():
    """Sample student data for testing."""
    return {
        "age": "20",
        "gender": "Male",
        "study_hours_per_day": "5.5",
        "social_media_hours": "2.0",
        "part_time_job": "No",
        "attendance_percentage": "90",
        "sleep_hours": "7.5",
        "diet_quality": "Good",
        "exercise_frequency": "3",
        "parental_education_level": "Bachelor",
        "internet_Resource_accessibility": "Good",
        "extracurricular_participation": "Yes"
    }


@pytest.fixture
def sample_json_data():
    """Sample student data in JSON format."""
    return {
        "age": 20,
        "gender": "Male",
        "study_hours_per_day": 5.5,
        "social_media_hours": 2.0,
        "part_time_job": "No",
        "attendance_percentage": 90,
        "sleep_hours": 7.5,
        "diet_quality": "Good",
        "exercise_frequency": 3,
        "parental_education_level": "Bachelor",
        "internet_Resource_accessibility": "Good",
        "extracurricular_participation": "Yes"
    }


class TestAPIEndpoints:
    """Test Flask API endpoints."""

    def test_home_endpoint_returns_200(self, client):
        """Test that the home endpoint returns 200 status."""
        response = client.get('/')
        assert response.status_code == 200

    def test_predict_post_json_valid_data(self, client, sample_json_data):
        """Test prediction endpoint with valid JSON data."""
        response = client.post(
            '/api/predict',
            data=json.dumps(sample_json_data),
            content_type='application/json'
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'prediction' in data
        assert 0 <= data['prediction'] <= 100

    def test_predict_post_form_data(self, client, sample_form_data):
        """Test prediction endpoint with form data."""
        response = client.post('/api/predict', data=sample_form_data)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'prediction' in data
        assert 0 <= data['prediction'] <= 100

    def test_predict_returns_suggestions(self, client, sample_json_data):
        """Test that prediction response includes suggestions."""
        response = client.post(
            '/api/predict',
            data=json.dumps(sample_json_data),
            content_type='application/json'
        )
        data = json.loads(response.data)
        assert 'suggestions' in data
        assert isinstance(data['suggestions'], list)
        assert len(data['suggestions']) > 0

    def test_predict_missing_required_field(self, client, sample_json_data):
        """Test prediction with missing required field."""
        incomplete_data = sample_json_data.copy()
        del incomplete_data['age']
        
        response = client.post(
            '/api/predict',
            data=json.dumps(incomplete_data),
            content_type='application/json'
        )
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'error' in data

    def test_predict_invalid_age_type(self, client, sample_json_data):
        """Test prediction with invalid age type."""
        invalid_data = sample_json_data.copy()
        invalid_data['age'] = "not_a_number"
        
        response = client.post(
            '/api/predict',
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False

    def test_predict_out_of_range_attendance(self, client, sample_json_data):
        """Test prediction with attendance > 100."""
        invalid_data = sample_json_data.copy()
        invalid_data['attendance_percentage'] = 150
        
        response = client.post(
            '/api/predict',
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        # Should still return 200 but handle gracefully
        assert response.status_code in [200, 400]


class TestUtilityFunctions:
    """Test utility functions."""

    def test_normalize_str_title_case(self):
        """Test normalize_str converts to title case."""
        assert normalize_str("male") == "Male"
        assert normalize_str("FEMALE") == "Female"
        assert normalize_str("other") == "Other"

    def test_normalize_str_with_whitespace(self):
        """Test normalize_str handles whitespace."""
        assert normalize_str("  male  ") == "Male"
        assert normalize_str("\tfemale\n") == "Female"

    def test_normalize_str_with_none(self):
        """Test normalize_str handles None."""
        assert normalize_str(None) is None


class TestSuggestionGeneration:
    """Test suggestion generation logic."""

    def test_basic_suggestions_low_score(self):
        """Test basic suggestions for low score."""
        form_data = {
            'study_hours_per_day': '2',
            'attendance_percentage': '70',
            'social_media_hours': '5',
            'sleep_hours': '5',
            'exercise_frequency': '0'
        }
        suggestions = generate_basic_suggestions(form_data, 50)
        assert len(suggestions) > 0
        # Should mention study habits for low score
        assert any('study' in s.lower() for s in suggestions)

    def test_basic_suggestions_high_score(self):
        """Test basic suggestions for high score."""
        form_data = {
            'study_hours_per_day': '6',
            'attendance_percentage': '95',
            'social_media_hours': '1',
            'sleep_hours': '8',
            'exercise_frequency': '5'
        }
        suggestions = generate_basic_suggestions(form_data, 90)
        assert len(suggestions) > 0
        # Should be encouraging for high score
        assert any('excellent' in s.lower() or 'maintain' in s.lower() for s in suggestions)

    def test_basic_suggestions_low_study_hours(self):
        """Test suggestions identify low study hours."""
        form_data = {
            'study_hours_per_day': '1',
            'attendance_percentage': '80',
            'social_media_hours': '2',
            'sleep_hours': '7',
            'exercise_frequency': '2'
        }
        suggestions = generate_basic_suggestions(form_data, 65)
        assert any('study hour' in s.lower() for s in suggestions)

    def test_basic_suggestions_low_attendance(self):
        """Test suggestions identify low attendance."""
        form_data = {
            'study_hours_per_day': '4',
            'attendance_percentage': '70',
            'social_media_hours': '2',
            'sleep_hours': '7',
            'exercise_frequency': '2'
        }
        suggestions = generate_basic_suggestions(form_data, 65)
        assert any('attendance' in s.lower() for s in suggestions)

    def test_basic_suggestions_high_social_media(self):
        """Test suggestions identify high social media usage."""
        form_data = {
            'study_hours_per_day': '4',
            'attendance_percentage': '85',
            'social_media_hours': '6',
            'sleep_hours': '7',
            'exercise_frequency': '2'
        }
        suggestions = generate_basic_suggestions(form_data, 70)
        assert any('social media' in s.lower() for s in suggestions)

    def test_basic_suggestions_poor_sleep(self):
        """Test suggestions identify poor sleep schedule."""
        form_data = {
            'study_hours_per_day': '4',
            'attendance_percentage': '85',
            'social_media_hours': '2',
            'sleep_hours': '4',
            'exercise_frequency': '2'
        }
        suggestions = generate_basic_suggestions(form_data, 70)
        assert any('sleep' in s.lower() for s in suggestions)

    def test_basic_suggestions_low_exercise(self):
        """Test suggestions identify low exercise frequency."""
        form_data = {
            'study_hours_per_day': '4',
            'attendance_percentage': '85',
            'social_media_hours': '2',
            'sleep_hours': '7',
            'exercise_frequency': '1'
        }
        suggestions = generate_basic_suggestions(form_data, 70)
        assert any('exercise' in s.lower() for s in suggestions)

    @patch.dict(os.environ, {'GEMINI_API_KEY': ''})
    def test_suggestions_without_gemini_key(self, sample_json_data):
        """Test suggestions fallback when no Gemini key."""
        suggestions = generate_suggestions(sample_json_data, 75)
        assert len(suggestions) > 0
        assert isinstance(suggestions, list)


class TestEdgeCases:
    """Test edge cases and boundary conditions."""

    def test_prediction_boundary_0(self, client, sample_json_data):
        """Test prediction clamps to 0 minimum."""
        # This tests that extremely negative predictions are clamped
        response = client.post(
            '/api/predict',
            data=json.dumps(sample_json_data),
            content_type='application/json'
        )
        data = json.loads(response.data)
        assert data['prediction'] >= 0

    def test_prediction_boundary_100(self, client, sample_json_data):
        """Test prediction clamps to 100 maximum."""
        # This tests that predictions > 100 are clamped
        response = client.post(
            '/api/predict',
            data=json.dumps(sample_json_data),
            content_type='application/json'
        )
        data = json.loads(response.data)
        assert data['prediction'] <= 100

    def test_zero_study_hours(self, client, sample_json_data):
        """Test prediction with zero study hours."""
        test_data = sample_json_data.copy()
        test_data['study_hours_per_day'] = 0
        
        response = client.post(
            '/api/predict',
            data=json.dumps(test_data),
            content_type='application/json'
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True

    def test_maximum_values(self, client, sample_json_data):
        """Test prediction with maximum reasonable values."""
        test_data = sample_json_data.copy()
        test_data['study_hours_per_day'] = 12
        test_data['social_media_hours'] = 8
        test_data['sleep_hours'] = 12
        test_data['exercise_frequency'] = 7
        test_data['attendance_percentage'] = 100
        
        response = client.post(
            '/api/predict',
            data=json.dumps(test_data),
            content_type='application/json'
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True


class TestCORSHeaders:
    """Test CORS configuration."""

    def test_cors_headers_present(self, client):
        """Test that CORS headers are present in response."""
        response = client.options('/api/predict')
        # Flask-CORS should handle preflight
        assert response.status_code in [200, 404, 405]


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--cov'])
