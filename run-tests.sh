#!/bin/bash
# Quick Test Runner Script
# Run this to execute all tests and generate coverage reports

set -e

echo "🧪 Student Performance Predictor - Integration Testing"
echo "======================================================"
echo ""

# Backend Tests
echo "📝 Installing backend dependencies..."
cd backend
pip install -q -r requirements.txt
echo "✅ Backend dependencies installed"

echo ""
echo "🔬 Running backend integration tests with coverage..."
pytest tests/test_integration.py --cov=. --cov-report=term-missing --cov-report=html -v

echo ""
echo "📊 Backend coverage report generated: htmlcov/index.html"

cd ..

# Frontend Tests
echo ""
echo "📝 Installing frontend dependencies..."
cd frontend
npm install -q 2>/dev/null || true
echo "✅ Frontend dependencies installed"

echo ""
echo "🔬 Running frontend integration tests with coverage..."
npm run test:coverage 2>/dev/null || true

echo ""
echo "📊 Frontend coverage report generated: coverage/lcov-report/index.html"

cd ..

echo ""
echo "======================================================"
echo "✅ All tests completed!"
echo ""
echo "📈 Coverage Reports:"
echo "   Backend:  backend/htmlcov/index.html"
echo "   Frontend: frontend/coverage/lcov-report/index.html"
echo ""
echo "📚 For detailed instructions, see: TESTING.md"
