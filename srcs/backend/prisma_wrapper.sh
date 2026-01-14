#!/bin/sh
# prisma_wrapper.sh
if [ -f /run/secrets/database_url ]; then
  export DATABASE_URL="$(cat /run/secrets/database_url)"
fi

echo "Running: npx prisma $*"
exec npx prisma "$@"
