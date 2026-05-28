// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import GameProgress from './pages/GameProgress';
import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from './components/ui/tooltip';

const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router>
            <Toaster />
            <Routes>
              {/* Page d'accueil : redirige vers lobby (ou login selon besoin) */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/lobby" element={<PrivateRoute><Lobby /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
              <Route path="/game-progress" element={<PrivateRoute><GameProgress /></PrivateRoute>} />
            </Routes>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;