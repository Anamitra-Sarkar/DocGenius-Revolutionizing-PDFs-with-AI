import './globals.css'

export const metadata = {
  title: 'DocGenius - AI Document Assistant',
  description: 'AI-powered PDF analysis and text generation platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
