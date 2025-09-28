## Snapshot Date - 28/09/25

*This file is aimed at developers. A shortened summary document is available at *[*README.md*](./README.md)

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
│ └── ci.yml ← unified workflow (detects changes + runs jobs)
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

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  detect:
    runs-on: ubuntu-latest
    outputs:
      client: ${{ steps.filter.outputs.client }}
      api: ${{ steps.filter.outputs.api }}
    steps:
      - uses: actions/checkout@v4
      - id: filter
        uses: dorny/paths-filter@v3
        with:
          filters: |
            client:
              - 'client/**'
            api:
              - 'api/**'

  client:
    if: ${{ needs.detect.outputs.client == 'true' }}
    needs: detect
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: client
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: client/package-lock.json
      - run: npm ci || npm install
      - run: npm run build
      - run: test -d dist && echo "✅ dist/ built"

  api:
    if: ${{ needs.detect.outputs.api == 'true' }}
    needs: detect
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: api
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: |
          set -e
          if [ -f ./api/search.js ]; then
            node -e "import('./api/search.js')"
          elif [ -f ./api/api/search.js ]; then
            node -e "import('./api/api/search.js')"
          else
            echo "❌ No serverless function found"; exit 1
```

✅ Branch protection is now configured to require only the `CI` workflow. Individual jobs (`client`, `api`) run conditionally based on file changes.

---

📝 Code in Key Files

### `client/src/index.jsx`

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

### `client/src/App.jsx`

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

### `api/api/search.js`

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

### `api/package.json`

```json
{
  "type": "module"
}
```

---

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

