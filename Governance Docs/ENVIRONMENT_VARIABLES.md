# ENVIRONMENT VARIABLES: NeSAM

The project relies strictly on the following environment variables mapped through `docker-compose.yml` and `application.yml`. **In accordance with Governance, NO new env variables have been added or invented.**

## 1. Local Docker Setup (`docker-compose.yml`)

These variables govern how the local Postgres database and pgAdmin boot.

| Variable Name | Value Used Locally | Description |
|---|---|---|
| `POSTGRES_DB` | `nesam_db` | The name of the initial database to create upon startup. |
| `POSTGRES_PASSWORD_FILE` | `/run/secrets/db-password` | Binds the Docker Secret representing the Postgres superuser password, preventing plaintext usage down the configuration tree. |
| `PGADMIN_DEFAULT_EMAIL` | `admin@example.com` | Default admin email login for pgAdmin4. |
| `PGADMIN_DEFAULT_PASSWORD` | `secretpassword` | Default admin password for pgAdmin4 UI. |

## 2. Java Application Environment (`application.yml`)

Spring Boot handles connection parameters for its persistence and application metrics.

| Variable Name | Value Used Locally | Description |
|---|---|---|
| `POSTGRES_PASSWORD` | `testpass` (default fallback) | Mapped via `${POSTGRES_PASSWORD:testpass}` to supply the database logic with the runtime password. In production, this must be securely injected via OS environment variables. |

## 3. Local Secrets File

Instead of raw environment variables, the system uses Docker Secrets via a local file to seed database passwords securely.
- **File:** `nesam-api/nesam/docker-test-password.txt`
- **Purpose:** Used universally by the PostgreSQL container (mapped to `POSTGRES_PASSWORD_FILE`) to establish the database superuser upon instantiation.
