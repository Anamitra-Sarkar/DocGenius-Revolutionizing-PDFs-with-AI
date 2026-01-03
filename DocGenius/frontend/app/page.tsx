'use client'

import React, { useState, useEffect } from 'react'
import PdfUpload from '../components/PdfUpload'
import PdfChat from '../components/PdfChat'
import GeminiBox from '../components/GeminiBox'
import { checkHealth } from '../lib/apiClient'

export default function Page() {
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [healthStatus, setHealthStatus] = useState<'checking' | 'ok' | 'error'>('checking')

  useEffect(() => {
    checkHealth()
      .then(() => setHealthStatus('ok'))
      .catch(() => setHealthStatus('error'))
  }, [])

  return (
    <main>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 8
      }}>
        <h1 style={{ 
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
          fontSize: 32,
          fontWeight: 700,
          margin: 0,
          color: '#111827'
        }}>
          DocGenius
        </h1>
        <div style={{
          padding: '4px 12px',
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 500,
          backgroundColor: healthStatus === 'ok' ? '#d1fae5' : healthStatus === 'error' ? '#fee2e2' : '#f3f4f6',
          color: healthStatus === 'ok' ? '#065f46' : healthStatus === 'error' ? '#991b1b' : '#6b7280'
        }}>
          {healthStatus === 'ok' ? '● Online' : healthStatus === 'error' ? '● Offline' : '● Checking...'}
        </div>
      </div>
      <p style={{ 
        color: '#6b7280', 
        marginTop: 4,
        marginBottom: 24,
        fontSize: 16
      }}>
        AI-powered document analysis and text generation
      </p>
      
      <div style={{ marginBottom: 24 }}>
        <PdfUpload onUploaded={(id: string) => setDocumentId(id)} />
      </div>
      
      <div style={{ marginBottom: 24 }}>
        <PdfChat documentId={documentId} />
      </div>
      
      <div>
        <GeminiBox />
      </div>
      
      <footer style={{ 
        marginTop: 48, 
        paddingTop: 24, 
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        fontSize: 12,
        color: '#9ca3af'
      }}>
        <p>DocGenius - AI Document Assistant</p>
      </footer>
    </main>
  )
}
