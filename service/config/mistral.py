import os

from mistralai.client import Mistral
from dotenv import load_dotenv

load_dotenv()

client = Mistral(
    api_key=os.getenv("MISTRAL_API_KEY"),
)