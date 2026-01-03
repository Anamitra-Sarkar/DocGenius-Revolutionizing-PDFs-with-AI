from dotenv import load_dotenv
import os
import streamlit as st
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.callbacks import get_openai_callback

"""
Legacy prototype removed.

This file previously contained an experimental Python-based UI. All
UI responsibilities have been migrated to the Next.js frontend in
`DocGenius/frontend` and the backend lives in `DocGenius/backend`.
"""
if pdf is not None:

    pdf_reader = PdfReader(pdf)
