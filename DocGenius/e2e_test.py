#!/usr/bin/env python3
"""
Minimal E2E test for DocGenius backend.

Usage:
  Ensure NEXT_PUBLIC_API_BASE_URL is set to your deployed backend URL (no localhost).
  Then run: python3 e2e_test.py

This script:
 - creates a tiny blank PDF
 - uploads it to POST /pdf/upload
 - calls POST /pdf/ask
 - calls POST /gemini/generate

It prints responses and exits non-zero on errors.
"""
import os
import sys
import requests
import json
from tempfile import NamedTemporaryFile


API_BASE = os.getenv('NEXT_PUBLIC_API_BASE_URL')
if not API_BASE:
    print('ERROR: NEXT_PUBLIC_API_BASE_URL is not defined', file=sys.stderr)
    sys.exit(2)

if 'localhost' in API_BASE or '127.0.0.1' in API_BASE:
    print('ERROR: NEXT_PUBLIC_API_BASE_URL must not be localhost', file=sys.stderr)
    sys.exit(2)


def make_pdf(path: str):
    try:
        from PyPDF2 import PdfWriter
    except Exception:
        # fallback: write a minimal empty PDF (may be less portable)
        with open(path, 'wb') as f:
            f.write(b"%PDF-1.1\n%EOF\n")
        return

    w = PdfWriter()
    w.add_blank_page(width=612, height=792)
    with open(path, 'wb') as f:
        w.write(f)


def post_upload(pdf_path: str):
    url = API_BASE.rstrip('/') + '/pdf/upload'
    with open(pdf_path, 'rb') as fh:
        files = {'file': ('sample.pdf', fh, 'application/pdf')}
        r = requests.post(url, files=files, timeout=60)
    r.raise_for_status()
    return r.json()


def post_ask(document_id: str, question: str):
    url = API_BASE.rstrip('/') + '/pdf/ask'
    r = requests.post(url, json={'document_id': document_id, 'question': question}, timeout=60)
    r.raise_for_status()
    return r.json()


def post_gemini(prompt: str):
    url = API_BASE.rstrip('/') + '/gemini/generate'
    r = requests.post(url, json={'prompt': prompt}, timeout=60)
    r.raise_for_status()
    return r.json()


def main():
    print('Using API base:', API_BASE)
    with NamedTemporaryFile(suffix='.pdf', delete=False) as tf:
        pdf_path = tf.name
    print('Creating sample PDF at', pdf_path)
    make_pdf(pdf_path)

    try:
        print('Uploading PDF...')
        up = post_upload(pdf_path)
        print('Upload response:', json.dumps(up, indent=2))
        doc_id = up.get('document_id')
        if not doc_id:
            print('No document_id returned', file=sys.stderr)
            sys.exit(1)

        print('Asking question...')
        ans = post_ask(doc_id, 'What is this document about?')
        print('Ask response:', json.dumps(ans, indent=2))

        print('Calling Gemini generate...')
        gen = post_gemini('Write a one-sentence description of an AI document assistant.')
        print('Gemini response:', json.dumps(gen, indent=2))

    except requests.RequestException as e:
        print('HTTP error:', e, file=sys.stderr)
        if e.response is not None:
            try:
                print('Response body:', e.response.text, file=sys.stderr)
            except Exception:
                pass
        sys.exit(1)
    finally:
        try:
            os.remove(pdf_path)
        except Exception:
            pass

    print('E2E test completed successfully')


if __name__ == '__main__':
    main()
