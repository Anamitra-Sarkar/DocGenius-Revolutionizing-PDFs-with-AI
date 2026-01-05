import os
from .vector_store import load_vector_store

def answer_question(document_id: str, question: str) -> str:
    # Load vector store and run similarity search
    vs = load_vector_store(document_id)
    docs = vs.similarity_search(question, k=4)
    context = "\n\n".join([d.page_content for d in docs])

    prompt_text = (
        "You are a helpful assistant. Use the following document context to answer the question. "
        "If the answer is not contained in the context, say you don't know.\n\n" +
        f"Context:\n{context}\n\nQuestion: {question}\nAnswer:"
    )

    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")

    try:
        if openai_key:
            from langchain_community.chat_models import ChatOpenAI
            llm = ChatOpenAI(temperature=0.0, model="gpt-3.5-turbo", openai_api_key=openai_key)
        elif gemini_key:
            from langchain_google_genai import ChatGoogleGenerativeAI
            llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=gemini_key, temperature=0.0)
        else:
            # Fallback for testing without keys
            return (
                "I see you don't have an API key configured. Here is a simulated answer based on the context:\n\n"
                f"{context[:200]}...\n\n"
                "(Please configure OPENAI_API_KEY or GEMINI_API_KEY in .env for real AI responses)"
            )

        from langchain.schema import HumanMessage
        messages = [HumanMessage(content=prompt_text)]
        
        response = llm.invoke(messages)
        return response.content

    except Exception as e:
        return f"I encountered an error while generating the answer: {str(e)}"
