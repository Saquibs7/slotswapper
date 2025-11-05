# SlotSwapper

Peer-to-peer calendar slot swapping application. Built with React, Node.js, Express, MongoDb.
## try: https://slotswapper-2-vke6.onrender.com/
## Features

- JWT authentication (Sign Up / Log In)
- Calendar event CRUD
- Mark slots as swappable
- Request slot swaps (with P2P logic)
- Accept/Reject swap requests, atomic slot owner swap
- Dynamic state updates; discover available slots from others

## Setup

1. Clone repo, run `npm install` in both `frontend/` and `backend/`.
2. Initialize Mongo DB; run provided schema.
3. Set up a `.env` in `backend/` for `JWT_SECRET`, `  MONGO_URI`, etc.
4. Build and run backend: `npm start`
5. Build and run frontend: `npm start`

## Endpoints

| Endpoint | Purpose | Auth |
|---|---|---|
| POST /api/signup | Register user | No |
| POST /api/login | Log in, get JWT | No |
| GET/POST/PATCH /api/events | Event Mgmt | Yes |
| GET /api/swappable-slots | Discover slots | Yes |
| POST /api/swap-request | Offer swap | Yes |
| POST /api/swap-response/:id | Accept/Reject swap | Yes |
| GET /api/swap-requests | List requests | Yes |

## Live Demo


