🚀 Getting Started with React + Vite

This project is built using ReactJS and Vite. Follow the steps below to set up your development environment and run the application locally.
🛠️ 1. Environment Setup

Before running the project, you must have Node.js and npm installed.
Windows (Using Winget)

Open PowerShell as Administrator:
Bash

winget install OpenJS.NodeJS

macOS (Using Homebrew)
Bash

brew install node

Linux (Ubuntu/Debian)
Bash

sudo apt update
sudo apt install nodejs npm

Verify Installation

Check your versions to ensure they are installed correctly:
Bash

node -v
npm -v

📦 2. Project Installation

Once Node.js is installed, navigate to the project root folder and install the necessary dependencies defined in package.json.
Bash

# Navigate to project directory
cd your-project-name

# Install dependencies (Axios, React-Router, etc.)
npm install

🏃 3. Running the App Locally

Since this project uses Vite, the startup time is nearly instant. Use the following commands to manage the development server:
Command	Action
npm run dev	Start the local development server
npm run build	Build the project for production
npm run preview	Locally preview the production build
Starting the Dev Server
Bash

npm run dev

Once started, the terminal will provide a local URL (usually http://localhost:5173). Open this in your browser to view the app.
📁 4. Project Structure Brief

    src/api/: Axios configuration and interceptors.

    src/services/: API call definitions (User registration, login, etc.).

    src/components/: UI components (Header, Footer, Home).

    App.jsx: Main routing and layout logic.

⚠️ Common Troubleshooting

    Error: node is not recognized
    Restart your terminal or IDE after installing Node.js to refresh the PATH environment variables.

    Error: EACCES permission denied
    On macOS/Linux, you may need to run sudo npm install or fix your npm permissions.