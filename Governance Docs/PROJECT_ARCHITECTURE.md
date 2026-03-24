# PROJECT ARCHITECTURE: NeSAM

## SYSTEM ARCHITECTURE
The NeSAM platform utilizes a traditional client-server architecture.
- **Client App (Frontend):** React 19 Single Page Application (SPA). Handles user interactions, application forms, and dashboard views.
- **Backend API:** Spring Boot 4.0 API Backend (Java 21). Acts as the authoritative rule engine processing user creation, security (OTT), and DFC logic.
- **Database Layer:** PostgreSQL 16 (running via Docker). Serves as the immutable source of truth and enforces strict invariants (e.g., nominee percentages, membership rules).
- **External Services:** Twilio SDK for delivering SMS/OTP notifications.

## MODULE STRUCTURE
- `/Governance Docs/`: The irrefutable source of truth. Contains domain definitions (Domain Canon) and business invariants.
- `/Docs/`: Contains business and legacy SQL schema documents.
- `/nesam-api/nesam/`: Contains the backend Java Spring Boot project, utilizing Gradle for builds.
- `/reactjs-starter/reactjs-starter/`: Contains the frontend Vite + React application.

## API LAYERS & DATA FLOW
1. **Request:** A user interaction triggers an API call from the React frontend using Axios.
2. **Security & Routing:** Spring Security intercepts the request using `OneTimeTokenService` (OTT) for magic link flow. Upon successful authentication, a JWT is issued.
3. **Controller (`ProfileController`):** Receives the REST request.
4. **Service (`MembershipService`, `UserProfileService`):** Orchestrates business logic according to Governance Invariants.
5. **Data Access (`Spring Data JPA`):** Maps entities and queries the database.
6. **Database:** PostgreSQL executes the query and guarantees data constraints before responding.

## DEPENDENCY GRAPH
- **Frontend:** React 19 -> React Hook Form, React Router Dom, TailwindCSS -> Vite -> Node.js
- **Backend:** Spring Boot (Web, Security, JPA) -> PostgreSQL Driver, Twilio SDK -> Java 21
- **Infrastructure:** Docker -> PostgreSQL 16, pgAdmin4

## BUILD PROCESS
### How Backend Starts
- The backend relies on Gradle. `.\gradlew clean build` compiles and tests the code.
- `.\gradlew bootRun` starts the embedded Tomcat server on port `9090`.
- Configuration is loaded from `src/main/resources/application.yml` which connects to the local PostgreSQL instance.

### How Frontend Starts
- The frontend relies on npm standard scripts. `npm install` handles dependency resolution.
- `npm run dev` starts the Vite dev server on port `5173`.
- Axios interfaces with the backend.

### How APIs are Wired & DB connects
- The frontend Axios instances should point to `http://localhost:9090/api/v1/*`.
- The backend uses HikariCP as a connection pool managed by Spring Data JPA to connect to PostgreSQL `jdbc:postgresql://localhost:5432/example`.

### How Environment Variables Work
- The system heavily relies on Docker Compose variables and local text file secrets (`docker-test-password.txt`) for the database setup.
- `application.yml` maps JVM properties implicitly to override `POSTGRES_PASSWORD` falling back to default tests.
