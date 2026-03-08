# DSA Coding Tutor

A production-ready React app that uses Google Gemini to answer coding questions. The UI is a chat interface; the backend keeps your API key server-side.

## Stack

- **Frontend:** React 18, TypeScript, Vite, react-markdown
- **Backend:** Express, `@google/genai` (Gemini)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy the example env and set your Gemini API key:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:

   ```env
   GEMINI_API_KEY=your_key_here
   ```

   Get a key at [Google AI Studio](https://aistudio.google.com/apikey).

## Development

Run the API server and the Vite dev server together:

```bash
npm run dev
```

- App: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3001](http://localhost:3001)

Vite proxies `/api` to the server, so the frontend talks to the same origin in dev.

## Production

1. **Build the frontend**

   ```bash
   npm run build
   ```

2. **Run the server**

   Set `GEMINI_API_KEY` in the environment, then:

   ```bash
   set GEMINI_API_KEY=your_key&& node server/index.js
   ```

   Or on Linux/macOS:

   ```bash
   GEMINI_API_KEY=your_key node server/index.js
   ```

   The server serves the built app from `dist/` and listens on `PORT` (default `3001`). Open [http://localhost:3001](http://localhost:3001).

3. **Deploy on Vercel**

   - Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
   - In the project settings, add an **Environment Variable**: `GEMINI_API_KEY` = your Gemini API key.
   - Deploy. The app uses the `/api/chat` serverless function; the key stays server-side.

## Scripts

| Command       | Description                          |
|---------------|--------------------------------------|
| `npm run dev` | Start API + Vite dev server          |
| `npm run build` | Build frontend for production      |
| `npm run preview` | Preview production build (Vite)   |
| `npm start`   | Run API server only (no dev server) |

## Security

- The Gemini API key is only used on the server. Never put it in frontend code or in `VITE_*` env vars.
- For production, run the server with `GEMINI_API_KEY` set in the environment (or your host’s secrets).
