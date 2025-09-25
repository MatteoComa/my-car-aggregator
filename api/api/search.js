export default function handler(req, res) {
  const origin = req.headers.origin || "*";         // reflect caller
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const { query = "" } = req.query;
  const results = [
    { id: 1, title: `2005 Toyota Corolla (mock) — ${query}`, price: "$4,500" },
    { id: 2, title: `2010 Mazda 3 (mock) — ${query}`,       price: "$6,800" }
  ];
  res.status(200).json({ results });
}
