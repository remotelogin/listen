CREATE TABLE IF NOT EXISTS public.analysis_log (
    uuid        TEXT PRIMARY KEY,
    processed   BOOLEAN NOT NULL DEFAULT FALSE,
    convicted   BOOLEAN NOT NULL DEFAULT FALSE,
    reason      TEXT,
    details     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
