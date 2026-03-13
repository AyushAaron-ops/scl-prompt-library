# SC&L AI Prompt Library

A professional prompt library for Supply Chain & Logistics professionals, featuring **1,600+ curated AI prompts** organised by category, with real-time filtering, favourites, export, and a Gemini-powered supply chain dictionary.

## Quick Start (Local)

```bash
git clone https://github.com/your-username/scl-prompt-library.git
cd scl-prompt-library
cp .env.example .env
# Add your Gemini API key to .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## One-Click Deployment

### Vercel
1. Import repository at [vercel.com/new](https://vercel.com/new)
2. Add environment variable `VITE_GEMINI_API_KEY` in project settings
3. Deploy — Vercel auto-detects Vite

### Netlify
1. Connect repository at [app.netlify.com](https://app.netlify.com)
2. Build command: `npm run build`, publish directory: `dist`
3. Add `VITE_GEMINI_API_KEY` in Site settings > Environment variables

### GitHub Pages
Push to `main` branch — the included workflow deploys automatically.
Add `VITE_GEMINI_API_KEY` as a repository secret under Settings > Secrets and variables > Actions.

## Dictionary Feature

The dictionary requires a free Gemini API key from [Google AI Studio](https://aistudio.google.com/). The application works fully without it — the dictionary panel will show a configuration notice.

## Prompt Categories (1,600+ prompts)

| Category | Prompts |
|---|---|
| Transportation Management | 230+ |
| Logistics Network Design | 250+ |
| Procurement & Sourcing | 180+ |
| Inventory Management | 100 |
| Risk Management | 120 |
| Sustainability & ESG | 110+ |
| Documentation & Compliance | 80 |
| Analytics & Reporting | 350+ |
| AI & Automation | 180+ |

## AI Models Covered

- **GPT-5** (OpenAI) — Complex reasoning, strategic planning
- **Claude Sonnet 4.5** (Anthropic) — Long-form compliance, ESG reports
- **Gemini 2.5 Pro** (Google) — Excel formulas, KPI calculations
- **Perplexity Sonar Pro** (Perplexity AI) — Real-time market data
- **Llama 3.3 70B** (Meta) — High-volume batch, self-hosted
- **GPT-4o mini** (OpenAI) — Fast classification, low-latency tasks

## Features

- **Smart filtering** — by category, subcategory, AI model, and complexity level
- **Full-text search** — across prompt titles, descriptions, and content
- **Favorites** — bookmark prompts, persisted in localStorage
- **Recently viewed** — quick access to last 20 viewed prompts
- **Model comparison panel** — side-by-side view of all 6 AI models
- **Copy with model recommendation** — copies prompt + formatted model rationale
- **Export** — JSON and CSV export of filtered or full prompt set
- **AI Dictionary** — Gemini-powered supply chain term definitions
- **Dark mode** — persisted preference
- **Fully responsive** — works on mobile, tablet, and desktop

## Project Structure

```
src/
├── types/          TypeScript interfaces (no logic)
├── data/           Static prompt data (no UI)
├── hooks/          Stateful logic (no JSX)
├── utils/          Pure functions (no React)
└── components/
    ├── layout/     Header, Sidebar
    ├── prompts/    PromptCard, PromptGrid, PromptModal
    ├── filters/    FilterBar
    ├── models/     ModelBadge, ModelPanel
    ├── dictionary/ DictionaryDrawer
    └── ui/         Toast, Skeleton
```

## Tech Stack

- **Vite 5** + **React 18** + **TypeScript 5**
- **Tailwind CSS 3.4** for styling
- **Headless UI 2** for accessible dropdowns, dialogs, tabs
- **Lucide React** for icons
- No Redux, no CSS-in-JS, no external state libraries

## License

MIT
