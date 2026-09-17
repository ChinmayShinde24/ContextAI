import os

from dotenv import load_dotenv
from mistralai.client import Mistral

load_dotenv()

client = Mistral(
    api_key=os.getenv("MISTRAL_API_KEY")
)

models = client.models.list()

print("Mistral connection successful")
print("Number of models:", len(models.data))