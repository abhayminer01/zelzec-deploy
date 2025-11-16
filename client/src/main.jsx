import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import { SellProvider } from './contexts/SellContext';
import ProductPage from './pages/ProductPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModalProvider>
    <AuthProvider>
    <SellProvider>
      <Router>
        <Routes>
          <Route path='/' element={ <HomePage /> }/>
          <Route path='product/:id' element={ <ProductPage /> }/>
        </Routes>
      </Router>
    </SellProvider>
    </AuthProvider>
    </ModalProvider>
  </StrictMode>
)