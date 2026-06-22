#!/bin/sh
set -e

echo "Waiting for database..."
for i in $(seq 1 30); do
  if npx prisma migrate deploy 2>&1 > /dev/null; then
    echo "Database ready!"
    break
  fi
  echo "Attempt $i: database not ready, retrying..."
  sleep 2
done

echo "Starting application..."
exec "$@"
