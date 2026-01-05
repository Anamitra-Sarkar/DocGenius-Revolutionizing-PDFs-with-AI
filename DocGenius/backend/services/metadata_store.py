import os
import json
from typing import List, Dict, Optional
from datetime import datetime

DATA_DIR = os.path.join(os.getcwd(), "data")
METADATA_FILE = os.path.join(DATA_DIR, "metadata.json")

def _load_db() -> Dict[str, Dict]:
    if not os.path.exists(METADATA_FILE):
        return {}
    try:
        with open(METADATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def _save_db(db: Dict[str, Dict]):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, default=str)

def save_document_metadata(doc_id: str, name: str, size: int, page_count: Optional[int] = None):
    db = _load_db()
    db[doc_id] = {
        "id": doc_id,
        "name": name,
        "size": size,
        "uploadedAt": datetime.now().isoformat(),
        "status": "indexed",
        "pageCount": page_count or 0
    }
    _save_db(db)

def get_all_documents() -> List[Dict]:
    db = _load_db()
    # Convert dict value to list and sort by date descending
    docs = list(db.values())
    docs.sort(key=lambda x: x.get("uploadedAt", ""), reverse=True)
    return docs

def get_document_metadata(doc_id: str) -> Optional[Dict]:
    db = _load_db()
    return db.get(doc_id)
