import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../api.js';

export default function Requests() {
  const { token } = useAuth();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const res = await apiFetch('/api/swap-requests', { token });
      setIncoming(res.incoming || []);
      setOutgoing(res.outgoing || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { if (token) load(); }, [token]);

  async function respond(id, accept) {
    setLoading(true);
    try {
      await apiFetch(`/api/swap-response/${id}`, { token, method: 'POST', body: { accept }});
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Requests</h2>

      <h3>Incoming</h3>
      <ul className="list">
        {incoming.map(r => (
          <li key={r._id}>
            <div>
              <div className="title">{r.requester?.name || 'Someone'}</div>
              <div className="muted">wants {r.theirSlot?.title} for your {r.mySlot?.title}</div>
            </div>
            <div className="row">
              <button onClick={() => respond(r._id, true)}>Accept</button>
              <button className="ghost" onClick={() => respond(r._id, false)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Outgoing</h3>
      <ul className="list">
        {outgoing.map(r => (
          <li key={r._id}>
            <div>
              <div className="title">Requested {r.theirSlot?.title}</div>
              <div className="muted">for your {r.mySlot?.title}</div>
            </div>
            <div className="muted">{r.status}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
