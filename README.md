# Leaderboard with Random Points (NodeJS + React + MongoDB + Tailwind + Socket.IO)

This project implements:
- 10 default users seeded on first run (you can add more from the UI).
- Claim random points (1–10) for a selected user.
- MongoDB collections: `users` and `claimhistories` (claim points history is recorded on every claim).
- Real-time leaderboard updates via Socket.IO.
- Basic React UI styled with TailwindCSS.

---

## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

---

## 1) Backend Setup

```bash
cd server
cp .env.example .env
# If needed, edit .env to point to your MongoDB and client origin(s)

npm install
npm run dev   # or: npm start
```

- Server runs on **http://localhost:5000**
- On first start, it seeds 10 users: Rahul, Kamal, Sanak, Anita, Vikram, Neha, Arjun, Priya, Rohit, Meera.

### API Endpoints
- `GET /api/users` — list all users
- `POST /api/users` — create a new user `{ name }`
- `GET /api/users/leaderboard` — returns [{ _id, name, totalPoints, rank }, ...]
- `POST /api/claim` — body `{ userId }` → awards random 1–10 points, saves history, returns `{ points, user }`
- `GET /api/claim/history?userId=<id>` — claim history (latest 100). Omit `userId` to see all.

---

## 2) Frontend Setup (React + Vite + Tailwind)

```bash
cd client
cp .env.example .env   # ensure VITE_API_BASE_URL points to your server
npm install
npm run dev
```
- App runs on **http://localhost:5173**

Tailwind is already configured:
- `tailwind.config.js` includes `./index.html` and `./src/**/*.{js,jsx,ts,tsx}`
- `postcss.config.js` enabled
- `src/index.css` has `@tailwind base; @tailwind components; @tailwind utilities;`

---

## 3) How Real-time Updates Work
- The server emits `leaderboard:update` after any claim or user creation.
- The client subscribes via Socket.IO and updates the leaderboard instantly for everyone connected.
- The server also emits `history:new` with each claim; the client prepends it to the current history (if relevant).

---

## 4) Notes & Tips
- CORS and Socket.IO origins are controlled by `CLIENT_ORIGIN` in `server/.env` (comma-separated for multiple).
- Ranking uses "competition ranking": if two users tie at rank 1, the next rank is 3.
- If you want to reset, you can drop the database `leaderboard_db` and restart the server.

---

## 5) Folder Structure

```
leaderboard-points-app/
├─ server/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ models/
│  │  │  ├─ ClaimHistory.js
│  │  │  └─ User.js
│  │  ├─ routes/
│  │  │  ├─ claimRoutes.js
│  │  │  └─ userRoutes.js
│  │  ├─ utils/
│  │  │  └─ ranking.js
│  │  ├─ db.js
│  │  └─ index.js
│  ├─ .env.example
│  └─ package.json
└─ client/
   ├─ src/
   │  ├─ components/
   │  │  ├─ AddUser.jsx
   │  │  ├─ ClaimPanel.jsx
   │  │  ├─ History.jsx
   │  │  └─ Leaderboard.jsx
   │  │  └─ UserSelect.jsx
   │  ├─ api.js
   │  ├─ socket.js
   │  ├─ App.jsx
   │  ├─ index.css
   │  └─ main.jsx
   ├─ .env.example
   ├─ index.html
   ├─ package.json
   ├─ postcss.config.js
   ├─ tailwind.config.js
   └─ vite.config.js
```

---

## 6) Test Quickly with cURL

```bash
# List users
curl http://localhost:5000/api/users

# Claim points for a user
curl -X POST http://localhost:5000/api/claim -H "Content-Type: application/json" -d '{"userId":"<PUT_USER_ID_HERE>"}'

# See leaderboard
curl http://localhost:5000/api/users/leaderboard

# See history (all)
curl http://localhost:5000/api/claim/history
```

Happy coding! 🎉
