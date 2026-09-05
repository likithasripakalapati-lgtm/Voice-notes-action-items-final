# Deployment

## Backend on Cloud Run

From the repository root:

```bash
gcloud builds submit backend --tag gcr.io/PROJECT_ID/voice-notes-api
gcloud run deploy voice-notes-api --image gcr.io/PROJECT_ID/voice-notes-api --region REGION --allow-unauthenticated --set-env-vars PORT=8080 --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

Create `GEMINI_API_KEY` in Google Cloud Secret Manager before deploying. Grant the Cloud Run service account permission to access that secret. Cloud Run supplies the `PORT` value at runtime.

## Frontend

Set `VITE_API_URL` to the deployed Cloud Run URL and set the Firebase `VITE_` values, then build:

```bash
npm run build --prefix frontend
```

Host the resulting `frontend/dist` folder on Firebase Hosting, Cloud Storage, or another static host. Deploy `firestore.rules` separately using Firebase Console or the Firebase CLI.

Do not put `GEMINI_API_KEY` in frontend environment variables or source code.
