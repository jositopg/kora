import { Routes, Route, Navigate } from 'react-router-dom'
import { useLocalStorage } from './hooks/useLocalStorage'
import Disclaimer from './components/Disclaimer'
import Dashboard from './components/Dashboard'
import Parcelas from './components/Parcelas'
import Emociones from './components/Emociones'
import Pensamientos from './components/Pensamientos'
import Necesidades from './components/Necesidades'
import Valores from './components/Valores'

export default function App() {
  const [seenDisclaimer] = useLocalStorage<boolean>('santuario_seen_disclaimer', false)

  return (
    <Routes>
      <Route
        path="/"
        element={seenDisclaimer ? <Navigate to="/dashboard" replace /> : <Disclaimer />}
      />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/parcelas" element={<Parcelas />} />
      <Route path="/emociones" element={<Emociones />} />
      <Route path="/pensamientos" element={<Pensamientos />} />
      <Route path="/necesidades" element={<Necesidades />} />
      <Route path="/valores" element={<Valores />} />
    </Routes>
  )
}
