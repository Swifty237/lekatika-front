// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import GameProgress from './pages/GameProgress';
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Page d'accueil : redirige vers lobby (ou login selon besoin) */}
        <Route path="/" element={<Lobby />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/game-progress" element={<GameProgress />} />
      </Routes>
    </Router>
  );
}

export default App;