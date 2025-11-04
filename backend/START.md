# Quick Start Guide

## One Command Setup

### Windows (PowerShell):
```powershell
cd backend
.\setup.ps1
```

### Linux/Mac:
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

### Or use npm:
```bash
cd backend
npm run setup
```

## What This Does

1. ✅ Installs all npm dependencies
2. ✅ Starts PostgreSQL in Docker
3. ✅ Generates database schema migrations
4. ✅ Runs migrations to create tables
5. ✅ Seeds database with test data
6. ✅ Starts the development server

## Test Credentials

After setup, you can login with:
- **Manager**: `manager@mskn.com` / `password123`
- **Tenant**: `tenant@mskn.com` / `password123`
- **Owner**: `owner@mskn.com` / `password123`

## Manual Steps (if needed)

If the one-command setup doesn't work:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

3. **Create .env file:**
   ```bash
   # Copy .env.example to .env or create manually
   ```

4. **Generate and run migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Seed database:**
   ```bash
   npm run db:seed
   ```

6. **Start server:**
   ```bash
   npm run dev
   ```

## Troubleshooting

### Docker not running
- Make sure Docker Desktop is installed and running
- Check with: `docker ps`

### Port 5432 already in use
- Stop existing PostgreSQL instance
- Or change port in `docker-compose.yml`

### Migration errors
- Make sure PostgreSQL container is running: `docker ps`
- Check logs: `docker-compose logs postgres`

### Connection refused
- Wait a few seconds after starting Docker
- PostgreSQL needs time to initialize

