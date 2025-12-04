import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VGrade - Student Performance Predictor',
  description: 'Predict student exam scores with AI-powered analytics. VGrade helps educators and students forecast academic performance.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

