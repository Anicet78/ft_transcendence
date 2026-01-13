#!/bin/sh

# echo "Running db_entrypoint.sh..."
# ls -l /run/secrets
DB_PASSWORD=$(cat /run/secrets/db_password)
# echo "Password loaded: ${#DB_PASSWORD} chars"

export DATABASE_URL="postgresql://postgres_user:${DB_PASSWORD}@db:5432/transcendence"

echo $DATABASE_URL

exec npx prisma db pull

echo "DATABASE_URL loaded securely"

exec "$@"


# # Load DATABASE_URL from secret file
# if [ -f /run/secrets/database_url ]; then
#   export DATABASE_URL="$(cat /run/secrets/database_url)"
# fi

# echo "DATABASE_URL loaded: ${#DATABASE_URL} chars"

# exec "$@"



  # url = env("postgresql://postgres_user:hellopss@db:5432/transcendence")
