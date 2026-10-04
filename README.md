# Chat

A real-time chat app with a React (Vite) frontend and an Express + Socket.IO backend.

## Prerequisites

- Node.js 20.19 or newer
- npm

## Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values
npm run dev            # or: npm start
```

The server runs on http://localhost:8080 by default.

| Variable          | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `RESEND_API_KEY`  | Resend API key for sending email                     |
| `MAIL_FROM`       | Sender address for outgoing email                    |
| `JWT_PRIVATE_KEY` | Key used to sign JWTs                                |
| `MONGODB_URI`     | MongoDB connection string                            |
| `PORT`            | Optional. Server port (default `8080`)               |
| `CLIENT_ORIGIN`   | Optional. Allowed CORS origin (default `http://localhost:5173`) |

## Frontend

```bash
cd frontend
npm install
cp .env.sample .env    # then fill in the values
npm run dev
```

The app runs on http://localhost:5173.

| Variable        | Description                                         |
| --------------- | --------------------------------------------------- |
| `VITE_BASE_URL` | Backend URL (default `http://localhost:8080`)       |

To build for production, run `npm run build`; `npm run preview` serves the build locally.

## Running both

Start the backend first, then the frontend, each in its own terminal.
