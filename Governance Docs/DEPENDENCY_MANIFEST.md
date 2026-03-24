# DEPENDENCY MANIFEST: NeSAM

This is a consolidated manifest of all primary dependencies required for the project.

## Language Runtimes & Infrastructure
- **Java:** JDK 21 (Backend language runtime)
- **Node.js:** v18.x or v20.x (Frontend build and runtime environment)
- **Database:** PostgreSQL 16 (Deployed via Docker)
- **Docker Admin:** dpage/pgadmin4:latest
- **Build Tool:** Gradle (Backend wrapper version embedded)

## Backend Dependencies (Spring Boot 4.0.2)
*Managed via `nesam-api/nesam/build.gradle`*
- `org.springframework.boot:spring-boot-starter-data-jpa` (ORM & Database Layer)
- `org.springframework.boot:spring-boot-starter-webmvc` (REST APIs)
- `org.springframework.boot:spring-boot-starter-security` (Authentication)
- `org.springframework.boot:spring-boot-starter-oauth2-resource-server` (OAuth2 / Token Security)
- `org.springdoc:springdoc-openapi-starter-webmvc-ui` (v2.8.9) (Swagger / OpenAPI Documentation)
- `com.twilio.sdk:twilio` (v11.3.3) (External SMS SDK)
- `org.postgresql:postgresql` (PostgreSQL JDBC Driver)
- `org.projectlombok:lombok` (Code generation utility)
- `org.springframework.boot:spring-boot-starter-data-jpa-test`, `spring-boot-starter-security-test`, `spring-boot-starter-webmvc-test` (Testing frameworks)

## Frontend Dependencies (React 19)
*Managed via `reactjs-starter/reactjs-starter/package.json`*
- `react`, `react-dom` (v19.2.0) (Core UI Library)
- `vite` (v7.2.4) (Build tool and Dev Server)
- `react-router-dom` (v7.13.0) (Client-side routing)
- `axios` (v1.13.4) (HTTP Client for API communication)
- `react-hook-form` (v7.71.1) (Form state management and validation)
- `@hookform/resolvers` (v5.2.2) (Schema validation connectivity)
- `zod` (v4.3.6) (TypeScript-first schema validation logic)
- `tailwindcss` (v4.1.18), `autoprefixer` (v10.4.24), `postcss` (v8.5.6) (Styling System)
- `eslint` (v9.39.1) (Code linting)
