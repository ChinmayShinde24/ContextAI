from config.gemini import GEMINI_MODEL
from config.gemini import client as gemini_client
from config.mistral import client

MODEL_NAME = "ministral-3b-2512"


def _is_rate_limit_error(error: Exception) -> bool:
    status_code = getattr(error, "status_code", None)
    if status_code == 429:
        return True

    response = getattr(error, "response", None) or getattr(error, "raw_response", None)
    if response is not None and getattr(response, "status_code", None) == 429:
        return True

    message = str(error).lower()
    return "status 429" in message or "rate limit" in message or "rate_limited" in message


def _generate_with_gemini(prompt: str) -> str:
    response = gemini_client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )
    return response.text


def generate_answer(prompt: str) -> str:
    try:
        response = client.chat.complete(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )
        return response.choices[0].message.content
    except Exception as error:
        if not _is_rate_limit_error(error):
            raise

        print("Mistral rate limit reached. Falling back to Gemini.")
        return _generate_with_gemini(prompt)


def build_rag_prompt(question: str, matches: list) -> str:
    context = "\n\n".join(
        match["metadata"]["text"]
        for match in matches
    )

    return f"""
Answer the question using only the context below.

Context:
{context}

Question:
{question}

If the answer is not present in the context, say:
"I could not find the answer in the document."
"""


