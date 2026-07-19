import re
import json
import logging
from huggingface_hub import InferenceClient
from app.core.config import settings

logger = logging.getLogger(__name__)

class ResumeExtractor:
    @staticmethod
    def extract_info(text: str) -> dict:
        hf_token = settings.HUGGINGFACE_API_KEY
        if not hf_token:
            logger.warning("Hugging Face API key not configured. Falling back to heuristic parsing.")
            return ResumeExtractor.heuristic_extract(text)

        try:
            # We use Qwen2.5-72B-Instruct or Llama-3-8B-Instruct via HF free Inference API
            client = InferenceClient(
                model="Qwen/Qwen2.5-72B-Instruct",
                token=hf_token
            )

            prompt = f"""
            Extract the following structured details from this resume text:
            1. Applicant Name (full name of the person)
            2. Estimated Years of Experience (as float/integer number)
            3. Best-matching Job Title from this exact list:
               ["Software Engineer", "Data Scientist", "Data Analyst", "Product Manager", "Project Engineer", "Accountant", "Sales Representative", "UX/UI Designer"]
            4. Highest Education Level from this list: ["Bachelor's", "Master's", "PhD"]
            5. Primary Skills (as list of strings, e.g. ["Python", "AWS", "React"])

            Resume Text:
            {text[:4000]}

            Return ONLY a valid JSON object matching this schema. Do not output any markdown codeblocks or thinking tags:
            {{
                "name": "Full Name",
                "years_of_experience": 5.0,
                "job_title": "Software Engineer",
                "education_level": "Bachelor's",
                "skills": ["Python", "SQL"]
            }}
            """

            response = client.text_generation(
                prompt,
                max_new_tokens=400,
                temperature=0.1
            )
            
            cleaned = response.strip()
            # Find the JSON block in the response to handle markdown wrappers
            json_match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if json_match:
                cleaned = json_match.group(0)

            extracted = json.loads(cleaned)
            
            # Map required fields and fallback if null
            return {
                "name": extracted.get("name") or "Applicant Name",
                "years_of_experience": float(extracted.get("years_of_experience") or 0.0),
                "job_title": extracted.get("job_title") or "Software Engineer",
                "education_level": extracted.get("education_level") or "Bachelor's",
                "skills": extracted.get("skills") or []
            }

        except Exception as e:
            logger.error(f"Hugging Face LLM extraction failed: {str(e)}. Using heuristic fallback.")
            return ResumeExtractor.heuristic_extract(text)

    @staticmethod
    def heuristic_extract(text: str) -> dict:
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        
        # 1. Extract Name (Heuristic: first non-empty line if short, or match standard patterns)
        name = "Applicant Name"
        if lines:
            first_line = lines[0]
            if len(first_line) < 50 and not any(k in first_line.lower() for k in ["resume", "cv", "curriculum", "profile", "summary"]):
                name = first_line
        
        # 2. Extract Years of Experience
        experience = 0.0
        exp_patterns = [
            r'(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)\b',
            r'(?:experience|history)\s*:\s*(\d+(?:\.\d+)?)\+?',
        ]
        
        for pattern in exp_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    experience = float(match.group(1))
                    break
                except ValueError:
                    continue
                    
        # 3. Extract Job Title / Job Role
        job_title = "Software Engineer"  # Default fallback
        
        job_patterns = {
            "Software Engineer": [
                r'software\s*engineer', r'developer', r'programmer', r'full\s*stack', 
                r'backend\s*engineer', r'frontend\s*engineer', r'web\s*developer'
            ],
            "Data Scientist": [
                r'data\s*scientist', r'machine\s*learning\s*engineer', r'ml\s*engineer', 
                r'ai\s*engineer', r'deep\s*learning'
            ],
            "Data Analyst": [r'data\s*analyst', r'business\s*analyst', r'bi\s*analyst'],
            "Product Manager": [r'product\s*manager', r'pm\b'],
            "Project Manager": [r'project\s*manager', r'scrum\s*master'],
            "Accountant": [r'accountant', r'finance\s*analyst', r'accounting'],
            "Sales Representative": [r'sales\s*representative', r'sales\s*manager', r'account\s*executive'],
            "UX/UI Designer": [r'designer', r'ux', r'ui', r'user\s*experience'],
        }
        
        matched_title = None
        for title, patterns in job_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    matched_title = title
                    break
            if matched_title:
                job_title = matched_title
                break
                
        # 4. Extract Education Level
        education_level = "Bachelor's"  # Default fallback
        edu_patterns = {
            "PhD": [r'\bphd\b', r'\bph\.d\b', r'doctorate', r'doctor\s*of\s*philosophy'],
            "Master's": [r'\bmasters?\b', r'\bm\.sc\b', r'\bmsc\b', r'\bms\s', r'\bmba\b'],
            "Bachelor's": [r'\bbachelors?\b', r'\bb\.sc\b', r'\bbsc\b', r'\bbe\b', r'\bbtech\b', r'degree'],
        }
        
        matched_edu = None
        for level, patterns in edu_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    matched_edu = level
                    break
            if matched_edu:
                education_level = matched_edu
                break
                
        # 5. Extract Skills
        common_skills = [
            "Python", "Java", "React", "Node.js", "SQL", "JavaScript", "HTML", "CSS",
            "C++", "C#", "Go", "Docker", "Kubernetes", "AWS", "Machine Learning", 
            "TensorFlow", "PyTorch", "Data Science", "Project Management", "Agile",
            "Scrum", "Git", "GitHub", "System Design", "Cloud Computing"
        ]
        
        extracted_skills = []
        for skill in common_skills:
            pattern = rf'\b{re.escape(skill)}\b'
            if re.search(pattern, text, re.IGNORECASE):
                extracted_skills.append(skill)
                
        logger.info(
            f"Extracted info: Name='{name}', Experience={experience}, "
            f"JobTitle='{job_title}', Education='{education_level}', Skills={extracted_skills}"
        )
        
        return {
            "name": name,
            "years_of_experience": experience,
            "job_title": job_title,
            "education_level": education_level,
            "skills": extracted_skills
        }
