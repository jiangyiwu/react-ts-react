import { Routes, BrowserRouter } from 'react-router-dom'
import { menu } from './consts/menu'
import { getMenuRoutes } from './utils/menu'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        { getMenuRoutes(menu) }
      </Routes>
    </BrowserRouter>
  )
}

export default App
