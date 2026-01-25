// sert a faire le rendu de la page (details dans App.tsx)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bulma/css/bulma.min.css'; // Add this line
import '../index.css'

const Connector = () => {
  return (
    <div>
      <p>test</p>
    </div>
  )
}

// va chercher l'element avec l'ID 'root' dans le doc index.html et met App dedans
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Connector />
  </StrictMode>,
)
