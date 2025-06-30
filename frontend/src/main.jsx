import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx';
import './index.css';
import AuthProvider from './context/UserContextProvider.jsx';
import ServiceProviderAuthProvider from './context/ServiceProviderContextProvider.jsx' 
import SocketProvider from './context/Socket.context.jsx'
createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
    <ServiceProviderAuthProvider>
    <AuthProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
    </AuthProvider>
    </ServiceProviderAuthProvider>
    </BrowserRouter>

);