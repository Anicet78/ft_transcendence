#!/bin/sh
set -e

echo "Running prisma_entrypoint.sh..."

DB_PASSWORD=$(cat /run/secrets/db_password)
export DATABASE_URL="postgresql://postgres_user:${DB_PASSWORD}@db:5432/transcendence"
echo "DATABASE_URL=" $DATABASE_URL

# wait for Postgres to be ready
until nc -z db 5432; do
	echo "Waiting for Postgres..."
	sleep 1
done

# Run introspection once but do not let failure kill the container
if ! npx prisma db pull; then
	echo "Prisma db pull failed; continuing without blocking container start"
fi

echo "DATABASE_URL loaded securely: ${#DATABASE_URL} chars."

exec "$@"


# #!/bin/sh
# set -e

# echo "Running prisma_entrypoint.sh..."

# # Load DB password
# DB_PASSWORD="$(cat /run/secrets/db_password)"

# export DATABASE_URL="postgresql://postgres_user:${DB_PASSWORD}@db:5432/transcendence"
# echo "DATABASE_URL=" $DATABASE_URL

# npx prisma db pull

# # Start the real command
# echo "Starting application: $@"
# exec "$@"