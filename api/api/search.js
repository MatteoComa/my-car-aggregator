export default function handler(req, res) {
  const { query = "" } = req.query;
  const results = [
    { id: 1, title: `2005 Toyota Corolla (mock) — ${query}`, price: "$4,500" },
    { id: 2, title: `2010 Mazda 3 (mock) — ${query}`, price: "$6,800" }
  ];
  res.status(200).json({ results });
}
