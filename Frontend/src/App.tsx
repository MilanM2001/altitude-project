import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AuthProvider } from './services/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/NavBar'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
  )
}

export default App
