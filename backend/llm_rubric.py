from google import generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def evaluate_answer(answer: str, rubric: str):
    prompt = f"""
    You are an Excel interviewer AI.
    Rubric: {rubric}
    Candidate Answer: {answer}
    
    Task: Give a score 0-10 and feedback.
    Respond in strict JSON format: {{ "score": 0, "feedback": "..." }}
    """
    response = model.generate_content(prompt)
    
    # Parse JSON safely
    try:
        eval_json = json.loads(response.text)
    except Exception:
        # fallback if AI doesn't respond in JSON
        eval_json = {"score": 0, "feedback": response.text}
    
    return eval_json