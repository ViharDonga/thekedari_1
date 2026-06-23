-- STEP B: Create database — use ONE of these methods (not Query Tool batch)

-- METHOD 1 (EASIEST): pgAdmin GUI
--   Right-click "Databases" -> Create -> Database
--   Name: thekedari
--   Owner: vihar
--   Click Save

-- METHOD 2: Command Prompt (run this single line):
--   "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -p 5433 -c "CREATE DATABASE thekedari OWNER vihar;"

-- METHOD 3: pgAdmin Query Tool — open a NEW tab, paste ONLY the line below, then Execute:
CREATE DATABASE thekedari OWNER vihar;
