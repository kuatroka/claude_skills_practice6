import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { syncFromServer } from './db/sync'
import './index.css'

// Start sync in background (non-blocking)
// UI renders immediately from IndexedDB, server sync updates silently
syncFromServer()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
