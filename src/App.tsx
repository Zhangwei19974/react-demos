import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Route, Routes, useNavigate} from 'react-router-dom';
import Home from './pages/Home';
import ThreeDemo from './pages/ThreeDemo';
import main from '@/styles/main.module.css'

function App() {
  const [count, setCount] = useState(0)
  const router = useNavigate()
  return (
    <div className={main.fullScreen}>
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/threeDemo'} element={<ThreeDemo />} />
      </Routes>
    </div>
  )
}

export default App
