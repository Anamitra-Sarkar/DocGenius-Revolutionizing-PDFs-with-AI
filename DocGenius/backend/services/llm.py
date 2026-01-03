import os
import openai
from .vector_store import load_vector_store

openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key:
    openai.api_key = openai_api_key


def answer_question(document_id: str, question: str) -> str:
    # Load vector store and run similarity search
    vs = load_vector_store(document_id)
    docs = vs.similarity_search(question, k=4)
    context = "\n\n".join([d.page_content for d in docs])

    prompt = (
        "You are a helpful assistant. Use the following document context to answer the question. "
        "If the answer is not contained in the context, say you don't know.\n\n" +
        f"Context:\n{context}\n\nQuestion: {question}\nAnswer:"
    )

    if not openai_api_key:
        raise EnvironmentError("OPENAI_API_KEY not configured")

    resp = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.0,
        max_tokens=512,
    )
    answer = resp["choices"][0]["message"]["content"].strip()
    return answer
