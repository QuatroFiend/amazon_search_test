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

#### a) Create tables
Use this template/setup:
- https://github.com/uibakery-templates/faceted-search-database

#### b) Create RPC functions for facet counts
Open SQL Editor in Supabase and run:

```sql
-- Brand facet counts with SQL aggregation
CREATE OR REPLACE FUNCTION get_brand_facet_counts(
  p_category_ids INTEGER[] DEFAULT NULL,
  p_search_query TEXT DEFAULT NULL
)
RETURNS TABLE (brand_id INTEGER, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.brand_id::INTEGER,
    COUNT(*)::BIGINT as count
  FROM products p
  WHERE
    p.brand_id IS NOT NULL
    AND (p_category_ids IS NULL OR p.id IN (
      SELECT pc.product_id
      FROM product_categories pc
      WHERE pc.category_id = ANY(p_category_ids)
    ))
    AND (p_search_query IS NULL OR p.name ILIKE '%' || p_search_query || '%')
  GROUP BY p.brand_id;
END;
$$ LANGUAGE plpgsql;

-- Category facet counts with SQL aggregation
CREATE OR REPLACE FUNCTION get_category_facet_counts(
  p_brand_ids INTEGER[] DEFAULT NULL,
  p_search_query TEXT DEFAULT NULL
)
RETURNS TABLE (category_id INTEGER, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pc.category_id::INTEGER,
    COUNT(*)::BIGINT as count
  FROM product_categories pc
  INNER JOIN products p ON pc.product_id = p.id
  WHERE
    (p_brand_ids IS NULL OR p.brand_id = ANY(p_brand_ids))
    AND (p_search_query IS NULL OR p.name ILIKE '%' || p_search_query || '%')
  GROUP BY pc.category_id;
END;
$$ LANGUAGE plpgsql;
```

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
- UI is functional MVP quality; visual polish can be improved.

## Engineering notes
- [ENGINEERING_NOTES_RU.md](./ENGINEERING_NOTES_RU.md) - detailed decisions and trade-offs (RU)
- [ENGINEERING_NOTES.md](./ENGINEERING_NOTES.md) - detailed decisions and trade-offs (EN)
