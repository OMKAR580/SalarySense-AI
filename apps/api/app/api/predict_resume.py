import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.resume.service import ResumeService
from app.resume.schemas import ResumePredictionResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post(
    "/predict/resume",
    response_model=ResumePredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict Salary from Resume PDF"
)
async def predict_resume(
    file: UploadFile = File(...)
):
    # 1. Validate file extension (must be PDF)
    if not file.filename.lower().endswith(".pdf"):
        logger.warning(f"Validation Failure: Rejected non-PDF upload '{file.filename}'")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF files are accepted."
        )
        
    # 2. Read file bytes
    try:
        file_bytes = await file.read()
    except Exception as e:
        logger.error(f"Failed to read uploaded file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to read the uploaded file."
        )
        
    # 3. Validate non-empty file
    if len(file_bytes) == 0:
        logger.warning("Validation Failure: Uploaded file is empty (0 bytes)")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded PDF file is empty."
        )
        
    # 4. Parse, extract, and predict
    try:
        service = ResumeService()
        result = service.process_and_predict(file_bytes)
        return result
    except ValueError as ve:
        logger.warning(f"Parsing Failure: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Internal Error processing resume: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while parsing and processing your resume."
        )
