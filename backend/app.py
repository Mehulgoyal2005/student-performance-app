# # backend/app.py
# import os
# from flask import Flask, request, redirect, url_for
# import pandas as pd
# import joblib

# # Paths
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# MODEL_PATH = os.path.join(BASE_DIR, "models", "ridge_pipeline.joblib")
# FRONTEND_HTML = os.path.join(BASE_DIR, "frontend", "index.html")

# # Load model (sklearn Pipeline that includes preprocessing)
# if not os.path.exists(MODEL_PATH):
#     raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Place ridge_pipeline.joblib in models/")

# model = joblib.load(MODEL_PATH)

# app = Flask(__name__, static_folder=os.path.join(BASE_DIR, "frontend"), template_folder=None)

# def normalize_str(s):
#     if s is None:
#         return s
#     return str(s).strip().title()

# @app.route("/", methods=["GET"])
# def home():
#     # Serve the static HTML file
#     with open(FRONTEND_HTML, "r", encoding="utf-8") as f:
#         return f.read()

# @app.route("/predict", methods=["POST"])
# def predict():
#     try:
#         # Collect form data (ensure keys match your frontend form names)
#         data = {
#             "age": [int(request.form.get("age", 18))],
#             "gender": [normalize_str(request.form.get("gender"))],
#             "study_hours_per_day": [float(request.form.get("study_hours_per_day", 0.0))],
#             "social_media_hours": [float(request.form.get("social_media_hours", 0.0))],
#             "part_time_job": [normalize_str(request.form.get("part_time_job"))],
#             "attendance_percentage": [float(request.form.get("attendance_percentage", 0.0))],
#             "sleep_hours": [float(request.form.get("sleep_hours", 0.0))],
#             "diet_quality": [normalize_str(request.form.get("diet_quality"))],
#             "exercise_frequency": [int(request.form.get("exercise_frequency", 0))],
#             "parental_education_level": [normalize_str(request.form.get("parental_education_level"))],
#             "internet_Resource_accessibility": [normalize_str(request.form.get("internet_Resource_accessibility"))],
#             "extracurricular_participation": [normalize_str(request.form.get("extracurricular_participation"))]
#         }

#         # Create DataFrame and predict
#         input_df = pd.DataFrame(data)
#         prediction = model.predict(input_df)[0]
#         prediction = round(float(prediction), 2)

#         # Return a small HTML with result and a back link
#         return f"""
#         <html><body style="font-family:Arial;padding:20px;">
#           <h2>Predicted Exam Score: <span style="color:green">{prediction}</span></h2>
#           <p><a href="/">Back to form</a></p>
#         </body></html>
#         """
#     except Exception as e:
#         # Return error message (simple)
#         return f"<h3>Error: {str(e)}</h3><p><a href='/'>Back</a></p>"
    
# if __name__ == "__main__":
#     # Dev server
#     app.run(host="127.0.0.1", port=5000, debug=True)
# backend/app.py

import os
from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import google.generativeai as genai

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
MODEL_PATH = os.path.join(BASE_DIR, "models", "ridge_pipeline.joblib")

# Check model
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

model = joblib.load(MODEL_PATH)

# Initialize Gemini AI (optional - will work without API key but suggestions won't be generated)
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Serve static files from /frontend
app = Flask(__name__, static_folder=FRONTEND_DIR, template_folder=None)
CORS(app)  # Enable CORS for Next.js frontend


def normalize_str(s):
    if s is None:
        return s
    return str(s).strip().title()


def generate_basic_suggestions(form_data, prediction):
    """Generate basic suggestions based on score and profile (fallback when API key not available)"""
    suggestions = []
    
    # Score-based suggestions
    if prediction < 60:
        suggestions.append("Focus on improving your study habits. Aim for at least 4-6 hours of dedicated study time per day.")
        suggestions.append("Increase your attendance rate. Regular class attendance is crucial for understanding course material.")
    elif prediction < 80:
        suggestions.append("Maintain consistent study hours and create a structured study schedule.")
        suggestions.append("Consider reducing social media usage to maximize productive study time.")
    else:
        suggestions.append("Continue maintaining your excellent study habits and academic performance.")
        suggestions.append("Consider helping peers or engaging in advanced topics to further enhance your learning.")
    
    # Profile-based suggestions
    study_hours = float(form_data.get('study_hours_per_day', 0) or 0)
    if study_hours < 3:
        suggestions.append("Increase your daily study hours gradually. Start with 3-4 hours and build up to 5-6 hours.")
    
    attendance = float(form_data.get('attendance_percentage', 0) or 0)
    if attendance < 80:
        suggestions.append("Improve your attendance rate. Aim for at least 85-90% attendance to stay on track with coursework.")
    
    social_media = float(form_data.get('social_media_hours', 0) or 0)
    if social_media > 4:
        suggestions.append("Reduce social media usage. Limit it to 1-2 hours per day to free up more time for studying.")
    
    sleep_hours = float(form_data.get('sleep_hours', 0) or 0)
    if sleep_hours < 6 or sleep_hours > 9:
        suggestions.append("Maintain a consistent sleep schedule of 7-8 hours per night for optimal cognitive performance.")
    
    exercise = int(form_data.get('exercise_frequency', 0) or 0)
    if exercise < 3:
        suggestions.append("Incorporate regular exercise (3-4 times per week) to improve focus and reduce stress.")
    
    return suggestions[:5]


