import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/page'
import RootLayout from './app/layout'
import './styles/main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootLayout>
      <App />
    </RootLayout>
  </React.StrictMode>,
) 