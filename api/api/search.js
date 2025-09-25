export default function handler(req, res) {
  // Allow your frontend to call this API
  const allowedOrigin = process.env.FRONTEND_ORIGIN || "*";

  // Always set CORS headers
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Vary", "Origin"); // so caches vary by origin
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const { query = "" } = req.query;

  // Mock data (still fine)
  const results = [
    { id: 1, title: `2005 Toyota Corolla (mock) — ${query}`, price: "$4,500" },
    { id: 2, title: `2010 Mazda 3 (mock) — ${query}`,      price: "$6,800" }
  ];

  res.status(200).json({ results });
}
