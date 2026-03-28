# API Endpoints

Complete reference of all REST API endpoints in the NESAm backend.

## Table of Contents
- [Base URL](#base-url)
- [Authentication Endpoints](#authentication-endpoints)
- [User Endpoints](#user-endpoints)
- [Membership Endpoints](#membership-endpoints)
- [Nominee Endpoints](#nominee-endpoints)
- [Payment Endpoints](#payment-endpoints)
- [Settlement Endpoints](#settlement-endpoints)
- [DFC Endpoints](#dfc-endpoints)
- [Notification Endpoints](#notification-endpoints)

## Base URL

**Development**: `http://localhost:9090`

**API Base Path**: `/api`

**Swagger UI**: `http://localhost:9090/swagger-ui.html`

**OpenAPI Spec**: `http://localhost:9090/v3/api-docs`

## Common Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Authentication Endpoints

**Controller**: `AuthController.java`  
**Base Path**: `/api/auth`

### Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate user and receive JWT token
- **Authentication**: None (public endpoint)
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt.token.here",
    "user": {
      "id": "uuid",
      "username": "string",
      "roles": ["ROLE_USER"]
    }
  }
  ```

### Token Validation
- **Endpoint**: `GET /api/auth/validate`
- **Description**: Validate JWT token
- **Authentication**: Required (JWT)
- **Response**:
  ```json
  {
    "valid": true,
    "username": "string"
  }
  ```

---

## User Endpoints

**Controller**: `UserController.java`  
**Base Path**: `/api/users`

### Get Current User Profile
- **Endpoint**: `GET /api/users/profile`
- **Description**: Get authenticated user's profile
- **Authentication**: Required (JWT)
- **Response**: UserProfileResponseDTO

### Update User Profile
- **Endpoint**: `PUT /api/users/profile`
- **Description**: Update user profile information
- **Authentication**: Required (JWT)
- **Request Body**: UserProfileRequestDTO
- **Response**: UserProfileResponseDTO

### Get User by ID
- **Endpoint**: `GET /api/users/{id}`
- **Description**: Get user profile by user ID
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `id`: User UUID
- **Response**: UserProfileResponseDTO

---

## Membership Endpoints

**Controller**: `MembershipController.java`  
**Base Path**: `/api/membership`

### Register New Member
- **Endpoint**: `POST /api/membership/register`
- **Description**: Register a new membership
- **Authentication**: Required (JWT)
- **Request Body**: MembershipRequestDTO
  ```json
  {
    "userId": "uuid",
    "category": "REGULAR",
    "depositAmount": 1000.00,
    "dateOfBirth": "1990-01-15",
    "gender": "MALE"
  }
  ```
- **Response**: MembershipResponseDTO

### Get Membership Details
- **Endpoint**: `GET /api/membership/{id}`
- **Description**: Get membership by ID
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `id`: Membership ID
- **Response**: MembershipResponseDTO

### Update Membership Status
- **Endpoint**: `PUT /api/membership/{id}/status`
- **Description**: Update membership status
- **Authentication**: Required (JWT, ADMIN)
- **Path Parameters**:
  - `id`: Membership ID
- **Request Body**:
  ```json
  {
    "status": "ACTIVE"
  }
  ```
- **Response**: MembershipResponseDTO

### Renew Membership
- **Endpoint**: `POST /api/membership/{id}/renew`
- **Description**: Renew an existing membership
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `id`: Membership ID
- **Response**: MembershipResponseDTO

### Get User's Memberships
- **Endpoint**: `GET /api/membership/user/{userId}`
- **Description**: Get all memberships for a user
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `userId`: User UUID
- **Response**: List<MembershipResponseDTO>

---

## Nominee Endpoints

**Controller**: `NomineeController.java`  
**Base Path**: `/api/nominees`

### Add Nominee
- **Endpoint**: `POST /api/nominees`
- **Description**: Add a nominee for a member
- **Authentication**: Required (JWT)
- **Request Body**:
  ```json
  {
    "membershipId": "uuid",
    "name": "John Doe",
    "relationship": "SPOUSE",
    "percentage": 100.0,
    "dateOfBirth": "1985-05-20"
  }
  ```
- **Response**: NomineeResponseDTO

### Get Nominees for Membership
- **Endpoint**: `GET /api/nominees/membership/{membershipId}`
- **Description**: Get all nominees for a membership
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `membershipId`: Membership ID
- **Response**: List<NomineeResponseDTO>

### Update Nominee
- **Endpoint**: `PUT /api/nominees/{id}`
- **Description**: Update nominee information
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `id`: Nominee ID
- **Request Body**: NomineeRequestDTO
- **Response**: NomineeResponseDTO

### Delete Nominee
- **Endpoint**: `DELETE /api/nominees/{id}`
- **Description**: Remove a nominee
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `id`: Nominee ID
- **Response**: 204 No Content

---

## Payment Endpoints

**Controller**: `PaymentController.java`  
**Base Path**: `/api/payments`

### Create Transaction
- **Endpoint**: `POST /api/payments/transactions`
- **Description**: Create a new payment transaction
- **Authentication**: Required (JWT)
- **Request Body**: TransactionDTO
  ```json
  {
    "userId": "uuid",
    "membershipId": "uuid",
    "amount": 5000.00,
    "type": "DEPOSIT",
    "category": "MEMBERSHIP_FEE",
    "description": "Monthly deposit"
  }
  ```
- **Response**: TransactionDTO

### Get Transaction by ID
- **Endpoint**: `GET /api/payments/transactions/{id}`
- **Description**: Get transaction details
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `id`: Transaction ID
- **Response**: TransactionDTO

### Get User Transactions
- **Endpoint**: `GET /api/payments/users/{userId}/transactions`
- **Description**: Get all transactions for a user
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `userId`: User UUID
- **Query Parameters**:
  - `page`: Page number (default: 0)
  - `size`: Page size (default: 20)
  - `type`: Filter by transaction type
  - `status`: Filter by transaction status
- **Response**: Page<TransactionDTO>

### Get Ledger Balance
- **Endpoint**: `GET /api/payments/ledger/{userId}/balance`
- **Description**: Get user's ledger balance
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `userId`: User UUID
- **Response**:
  ```json
  {
    "balance": 15000.00,
    "currency": "INR"
  }
  ```

---

## Settlement Endpoints

**Controller**: `SettlementController.java`  
**Base Path**: `/api/settlement`

### Request Settlement
- **Endpoint**: `POST /api/settlement/request`
- **Description**: Request a settlement
- **Authentication**: Required (JWT)
- **Request Body**:
  ```json
  {
    "membershipId": "uuid",
    "reason": "WITHDRAWAL"
  }
  ```
- **Response**: SettlementResponseDTO

### Get Settlement Details
- **Endpoint**: `GET /api/settlement/{id}`
- **Description**: Get settlement by ID
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `id`: Settlement ID
- **Response**: SettlementResponseDTO

### Process Settlement
- **Endpoint**: `POST /api/settlement/{id}/process`
- **Description**: Process a settlement request
- **Authentication**: Required (JWT, ADMIN)
- **Path Parameters**:
  - `id`: Settlement ID
- **Response**: SettlementResponseDTO

---

## DFC Endpoints

**Controller**: `DfcController.java`  
**Base Path**: `/api/dfc`

### Get DFC Rates
- **Endpoint**: `GET /api/dfc/rates`
- **Description**: Get current DFC rates
- **Authentication**: Required (JWT)
- **Response**: List<DfcRateDTO>

### Calculate DFC
- **Endpoint**: `POST /api/dfc/calculate`
- **Description**: Calculate DFC for a membership
- **Authentication**: Required (JWT)
- **Request Body**:
  ```json
  {
    "membershipId": "uuid",
    "amount": 10000.00,
    "period": 12
  }
  ```
- **Response**:
  ```json
  {
    "amount": 10000.00,
    "rate": 8.5,
    "calculatedValue": 10850.00
  }
  ```

### Get DFC for Membership
- **Endpoint**: `GET /api/dfc/membership/{membershipId}`
- **Description**: Get DFC details for a membership
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `membershipId`: Membership ID
- **Response**: DfcDetailsDTO

---

## Notification Endpoints

**Controller**: `NotificationController.java`  
**Base Path**: `/api/notifications`

### Send Notification
- **Endpoint**: `POST /api/notifications/send`
- **Description**: Send a notification
- **Authentication**: Required (JWT, ADMIN)
- **Request Body**:
  ```json
  {
    "userId": "uuid",
    "type": "SMS",
    "message": "Your membership has been approved",
    "phoneNumber": "+911234567890"
  }
  ```
- **Response**: NotificationResponseDTO

### Get User Notifications
- **Endpoint**: `GET /api/notifications/user/{userId}`
- **Description**: Get notification history for a user
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `userId`: User UUID
- **Query Parameters**:
  - `page`: Page number (default: 0)
  - `size`: Page size (default: 20)
- **Response**: Page<NotificationResponseDTO>

### Get Notification by ID
- **Endpoint**: `GET /api/notifications/{id}`
- **Description**: Get notification details
- **Authentication**: Required (JWT)
- **Path Parameters**:
  - `id`: Notification ID
- **Response**: NotificationResponseDTO

---

## Request/Response Examples

### Common Request Headers
```
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

### Error Response Format
```json
{
  "timestamp": "2026-03-28T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/membership/register",
  "errors": [
    {
      "field": "depositAmount",
      "message": "Deposit amount must be greater than 0"
    }
  ]
}
```

## Authentication Flow

1. **Login**: `POST /api/auth/login` → Receive JWT token
2. **Use Token**: Include in `Authorization: Bearer {token}` header
3. **Access Protected Endpoints**: All `/api/*` endpoints (except login)

## Pagination

Endpoints returning lists support pagination:
- **Query Parameters**:
  - `page`: Zero-based page number
  - `size`: Number of items per page
  - `sort`: Sort field and direction (e.g., `createdAt,desc`)

**Paginated Response Format**:
```json
{
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalPages": 5,
  "totalElements": 100,
  "last": false,
  "first": true
}
```

## Testing with Swagger

1. Navigate to `http://localhost:9090/swagger-ui.html`
2. Click "Authorize" button
3. Enter JWT token in format: `Bearer {your_token}`
4. Test endpoints interactively
