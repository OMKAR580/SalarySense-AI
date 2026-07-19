import os
import sys
import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

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

@patch("app.resume.parser.PdfReader")
def test_predict_resume_success(mock_pdf_reader, client):
    # 1. Setup mock PDF page with text content matching regex extractions
    mock_page = MagicMock()
    mock_page.extract_text.return_value = (
        "Alice Johnson\n"
        "5 years of Python Developer experience\n"
        "Bachelors in Computer Science\n"
        "Skills: Python, Machine Learning, SQL, Git"
    )
    
    mock_reader_instance = MagicMock()
    mock_reader_instance.pages = [mock_page]
    mock_pdf_reader.return_value = mock_reader_instance
    
    # 2. Call the endpoint with dummy PDF bytes
    response = client.post(
        "/api/predict/resume",
        files={"file": ("resume.pdf", b"%PDF-1.4 ... mock pdf ...", "application/pdf")}
    )
    
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    
    # 3. Assert correct feature extractions
    features = json_data["extracted_features"]
    assert features["name"] == "Alice Johnson"
    assert features["job_title"] == "Software Engineer"
    assert features["experience"] == 5.0
    assert features["education_level"] == "Bachelor's"
    assert "Python" in features["skills"]
    assert "Machine Learning" in features["skills"]
    
    # 4. Assert correct prediction values
    prediction = json_data["prediction"]
    assert "salary" in prediction
    assert isinstance(prediction["salary"], float)
    assert prediction["currency"] == "USD"

def test_predict_resume_invalid_type(client):
    # Try uploading a non-PDF file
    response = client.post(
        "/api/predict/resume",
        files={"file": ("notes.txt", b"simple text content", "text/plain")}
    )
    assert response.status_code == 400
    assert response.json()["success"] is False
    assert "Only PDF files are accepted" in response.json()["message"]

def test_predict_resume_empty_file(client):
    # Try uploading an empty PDF file
    response = client.post(
        "/api/predict/resume",
        files={"file": ("empty.pdf", b"", "application/pdf")}
    )
    assert response.status_code == 400
    assert response.json()["success"] is False
    assert "empty" in response.json()["message"].lower()

@patch("app.resume.parser.PdfReader")
def test_predict_resume_extraction_failure(mock_pdf_reader, client):
    # Mock unreadable PDF containing no text elements (e.g. scanned image with no OCR)
    mock_page = MagicMock()
    mock_page.extract_text.return_value = "" # No text extracted
    
    mock_reader_instance = MagicMock()
    mock_reader_instance.pages = [mock_page]
    mock_pdf_reader.return_value = mock_reader_instance
    
    response = client.post(
        "/api/predict/resume",
        files={"file": ("scanned.pdf", b"%PDF-1.4 mock scan", "application/pdf")}
    )
    assert response.status_code == 422
    assert response.json()["success"] is False
    assert "unreadable" in response.json()["message"].lower()

@patch("app.resume.parser.PdfReader")
def test_predict_resume_wrong_document(mock_pdf_reader, client):
    # Mock a syllabus document content
    mock_page = MagicMock()
    mock_page.extract_text.return_value = (
        "CSE273: Machine Learning Course Syllabus\n"
        "Course Description and Grading Policy\n"
        "No homework will be accepted late."
    )
    
    mock_reader_instance = MagicMock()
    mock_reader_instance.pages = [mock_page]
    mock_pdf_reader.return_value = mock_reader_instance
    
    response = client.post(
        "/api/predict/resume",
        files={"file": ("syllabus.pdf", b"%PDF-1.4 mock syllabus", "application/pdf")}
    )
    assert response.status_code == 422
    assert response.json()["success"] is False
    assert "course syllabus" in response.json()["message"].lower()
