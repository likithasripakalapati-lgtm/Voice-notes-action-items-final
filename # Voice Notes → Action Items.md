# Voice Notes → Action Items

## Project Overview

Build a GenAI application called "Voice Notes → Action Items".

The application allows users to enter or speak a note. Gemini AI analyzes the note and automatically extracts a summary and actionable tasks.

Users can save their notes and action items and view them later.

## Main Features

### 1. User Authentication
Use Firebase Authentication.

Users should be able to:
- Sign up
- Log in
- Log out

Only logged-in users can access their own notes.

### 2. Voice Notes
Provide a microphone button for voice input.

Use browser speech recognition where supported.

If speech recognition is not supported, show a message and allow the user to type the note manually.

### 3. Manual Note Input
Provide a text area where users can type or paste a note.

Do not allow empty notes to be submitted.

### 4. Gemini AI Analysis
Send the note text to the backend.

Gemini should analyze the note and return:

- Short summary
- Action items
- Priority
- Due date only when explicitly mentioned
- Important topics

Expected response:

{
  "summary": "Short summary of the note",
  "actionItems": [
    {
      "task": "Complete Java assignment",
      "priority": "high",
      "dueDate": null,
      "completed": false
    }
  ],
  "topics": ["Java", "Assignment"]
}

Rules:
- Priority must be low, medium, or high.
- Never invent a deadline.
- If no action items exist, return an empty array.
- Topics should contain important subjects from the note.

### 5. Save Notes
Save analyzed notes to Cloud Firestore.

Use this structure:

users/{userId}/notes/{noteId}

Each note should contain:

- userId
- originalText
- summary
- actionItems
- topics
- createdAt
- updatedAt

### 6. History
Users should be able to see their previous notes.

Each note should display:
- Original text
- Summary
- Action items
- Topics
- Created date

Users can:
- Mark action items as completed
- Delete their own notes

### 7. Dashboard
Show:
- Total notes
- Pending action items
- Completed action items
- High-priority action items
- Recent notes

Also include a simple "AI Focus Insights" section showing frequently mentioned topics and a short productivity suggestion.

### 8. Backend
Use Node.js + Express.

Required API routes:

GET /api/health

POST /api/analyze

The backend should:
1. Receive the note text.
2. Send it to Gemini.
3. Validate the Gemini response.
4. Return structured JSON.
5. Handle errors properly.

### 9. Security
The Gemini API key must NEVER be placed in frontend code.

For local development use environment variables.

For production use Google Cloud Secret Manager.

Create:
- .env.example
- .gitignore

Never commit API keys or secrets to GitHub.

### 10. Firestore Security Rules
Users must only be able to read and write their own notes.

Never use:

allow read, write: if true;

### 11. Error Handling
Handle:
- Empty notes
- Microphone permission denied
- Unsupported speech recognition
- Gemini API errors
- Invalid Gemini response
- Firebase errors
- Firestore errors
- Backend unavailable
- Network errors

Show simple and clear error messages.

### 12. UI
Use:

- React
- Vite
- JavaScripts
- CSS

Create a clean, simple and responsive interface for desktop and mobile.

Do not add unnecessary animations or complicated features.

### 13. Project Structure

voice-notes-action-items/
├── frontend/
├── backend/
├── firestore.rules
├── .env.example
├── .gitignore
├── README.md
├── deploy.md
└── spec.md

### 14. Cloud Run
The backend must be deployable to Google Cloud Run.

Use process.env.PORT.

Include the health endpoint.

The frontend must use a configurable backend API URL so it can use the Cloud Run URL after deployment.

### 15. GitHub
The repository should include:

- Frontend source code
- Backend source code
- README.md
- Firestore security rules
- Deployment instructions
- .env.example
- .gitignore
- spec.md

Do not commit:
- API keys
- Secrets
- .env files containing secrets
- node_modules

### 16. Success Criteria

The project is successful when:

1. User can register and log in.
2. User can enter or speak a note.
3. Gemini analyzes the note.
4. Summary and action items are displayed.
5. User can save the result.
6. Saved notes appear in history.
7. Action items can be marked completed.
8. User can delete their own notes.
9. Users cannot access other users' notes.
10. Gemini API key is protected.
11. Backend works locally.
12. Backend can be deployed to Cloud Run.
13. GitHub repository contains proper documentation.

### Development Rule

Keep the implementation simple and beginner-friendly.

Do not add unnecessary features.

Build and test the project step by step.