import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Aidsdeathsstats from './Aidsdeathsstats.jsx'
import EditAidsDeath from './Editaidsdeath.jsx';

const path = window.location.pathname.split('/').filter(Boolean)

const App = path.length === 3
  ? <EditAidsDeath codecountry={path[1]} year={path[2]} />
  : <Aidsdeathsstats />

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {App}
  </StrictMode>,
)
