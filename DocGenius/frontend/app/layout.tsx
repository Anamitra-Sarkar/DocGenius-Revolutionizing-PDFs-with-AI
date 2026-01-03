import './globals.css'

export const metadata = {
  title: 'DocGenius',
  description: 'AI document assistant',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: 800, margin: '36px auto', padding: '0 16px' }}>{children}</div>
      </body>
    </html>
  )
}
