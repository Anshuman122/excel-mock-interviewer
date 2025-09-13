# backend/main.py

from fastapi import FastAPI
import google.generativeai as genai

from dotenv import load_dotenv
import os

#from fastapi import FastAPI

import os
app = FastAPI()

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