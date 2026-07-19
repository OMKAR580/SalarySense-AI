import os
import sys
import pytest
import io
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

def test_batch_predict_success(client):
    csv_content = (
        "age,gender,education_level,job_title,years_of_experience\n"
        "32,Male,Bachelor's,Software Engineer,5\n"
        "30,Female,Master's,Data Scientist,4\n"
    )
    
    files = {"file": ("employees.csv", csv_content, "text/csv")}
    response = client.post("/api/predict/batch", files=files)
    
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/csv; charset=utf-8"
    assert "attachment" in response.headers["content-disposition"]
    
    # Read response CSV content
    output_content = response.text
    assert "predicted_salary" in output_content
    
    # Verify the output rows
    lines = [line for line in output_content.splitlines() if line.strip()]
    assert len(lines) == 3  # Header + 2 rows
    
    # Verify columns
    headers = lines[0].split(",")
    assert "predicted_salary" in headers
    
    # Verify predictions are present and are floats
    row1 = lines[1].split(",")
    row2 = lines[2].split(",")
    # predicted_salary is the last column
    salary1 = float(row1[-1])
    salary2 = float(row2[-1])
    assert salary1 > 0
    assert salary2 > 0

def test_batch_predict_missing_column(client):
    # Missing 'job_title'
    csv_content = (
        "age,gender,education_level,years_of_experience\n"
        "32,Male,Bachelor's,5\n"
    )
    
    files = {"file": ("employees.csv", csv_content, "text/csv")}
    response = client.post("/api/predict/batch", files=files)
    
    assert response.status_code == 400
    json_data = response.json()
    assert json_data["success"] is False
    assert "Missing column: job_title" in json_data["error"]

def test_batch_predict_empty_csv(client):
    # Empty CSV
    files = {"file": ("employees.csv", "", "text/csv")}
    response = client.post("/api/predict/batch", files=files)
    
    assert response.status_code == 400
    json_data = response.json()
    assert json_data["success"] is False
    assert "empty" in json_data["error"].lower()

def test_batch_predict_invalid_rows(client):
    # Age is out of bounds (>= 100)
    csv_content = (
        "age,gender,education_level,job_title,years_of_experience\n"
        "105,Male,Bachelor's,Software Engineer,5\n"
    )
    
    files = {"file": ("employees.csv", csv_content, "text/csv")}
    response = client.post("/api/predict/batch", files=files)
    
    assert response.status_code == 400
    json_data = response.json()
    assert json_data["success"] is False
    assert "Invalid row" in json_data["error"]

def test_batch_predict_large_file(client):
    # Exceeding the 1000 row limit
    header = "age,gender,education_level,job_title,years_of_experience\n"
    row = "32,Male,Bachelor's,Software Engineer,5\n"
    csv_content = header + (row * 1001)
    
    files = {"file": ("employees.csv", csv_content, "text/csv")}
    response = client.post("/api/predict/batch", files=files)
    
    assert response.status_code == 400
    json_data = response.json()
    assert json_data["success"] is False
    assert "exceeds maximum limit" in json_data["error"]
