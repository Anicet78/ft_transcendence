#!/bin/sh
set -e

echo "Running prisma_entrypoint.sh..."

DB_PASSWORD=$(cat /run/secrets/db_password)
URL="postgresql://${POSTGRES_USER}:${DB_PASSWORD}@postgres:5432/${POSTGRES_DB}"
export DATABASE_URL=$URL
echo "DATABASE_URL=\"$URL\"" > /app/.env

GOOGLE_SECRET=$(cat /run/secrets/google_secret)
export GOOGLE_SECRET=$GOOGLE_SECRET
echo "GOOGLE_SECRET=\"$GOOGLE_SECRET\"" >> /app/.env

SECRET_42=$(cat /run/secrets/secret_42)
export SECRET_42=$SECRET_42
echo "SECRET_42=\"$SECRET_42\"" >> /app/.env


# wait for Postgres to be ready
until python3 -c "import socket; s = socket.socket(); s.connect(('postgres', 5432))" >/dev/null 2>&1; do
	echo "Waiting for Postgres..."
	sleep 1
done

# Run introspection once but do not let failure kill the container
if ! npx prisma db pull; then
	echo "Prisma db pull failed; continuing without blocking container start"
fi

if ! npx prisma db seed; then
	echo "Prisma db seed failed; continuing without blocking container start"
fi

echo "DATABASE_URL loaded securely: ${#URL} chars."

exec "$@"
