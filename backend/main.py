# backend/main.py


import google.generativeai as genai

from pydantic import BaseModel
from .session_manager import start_session, record_answer
from dotenv import load_dotenv

from fastapi import FastAPI, UploadFile, File, Form
from .generate_report import generate_report
from fastapi.middleware.cors import CORSMiddleware
import os
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# Load API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

@app.get("/ping")
async def ping():
    return {"message": "Server is running!"}

@app.get("/test-gemini")
async def test_gemini():
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("Say hello from Gemini API!")
    return {"reply": response.text}

class MessageRequest(BaseModel):
    answer: str

@app.post("/session")
def create_session():
    session_id, first_question = start_session()
    return {"session_id": session_id, "question": first_question}

@app.post("/session/{session_id}/message")
def send_answer(session_id: str, msg: MessageRequest):
    next_question = record_answer(session_id, msg.answer)
    return {"next_question": next_question, "session_done": next_question is None}

@app.post("/session/{session_id}/submit")
async def submit_answer(
    session_id: str,
    answer: str = Form(...),
    excel_file: UploadFile = File(None)
):
    file_path = None
    if excel_file:
        file_path = f"temp_{excel_file.filename}"
        with open(file_path, "wb") as f:
            f.write(await excel_file.read())
    
    # Generate evaluation report
    report = generate_report(answer, "Basic Excel competency rubric", file_path)
    return report