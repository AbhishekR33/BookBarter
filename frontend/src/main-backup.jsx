import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SimpleApp from './SimpleApp.jsx'

// Use SimpleApp for testing if there are issues
// Switch between App and SimpleApp based on the issue
const AppToRender = App; // Change to SimpleApp if you want to test

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppToRender />
  </StrictMode>,
)
