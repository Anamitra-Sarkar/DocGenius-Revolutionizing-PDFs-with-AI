import React, { useState } from 'react'
import { apiFetch, ApiError } from '../lib/apiClient'

export default function PdfUpload({ onUploaded }: { onUploaded: (id: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    setSuccess(null)
    const file = e.target.files?.[0]
    if (!file) return
    
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    
    try {
      const data = await apiFetch('/pdf/upload', { method: 'POST', body: form })
      onUploaded(data.document_id)
      setSuccess('PDF uploaded successfully!')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Upload failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
        Upload PDF Document
      </label>
      <input 
        type="file" 
        accept="application/pdf" 
        onChange={handleFile} 
        disabled={loading}
        style={{ marginBottom: 8 }}
      />
      {loading && <div style={{ color: '#0066cc', marginTop: 8 }}>Uploading and processing...</div>}
      {error && <div style={{ color: '#dc2626', marginTop: 8, fontWeight: 500 }}>{error}</div>}
      {success && <div style={{ color: '#16a34a', marginTop: 8, fontWeight: 500 }}>{success}</div>}
    </section>
  )
}
