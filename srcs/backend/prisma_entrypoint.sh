#!/bin/sh
set -e

echo "Running prisma_entrypoint.sh..."

DB_PASSWORD=$(cat /run/secrets/db_password)
URL="postgresql://postgres_user:${DB_PASSWORD}@db:5432/transcendence"
export DATABASE_URL=$URL
echo "DATABASE_URL=" $URL
echo "DATABASE_URL=\"$URL\"" > /app/.env

# wait for Postgres to be ready
until python3 -c "import socket; s = socket.socket(); s.connect(('db', 5432))" >/dev/null 2>&1; do
	echo "Waiting for Postgres..."
	sleep 1
done

# Run introspection once but do not let failure kill the container
if ! npx prisma db pull; then
	echo "Prisma db pull failed; continuing without blocking container start"
fi

echo "DATABASE_URL loaded securely: ${#URL} chars."

exec "$@"
