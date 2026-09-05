# Deployment

## Backend on Cloud Run

From the repository root, set your project and region first:

```bash
gcloud config set project PROJECT_ID
gcloud services enable run.googleapis.com secretmanager.googleapis.com artifactregistry.googleapis.com
```

Create the secret without putting its value in source code or an environment file:

```bash
printf '%s' 'YOUR_GEMINI_API_KEY' | gcloud secrets create gemini-api-key --data-file=-
```

Find the Cloud Run runtime service account and grant it access to this secret:

```bash
gcloud iam service-accounts list
gcloud secrets add-iam-policy-binding gemini-api-key \
	--member="serviceAccount:CLOUD_RUN_SERVICE_ACCOUNT" \
	--role="roles/secretmanager.secretAccessor"
```

Build and deploy the backend:

```bash
gcloud builds submit backend --tag gcr.io/PROJECT_ID/voice-notes-api
gcloud run deploy voice-notes-api --image gcr.io/PROJECT_ID/voice-notes-api --region REGION --allow-unauthenticated --set-env-vars GEMINI_SECRET_NAME=gemini-api-key,GOOGLE_CLOUD_PROJECT=PROJECT_ID
```

The backend uses Google Cloud Application Default Credentials to call Secret Manager. Cloud Run supplies the `PORT` value at runtime. Do not set `GEMINI_API_KEY` on the Cloud Run service and do not pass the secret value to the frontend. To rotate the key, add a new secret version:

```bash
printf '%s' 'NEW_GEMINI_API_KEY' | gcloud secrets versions add gemini-api-key --data-file=-
```

The backend reads the latest version when it first needs Gemini after restart.

## Frontend

Set `VITE_API_URL` to the deployed Cloud Run URL and set the Firebase `VITE_` values, then build:

```bash
npm run build --prefix frontend
```

Host the resulting `frontend/dist` folder on Firebase Hosting, Cloud Storage, or another static host. Deploy `firestore.rules` separately using Firebase Console or the Firebase CLI.

Do not put `GEMINI_API_KEY` in frontend environment variables or source code.
