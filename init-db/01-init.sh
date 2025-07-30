#!/bin/bash
set -e

# Tạo database nếu chưa tồn tại
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Tạo extension UUID nếu cần
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Tạo schema nếu cần
    CREATE SCHEMA IF NOT EXISTS public;
    
    -- Grant permissions
    GRANT ALL PRIVILEGES ON DATABASE ecom_db TO ecom_user;
    GRANT ALL ON SCHEMA public TO ecom_user;
EOSQL

echo "Database initialized successfully!"
