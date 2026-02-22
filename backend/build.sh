#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files (Required for Admin and Whitenoise)
python manage.py collectstatic --no-input

# Run migrations to set up the DB
python manage.py migrate