import os
import openai

key = os.getenv("OPENAI_API_KEY")
if key:
    openai.api_key = key

def _raise_no_key():
    raise EnvironmentError("OPENAI_API_KEY not set")

# Try common LangChain import locations; if unavailable, provide a small fallback
try:
    from langchain.embeddings.openai import OpenAIEmbeddings as LCOpenAIEmbeddings
    def get_embeddings():
        if not key:
            _raise_no_key()
        return LCOpenAIEmbeddings(openai_api_key=key)
except Exception:
    try:
        from langchain.embeddings import OpenAIEmbeddings as LCOpenAIEmbeddings2
        def get_embeddings():
            if not key:
                _raise_no_key()
            return LCOpenAIEmbeddings2(openai_api_key=key)
    except Exception:
        # Fallback small wrapper around openai.Embedding so FAISS.from_documents works
        class OpenAIEmbeddingsFallback:
            def __init__(self, model: str = "text-embedding-3-small"):
                if not key:
                    _raise_no_key()
                self.model = model

            def embed_documents(self, texts):
                # OpenAI accepts up to certain batch sizes; send as one batch here
                resp = openai.Embedding.create(model=self.model, input=texts)
                return [r["embedding"] for r in resp["data"]]

            def embed_query(self, text):
                resp = openai.Embedding.create(model=self.model, input=[text])
                return resp["data"][0]["embedding"]

        def get_embeddings():
            return OpenAIEmbeddingsFallback()
