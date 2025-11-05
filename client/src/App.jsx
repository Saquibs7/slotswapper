import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Requests from './pages/Requests.jsx';

export default function App() {
  const { token, logout, user } = useAuth();

  return (
    <div className="App">
      <header className="topbar">
        <div className="brand"><Link to="/">SlotSwapper</Link></div>

        <nav className="nav">
          {token ? (
            <>
              <Link to="/">Calendar</Link>
              <Link to="/marketplace">Marketplace</Link>
              <Link to="/requests">Requests</Link>
              <span className="muted"> {user?.name || ''} </span>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/auth">Login</Link>
          )}
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          } />
          <Route path="/requests" element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <footer className="footer">Built with ❤️ — SlotSwapper</footer>
    </div>
  );
}
