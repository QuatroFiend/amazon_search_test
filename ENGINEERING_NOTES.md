# Engineering Notes

## Technology Choices

**Next.js 16 (App Router) + React Server Components**

**Why I chose it:**
- **All-in-one framework**: Next.js gives production-ready foundations out of the box (routing, SSR, API routes, deployment optimization).
- **Native URL state management**: built-in `searchParams` removes the need for external state tools (Redux, Zustand) for search/filter synchronization.
- **SEO-first architecture**: for e-commerce, indexability matters. Server Components render the catalog server-side, so content is available to crawlers immediately.
- **Performance**: SSR improves Time-to-First-Byte (TTFB) and First Contentful Paint (FCP), which are important for conversion.

**Trade-off:**
- Full page navigation on filter changes (vs instant SPA-style filtering).
- For MVP, SEO + shareable URLs + simpler architecture are more important than instant transitions.

---

**TypeScript**

**Why I chose it:**
- End-to-end type safety across the pipeline: `DB schema -> API responses -> UI components`.
- Catches compile-time issues early (e.g. filter field typos, invalid Supabase data types).
- Better developer experience with autocomplete and inline hints.

---

**CSS Modules instead of Tailwind CSS**

**Decision:** Use CSS Modules instead of a utility-first styling approach.

**Why I chose it:**
- **Code readability**: keeps JSX focused on behavior, not styling noise.
- **Style isolation**: CSS Modules scope class names automatically and prevent collisions.
- **Project fit**: for a single-page MVP with ~10-15 components, Tailwind setup and utility verbosity were not worth it.

**When Tailwind would make sense:**
- Large design system with many reusable components.
- Fast prototyping with predefined design tokens.
- Team already aligned on Tailwind conventions.

**Trade-off:**
- No built-in responsive utilities (need custom media queries).
- More manual styling than utility classes.
- Cleaner component code and easier code review.
- No extra config/purge setup required.

**Migration path:** If the project grows beyond MVP, moving to Tailwind should be straightforward (CSS Modules can coexist during migration).

## Key Architectural Decisions

### 1. Server-Side Faceted Search

**Decision:** I implemented faceted search on the server (Server Components), while keeping URL as the single source of truth for search/filter state.

**Why this approach:**
- `searchParams` solves multiple things at once: shareable links, reproducible state, and easier debugging.
- SEO stays strong because catalog and filtered results are server-rendered.
- No separate state manager is needed just to keep `URL <-> UI` in sync.

**Why not client-only filtering:**
- It requires shipping and keeping a larger dataset in browser memory.
- On weaker devices this quickly becomes laggy.
- State consistency becomes harder to maintain.

**Trade-off:**
- Filter navigation is not as instant as a pure SPA.
- In return, the solution is predictable, SEO-friendly, and easier to maintain.

---

**Technical decision: ID-based URL encoding instead of name-based**

Filters started as name-based, but I moved to IDs:
```text
?brands=1,2,5&categories=3,7
```

**Why:**
- IDs are stable (brand/category renames do not break links).
- No name collisions and no URL-encoding edge cases.
- Validation is simpler: only positive integers are allowed.

**Trade-off:**
- URL is less human-readable.
- For MVP, reliability and predictability are more important.

**Production improvement path:**
- Add `slug` fields in DB and switch to hybrid `slug-id` format for readability + stability.

---

### 2. Dynamic Facet Counts with Selective Filter Exclusion

**Decision:** while calculating facet counts, I exclude the facet's own filter type:
- for brand counts: exclude `brandIds`, but apply `categoryIds` and `q`;
- for category counts: exclude `categoryIds`, but apply `brandIds` and `q`.

**Why:**
- Users see filter potential instead of a list of zeros.
- This is better for discoverability with 2 facets in MVP.

**Current implementation:**
- Counts are calculated in app code via fetched rows + `reduce`.
- For ~10k products this is acceptable; at 100k+ I would move aggregation to SQL (`GROUP BY`, RPC/view) with indexes.

**Optimization already implemented:**
- facet counts and product data are fetched in parallel.

---

### 3. Pagination Edge Cases

**Decision:** any invalid `page` value is normalized to a valid range and redirected with filters preserved.

**What it handles:**
- `page <= 0`, fractional values, or page numbers beyond available range.
- stale/shared links from external sources.

**Why it matters:**
- Users do not get stuck in broken states.
- URL remains consistent and safely shareable.

---

### 4. Partial Text Search (`ILIKE`)

**Decision:** partial text search is implemented via `ILIKE %query%`.

**Why:**
- simplest, most transparent MVP implementation.
- matches expected "contains text" behavior.

**Trade-off:**
- At larger scale (`100k+`) `ILIKE` needs optimization.
- At current scale (`~10k`) performance is acceptable and correct.

**Scale plan:**
- `pg_trgm` / Full-Text Search + GIN indexes.
- Add autocomplete and better ranking.

---

### 5. Sorting Strategy with a Practical "Popular" Proxy

**Decision:** support 5 sort options: `newest`, `oldest`, `name-asc`, `name-desc`, `popular`.

**How `popular` works:**
- There is no `popularity_score` in DB, so I use a proxy:
  number of products under a brand + `created_at` tie-break.

**Implementation detail:**
- For `popular`, I fetch all filtered products, sort in app code, then paginate.
- For MVP, this is the best balance of simplicity and feature completeness.
- For `100k+` scale, sorting should move to SQL level.

**Production plan:**
- Materialize popularity score in DB (view/materialized field) and sort in SQL.
- Add short-TTL cache by normalized filter key to avoid repeated recomputation.

---

### 6. Reusable UI Components and UI Scalability

**What I built:**
- A reusable UI baseline: `Icon`, `Typography`, `Button`, `IconButton`, `CheckBox`, `RadioButton`.
- Icons are centralized in a typed registry (`IconName` + single render entrypoint).
- Typography is centralized via variants (`title`, `cardTitle`, `info`, `error`, `link`) for a consistent visual language.

**Why this scales well:**
- New screens can be assembled from reusable building blocks instead of copy-paste.
- UI changes are centralized and safer.
- Easier consistency and faster future delivery.

---

### 7. `app/api` Structure and Runtime Resilience

**`app/api` architecture:**
- Split by responsibility: `products`, `brands`, `categories`.
- Inside `products`: separate `helpers`, `facets`, `queries`, plus `productService` orchestrator.
- This layout makes new filters/sort options easier to add without rewriting core logic.

**Resilience at rendering level:**
- Dedicated `loading.tsx` for loading state.
- `error.tsx` for recoverable page-level errors (`reset()` path).
- `global-error.tsx` for critical rendering failures.

**Why it matters:**
- Users do not hit a blank screen on runtime/network issues.
- Fallback UX and recovery path remain predictable.

---

### Non-trivial Edge Case I Solved

**Problem:** race-condition in multi-select checkboxes during rapid clicks (some selections could be lost before URL update).

**Solution:**
- Added optimistic local state for checkboxes.
- Synced with URL through controlled remount.
- Switched filter updates to `router.replace` to avoid browser history spam.

**Result:** UI became more predictable while URL stayed the source of truth after navigation.

---

### How I Would Scale Next

1. Move facet counts to SQL aggregation (`GROUP BY` via RPC/view) to reduce Node-side load.
2. Add indexes for filters/search:
   - `products(brand_id)`
   - `product_categories(product_id, category_id)` and `product_categories(category_id, product_id)`
   - `pg_trgm` index for `name` search.
3. Add short-TTL cache for heavy paths (`popular`, facet counts).
4. Add slow-query monitoring and request tracing at Supabase/app level.
