import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../api.js';

export default function Dashboard() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', startTime: '', endTime: '' });
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const data = await apiFetch('/api/events', { token });
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { if (token) load(); }, [token]);

  async function create(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/api/events', { token, method: 'POST', body: form });
      setForm({ title: '', startTime: '', endTime: '' });
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleSwappable(evId, toStatus) {
    try {
      await apiFetch(`/api/events/${evId}/status`, { token, method: 'PATCH', body: { status: toStatus } });
      await load();
    } catch (err) { alert(err.message); }
  }

  return (
    <section>
      <h2>Your Calendar</h2>
      <form className="grid" onSubmit={create}>
        <input placeholder="Title" value={form.title} required onChange={e => setForm(s => ({...s, title: e.target.value}))} />
        <input type="datetime-local" value={form.startTime} required onChange={e => setForm(s => ({...s, startTime: e.target.value}))} />
        <input type="datetime-local" value={form.endTime} required onChange={e => setForm(s => ({...s, endTime: e.target.value}))} />
        <button disabled={loading}>{loading ? 'Adding…' : 'Add Event'}</button>
      </form>

      <ul className="list">
        {events.map(ev => (
          <li key={ev._id}>
            <div>
              <div className="title">{ev.title}</div>
              <div className="muted">
                {new Date(ev.startTime).toLocaleString()} — {new Date(ev.endTime).toLocaleString()}
              </div>
            </div>

            <div className="row">
              <span className={ev.status === 'BUSY' ? 'busy' : ev.status === 'SWAPPABLE' ? 'swappable' : 'pending'}>
                {ev.status}
              </span>
              {ev.status === 'BUSY' && (
                <button onClick={() => toggleSwappable(ev._id, 'SWAPPABLE')}>Make Swappable</button>
              )}
              {ev.status === 'SWAPPABLE' && (
                <button onClick={() => toggleSwappable(ev._1d, 'BUSY')}>Make Busy</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
