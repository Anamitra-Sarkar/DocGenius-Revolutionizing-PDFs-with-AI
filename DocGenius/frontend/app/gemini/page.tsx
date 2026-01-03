import React from 'react'
import GeminiBox from '../../components/GeminiBox'

export default function GeminiPage() {
  return (
    <main>
      <h1>Gemini Generator</h1>
      <p style={{ color: '#555' }}>Generate text with Gemini</p>
      <GeminiBox />
    </main>
  )
}
