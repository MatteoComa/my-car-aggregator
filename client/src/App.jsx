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
      const res = await fetch(
        `${API_BASE}/api/search?query=${encodeURIComponent(query)}`
      );
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
    <div style={{ padding: "1rem" }}>
      <h1>Car Aggregator</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search cars..."
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {results.map((r) => (
          <li key={r.id}>
            {r.title} — {r.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
