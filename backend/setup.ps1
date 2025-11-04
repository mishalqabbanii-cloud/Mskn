# PowerShell setup script for Windows

Write-Host "🚀 Setting up MSKN Cloud Backend..." -ForegroundColor Cyan

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Start PostgreSQL
Write-Host "🐘 Starting PostgreSQL with Docker..." -ForegroundColor Yellow
docker-compose up -d

# Wait for PostgreSQL to be ready
Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Generate migrations
Write-Host "📝 Generating database migrations..." -ForegroundColor Yellow
npm run db:generate

# Run migrations
Write-Host "🔄 Running database migrations..." -ForegroundColor Yellow
npm run db:migrate

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
npm run db:seed

Write-Host "✅ Setup complete! Starting development server..." -ForegroundColor Green
Write-Host ""
Write-Host "📡 Backend will be available at http://localhost:5000" -ForegroundColor Cyan
Write-Host "🔐 Test credentials:" -ForegroundColor Cyan
Write-Host "   Manager: manager@mskn.com / password123"
Write-Host "   Tenant: tenant@mskn.com / password123"
Write-Host "   Owner: owner@mskn.com / password123"
Write-Host ""

# Start dev server
npm run dev

