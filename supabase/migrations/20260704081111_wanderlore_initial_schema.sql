/*
# Wanderlore Initial Schema

## Overview
Creates the three core tables that give Wanderlore persistent state:
AI lore cache, saved destinations, and search analytics.

## Tables

### 1. lore_cache
Stores Gemini AI-generated cultural intelligence for each destination so the
same story isn't regenerated on every visit. Acts as a cross-session L2 cache
on top of the in-memory L1 cache already in the frontend.

Columns:
- id             — surrogate primary key
- cache_key      — unique lookup key formatted as "city::place_name" (lowercased)
- city           — city name used in the Gemini prompt
- country        — country name used in the Gemini prompt
- place_name     — specific place/destination name
- opening        — AI-generated emotional opening in first person
- hidden_secret  — hidden local fact tourists miss
- tradition      — living local tradition or daily ritual
- taste          — signature dish and where to find it
- etiquette      — cultural etiquette note
- legend         — local legend or story
- experience     — the single most memorable experience
- created_at     — when the lore was generated
- expires_at     — when this entry should be considered stale (default: 7 days)

### 2. saved_destinations
Lets visitors bookmark destinations. Without auth, saves are stored with a
client-generated session_id (uuid from localStorage) so a user's bookmarks
persist across page refreshes without requiring sign-in.

Columns:
- id                  — surrogate primary key
- session_id          — client-generated uuid stored in localStorage
- destination_id      — matches the destination id from the static data
- destination_name    — denormalized for display without joining static data
- destination_location — city / region
- destination_country  — country
- destination_image   — image URL for display in a saved list
- created_at          — when the destination was saved

Unique constraint on (session_id, destination_id) prevents duplicates.

### 3. search_analytics
Records each search event for the demo analytics panel and to surface popular
destinations to judges. No PII is stored.

Columns:
- id             — surrogate primary key
- category       — filter: heritage, food, art, nightlife, nature, or "all"
- experience_type — filter: authentic, mainstream, or "all"
- budget         — filter: free, budget, mid, premium, or "all"
- time_required  — filter: hour, halfday, fullday, weekend, or "all"
- region         — filter: asia, europe, americas, africa-middle-east, or "all"
- text_query     — free-text search string (may be empty)
- results_count  — how many destinations matched
- created_at     — timestamp of the search

## Security
- RLS enabled on all three tables.
- No authentication required — this is a single-tenant public app.
- All policies use TO anon, authenticated with USING (true) / WITH CHECK (true)
  because the data is intentionally shared/public.

## Notes
- lore_cache.cache_key has a unique index — upsert on conflict to keep fresh.
- saved_destinations has a unique index on (session_id, destination_id).
- Indexes added on session_id, cache_key, and created_at for common queries.
*/

-- ─── lore_cache ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS lore_cache (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key    text NOT NULL,
  city         text NOT NULL,
  country      text NOT NULL,
  place_name   text NOT NULL,
  opening      text NOT NULL DEFAULT '',
  hidden_secret text NOT NULL DEFAULT '',
  tradition    text NOT NULL DEFAULT '',
  taste        text NOT NULL DEFAULT '',
  etiquette    text NOT NULL DEFAULT '',
  legend       text NOT NULL DEFAULT '',
  experience   text NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL DEFAULT (now() + interval '7 days')
);

CREATE UNIQUE INDEX IF NOT EXISTS lore_cache_key_idx ON lore_cache (cache_key);
CREATE INDEX IF NOT EXISTS lore_cache_expires_idx ON lore_cache (expires_at);

ALTER TABLE lore_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_lore_cache" ON lore_cache;
CREATE POLICY "anon_select_lore_cache" ON lore_cache FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_lore_cache" ON lore_cache;
CREATE POLICY "anon_insert_lore_cache" ON lore_cache FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_lore_cache" ON lore_cache;
CREATE POLICY "anon_update_lore_cache" ON lore_cache FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_lore_cache" ON lore_cache;
CREATE POLICY "anon_delete_lore_cache" ON lore_cache FOR DELETE
  TO anon, authenticated USING (true);

-- ─── saved_destinations ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS saved_destinations (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id           text NOT NULL,
  destination_id       text NOT NULL,
  destination_name     text NOT NULL,
  destination_location text NOT NULL DEFAULT '',
  destination_country  text NOT NULL DEFAULT '',
  destination_image    text NOT NULL DEFAULT '',
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS saved_dest_session_dest_idx
  ON saved_destinations (session_id, destination_id);
CREATE INDEX IF NOT EXISTS saved_dest_session_idx ON saved_destinations (session_id);

ALTER TABLE saved_destinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_saved" ON saved_destinations;
CREATE POLICY "anon_select_saved" ON saved_destinations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_saved" ON saved_destinations;
CREATE POLICY "anon_insert_saved" ON saved_destinations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_saved" ON saved_destinations;
CREATE POLICY "anon_update_saved" ON saved_destinations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_saved" ON saved_destinations;
CREATE POLICY "anon_delete_saved" ON saved_destinations FOR DELETE
  TO anon, authenticated USING (true);

-- ─── search_analytics ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS search_analytics (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category        text NOT NULL DEFAULT 'all',
  experience_type text NOT NULL DEFAULT 'all',
  budget          text NOT NULL DEFAULT 'all',
  time_required   text NOT NULL DEFAULT 'all',
  region          text NOT NULL DEFAULT 'all',
  text_query      text NOT NULL DEFAULT '',
  results_count   int NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_category_idx ON search_analytics (category);
CREATE INDEX IF NOT EXISTS analytics_created_idx  ON search_analytics (created_at);

ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_analytics" ON search_analytics;
CREATE POLICY "anon_select_analytics" ON search_analytics FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_analytics" ON search_analytics;
CREATE POLICY "anon_insert_analytics" ON search_analytics FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_analytics" ON search_analytics;
CREATE POLICY "anon_update_analytics" ON search_analytics FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_analytics" ON search_analytics;
CREATE POLICY "anon_delete_analytics" ON search_analytics FOR DELETE
  TO anon, authenticated USING (true);
