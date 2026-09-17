from utils.llm import generate_answer

prompt = """
Context:
The grand total is ₹1,10,500.

Question:
What is the grand total?
"""

answer = generate_answer(prompt)

print("Answer:", answer)