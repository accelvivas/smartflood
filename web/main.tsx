import React from 'react'
import { createRoot } from 'react-dom/client'
import App from '../app'
import '../styles/global.css'

const rootEl = document.getElementById('root')!
createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
