# Voice Notes -> Action Items

A beginner-friendly React and Express app that turns typed or spoken notes into summaries and action items with Gemini, then saves them privately in Cloud Firestore.

## Included Features

- Firebase email/password sign up, login, and logout
- Browser speech recognition with a manual text fallback
- Server-side Gemini analysis with validated structured JSON
- Summaries, topics, priorities, and explicitly mentioned due dates
- Private Firestore note history with completion and deletion controls
- Dashboard totals and AI Focus Insights
- Cloud Run-compatible Express backend with Secret Manager support

## Requirements

- Node.js 20+
- A Firebase project with Email/Password Authentication and Cloud Firestore enabled
- A Gemini API key

## Setup

1. Copy `backend/.env.example` to `backend/.env` and add your Gemini key for local development. Never put this file in Git.
2. Copy `frontend/.env.example` to `frontend/.env` and add the Firebase web app values from Firebase Console.
3. Install dependencies from the project root:

   `npm install`

   `npm run install:all`

4. Publish `firestore.rules` in the Firebase Console or with the Firebase CLI.
5. Run both apps with `npm run dev`.

The frontend runs at `http://localhost:5173` and the API at `http://localhost:3001`.

## Security

Gemini credentials are read only by the backend. In production, the backend reads the latest version of the Secret Manager secret named by `GEMINI_SECRET_NAME` using Google Cloud Application Default Credentials. Vite variables are public client configuration, not secrets. Firestore rules require an authenticated user and match the requested user ID to the authenticated UID. Never commit `.env` files or API keys.

For local development, set `GEMINI_API_KEY` in `backend/.env`. For Cloud Run, leave that value out and configure Secret Manager as described in [deploy.md](deploy.md). The backend `.dockerignore` also excludes local environment files from container build contexts.

## Checks

- API health: `http://localhost:3001/api/health`
- Frontend production build: `npm run build --prefix frontend`