def generate_suggestions(form_data, prediction):
    """Generate personalized improvement suggestions using Gemini AI"""
    if not GEMINI_API_KEY:
        print("GEMINI_API_KEY not set. Using basic suggestions.")
        return generate_basic_suggestions(form_data, prediction)
    
    try:
        # Prepare student data summary
        student_summary = f"""
        Student Profile:
        - Age: {form_data.get('age', 'N/A')}
        - Study Hours per Day: {form_data.get('study_hours_per_day', 'N/A')} hours
        - Social Media Usage: {form_data.get('social_media_hours', 'N/A')} hours/day
        - Part-time Job: {form_data.get('part_time_job', 'N/A')}
        - Attendance: {form_data.get('attendance_percentage', 'N/A')}%
        - Sleep Duration: {form_data.get('sleep_hours', 'N/A')} hours
        - Diet Quality: {form_data.get('diet_quality', 'N/A')}
        - Exercise Frequency: {form_data.get('exercise_frequency', 'N/A')} days/week
        - Parental Education: {form_data.get('parental_education_level', 'N/A')}
        - Internet Access: {form_data.get('internet_Resource_accessibility', 'N/A')}
        - Extracurricular Activities: {form_data.get('extracurricular_participation', 'N/A')}
        
        Predicted Exam Score: {prediction}/100
        """
        
        # Create prompt for Gemini
        prompt = f"""You are an educational advisor. Based on the following student profile and their predicted exam score, provide 4-5 specific, actionable suggestions to help them improve their academic performance.

{student_summary}

Please provide:
1. Specific, actionable suggestions (not generic advice)
2. Focus on the areas that need the most improvement based on their profile
3. Be encouraging and supportive
4. Format as a numbered list
5. Keep each suggestion concise (1-2 sentences)
6. Focus on practical, implementable changes

Suggestions:"""

        # Generate suggestions using Gemini
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        suggestions_text = response.text.strip()
        
        # Parse suggestions into a list
        suggestions = []
        lines = suggestions_text.split('\n')
        for line in lines:
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith('•') or line.startswith('-')):
                # Remove numbering/bullets
                suggestion = line.lstrip('0123456789.-) ').strip()
                if suggestion:
                    suggestions.append(suggestion)
        
        # If parsing didn't work well, return the full text split by newlines
        if not suggestions:
            suggestions = [s.strip() for s in suggestions_text.split('\n') if s.strip()]
        
        return suggestions[:5]  # Return max 5 suggestions
        
    except Exception as e:
        print(f"Error generating suggestions: {str(e)}")
        return None


# --------------------------
#  Serve Frontend Files
# --------------------------
@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/<path:filename>")
def frontend_static(filename):
    return send_from_directory(FRONTEND_DIR, filename)


# --------------------------
#  Prediction API
# --------------------------
@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        # Handle both JSON and form data
        if request.is_json:
            json_data = request.get_json()
            data = {
                "age": [int(json_data.get("age", 18))],
                "gender": [normalize_str(json_data.get("gender"))],
                "study_hours_per_day": [float(json_data.get("study_hours_per_day", 0.0))],
                "social_media_hours": [float(json_data.get("social_media_hours", 0.0))],
                "part_time_job": [normalize_str(json_data.get("part_time_job"))],
                "attendance_percentage": [float(json_data.get("attendance_percentage", 0.0))],
                "sleep_hours": [float(json_data.get("sleep_hours", 0.0))],
                "diet_quality": [normalize_str(json_data.get("diet_quality"))],
                "exercise_frequency": [int(json_data.get("exercise_frequency", 0))],
                "parental_education_level": [normalize_str(json_data.get("parental_education_level"))],
                "internet_Resource_accessibility": [normalize_str(json_data.get("internet_Resource_accessibility"))],
                "extracurricular_participation": [normalize_str(json_data.get("extracurricular_participation"))]
            }
        else:
            data = {
                "age": [int(request.form.get("age", 18))],
                "gender": [normalize_str(request.form.get("gender"))],
                "study_hours_per_day": [float(request.form.get("study_hours_per_day", 0.0))],
                "social_media_hours": [float(request.form.get("social_media_hours", 0.0))],
                "part_time_job": [normalize_str(request.form.get("part_time_job"))],
                "attendance_percentage": [float(request.form.get("attendance_percentage", 0.0))],
                "sleep_hours": [float(request.form.get("sleep_hours", 0.0))],
                "diet_quality": [normalize_str(request.form.get("diet_quality"))],
                "exercise_frequency": [int(request.form.get("exercise_frequency", 0))],
                "parental_education_level": [normalize_str(request.form.get("parental_education_level"))],
                "internet_Resource_accessibility": [normalize_str(request.form.get("internet_Resource_accessibility"))],
                "extracurricular_participation": [normalize_str(request.form.get("extracurricular_participation"))]
            }

        df = pd.DataFrame(data)
        raw_pred = float(model.predict(df)[0])
        clamped_pred = max(0, min(100, raw_pred))
        prediction = round(clamped_pred, 2)

        # Generate suggestions using Gemini AI
        suggestions = generate_suggestions(
            json_data if request.is_json else request.form.to_dict(),
            prediction
        )

        response_data = {
            "success": True,
            "prediction": prediction
        }
        
        # Always include suggestions (either from Gemini or basic fallback)
        if suggestions:
            response_data["suggestions"] = suggestions
        else:
            # Fallback if both fail
            response_data["suggestions"] = [
                "Maintain consistent study hours daily",
                "Focus on improving attendance",
                "Balance study time with adequate rest",
                "Reduce distractions during study sessions"
            ]

        return jsonify(response_data)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


# --------------------------
# Run Dev Server
# --------------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
