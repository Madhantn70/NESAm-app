# NESAm App

Welcome to **NESAm App**! This repository contains a full-stack application built with a **Spring Boot** backend and a **React/TypeScript** frontend.

## 🚀 Prerequisites
Before you start, make sure you have the following installed on your machine:
- **Docker & Docker Compose** (for running the PostgreSQL database)
- **Java (JDK 17 or higher)** (for the Spring Boot backend)
- **Node.js & npm** (for the React frontend)
- **Git** (for version control)

## 🛠 Quick Start (Beginner Friendly)
The easiest way to get the entire application up and running is to use the provided setup scripts. These scripts automate everything for you!

### On Windows (PowerShell)
Open your PowerShell terminal, navigate to the project root, and run:
```powershell
.\setup.ps1
```
*(If you get an execution policy error, you might need to run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` first).*

### On macOS/Linux
Open your terminal, navigate to the project root, make the script executable, and run it:
```bash
chmod +x setup.sh
./setup.sh
```

---

## 🏗 What the Setup Script Does Automatically:
1. Starts the **PostgreSQL** database and **pgAdmin** using Docker Compose.
2. Builds the **Spring Boot** backend (`nesam-api`).
3. Installs all **Frontend** dependencies (`reactjs-starter`) via npm.
4. Starts both the Backend API and the Frontend React development server simultaneously.

## 🌐 Accessing the Application
Once the setup script finishes successfully, the services will be available at:

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API Documentation (Swagger):** [http://localhost:9090/swagger-ui/index.html](http://localhost:9090/swagger-ui/index.html)
- **Database Management (pgAdmin):** [http://localhost:8080](http://localhost:8080)
  - *Email:* `admin@example.com`
  - *Password:* `secretpassword`

## 🔒 Security & Environment Variables
For security reasons, database passwords and private keys are **not** committed to this repository. You should define your local configurations inside a `.env` file located in `nesam-api/nesam`. This file is ignored by Git.

Happy Coding! 🎉
