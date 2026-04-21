-- ══════════════════════════════════════════════════════════════════════════════
-- GCC Assignment Cover Page Generator — Supabase Schema
-- Paste this entire file into: Supabase Dashboard → SQL Editor → Run
-- ══════════════════════════════════════════════════════════════════════════════

-- Extension for UUID generation (usually pre-enabled on Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ── 1. TABLES ─────────────────────────────────────────────────────────────────

-- Teachers
CREATE TABLE IF NOT EXISTS public.teachers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  designation TEXT        NOT NULL,
  department  TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subjects (each subject is taught by one teacher)
CREATE TABLE IF NOT EXISTS public.subjects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  code        TEXT        NOT NULL,
  teacher_id  UUID        NOT NULL REFERENCES public.teachers(id) ON DELETE RESTRICT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assignments (linked to a subject; teacher is derived via subject → teacher)
CREATE TABLE IF NOT EXISTS public.assignments (
  id              UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT  NOT NULL,
  subject_id      UUID  NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
  submission_date DATE  NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Students (custom auth — no Supabase Auth used)
CREATE TABLE IF NOT EXISTS public.students (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  roll        TEXT        NOT NULL,
  reg_no      TEXT        NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admins (login via a secret reg_no — update the value below before going live)
CREATE TABLE IF NOT EXISTS public.admins (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  reg_no      TEXT        NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ⚠️  IMPORTANT: Change 'ADMIN-GCC-SECRET-2024' to your own secret value
--     before running this script. This is the reg_no the admin uses to log in.
INSERT INTO public.admins (reg_no)
VALUES ('ADMIN-GCC-SECRET-2024')
ON CONFLICT (reg_no) DO NOTHING;


-- ── 2. ROW LEVEL SECURITY ─────────────────────────────────────────────────────

ALTER TABLE public.teachers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins      ENABLE ROW LEVEL SECURITY;


-- ── teachers ──────────────────────────────────────────────────────────────────
-- Students (anon) can read. Only service_role (server-side) can write.

CREATE POLICY "teachers_select_public"
  ON public.teachers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "teachers_all_service"
  ON public.teachers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ── subjects ──────────────────────────────────────────────────────────────────

CREATE POLICY "subjects_select_public"
  ON public.subjects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "subjects_all_service"
  ON public.subjects FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ── assignments ───────────────────────────────────────────────────────────────

CREATE POLICY "assignments_select_public"
  ON public.assignments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "assignments_all_service"
  ON public.assignments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ── students ──────────────────────────────────────────────────────────────────
-- Never exposed via anon key. All access is server-side (service_role only).

CREATE POLICY "students_all_service"
  ON public.students FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ── admins ────────────────────────────────────────────────────────────────────

CREATE POLICY "admins_all_service"
  ON public.admins FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ── 3. USEFUL INDEXES ────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_subjects_teacher   ON public.subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_subject ON public.assignments(subject_id);
CREATE INDEX IF NOT EXISTS idx_students_reg_no    ON public.students(reg_no);
CREATE INDEX IF NOT EXISTS idx_admins_reg_no      ON public.admins(reg_no);


-- ══════════════════════════════════════════════════════════════════════════════
-- Done. Verify in Supabase: Table Editor → each table should show 0 or 1 rows.
-- ══════════════════════════════════════════════════════════════════════════════
