# Development Guide

Guide for developers working on the NESAm backend.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding New Features](#adding-new-features)
- [Code Patterns and Standards](#code-patterns-and-standards)
- [Testing](#testing)
- [Common Tasks](#common-tasks)

## Getting Started

### Prerequisites
- **Java**: JDK 21
- **Build Tool**: Gradle (wrapper included)
- **Database**: PostgreSQL 12+
- **IDE**: IntelliJ IDEA or Eclipse with Lombok plugin
- **Tools**: Git, Docker (optional)

### Initial Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd nesam-api/nesam
   ```

2. **Configure Environment**
   Create `.env` file:
   ```env
   DB_URL=jdbc:postgresql://localhost:5432/nesam_db
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   ```

3. **Setup Database**
   ```bash
   createdb nesam_db
   psql -d nesam_db -f docs/db_scripts_v1.6_postgres.sql
   ```

4. **Build Project**
   ```bash
   ./gradlew build
   ```

5. **Run Application**
   ```bash
   ./gradlew bootRun
   ```

6. **Access Swagger UI**
   Navigate to: `http://localhost:9090/swagger-ui.html`

### IDE Setup

#### IntelliJ IDEA
1. Install Lombok plugin
2. Enable annotation processing:
   - Settings → Build, Execution, Deployment → Compiler → Annotation Processors
   - Check "Enable annotation processing"
3. Import as Gradle project

#### Eclipse
1. Install Lombok: Download `lombok.jar` and install
2. Install Gradle plugin (Buildship)
3. Import as existing Gradle project

---

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

### Typical Workflow
1. Create feature branch from `develop`
2. Implement feature following module pattern
3. Write unit and integration tests
4. Run tests: `./gradlew test`
5. Build: `./gradlew build`
6. Create pull request to `develop`
7. Code review
8. Merge after approval

---

## Adding New Features

### Adding a New Module

**Example**: Creating a "Loan" module

#### Step 1: Create Module Structure
```
modules/loan/
├── controller/
│   └── LoanController.java
├── service/
│   └── LoanService.java
├── repository/
│   └── LoanRepository.java
├── domain/
│   ├── model/
│   │   └── Loan.java
│   ├── rules/
│   │   └── LoanEligibilityRule.java
│   ├── events/
│   │   └── LoanApprovedEvent.java
│   └── enums/
│       └── LoanStatus.java
├── dto/
│   ├── request/
│   │   └── LoanRequestDTO.java
│   └── response/
│       └── LoanResponseDTO.java
└── mapper/
    └── LoanMapper.java
```

#### Step 2: Create Entity
```java
package org.irtt.nesam.modules.loan.domain.model;

@Entity
@Table(name = "loan")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Loan extends BaseEntity {
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserProfile user;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    private LoanStatus status;
    
    private LocalDate applicationDate;
    private LocalDate approvalDate;
}
```

#### Step 3: Create Repository
```java
package org.irtt.nesam.modules.loan.repository;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserId(Long userId);
    List<Loan> findByStatus(LoanStatus status);
}
```

#### Step 4: Create DTOs
```java
// Request DTO
package org.irtt.nesam.modules.loan.dto.request;

@Data
@Builder
public class LoanRequestDTO {
    private Long userId;
    private BigDecimal amount;
    private Integer termMonths;
}

// Response DTO
package org.irtt.nesam.modules.loan.dto.response;

@Data
@Builder
public class LoanResponseDTO {
    private Long id;
    private Long userId;
    private BigDecimal amount;
    private String status;
    private LocalDate applicationDate;
}
```

#### Step 5: Create Mapper
```java
package org.irtt.nesam.modules.loan.mapper;

@Component
public class LoanMapper {
    
    public Loan toEntity(LoanRequestDTO dto, UserProfile user) {
        return Loan.builder()
            .user(user)
            .amount(dto.getAmount())
            .status(LoanStatus.PENDING)
            .applicationDate(LocalDate.now())
            .build();
    }
    
    public LoanResponseDTO toDTO(Loan entity) {
        return LoanResponseDTO.builder()
            .id(entity.getId())
            .userId(entity.getUser().getId())
            .amount(entity.getAmount())
            .status(entity.getStatus().name())
            .applicationDate(entity.getApplicationDate())
            .build();
    }
}
```

#### Step 6: Create Service
```java
package org.irtt.nesam.modules.loan.service;

@Service
@Transactional
public class LoanService {
    
    @Autowired
    private LoanRepository loanRepository;
    
    @Autowired
    private LoanMapper loanMapper;
    
    @Autowired
    private UserRepository userRepository;
    
    public LoanResponseDTO applyForLoan(LoanRequestDTO request) {
        // Validate user
        UserProfile user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Apply business rules
        // LoanEligibilityRule.validate(user, request.getAmount());
        
        // Create loan
        Loan loan = loanMapper.toEntity(request, user);
        Loan savedLoan = loanRepository.save(loan);
        
        // Publish event (optional)
        // eventPublisher.publishEvent(new LoanAppliedEvent(savedLoan));
        
        return loanMapper.toDTO(savedLoan);
    }
    
    public List<LoanResponseDTO> getUserLoans(Long userId) {
        return loanRepository.findByUserId(userId).stream()
            .map(loanMapper::toDTO)
            .collect(Collectors.toList());
    }
}
```

#### Step 7: Create Controller
```java
package org.irtt.nesam.modules.loan.controller;

@RestController
@RequestMapping("/api/loans")
public class LoanController {
    
    @Autowired
    private LoanService loanService;
    
    @PostMapping("/apply")
    public ResponseEntity<LoanResponseDTO> applyForLoan(
            @RequestBody @Valid LoanRequestDTO request) {
        LoanResponseDTO response = loanService.applyForLoan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanResponseDTO>> getUserLoans(
            @PathVariable Long userId) {
        List<LoanResponseDTO> loans = loanService.getUserLoans(userId);
        return ResponseEntity.ok(loans);
    }
}
```

#### Step 8: Create Database Migration
```sql
-- docs/db_scripts_v1.7_add_loan.sql
CREATE TABLE loan (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES user_profile(id),
    amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    application_date DATE NOT NULL,
    approval_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loan_user ON loan(user_id);
CREATE INDEX idx_loan_status ON loan(status);
```

---

### Adding an API Endpoint to Existing Module

**Example**: Add "Get Active Memberships" endpoint

#### Step 1: Add Repository Method
```java
// modules/membership/repository/MembershipRepository.java
List<Membership> findByStatusAndUserId(MembershipStatus status, Long userId);
```

#### Step 2: Add Service Method
```java
// modules/membership/service/MembershipService.java
public List<MembershipResponseDTO> getActiveMemberships(Long userId) {
    List<Membership> active = membershipRepository.findByStatusAndUserId(
        MembershipStatus.ACTIVE, userId
    );
    return active.stream()
        .map(membershipMapper::toDTO)
        .collect(Collectors.toList());
}
```

#### Step 3: Add Controller Endpoint
```java
// modules/membership/controller/MembershipController.java
@GetMapping("/user/{userId}/active")
public ResponseEntity<List<MembershipResponseDTO>> getActiveMemberships(
        @PathVariable Long userId) {
    List<MembershipResponseDTO> memberships = 
        membershipService.getActiveMemberships(userId);
    return ResponseEntity.ok(memberships);
}
```

---

### Adding Business Rules

**Example**: Add minimum deposit rule

#### Step 1: Create Rule Class
```java
package org.irtt.nesam.modules.membership.domain.rules;

@Component
public class MinimumDepositRule {
    
    private static final BigDecimal MINIMUM_DEPOSIT = new BigDecimal("1000.00");
    
    public void validate(BigDecimal depositAmount) {
        if (depositAmount.compareTo(MINIMUM_DEPOSIT) < 0) {
            throw new BusinessRuleException(
                "Deposit amount must be at least " + MINIMUM_DEPOSIT
            );
        }
    }
}
```

#### Step 2: Use in Service
```java
@Autowired
private MinimumDepositRule minimumDepositRule;

public MembershipResponseDTO register(MembershipRequestDTO request) {
    // Validate deposit
    minimumDepositRule.validate(request.getDepositAmount());
    
    // Continue with registration...
}
```

---

### Adding Domain Events

#### Step 1: Create Event Class
```java
package org.irtt.nesam.modules.membership.domain.events;

public class MembershipApprovedEvent extends DomainEvent {
    private final Long membershipId;
    private final Long userId;
    
    public MembershipApprovedEvent(Object source, Long membershipId, Long userId) {
        super(source);
        this.membershipId = membershipId;
        this.userId = userId;
    }
    
    // Getters
}
```

#### Step 2: Publish Event
```java
@Autowired
private ApplicationEventPublisher eventPublisher;

public void approveMembership(Long id) {
    Membership membership = findById(id);
    membership.setStatus(MembershipStatus.ACTIVE);
    membershipRepository.save(membership);
    
    // Publish event
    eventPublisher.publishEvent(
        new MembershipApprovedEvent(this, id, membership.getUser().getId())
    );
}
```

#### Step 3: Create Event Listener
```java
@Component
public class MembershipEventListener {
    
    @Autowired
    private NotificationService notificationService;
    
    @EventListener
    public void handleMembershipApproved(MembershipApprovedEvent event) {
        // Send notification
        notificationService.sendApprovalNotification(event.getUserId());
    }
}
```

---

## Code Patterns and Standards

### Naming Conventions
- **Classes**: PascalCase (e.g., `MembershipService`)
- **Methods**: camelCase (e.g., `getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_LOGIN_ATTEMPTS`)
- **Packages**: lowercase (e.g., `org.irtt.nesam.modules.user`)

### Annotations
```java
@RestController           // For controllers
@Service                  // For services
@Repository               // For repositories
@Component                // For utilities
@Entity                   // For JPA entities
@Builder                  // Lombok builder pattern
@Data                     // Lombok getters/setters
@Transactional           // For transactional methods
@Valid                    // For DTO validation
```

### Exception Handling
```java
// Custom exceptions
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message);
    }
}

// Global handler already exists in:
// shared/exception/GlobalExceptionHandler.java
```

### Validation
```java
@Data
public class RequestDTO {
    @NotNull(message = "Username is required")
    @Size(min = 3, max = 50)
    private String username;
    
    @Email(message = "Invalid email format")
    private String email;
    
    @Min(value = 0, message = "Amount must be positive")
    private BigDecimal amount;
}
```

---

## Testing

### Unit Testing
```java
@ExtendWith(MockitoExtension.class)
class MembershipServiceTest {
    
    @Mock
    private MembershipRepository repository;
    
    @Mock
    private MembershipMapper mapper;
    
    @InjectMocks
    private MembershipService service;
    
    @Test
    void testGetMembershipById_Success() {
        // Arrange
        Long id = 1L;
        Membership membership = new Membership();
        when(repository.findById(id)).thenReturn(Optional.of(membership));
        
        // Act
        MembershipResponseDTO result = service.getById(id);
        
        // Assert
        assertNotNull(result);
        verify(repository).findById(id);
    }
}
```

### Integration Testing
```java
@SpringBootTest
@AutoConfigureMockMvc
class MembershipControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testRegisterMembership() throws Exception {
        String requestJson = "{ \"userId\": 1, \"category\": \"REGULAR\" }";
        
        mockMvc.perform(post("/api/membership/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());
    }
}
```

### Running Tests
```bash
# Run all tests
./gradlew test

# Run specific test class
./gradlew test --tests MembershipServiceTest

# Run with coverage
./gradlew test jacocoTestReport
```

---

## Common Tasks

### Adding a New Dependency
1. Add to `build.gradle`:
   ```gradle
   dependencies {
       implementation 'group:artifact:version'
   }
   ```
2. Refresh Gradle: `./gradlew build --refresh-dependencies`

### Changing Database Schema
1. Create migration script in `docs/`
2. Test on development database
3. Update entity classes
4. Update DTOs if needed
5. Update mappers

### Adding Configuration Property
1. Add to `application.yml`:
   ```yaml
   app:
     feature:
       max-attempts: 3
   ```
2. Create configuration class:
   ```java
   @Configuration
   @ConfigurationProperties(prefix = "app.feature")
   @Data
   public class FeatureConfig {
       private int maxAttempts;
   }
   ```

### Debugging
- Set breakpoints in IDE
- Run in debug mode
- Check logs: `./gradlew bootRun --debug`
- Use Swagger UI for API testing

---

## Best Practices

1. **Follow the Module Pattern**: Every new feature should fit into the modular structure
2. **Write Tests**: Unit tests for business logic, integration tests for endpoints
3. **Use DTOs**: Never expose entities directly in APIs
4. **Validate Input**: Use Bean Validation annotations
5. **Handle Errors**: Use appropriate exception types
6. **Document APIs**: Swagger annotations for API documentation
7. **Follow Naming Conventions**: Consistent naming across project
8. **Code Reviews**: All changes should be reviewed
9. **Keep Services Thin**: Move complex logic to domain layer
10. **Use Transactions**: Annotate service methods with @Transactional
