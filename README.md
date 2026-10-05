# Chat

A real-time chat app with a React (Vite) frontend and an Express + Socket.IO backend.

- Log in with a one-time code sent to your email
- Search for users by name and add them as contacts
- Send one-to-one messages in real time; messages are saved in MongoDB

## Prerequisites

- Node.js 20.19 or newer
- npm
- A MongoDB database and a [Resend](https://resend.com) API key

## Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The server runs on http://localhost:8080 by default. `npm run dev` loads `.env` and restarts on file changes. `npm start` does not load `.env`, so use it only where the variables are set in the environment (for example, on Render).

| Variable          | Description                                                                     |
| ----------------- | ------------------------------------------------------------------------------- |
| `RESEND_API_KEY`  | Resend API key for sending email                                                |
| `MAIL_FROM`       | Sender address for outgoing email                                               |
| `JWT_PRIVATE_KEY` | Key used to sign JWTs                                                           |
| `MONGODB_URI`     | MongoDB connection string                                                       |
| `NODE_ENV`        | Set to `production` to send the login cookie with `Secure` and `SameSite=None`  |
| `PORT`            | Optional. Server port (default `8080`)                                          |
| `CLIENT_ORIGIN`   | Optional. Allowed CORS origin (default `http://localhost:5173`)                 |

## Frontend

```bash
cd frontend
npm install
cp .env.sample .env    # then fill in the values
npm run dev
```

The app runs on http://localhost:5173.

| Variable        | Description                                   |
| --------------- | --------------------------------------------- |
| `VITE_BASE_URL` | Backend URL (default `http://localhost:8080`) |

To build for production, run `npm run build`; `npm run preview` serves the build locally. `VITE_BASE_URL` is read at build time, so rebuild after changing it.

## Running both

Start the backend first, then the frontend, each in its own terminal.

## Deployment

- **Frontend:** Cloudflare Worker. Set `VITE_BASE_URL` as a build variable to the backend URL.
- **Backend:** Render web service with a custom domain. Set `CLIENT_ORIGIN` to the frontend URL.

Keep the frontend and the API on the same domain. The login cookie is httpOnly; if the API runs on a different domain such as onrender.com, browsers treat the cookie as third-party and may block it, which breaks login.
