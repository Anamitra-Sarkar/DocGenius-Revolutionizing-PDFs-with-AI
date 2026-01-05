import os
import openai

def get_embeddings():
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    if openai_key:
        try:
            from langchain_community.embeddings import OpenAIEmbeddings
            return OpenAIEmbeddings(openai_api_key=openai_key)
        except ImportError:
            pass # Fallback
            
    if gemini_key:
        try:
            from langchain_google_genai import GoogleGenerativeAIEmbeddings
            return GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=gemini_key)
        except ImportError:
            pass # Fallback

    # If no keys or imports fail, use FakeEmbeddings for testing/demo purposes
    # so the app doesn't crash.
    print("[DocGenius] Warning: No valid API keys found. Using FakeEmbeddings.", flush=True)
    try:
        from langchain_community.embeddings import FakeEmbeddings
        return FakeEmbeddings(size=1536) # Match OpenAI size usually
    except ImportError:
        # Absolute fallback if even FakeEmbeddings is missing
        class SimpleFakeEmbeddings:
            def embed_documents(self, texts):
                return [[0.0]*1536 for _ in texts]
            def embed_query(self, text):
                return [0.0]*1536
        return SimpleFakeEmbeddings()

