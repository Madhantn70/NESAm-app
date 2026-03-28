# NESAm Backend Architecture Documentation

Welcome to the comprehensive architecture documentation for the NESAm backend API. This documentation is designed to help developers quickly understand the system architecture and locate where to make specific changes.

## 📚 Documentation Index

### Getting Started
- **[Architecture Overview](ARCHITECTURE_OVERVIEW.md)** - High-level system architecture, tech stack, and design patterns
- **[Quick Reference Guide](QUICK_REFERENCE.md)** ⭐ - Fast lookup: "Where do I change X?"
- **[Folder Structure](FOLDER_STRUCTURE.md)** - Complete directory organization and purpose

### Deep Dive
- **[Module Guide](MODULE_GUIDE.md)** - Detailed breakdown of all 8 business modules
- **[API Endpoints](API_ENDPOINTS.md)** - Complete REST API reference
- **[Database Schema](DATABASE_SCHEMA.md)** - Entity relationships and table structures

### Development
- **[Development Guide](DEVELOPMENT_GUIDE.md)** - How to add new features, modules, and endpoints

## 🎯 Quick Navigation

### I want to...

| Task | Go To |
|------|-------|
| Understand overall architecture | [Architecture Overview](ARCHITECTURE_OVERVIEW.md) |
| Find where to modify specific functionality | [Quick Reference](QUICK_REFERENCE.md) |
| Learn about a specific module | [Module Guide](MODULE_GUIDE.md) |
| See all API endpoints | [API Endpoints](API_ENDPOINTS.md) |
| Understand database structure | [Database Schema](DATABASE_SCHEMA.md) |
| Add a new feature or module | [Development Guide](DEVELOPMENT_GUIDE.md) |
| Understand folder organization | [Folder Structure](FOLDER_STRUCTURE.md) |

## 🏗️ System Overview

**NESAm** is a Spring Boot-based backend API for membership and financial management system built with:

- **Framework**: Spring Boot 4.0.2
- **Language**: Java 21
- **Database**: PostgreSQL
- **Architecture**: Modular Domain-Driven Design (DDD) with layered architecture
- **Build Tool**: Gradle
- **API Docs**: SpringDoc OpenAPI (Swagger)

### Core Business Modules

1. **Authentication** - OAuth2/JWT authentication and authorization
2. **User Management** - User profiles and account management
3. **Membership** - Membership lifecycle and registration
4. **Nominee** - Nominee management for members
5. **Payment** - Payment processing and transaction ledger
6. **Settlement** - Settlement processing and management
7. **DFC** - DFC rate calculations and management
8. **Notification** - Notification service and logging

## 🎨 Architecture Highlights

- **Modular Design**: Each business domain is isolated in its own module
- **Layered Architecture**: Clear separation of controllers, services, repositories, and domain logic
- **Domain-Driven Design**: Rich domain models with business rules and validation
- **RESTful APIs**: Clean REST endpoints with OpenAPI documentation
- **Security**: Spring Security with OAuth2 and JWT tokens

## 📖 How to Use This Documentation

1. **New to the project?** Start with [Architecture Overview](ARCHITECTURE_OVERVIEW.md)
2. **Need to make a change?** Check [Quick Reference](QUICK_REFERENCE.md) first
3. **Understanding a module?** See [Module Guide](MODULE_GUIDE.md)
4. **Adding new features?** Follow [Development Guide](DEVELOPMENT_GUIDE.md)

## 🔄 Documentation Maintenance

This documentation should be updated when:
- New modules are added
- Architecture patterns change
- New major features are introduced
- API endpoints are significantly modified

---

*Last Updated: March 2026*
