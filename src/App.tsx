// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil : redirige vers lobby (ou login selon besoin) */}
        <Route path="/" element={<Lobby />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;