import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // optional if you have global styles
import { AuthProvider } from './context/AuthContext';

// This is the root element where your React app will be rendered
ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
