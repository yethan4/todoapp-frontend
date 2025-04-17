import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ListProvider } from './context/ListContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ListProvider >
        <Router >
          <App />
        </Router>
      </ListProvider>
    </AuthProvider>
  </React.StrictMode>
);


