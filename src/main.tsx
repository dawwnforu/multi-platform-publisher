import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/classic.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
