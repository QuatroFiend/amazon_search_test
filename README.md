# Amazon Product Search MVP

MVP e-commerce catalog with server-side faceted search on Next.js 16 + Supabase.

## Demo
- Live: `https://little-amazon-project.vercel.app/`
- Repository: `https://github.com/QuatroFiend/amazon_search_test`

## What is implemented
- Text search with partial match (`ILIKE`).
- Facet filters:
  - Brand (multi-select)
  - Category (multi-select)
- Dynamic facet counts based on active filters.
- URL-driven state for `q`, `brands`, `categories`, `sortBy`, `page`.
- Pagination with invalid-page normalization (redirect to valid page).
- Loading and error fallbacks: `loading.tsx`, `error.tsx`, `global-error.tsx`.

## Tech Stack
- Next.js 16 (App Router, Server Components)
- React 19
- TypeScript
- Supabase (PostgreSQL)
- CSS Modules

## Local setup

### Prerequisites
- Node.js 20+
- npm
- Supabase project

### 1) Install
```bash
npm install
```

### 2) Environment
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3) Database
Use this template/setup:
- https://github.com/uibakery-templates/faceted-search-database

### 4) Run
```bash
npm run dev
```

Open `http://localhost:3000`

### 5) Production build
```bash
npm run build
npm start
```

## URL state example
```text
/?q=laptop&brands=1,5&categories=3&sortBy=popular&page=2
```

## Known limitations
- `popular` sorting is computed in app code (not SQL-level ranking).
- Facet counts are currently aggregated in Node.js (`reduce`), not `GROUP BY`.
- UI is functional MVP quality; visual polish can be improved.

## Engineering notes
- [ENGINEERING_NOTES_RU.md](./ENGINEERING_NOTES_RU.md) - detailed decisions and trade-offs (RU)
- [ENGINEERING_NOTES.md](./ENGINEERING_NOTES.md) - detailed decisions and trade-offs (EN)
