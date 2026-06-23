-- Run in pgAdmin Query Tool while connected as POSTGRES on port 5433
-- Execute each block separately (one at a time)

-- 1) Reset vihar password to match backend/.env
ALTER USER vihar WITH PASSWORD 'vihar2203';

-- 2) Ensure database exists (run in psql OR pgAdmin GUI if this errors in Query Tool)
-- CREATE DATABASE thekedari OWNER vihar;

-- 3) Grant access
GRANT ALL PRIVILEGES ON DATABASE thekedari TO vihar;
