// sert a faire le rendu de la page (details dans App.tsx)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bulma/css/bulma.min.css'; // bulma style css
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'
import App from './App.tsx'

// va chercher l'element avec l'ID 'root' dans le doc index.html et met App dedans
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
