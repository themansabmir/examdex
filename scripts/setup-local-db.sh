#!/bin/bash

# Configuration matches .env.example
DB_USER="examdex"
DB_PASS="examdex_dev_password"
DB_NAME="examdex"

# Detect current user for psql connection (assuming they have admin rights on local postgres)
CURRENT_USER=$(whoami)

echo "🚀 Setting up local PostgreSQL database..."
echo "Target: User='$DB_USER', DB='$DB_NAME'"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql command not found. Please install PostgreSQL."
    exit 1
fi

# Create User with CREATEDB privilege (required for Prisma shadow database)
echo "creating user..."
psql -d postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS' CREATEDB;" 2>/dev/null || echo "⚠️  User '$DB_USER' might already exist"

# Grant CREATEDB to existing user if it already exists
psql -d postgres -c "ALTER USER $DB_USER CREATEDB;" 2>/dev/null

# Create Database
echo "creating database..."
psql -d postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || echo "⚠️  Database '$DB_NAME' might already exist"

# Grant privileges (just in case)
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null

echo "✅ Local database configured!"
echo "You can now run 'pnpm dev' (the .env file is already configured for this setup)."
