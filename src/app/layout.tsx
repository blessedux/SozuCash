import React from 'react'
import '../styles/main.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-[400px] h-[600px] overflow-hidden bg-black text-white">
      {children}
    </div>
  )
} 