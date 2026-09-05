import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = Number(process.env.PORT) || 3001;
const allowedPriorities = new Set(['low', 'medium', 'high']);

app.use(cors());
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

function validateAnalysis(value) {
  if (!value || typeof value.summary !== 'string' || !Array.isArray(value.actionItems) || !Array.isArray(value.topics)) {
    throw new Error('Gemini returned an invalid response shape.');
  }

  const actionItems = value.actionItems.map((item) => {
    if (!item || typeof item.task !== 'string' || !allowedPriorities.has(item.priority)) {
      throw new Error('Gemini returned an invalid action item.');
    }
    return {
      task: item.task.trim(),
      priority: item.priority,
      dueDate: item.dueDate === null || typeof item.dueDate === 'string' ? item.dueDate : null,
      completed: false
    };
  });

  return {
    summary: value.summary.trim(),
    actionItems,
    topics: value.topics.filter((topic) => typeof topic === 'string').map((topic) => topic.trim()).filter(Boolean)
  };
}

app.post('/api/analyze', async (request, response) => {
  const text = typeof request.body?.text === 'string' ? request.body.text.trim() : '';
  if (!text) return response.status(400).json({ error: 'Note text is required.' });
  if (!process.env.GEMINI_API_KEY) return response.status(503).json({ error: 'Gemini is not configured on the server.' });

  try {
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = client.getGenerativeModel({ model: 'gemini-3.6-flash' });
    const result = await model.generateContent(`Analyze this note and return JSON only. Use exactly this shape: {"summary":"string","actionItems":[{"task":"string","priority":"low|medium|high","dueDate":"YYYY-MM-DD or null","completed":false}],"topics":["string"]}. Never invent due dates; only include one when explicitly mentioned. Keep the summary short. Note:\n${text}`);
    const raw = result.response.text().replace(/^```json\s*|\s*```$/g, '').trim();
    return response.json(validateAnalysis(JSON.parse(raw)));
  } catch (error) {
    console.error('Analysis failed:', error.message);
    return response.status(502).json({ error: 'The note could not be analyzed. Please try again.' });
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(port, () => console.log(`API listening on port ${port}`));
