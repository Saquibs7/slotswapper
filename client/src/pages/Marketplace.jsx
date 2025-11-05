import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal.jsx';
import { apiFetch } from '../api.js';

export default function Marketplace() {
  const { token } = useAuth();
  const [slots, setSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [targetSlot, setTargetSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const other = await apiFetch('/api/swappable-slots', { token });
      setSlots(other);
      const mine = await apiFetch('/api/events', { token });
      setMySlots(mine.filter(m => m.status === 'SWAPPABLE'));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { if (token) load(); }, [token]);

  function openRequestModal(slot) {
    setTargetSlot(slot);
    setOpenModal(true);
  }

  async function sendRequest(mySlotId) {
    if (!targetSlot) return;
    setLoading(true);
    try {
      await apiFetch('/api/swap-request', { token, method: 'POST', body: { mySlotId, theirSlotId: targetSlot._id }});
      alert('Swap request sent');
      setOpenModal(false);
      await load(); // refresh statuses
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Marketplace</h2>
      <div className="muted">Browse slots other users offered as swappable</div>
      <ul className="list">
        {slots.map(s => (
          <li key={s._id}>
            <div>
              <div className="title">{s.title}</div>
              <div className="muted">{new Date(s.startTime).toLocaleString()}</div>
            </div>
            <div className="row">
              <div className="muted">by {s.owner?.name || s.user}</div>
              <button onClick={() => openRequestModal(s)}>Request Swap</button>
            </div>
          </li>
        ))}
      </ul>

      <Modal open={openModal} title="Choose one of your swappable slots" onClose={() => setOpenModal(false)}>
        <div>
          {mySlots.length === 0 && <div className="muted">You have no SWAPPABLE slots. Mark a slot swappable first.</div>}
          <ul className="list">
            {mySlots.map(m => (
              <li key={m._id}>
                <div>
                  <div className="title">{m.title}</div>
                  <div className="muted">{new Date(m.startTime).toLocaleString()}</div>
                </div>
                <div>
                  <button onClick={() => sendRequest(m._id)} disabled={loading}>{loading ? 'Sending…' : 'Offer this'}</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </section>
  );
}
