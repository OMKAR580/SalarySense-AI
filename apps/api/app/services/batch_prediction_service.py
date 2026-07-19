import time
import logging
import io
import pandas as pd
from fastapi import HTTPException, status
from app.services.prediction_service import PredictionService
from app.schemas.batch_prediction import BatchRowSchema
from pydantic import ValidationError

logger = logging.getLogger(__name__)

class BatchPredictionService:
    def __init__(self):
        self.prediction_service = PredictionService()

    def process_batch(self, file_content: bytes, filename: str) -> bytes:
        start_time = time.perf_counter()
        logger.info(f"Batch prediction upload received: {filename}")

        # 1. File type validation
        if not filename or not filename.lower().endswith('.csv'):
            logger.error(f"Invalid file type: {filename}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Only CSV files are supported."
            )

        # 2. Empty file handling
        if not file_content or len(file_content.strip()) == 0:
            logger.error("Empty file uploaded")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty."
            )

        try:
            # Read CSV content into DataFrame
            df = pd.read_csv(io.BytesIO(file_content))
        except Exception as e:
            logger.error(f"Error parsing CSV: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse CSV: {str(e)}"
            )

        if df.empty:
            logger.error("Parsed CSV is empty (no rows)")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded CSV has no records."
            )

        # 3. Maximum row limit protection
        MAX_ROWS = 1000
        total_rows = len(df)
        if total_rows > MAX_ROWS:
            logger.error(f"File exceeds maximum limit of {MAX_ROWS} rows: {total_rows}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File exceeds maximum limit of {MAX_ROWS} rows."
            )

        # 4. Dynamic Column Cleaning and Alias Mapping
        df.columns = [c.strip().lower() for c in df.columns]
        mapping_rules = {
            "age": ["age", "yrs", "age_years"],
            "gender": ["gender", "sex"],
            "education_level": ["education_level", "education", "education level", "degree"],
            "job_title": ["job_title", "job title", "title", "role", "designation"],
            "years_of_experience": ["years_of_experience", "years of experience", "experience", "exp", "tenure"]
        }

        for target, aliases in mapping_rules.items():
            for col in df.columns:
                if col in aliases:
                    df = df.rename(columns={col: target})
                    break

        required_columns = ["age", "gender", "education_level", "job_title", "years_of_experience"]
        default_values = {
            "age": 30.0,
            "gender": "Male",
            "education_level": "Bachelor's",
            "job_title": "Software Engineer",
            "years_of_experience": 5.0
        }
        for col in required_columns:
            if col not in df.columns:
                logger.warning(f"Column '{col}' is missing from batch upload. Dynamically injecting default: {default_values[col]}")
                df[col] = default_values[col]

        # 5. Row validation and prediction
        predicted_salaries = []
        failed_rows = 0
        rows_processed = 0

        for idx, row in df.iterrows():
            row_dict = row.to_dict()
            cleaned_row = {}
            for col in required_columns:
                val = row_dict.get(col)
                if pd.isna(val) or val is None:
                    cleaned_row[col] = default_values[col]
                else:
                    cleaned_row[col] = val

            try:
                # Validate the row against schema
                validated_row = BatchRowSchema(**cleaned_row)
                
                # Perform prediction using the existing PredictionService
                prediction_result = self.prediction_service.predict(
                    age=validated_row.age,
                    gender=validated_row.gender,
                    education_level=validated_row.education_level,
                    job_title=validated_row.job_title,
                    years_of_experience=validated_row.years_of_experience
                )
                predicted_salaries.append(prediction_result["salary"])
                rows_processed += 1
            except Exception as e:
                failed_rows += 1
                logger.error(f"Validation or prediction error at row {idx + 1}: {str(e)}")
                # Use a default 0.0 value for invalid rows to keep processing other valid rows
                predicted_salaries.append(0.0)

        # Add predicted_salary column to the dataframe
        df["predicted_salary"] = predicted_salaries

        execution_time = (time.perf_counter() - start_time) * 1000
        logger.info(
            f"Batch prediction complete: "
            f"rows processed={rows_processed}, "
            f"failed rows={failed_rows}, "
            f"execution time={execution_time:.2f} ms"
        )

        # Return the output CSV bytes
        output = io.StringIO()
        df.to_csv(output, index=False)
        return output.getvalue().encode("utf-8")
