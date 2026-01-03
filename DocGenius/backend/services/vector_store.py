import os
import json
import pickle
import tempfile
from typing import List
import numpy as np
from .embeddings import get_embeddings

# Resilient Document type: prefer LangChain's Document, otherwise use a simple fallback
try:
    from langchain.docstore.document import Document  # type: ignore
except Exception:
    class Document:
        def __init__(self, page_content: str):
            self.page_content = page_content


# Compatibility: try to use LangChain's FAISS wrapper when available,
# otherwise provide a minimal fallback SimpleVectorStore that supports
# `from_documents` and `similarity_search`.
try:
    from langchain.vectorstores import FAISS  # type: ignore
except Exception:
    FAISS = None


class SimpleVectorStore:
    def __init__(self, docs, embeddings_matrix):
        self.docs = docs
        self.embeddings = np.asarray(embeddings_matrix, dtype=np.float32)

    @classmethod
    def from_documents(cls, docs, embeddings_obj):
        texts = [d.page_content for d in docs]
        embs = embeddings_obj.embed_documents(texts)
        return cls(docs, embs)

    def similarity_search(self, query, k=4, embeddings_obj=None):
        if embeddings_obj is None:
            embeddings_obj = get_embeddings()
        q_emb = np.asarray(embeddings_obj.embed_query(query), dtype=np.float32)
        # cosine similarity
        norms = np.linalg.norm(self.embeddings, axis=1) * (np.linalg.norm(q_emb) + 1e-12)
        sims = (self.embeddings @ q_emb) / norms
        idx = np.argsort(-sims)[:k]
        return [self.docs[i] for i in idx]

if FAISS is None:
    FAISS = SimpleVectorStore


BASE_DIR = os.path.join(os.getcwd(), "data")
VSTORE_DIR = os.path.join(BASE_DIR, "vectorstores")
os.makedirs(VSTORE_DIR, exist_ok=True)


def _store_path(document_id: str) -> str:
    return os.path.join(VSTORE_DIR, f"{document_id}.pkl")


def _meta_path(document_id: str) -> str:
    return os.path.join(VSTORE_DIR, f"{document_id}.meta.json")


def create_vector_store(document_id: str, texts: List[str]):
    embeddings = get_embeddings()
    docs = [Document(page_content=t) for t in texts]
    vectorstore = FAISS.from_documents(docs, embeddings)

    path = _store_path(document_id)
    meta = {"document_id": document_id, "count": len(docs)}

    # write atomically
    with tempfile.NamedTemporaryFile(delete=False, dir=VSTORE_DIR) as tf:
        pickle.dump(vectorstore, tf)
        temp_path = tf.name

    os.replace(temp_path, path)

    with open(_meta_path(document_id), "w", encoding="utf-8") as mf:
        json.dump(meta, mf)

    return path


def load_vector_store(document_id: str):
    path = _store_path(document_id)
    if not os.path.exists(path):
        raise FileNotFoundError("Vector store not found for document")
    with open(path, "rb") as f:
        vectorstore = pickle.load(f)
    return vectorstore


def has_vector_store(document_id: str) -> bool:
    return os.path.exists(_store_path(document_id))

