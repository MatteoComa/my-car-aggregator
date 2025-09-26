## Snapshot Date - 26/09/25
*This file is aimed at developers. A shortened summary document is available at [README.md](./README.md)*

# 🚗 Car Aggregator (Australian AutoTempest-style)

## 🎯 Aim
Build an **Australian AutoTempest-style car sales aggregator**:
- Pull listings from multiple sources (dealers, classifieds, APIs like eBay Motors).
- Clean, responsive frontend.
- Backend will eventually call APIs or scrape where allowed.
- Long-term: use Codex to generate code suggestions directly.

---

## 🛠 Current Setup

### Tools
- **GitHub Desktop** → commits
- **VS Code** → editing
- **Vercel** → hosting (two projects: frontend & API)
- **Codex connector** → long-term plan for code help

### Repo Structure
```
my-car-aggregator/
├── api/ ← backend project (Vercel serverless)
│ ├── api/
│ │ └── search.js ← mock API function
│ └── package.json ← { "type": "module" } for ESM
│
├── client/ ← React frontend
│ ├── src/
│ │ ├── App.jsx ← main UI (calls API)
│ │ └── index.jsx ← ReactDOM entry point
│ ├── index.html
│ ├── package.json ← React/Vite deps
│ ├── package-lock.json
│ └── vite.config.js
│
├── .github/
│ └── workflows/
│ ├── client.yml ← CI: build frontend
│ └── api.yml ← CI: check API imports
│
├── .gitignore ← ignores node_modules, dist, etc.
└── README.md
```
---

## 🌐 Hosting / Deployment

- **Frontend Project**:
  - URL: `https://my-car-aggregator.vercel.app`  
  - Root dir: `client/`  
  - Build: `npm run build`  
  - Output: `dist`  
  - Env var:  
    ```
    VITE_API_BASE=https://car-aggregator-api.vercel.app
    ```

- **API Project**:  
  - URL: `https://car-aggregator-api.vercel.app`  
  - Root dir: `api/`  
  - Hosts `api/api/search.js`  
  - CORS headers allow frontend origin.

---

## 🔧 CI/CD

### `.github/workflows/client.yml`
```yaml
name: Client (build)

on:
  push:
    branches: [ main ]
    paths:
      - "client/**"
      - ".github/workflows/client.yml"
  pull_request:
    branches: [ main ]
    paths:
      - "client/**"
      - ".github/workflows/client.yml"

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    defaults:
      run:
        working-directory: client

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Use Node 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: client/package-lock.json

      - name: Install deps
        run: npm ci || npm install

      - name: Build
        run: npm run build

      - name: Verify dist exists
        run: test -d dist && echo "✅ dist/ built"
   ```
### `.github/workflows/api.yml`
```yaml
name: API (checks)

on:
  push:
    branches: [ main ]
    paths:
      - "api/**"
      - ".github/workflows/api.yml"
  pull_request:
    branches: [ main ]
    paths:
      - "api/**"
      - ".github/workflows/api.yml"

jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 5

    defaults:
      run:
        working-directory: api

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Use Node 20
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Sanity import serverless function
        shell: bash
        run: |
          set -e
          if [ -f ./api/search.js ]; then
            node -e "import('./api/search.js').then(()=>console.log('✅ api/search.js import OK')).catch(e=>{console.error(e);process.exit(1)})"
          elif [ -f ./api/api/search.js ]; then
            node -e "import('./api/api/search.js').then(()=>console.log('✅ api/api/search.js import OK')).catch(e=>{console.error(e);process.exit(1)})"
          else
            echo "❌ No serverless function found at api/search.js or api/api/search.js"
            exit 1
          fi
   ```
📝 Code in Key Files

### `client/src/index.jsx'
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
### `client/src/App.jsx'
```jsx
import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "";

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Network response not ok");
      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search cars…" />
      <button onClick={handleSearch}>Search</button>
      {loading && <p>Loading…</p>}
      {error && <p style={{color: "red"}}>{error}</p>}
      <ul>
        {results.map(r => (
          <li key={r.id}>
            {r.title} — {r.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```
### `api/api/search.js'
```js
export default async function handler(req, res) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const { query = "" } = req.query;

  const results = [
    { id: 1, title: `2005 Toyota Corolla (mock) — ${query}`, price: "$4,500" },
    { id: 2, title: `2010 Mazda 3 (mock) — ${query}`, price: "$6,800" }
  ];

  res.status(200).json({ results });
}
```
### `api/package.json'
```json
{
  "type": "module"
}
```
✅ Next Steps
1. **Hook up eBay Motors API**
   - Add `EBAY_CLIENT_ID` + `EBAY_CLIENT_SECRET` to API env vars
   - Create `api/api/lib/ebayAuth.js` for token
   - Create `api/api/sources/ebay.js` adapter
   - Update `api/api/search.js` to call `searchEbay`

2. **Frontend polish**
   - Cards with image, price, year, location, link to source
   - Filters (price range, year)
   - Loading and error states

3. **Testing & CI**
   - Add lint/test steps to workflows
   - Optional caching & rate limiting in API

4. **Make it look nice**
   - Tailwind/shadcn for styling
   - Responsive grid, clean typography, error toasts


