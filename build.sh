#!/usr/bin/env bash
# exit on error
set -o errexit

# Install backend dependencies
cd server
npm install
npx prisma generate
cd ..

# Install frontend dependencies and build
npm install
npm run build
