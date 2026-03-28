# Quick Reference Guide

This guide helps you quickly find where to make specific changes in the codebase.

## Table of Contents
- [Common Scenarios](#common-scenarios)
- [File Location Quick Reference](#file-location-quick-reference)
- [Module Responsibility Matrix](#module-responsibility-matrix)

## Common Scenarios

### 🔐 Authentication & Authorization

| I want to... | File(s) to modify | Module |
|--------------|-------------------|--------|
| Change JWT token expiration | `application.yml` | Config |
| Add new authentication method | `modules/auth/service/TokenAuthenticationConverter.java` | Auth |
| Modify login endpoint | `modules/auth/controller/AuthController.java` | Auth |
| Change security rules | `app/security/WebSecurityConfig.java` | App |
| Add new role/permission | `modules/auth/service/*` + Database | Auth |

### 👤 User Management

| I want to... | File(s) to modify | Module |
|--------------|-------------------|--------|
| Add user profile field | `modules/user/domain/model/UserProfile.java` | User |
| Change user validation rules | `modules/user/service/UserProfileService.java` | User |
| Add user endpoint | `modules/user/controller/UserController.java` | User |
| Modify user DTO | `modules/user/dto/request\|response/*.java` | User |
| Add custom user query | `modules/user/repository/UserRepository.java` | User |

### 🎫 Membership Management

| I want to... | File(s) to modify | Module |
|--------------|-------------------|--------|
| Change membership eligibility | `modules/membership/domain/rules/AgeEligibilityRule.java` | Membership |
| Modify deposit requirements | `modules/membership/domain/rules/DepositPolicy.java` | Membership |
| Add membership status | `modules/membership/domain/enums/MembershipStatus.java` | Membership |
| Change status transition rules | `modules/membership/domain/rules/StatusTransitionRule.java` | Membership |
| Add membership category | `modules/membership/domain/enums/MembershipCategory.java` | Membership |
| Modify registration logic | `modules/membership/service/MembershipService.java` | Membership |
| Add registration endpoint | `modules/membership/controller/MembershipController.java` | Membership |

### 👥 Nominee Management

| I want to... | File(s) to modify | Module |
|--------------|-------------------|--------|
| Change nominee percentage rules | `modules/nominee/domain/rules/NomineePercentageRule.java` | Nominee |
| Add nominee field | `modules/nominee/domain/model/Nominee.java` | Nominee |
| Modify nominee validation | `modules/nominee/service/NomineeService.java` | Nominee |
| Add nominee endpoint | `modules/nominee/controller/NomineeController.java` | Nominee |

### 💰 Payment Processing

| I want to... | File(s) to modify | Module |
|--------------|-------------------|--------|
| Add transaction type | `modules/payment/domain/enums/TransactionType.java` | Payment |
| Change transaction status | `modules/payment/domain/enums/TransactionStatus.java` | Payment |
| Modify payment logic | `modules/payment/service/PaymentService.java` | Payment |
| Add ledger validation | `modules/payment/domain/rules/LedgerPolicy.java` | Payment |
| Change payment gateway | `infrastructure/external/ExternalPaymentClient.java` | Infrastructure |
| Add payment endpoint | `modules/payment/controller/PaymentController.java` | Payment |

### 🔔 Notifications

| I want to... | File(s) to modify | Module |
|--------------|-------------------|--------|
| Change SMS provider | `infrastructure/sms/SmsGateway.java` | Infrastructure |
| Add notification channel | `modules/notification/service/NotificationService.java` | Notification |
| Modify notification template | `modules/notification/service/NotificationService.java` | Notification |
| Add notification endpoint | `modules/notification/controller/NotificationController.java` | Notification |

### 🎯 Settlement Processing

| I want to... | File(s) to modify | Module |
|--------------|-------------------|--------|
| Change settlement policy | `modules/settlement/domain/rules/SettlementPolicy.java` | Settlement |
| Modify settlement calculation | `modules/settlement/service/SettlementService.java` | Settlement |
| Add settlement endpoint | `modules/settlement/controller/SettlementController.java` | Settlement |

### 📊 DFC Calculations

| I want to... | File(s) to modify | Module |
|--------------|-------------------|--------|
| Change DFC calculation formula | `modules/dfc/domain/rules/DfcCalculator.java` | DFC |
| Modify rate resolution | `modules/dfc/domain/rules/DfcRateResolver.java` | DFC |
| Add DFC endpoint | `modules/dfc/controller/DfcController.java` | DFC |
| Change DFC service logic | `modules/dfc/service/DfcService.java` | DFC |

### 🗃️ Database Changes

| I want to... | File(s) to modify | Module |
|--------------|-------------------|--------|
| Add new entity | Create in `modules/*/domain/model/*.java` | Relevant Module |
| Add entity field | Modify entity class + database migration | Relevant Module |
| Add custom query | `modules/*/repository/*Repository.java` | Relevant Module |
| Change table name | Entity `@Table` annotation + migration | Relevant Module |
| Add relationship | Entity class with `@OneToMany`, `@ManyToOne` | Relevant Module |

### ⚙️ Configuration

| I want to... | File(s) to modify | Module |
|--------------|-------------------|--------|
| Change database connection | `application.yml` or environment variables | Config |
| Modify server port | `application.yml` (server.port) | Config |
| Add Swagger configuration | `app/config/SwaggerConfig.java` | App |
| Change connection pool | `application.yml` (hikari settings) | Config |
| Add environment variable | `.env` file | Config |

### 🔧 Cross-Cutting Concerns

| I want to... | File(s) to modify | Module |
|--------------|-------------------|--------|
| Add global exception handler | `shared/exception/GlobalExceptionHandler.java` | Shared |
| Add utility function | `shared/utils/*.java` | Shared |
| Add application constant | `shared/constants/AppConstants.java` | Shared |
| Add date utility | `shared/utils/DateUtils.java` | Shared |
| Define domain event | `shared/events/DomainEvent.java` | Shared |

## File Location Quick Reference

### By Layer

#### Application Layer
```
app/
├── bootstrap/NesamApplication.java     # Main application entry point
├── config/
│   ├── DatasourceConfig.java          # Database configuration
│   └── SwaggerConfig.java             # API documentation config
└── security/
    └── WebSecurityConfig.java         # Security & JWT config
```

#### Module Layer (per module)
```
modules/{module-name}/
├── controller/{Module}Controller.java  # REST endpoints
├── service/{Module}Service.java       # Business logic
├── repository/{Module}Repository.java # Data access
├── domain/
│   ├── model/{Entity}.java           # Domain entities
│   ├── rules/{Rule}.java             # Business rules
│   ├── events/{Event}.java           # Domain events
│   └── enums/{Enum}.java             # Enumerations
├── dto/
│   ├── request/{Request}DTO.java     # Request DTOs
│   └── response/{Response}DTO.java   # Response DTOs
└── mapper/{Module}Mapper.java        # Entity-DTO mappers
```

#### Infrastructure Layer
```
infrastructure/
├── persistence/BaseEntity.java         # Base JPA entity
├── sms/SmsGateway.java                # SMS integration (Twilio)
└── external/ExternalPaymentClient.java # Payment gateway
```

#### Shared Layer
```
shared/
├── constants/AppConstants.java         # Application constants
├── dto/                                # Shared DTOs
├── events/DomainEvent.java            # Base event class
├── exception/GlobalExceptionHandler.java # Global error handling
└── utils/DateUtils.java               # Utility functions
```

## Module Responsibility Matrix

| Module | Primary Responsibility | Key Entities | Main Controllers |
|--------|----------------------|--------------|------------------|
| **Auth** | Authentication & Authorization | - | AuthController |
| **User** | User Profile Management | UserProfile | UserController |
| **Membership** | Membership Lifecycle | Membership | MembershipController |
| **Nominee** | Nominee Management | Nominee | NomineeController |
| **Payment** | Payment Processing | TransactionLedger | PaymentController |
| **Settlement** | Settlement Processing | - | SettlementController |
| **DFC** | DFC Calculations | - | DfcController |
| **Notification** | Notification Management | NotificationLog | NotificationController |

## API Endpoint Pattern

All REST endpoints follow this pattern:
```
/api/{module-name}/{resource}
```

Examples:
- `/api/auth/login`
- `/api/users/profile`
- `/api/membership/register`
- `/api/nominees`
- `/api/payments/transactions`

## Common Code Patterns

### Adding a New REST Endpoint
1. Add method to `modules/{module}/controller/{Module}Controller.java`
2. Implement logic in `modules/{module}/service/{Module}Service.java`
3. Create/modify DTOs in `modules/{module}/dto/`
4. Update mapper if needed: `modules/{module}/mapper/{Module}Mapper.java`

### Adding Business Validation
1. Create rule class in `modules/{module}/domain/rules/{Rule}.java`
2. Call rule from service: `modules/{module}/service/{Module}Service.java`

### Adding New Entity Field
1. Update entity: `modules/{module}/domain/model/{Entity}.java`
2. Update DTOs: `modules/{module}/dto/request|response/`
3. Update mapper: `modules/{module}/mapper/{Module}Mapper.java`
4. Create database migration script in `docs/`

### Adding Domain Event
1. Define event: `modules/{module}/domain/events/{Event}.java`
2. Publish from service: `modules/{module}/service/{Module}Service.java`
3. Create listener if needed (new class in module or shared)

## Technology-Specific Locations

### Spring Boot Annotations
- `@RestController` → Controllers
- `@Service` → Service classes
- `@Repository` → Repository interfaces
- `@Entity` → Domain models
- `@Configuration` → Config classes
- `@Component` → Utility/helper classes

### Database/JPA
- Entities → `modules/*/domain/model/*.java`
- Repositories → `modules/*/repository/*Repository.java`
- Base entity → `infrastructure/persistence/BaseEntity.java`
- Scripts → `docs/db_scripts_*.sql`

### Security
- Main config → `app/security/WebSecurityConfig.java`
- Token handling → `modules/auth/service/`
- Keys → `src/main/resources/*.pem`

## Quick Tips

### Finding the Right Module
1. **User-related?** → User module
2. **Registration/renewal?** → Membership module
3. **Beneficiaries?** → Nominee module
4. **Money/transactions?** → Payment module
5. **Withdrawals/disbursements?** → Settlement module
6. **Calculations?** → DFC module
7. **Alerts/messages?** → Notification module
8. **Login/security?** → Auth module

### Finding the Right Layer
1. **API endpoint?** → Controller
2. **Business logic?** → Service
3. **Database query?** → Repository
4. **Validation rule?** → Domain rules
5. **Data structure?** → Entity or DTO
6. **Type definition?** → Enum

### Common File Paths
- Application entry: `app/bootstrap/NesamApplication.java`
- Database config: `app/config/DatasourceConfig.java`
- Security config: `app/security/WebSecurityConfig.java`
- Global errors: `shared/exception/GlobalExceptionHandler.java`
- App properties: `src/main/resources/application.yml`
