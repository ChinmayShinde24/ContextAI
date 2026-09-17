import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_MODEL = "gemini-3.5-flash-lite"

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
