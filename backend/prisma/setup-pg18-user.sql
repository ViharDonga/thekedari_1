-- STEP A: Run this first in pgAdmin Query Tool (connected as postgres, port 5433)
-- If you already see "User vihar created" — skip this step.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'vihar') THEN
    CREATE USER vihar WITH PASSWORD 'vihar2203' LOGIN;
    RAISE NOTICE 'User vihar created';
  ELSE
    ALTER USER vihar WITH PASSWORD 'vihar2203';
    RAISE NOTICE 'Password reset for vihar';
  END IF;
END
$$;
