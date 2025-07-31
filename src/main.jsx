import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { VehicleProvider } from './context/VehicleContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <VehicleProvider>
    <App />
      </VehicleProvider>
    </ThemeProvider>
  </StrictMode>,
)
