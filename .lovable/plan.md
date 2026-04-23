

## Scheduled keyword index generator (every 15 days)

I'll build a backend job that runs automatically every 15 days, scans every product in your database, and generates a smart keyword search index — so when someone types "ip" they instantly see "iphone, ips, ipad", etc. This will make your search massively faster and smarter without re-querying the DB on every keystroke.

Note: this project runs on **Lovable Cloud** (not Vercel), so the equivalent of a Vercel Cron Job is a **Supabase Edge Function** + **pg_cron schedule** — same concept, fully serverless, already wired into your backend. No extra account or deploy step needed.

### What gets built

1. **New table `SearchIndex`** (1 row, always overwritten)
   - `id` (bigint, pk)
   - `keywords` (jsonb) — the prefix → product matches map
   - `updated_at` (timestamptz)
   - Public read RLS, no public writes.

2. **Edge Function `generate-search-index`**
   - Fetches all products (`id, title, description, category`).
   - Tokenizes each title + description into words (lowercased, stripped of punctuation, stop-words removed).
   - Builds a prefix map: every 2–4 character prefix → list of matching keywords + product IDs ranked by frequency.
   - Example output:
     ```json
     {
       "ip": ["iphone", "ips", "ipad"],
       "ne": ["netflix", "new"],
       "pe": ["perplexity", "pen"]
     }
     ```
   - Writes the result as a single row in `SearchIndex` (upsert id=1).
   - Uses `EXTERNAL_SUPABASE_SERVICE_ROLE_KEY` (already configured) to bypass RLS.

3. **Schedule via pg_cron** on the external Supabase
   - Cron expression: `0 3 1,16 * *` → runs at 03:00 UTC on the 1st and 16th of every month (≈15-day cadence).
   - Uses `pg_net` to POST to the Edge Function URL.

4. **Frontend integration (Explore page)**
   - New hook `useSearchIndex.ts` — fetches the single `SearchIndex` row once, caches for 1 hour.
   - Update `src/pages/Explore.tsx`: when user types ≥2 chars, look up the prefix in the index and show keyword suggestions as clickable chips above the results list. Clicking a chip fills the search box.
   - Falls back gracefully if the index hasn't been generated yet (current search behavior unchanged).

### Tech details

- The cron SQL runs against your **external Supabase project** (`jqxesguuoxgithnqdtgl`), not the Lovable Cloud DB. I'll provide the exact SQL snippet for you to paste into the SQL Editor (it contains your project URL + anon key, which can't be put into a migration since it's a different Supabase project).
- The Edge Function lives in this Lovable project's `supabase/functions/` and deploys automatically.
- A "Run now" button can be triggered manually for the first index build (one-line curl or just call the function URL once after deploy).

### What I need from you

Nothing right now — once you approve, I implement everything. After deploy, I'll give you:
- The cron SQL to paste once into your external Supabase SQL Editor.
- A one-time URL to hit so the first index is generated immediately (no waiting until the 1st/16th).

