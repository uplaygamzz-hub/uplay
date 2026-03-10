#!/bin/bash

# Install Python 3.12
uv python install 3.12
uv python pin 3.12

# Create and use virtual environment
uv venv .venv
source .venv/bin/activate

# Install dependencies
uv pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput