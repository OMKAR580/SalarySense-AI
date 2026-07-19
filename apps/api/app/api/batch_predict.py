import logging
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import StreamingResponse, JSONResponse
import io

from app.services.batch_prediction_service import BatchPredictionService

logger = logging.getLogger(__name__)
router = APIRouter()

def get_batch_prediction_service() -> BatchPredictionService:
    return BatchPredictionService()

@router.post(
    "/predict/batch",
    status_code=status.HTTP_200_OK,
    summary="Batch Salary Prediction from CSV"
)
async def batch_predict_salary(
    file: UploadFile = File(...),
    service: BatchPredictionService = Depends(get_batch_prediction_service)
):
    try:
        # Read the uploaded file contents
        content = await file.read()
        
        # Process the batch predictions using the service
        csv_bytes = service.process_batch(content, file.filename)
        
        # Return the downloadable CSV file
        return StreamingResponse(
            io.BytesIO(csv_bytes),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=predicted_{file.filename or 'employees.csv'}"
            }
        )
    except HTTPException as he:
        # Return JSON error responses exactly matching the required schemas
        return JSONResponse(
            status_code=he.status_code,
            content={
                "success": False,
                "error": he.detail
            }
        )
    except Exception as e:
        logger.error(f"Unhandled batch prediction error: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": "An unexpected error occurred during batch prediction computation."
            }
        )
