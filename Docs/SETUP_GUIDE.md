# SETUP GUIDE: NeSAM Starter

This guide outlines exactly how a new developer can bootstrap the NeSAM project locally on a fresh machine.

## Prerequisites
Before starting, ensure that you have installed the following tools:
1. **Java 21 Engine** (Verify with `java -version`)
2. **Node.js (v18.x or v20.x minimum)** (Verify with `node -v` and `npm -v`)
3. **Docker Desktop / Engine** (Required for PostgreSQL)
4. **PowerShell** (For Windows developers) or standard terminal.

## Step-by-Step Manual Setup

### 1. Database Initialization
Local development uses a containerized PostgreSQL 16 database.
1. Make sure Docker is running.
2. Navigate to `nesam-api/nesam`.
3. Start the database stack:
   ```bash
   docker-compose up -d
   ```
4. This will start:
   - `postgres:16` database on port `5432`.
   - `pgadmin4` interface on port `8080` (Email: `admin@example.com`, Pass: `secretpassword`).

### 2. Backend Initialization
1. Navigate to the backend directory:
   ```bash
   cd nesam-api/nesam
   ```
2. Build the project and run tests:
   ```bash
   ./gradlew clean build
   ```
3. Start the Spring Boot server:
   ```bash
   ./gradlew bootRun
   ```
   *The backend will be available at http://localhost:9090.*

### 3. Frontend Initialization
1. Navigate to the frontend directory:
   ```bash
   cd reactjs-starter/reactjs-starter
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at http://localhost:5173.*

## One Command Setup
For a fully automated setup process on Windows, run the generated script `setup.ps1` from the root of the repository:
```powershell
.\setup.ps1
```
This script will:
- Check for system prerequisites.
- Spin up the database via Docker Compose.
- Wait for the database to become healthy.
- Build and test the Spring Boot backend.
- Install NodeJS dependencies and build the frontend.
- Provide a clear success message.
