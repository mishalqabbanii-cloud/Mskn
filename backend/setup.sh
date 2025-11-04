#!/bin/bash

echo "🚀 Setting up MSKN Cloud Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start PostgreSQL
echo "🐘 Starting PostgreSQL with Docker..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Generate migrations
echo "📝 Generating database migrations..."
npm run db:generate

# Run migrations
echo "🔄 Running database migrations..."
npm run db:migrate

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Setup complete! Starting development server..."
echo ""
echo "📡 Backend will be available at http://localhost:5000"
echo "🔐 Test credentials:"
echo "   Manager: manager@mskn.com / password123"
echo "   Tenant: tenant@mskn.com / password123"
echo "   Owner: owner@mskn.com / password123"
echo ""

# Start dev server
npm run dev

