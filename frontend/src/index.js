// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter,Routes,Route  } from 'react-router-dom';
import { SquareDashedBottomIcon } from 'lucide-react';
import { SocketProvider } from './context/SocketContext';
import { io } from 'socket.io-client';

import './index.css';
import Dashboard from './components/Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
const socket=io("http://localhost:5000");

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId="848509755991-lp3l9v3j4iluchpqs7dt3e1bf707hblb.apps.googleusercontent.com">
      <AuthProvider>
        <SocketProvider socket={socket}>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
        </SocketProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
    </BrowserRouter>

  </React.StrictMode>
);