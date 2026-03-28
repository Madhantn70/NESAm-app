# Folder Structure

Complete directory structure of the NESAm backend with explanations.

## Table of Contents
- [Root Structure](#root-structure)
- [Source Code Structure](#source-code-structure)
- [Detailed Breakdown](#detailed-breakdown)

## Root Structure

```
nesam-api/nesam/
├── src/                    # Source code
│   ├── main/              # Application code
│   └── test/              # Test code
├── build/                 # Build output (generated)
├── bin/                   # Compiled classes (generated)
├── docs/                  # Database scripts
├── gradle/                # Gradle wrapper files
├── .gradle/               # Gradle cache (generated)
├── build.gradle           # Build configuration
├── settings.gradle        # Gradle settings
├── gradlew                # Gradle wrapper (Unix)
├── gradlew.bat           # Gradle wrapper (Windows)
├── docker-compose.yml    # Docker configuration
└── .env                  # Environment variables
```

## Source Code Structure

```
src/main/
├── java/org/irtt/nesam/   # Java source code
│   ├── app/               # Application layer
│   ├── infrastructure/    # Infrastructure layer
│   ├── modules/           # Business modules
│   └── shared/            # Shared components
└── resources/             # Application resources
    ├── application.yml    # App configuration
    ├── private_key.pem   # JWT private key
    └── test-pub.pem      # JWT public key
```

## Detailed Breakdown

### 📦 Application Layer (`app/`)

```
app/
├── bootstrap/
│   └── NesamApplication.java         # @SpringBootApplication main class
├── config/
│   ├── DatasourceConfig.java        # Database connection configuration
│   └── SwaggerConfig.java           # OpenAPI/Swagger documentation config
└── security/
    └── WebSecurityConfig.java       # Spring Security & JWT configuration
```

**Purpose**: Application-wide configuration and bootstrapping
- **bootstrap/**: Application entry point and initialization
- **config/**: Database, Swagger, and other configurations
- **security/**: Security setup (JWT, OAuth2, CORS)

---

### 🏗️ Infrastructure Layer (`infrastructure/`)

```
infrastructure/
├── persistence/
│   └── BaseEntity.java              # Base JPA entity with common fields
├── sms/
│   └── SmsGateway.java             # Twilio SMS integration
└── external/
    └── ExternalPaymentClient.java   # External payment gateway client
```

**Purpose**: Technical infrastructure and external integrations
- **persistence/**: Base classes for JPA entities (id, timestamps, etc.)
- **sms/**: SMS notification integration (Twilio)
- **external/**: Third-party service integrations

---

### 🎯 Modules Layer (`modules/`)

Each module follows identical structure. Here's the complete breakdown:

```
modules/
├── auth/                    # Authentication & Authorization
│   ├── controller/
│   │   └── AuthController.java
│   └── service/
│       ├── TokenConverter.java
│       ├── TokenAuthenticationConverter.java
│       └── ConsoleOTTHandler.java
│
├── user/                    # User Management
│   ├── controller/
│   │   └── UserController.java
│   ├── service/
│   │   ├── UserService.java
│   │   └── UserProfileService.java
│   ├── repository/
│   │   └── UserRepository.java
│   ├── domain/
│   │   └── model/
│   │       └── UserProfile.java
│   ├── dto/
│   │   ├── request/
│   │   │   └── UserProfileRequestDTO.java
│   │   └── response/
│   │       └── UserProfileResponseDTO.java
│   └── mapper/
│       └── UserMapper.java
│
├── membership/              # Membership Management
│   ├── controller/
│   │   └── MembershipController.java
│   ├── service/
│   │   └── MembershipService.java
│   ├── repository/
│   │   └── MembershipRepository.java
│   ├── domain/
│   │   ├── model/
│   │   │   └── Membership.java
│   │   ├── rules/
│   │   │   ├── AgeEligibilityRule.java
│   │   │   ├── DepositPolicy.java
│   │   │   ├── MembershipValidator.java
│   │   │   └── StatusTransitionRule.java
│   │   ├── events/
│   │   │   └── MemberRegisteredEvent.java
│   │   └── enums/
│   │       ├── MembershipStatus.java
│   │       ├── MembershipCategory.java
│   │       └── GenderType.java
│   ├── dto/
│   │   ├── request/
│   │   │   └── MembershipRequestDTO.java
│   │   └── response/
│   │       └── MembershipResponseDTO.java
│   └── mapper/
│       └── MembershipMapper.java
│
├── nominee/                 # Nominee Management
│   ├── controller/
│   │   └── NomineeController.java
│   ├── service/
│   │   └── NomineeService.java
│   ├── repository/
│   │   └── NomineeRepository.java
│   ├── domain/
│   │   ├── model/
│   │   │   └── Nominee.java
│   │   └── rules/
│   │       └── NomineePercentageRule.java
│   └── mapper/
│       └── NomineeMapper.java
│
├── payment/                 # Payment Processing
│   ├── controller/
│   │   └── PaymentController.java
│   ├── service/
│   │   └── PaymentService.java
│   ├── domain/
│   │   ├── model/
│   │   │   └── TransactionLedger.java
│   │   ├── rules/
│   │   │   └── LedgerPolicy.java
│   │   └── enums/
│   │       ├── TransactionType.java
│   │       ├── TransactionStatus.java
│   │       └── TransactionCategory.java
│   ├── dto/
│   │   └── request/
│   │       └── TransactionDTO.java
│   └── mapper/
│       └── PaymentMapper.java
│
├── settlement/              # Settlement Processing
│   ├── controller/
│   │   └── SettlementController.java
│   ├── service/
│   │   └── SettlementService.java
│   ├── domain/
│   │   └── rules/
│   │       └── SettlementPolicy.java
│   └── mapper/
│       └── SettlementMapper.java
│
├── dfc/                     # DFC Calculations
│   ├── controller/
│   │   └── DfcController.java
│   ├── service/
│   │   └── DfcService.java
│   ├── repository/
│   │   └── DfcRepository.java
│   └── domain/
│       └── rules/
│           ├── DfcRateResolver.java
│           └── DfcCalculator.java
│
└── notification/            # Notification Management
    ├── controller/
    │   └── NotificationController.java
    ├── service/
    │   └── NotificationService.java
    ├── repository/
    │   └── NotificationRepository.java
    └── domain/
        └── model/
            └── NotificationLog.java
```

**Module Structure Explained**:

#### **controller/**
- Contains REST API endpoints
- Annotated with `@RestController`
- Handles HTTP requests and responses
- Delegates business logic to services

#### **service/**
- Contains business logic
- Annotated with `@Service`
- Orchestrates operations
- Calls repositories and mappers

#### **repository/**
- Data access layer
- Extends `JpaRepository`
- Defines database queries
- Handles persistence operations

#### **domain/**
- Core business domain layer
- **model/**: JPA entities (`@Entity`)
- **rules/**: Business rules and validators
- **events/**: Domain events for event-driven architecture
- **enums/**: Type-safe enumerations

#### **dto/**
- Data Transfer Objects
- **request/**: API request payloads
- **response/**: API response formats
- Decouples API from domain models

#### **mapper/**
- Entity-DTO transformation
- Bidirectional mapping
- Uses MapStruct or manual mapping

---

### 🔧 Shared Layer (`shared/`)

```
shared/
├── constants/
│   └── AppConstants.java            # Application-wide constants
├── dto/                             # Shared DTOs (if any)
├── events/
│   └── DomainEvent.java            # Base domain event class
├── exception/
│   └── GlobalExceptionHandler.java  # @ControllerAdvice exception handler
└── utils/
    └── DateUtils.java              # Date utility functions
```

**Purpose**: Cross-cutting concerns and utilities
- **constants/**: Constants used across modules
- **dto/**: DTOs shared by multiple modules
- **events/**: Base classes for domain events
- **exception/**: Global error handling with `@ControllerAdvice`
- **utils/**: Utility functions (date, string, etc.)

---

### 📁 Resources (`src/main/resources/`)

```
resources/
├── application.yml          # Main configuration file
├── private_key.pem         # JWT RSA private key
└── test-pub.pem           # JWT RSA public key
```

**Purpose**: Configuration and static resources
- **application.yml**: Database, server, JWT, Swagger config
- ***.pem files**: RSA keys for JWT token signing

---

### 🧪 Test Structure (`src/test/`)

```
test/java/org/irtt/nesam/
├── NesamApplicationTests.java           # Application context test
├── modules/
│   └── membership/
│       └── service/
│           └── MembershipServiceTest.java
└── web/
    └── ProfileControllerTest.java
```

**Purpose**: Unit and integration tests
- Mirror structure of main source
- Use JUnit and Spring Boot Test

---

### 📄 Configuration Files

#### **build.gradle**
```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '4.0.2'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    // ... more dependencies
}
```

**Purpose**: Build configuration, dependencies, plugins

#### **application.yml**
```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate.ddl-auto: none

jwt:
  private.key: classpath:private_key.pem
  public.key: classpath:test-pub.pem

server:
  port: 9090
```

**Purpose**: Runtime configuration (database, server, JWT)

---

### 📊 Database Scripts (`docs/`)

```
docs/
├── db_scripts_v1.5.sql
└── db_scripts_v1.6_postgres.sql
```

**Purpose**: Database schema and migration scripts

---

## Directory Purpose Summary

| Directory | Purpose | When to Modify |
|-----------|---------|---------------|
| `app/` | Application setup | Adding global config, security rules |
| `infrastructure/` | External integrations | Adding new external services |
| `modules/*/controller/` | REST endpoints | Adding/modifying APIs |
| `modules/*/service/` | Business logic | Changing business rules |
| `modules/*/repository/` | Data access | Adding database queries |
| `modules/*/domain/model/` | Entities | Changing data structure |
| `modules/*/domain/rules/` | Business rules | Adding validation logic |
| `modules/*/domain/events/` | Domain events | Adding event-driven features |
| `modules/*/dto/` | API contracts | Changing API request/response |
| `modules/*/mapper/` | Transformations | Modifying entity-DTO mapping |
| `shared/` | Cross-cutting | Adding utilities, constants |
| `resources/` | Configuration | Changing app settings |
| `docs/` | Database | Schema changes |

## File Naming Conventions

### Controllers
- Pattern: `{Module}Controller.java`
- Examples: `UserController.java`, `MembershipController.java`

### Services
- Pattern: `{Module}Service.java`
- Examples: `UserService.java`, `PaymentService.java`

### Repositories
- Pattern: `{Module}Repository.java`
- Examples: `UserRepository.java`, `MembershipRepository.java`

### Entities
- Pattern: `{EntityName}.java`
- Examples: `UserProfile.java`, `Membership.java`, `Nominee.java`

### DTOs
- Pattern: `{Entity}{Request|Response}DTO.java`
- Examples: `UserProfileRequestDTO.java`, `MembershipResponseDTO.java`

### Mappers
- Pattern: `{Module}Mapper.java`
- Examples: `UserMapper.java`, `PaymentMapper.java`

### Rules
- Pattern: `{Purpose}Rule.java` or `{Purpose}Policy.java`
- Examples: `AgeEligibilityRule.java`, `DepositPolicy.java`

### Enums
- Pattern: `{Name}Type.java` or `{Name}Status.java`
- Examples: `TransactionType.java`, `MembershipStatus.java`

## Package Naming Convention

```
org.irtt.nesam.{layer}.{module}.{sublayer}
```

Examples:
- `org.irtt.nesam.modules.user.controller`
- `org.irtt.nesam.modules.membership.service`
- `org.irtt.nesam.infrastructure.sms`
- `org.irtt.nesam.shared.utils`
