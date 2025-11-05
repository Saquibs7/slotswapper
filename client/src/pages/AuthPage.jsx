import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../api.js';

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const path = mode === 'signup' ? '/api/signup' : '/api/login';
      const body = mode === 'signup' ? { name, email, password: pwd } : { email, password: pwd };
      const data = await apiFetch(path, { method: 'POST', body });
      login({ token: data.token, user: data.user });
      navigate('/');
    } catch (err) {
      alert(err.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <form className="card form-card" onSubmit={submit}>
        <h2>{mode === 'signup' ? 'Create account' : 'Welcome back'}</h2>
        {mode === 'signup' && (
          <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
        )}
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={pwd} onChange={e => setPwd(e.target.value)} required />
        <button disabled={loading}>{loading ? 'Please wait…' : (mode === 'signup' ? 'Sign up' : 'Log in')}</button>
        <div className="muted small">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
          <button type="button" className="linkish" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
            {mode === 'signup' ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </form>
    </div>
  );
}
