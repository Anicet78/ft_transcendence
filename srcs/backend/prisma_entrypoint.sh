#!/bin/sh

echo "Running prisma_entrypoint.sh..."
DB_PASSWORD=$(cat /run/secrets/db_password)

export DATABASE_URL="postgresql://postgres_user:${DB_PASSWORD}@db:5432/transcendence"
echo "DATABASE_URL=" $DATABASE_URL

exec npx prisma db pull

echo "DATABASE_URL loaded securely: ${#DATABASE_URL} chars."

exec "$@"
