#!/bin/sh
set -e

# Start Celery worker
# celery -A server.extensions.celery worker --loglevel=info &

# Start Flask application with Gunicorn
gunicorn --bind 0.0.0.0:5000 --timeout 400 --workers 4 --threads 2 server.wsgi:application