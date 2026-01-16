#!/bin/bash

# Load env vars
set -a
[ -f apps/api/.env ] && . apps/api/.env
set +a

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

mkdir -p $BACKUP_DIR

echo "📦 Creating database backup..."

# Parse DATABASE_URL for credentials
# Format: postgres://user:pass@host:port/dbname
# This is a naive parser, for production use a robust method or separate env vars
DB_URL=$DATABASE_URL

if [[ $DB_URL == *"localhost"* ]] || [[ $DB_URL == *"127.0.0.1"* ]]; then
    # Local DB
    echo "Detected Local Database"
    pg_dump "$DB_URL" > "$BACKUP_FILE"
else
    # Docker DB (assuming 'postgres' hostname implies docker network, but here we run from host)
    # If using Docker, we typically use 'docker exec'
    
    # Check if docker container is running
    if docker ps | grep -q "examdex-db"; then
        echo "Detected Docker Database"
        docker exec -t examdex-db pg_dump -U examdex examdex > "$BACKUP_FILE"
    else
        # Fallback to direct connection (e.g. if host is mapped)
        echo "Attempting direct connection..."
        pg_dump "$DB_URL" > "$BACKUP_FILE"
    fi
fi

if [ $? -eq 0 ]; then
  echo "✅ Backup created successfully: $BACKUP_FILE"
else
  echo "❌ Backup failed"
  rm "$BACKUP_FILE"
  exit 1
fi
