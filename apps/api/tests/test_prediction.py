import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure the app folder is in the path for resolution during test runs
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.ml.loader import MLLoader
from app.core.config import settings

@pytest.fixture(scope="module")
def client():
    # Initialize the model files once for tests
    loader = MLLoader()
    loader.initialize(settings.MODEL_DIR)
    with TestClient(app) as c:
        yield c

def test_prediction_success(client):
    payload = {
        "age": 32,
        "gender": "Male",
        "education_level": "Bachelor's",
        "job_title": "Software Engineer",
        "years_of_experience": 5
    }
    
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    
    json_data = response.json()
    assert json_data["success"] is True
    assert "prediction" in json_data
    
    prediction = json_data["prediction"]
    assert "salary" in prediction
    assert isinstance(prediction["salary"], float)
    assert prediction["currency"] == "USD"
    assert prediction["model"] == "Ridge Regression"
    
    # Check that predictions are rounded to 2 decimal places
    # We round it and verify that it matches itself
    salary = prediction["salary"]
    assert round(salary, 2) == salary

def test_validation_missing_fields(client):
    # Missing 'gender'
    payload = {
        "age": 32,
        "education_level": "Bachelor's",
        "job_title": "Software Engineer",
        "years_of_experience": 5
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422
    assert response.json()["success"] is False

def test_validation_out_of_bounds_age(client):
    # Age >= 100
    payload = {
        "age": 105,
        "gender": "Male",
        "education_level": "Bachelor's",
        "job_title": "Software Engineer",
        "years_of_experience": 5
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422
    assert response.json()["success"] is False

def test_validation_out_of_bounds_experience(client):
    # Experience > 60
    payload = {
        "age": 32,
        "gender": "Male",
        "education_level": "Bachelor's",
        "job_title": "Software Engineer",
        "years_of_experience": 65
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422
    assert response.json()["success"] is False
