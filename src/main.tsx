import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('mainCanvas')!).render(
  <>
    <canvas id="mainCanvas" className="webgl"></canvas>
    <App />
  </>
)
