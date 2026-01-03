import React, { useState } from 'react'
import { apiFetch } from '../lib/apiClient'

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
      setSuccess('Uploaded')
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <label style={{ display: 'block', fontWeight: 600 }}>Upload PDF</label>
      <input type="file" accept="application/pdf" onChange={handleFile} />
      {loading && <div>Uploading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </section>
  )
}
