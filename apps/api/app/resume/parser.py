import io
import logging
from pypdf import PdfReader

logger = logging.getLogger(__name__)

class ResumeParser:
    @staticmethod
    def extract_text(file_bytes: bytes) -> str:
        try:
            pdf_file = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_file)
            
            # Check if pdf has pages
            if len(reader.pages) == 0:
                raise ValueError("PDF file has 0 pages.")
                
            text = ""
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            cleaned_text = text.strip()
            if not cleaned_text:
                raise ValueError("PDF is unreadable or empty (no text extracted).")
                
            # Perform resume content validation
            lower_text = cleaned_text.lower()
            syllabus_indicators = ["syllabus", "course outline", "class schedule", "grading policy", "prerequisites:", "course description"]
            if any(ind in lower_text for ind in syllabus_indicators):
                raise ValueError("The uploaded file appears to be a course syllabus. Please upload a valid Resume/CV.")
                
            invoice_indicators = ["invoice number", "amount due", "billing details", "payment receipt"]
            if any(ind in lower_text for ind in invoice_indicators):
                raise ValueError("The uploaded file appears to be a billing document. Please upload a valid Resume/CV.")
                
            has_experience = any(kw in lower_text for kw in ["experience", "work history", "employment", "job history", "professional background", "working at"])
            has_education = any(kw in lower_text for kw in ["education", "academic", "degree", "university", "college", "gpa", "bachelor", "master", "phd", "graduate"])
            has_skills = any(kw in lower_text for kw in ["skills", "technologies", "languages", "expert", "proficient", "competenc", "tools"])
            
            if sum([has_experience, has_education, has_skills]) < 2:
                raise ValueError("The uploaded document does not look like a professional Resume/CV. Please ensure it contains your work experience, education, or skills.")
                
            return cleaned_text
        except Exception as e:
            logger.error(f"Error parsing PDF resume: {str(e)}")
            raise ValueError(f"Invalid or corrupted PDF file: {str(e)}")
