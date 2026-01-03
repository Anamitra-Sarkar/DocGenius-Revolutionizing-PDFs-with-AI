import React, { useState } from 'react'

type Props = {
  onUploaded: (id: string) => void
}

export default function Upload({ onUploaded }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL
      const res = await fetch(`${base}/pdf/upload`, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Upload failed')
      onUploaded(data.document_id)
    } catch (err: any) {
      setError(err.message || 'Upload error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <label style={{ display: 'block', fontWeight: 600 }}>Upload PDF</label>
      <input type="file" accept="application/pdf" onChange={handle} />
      {loading && <div>Uploading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </section>
  )
}
