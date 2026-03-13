#!/usr/bin/env bash
set -e

# Create and activate virtual environment for any Python tooling
python3 -m venv .venv
source .venv/bin/activate

# Install Node dependencies
npm install

echo "Setup complete. Run: npm run dev"
