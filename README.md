# 🚗 Car Aggregator (Australia)

An Australian alternative to **AutoTempest** — a car sales aggregator that combines listings from multiple sources into one place.  
Currently under development.

---

## ✨ Features (planned)

- Search cars across multiple sources (eBay Motors, Gumtree, dealer sites, etc.)
- Unified results with consistent fields (title, price, year, kms, location, source)
- Filter by price, year, and location
- Responsive, clean frontend built with **React + Vite**
- Backend powered by **Vercel serverless functions**

---

## 📦 Tech Stack

- **Frontend:** React (Vite), deployed on Vercel  
- **Backend:** Node.js serverless functions, deployed on Vercel  
- **CI/CD:** GitHub Actions (build & API checks)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or newer
- npm (comes with Node.js)

### Clone and install
```bash
git clone https://github.com/<your-username>/my-car-aggregator.git
cd my-car-aggregator
```
### Frontend
```bash
cd client
npm install
npm run dev
```
Frontend will be available at http://localhost:5173/.

### Backend
```bash
cd ../api
npm install   # not strictly needed yet (only package.json with "type": "module")
```
Serverless functions run on Vercel, but you can test them locally with tools like [Vercel CLI](https://vercel.com/docs/cli)

---

## 🛣 Roadmap
1. Data sources
    - Connect to eBay Motors API (Australia)
    - Add more sources where scraping/API use is allowed
2. Frontend polish
    - Display results as cards (image, price, year, location, source)
    - Add filters and loading/error states
3. Testing & CI
    - Linting, unit tests, and stricter checks in GitHub Actions
4. Styling
    - Tailwind/shadcn for clean, responsive UI
  
---

## 👩‍💻 Developer Notes
For detailed setup instructions, current repo structure, code snippets, and the full internal roadmap, see [PROJECT_NOTES.md](./PROJECT_NOTES.md)

---

## 📜 License

*This repository is provided publicly for portfolio and demonstration purposes only.  
No license is granted for reuse, modification, or distribution.*
