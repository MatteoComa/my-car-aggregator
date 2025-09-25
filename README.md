# Aussie Car Aggregator (Vercel-ready)

React (Vite) frontend in `/client`, serverless API in `/api`. `vercel.json` wires both into one Vercel project and routes `/api/*` to functions, everything else to the built frontend.

## Local dev

1) Install frontend deps:
   ```bash
   cd client
   npm install
   npm run dev