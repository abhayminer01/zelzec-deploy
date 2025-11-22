// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import { SellProvider } from './contexts/SellContext';
import { ChatProvider } from './contexts/ChatContext';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import Catalouge from './pages/Catalouge'; // ✅ Import
import ChatSidebar from './components/chatSidebar';
import ChatWidget from './components/ChatWidget';
import CataloguePage from './pages/CataloguePage';
import MobileChatListPage from './pages/MobileChatListPage';
import MobileChatPage from './pages/MobileChatPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModalProvider>
      <AuthProvider>
        <SellProvider>
          <ChatProvider>
            <Router>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/product/:id' element={<ProductPage />} />
                <Route path='/profile' element={<ProfilePage />} />
                {/* <Route path='/category/:id' element={<Catalouge />} /> */}
                <Route path='/category/:id' element={<CataloguePage />} />

                <Route path="/mobile/chats" element={<MobileChatListPage />} />
                <Route path="/mobile/chat/:chatId" element={<MobileChatPage />} />
              </Routes>
              <ChatWidget />
              <ChatSidebar /> {/* ✅ Render it here */}
            </Router>
          </ChatProvider>
        </SellProvider>
      </AuthProvider>
    </ModalProvider>
  </StrictMode>
);