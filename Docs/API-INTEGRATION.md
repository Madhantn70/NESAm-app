# API Integration Architecture

> **Purpose**: Comprehensive guide to how the frontend communicates with the backend, including HTTP client configuration, API service layer, mock system, and error handling.

---

## Overview

The NESAm frontend uses a **three-layer API architecture**:

1. **HTTP Client Layer** - Configured Axios instance with interceptors
2. **API Service Layer** - Domain-specific API functions
3. **Mock Layer** - Development-time fake data

This architecture provides:
- ✅ Centralized configuration (base URL, timeout, headers)
- ✅ Automatic authentication (JWT token injection)
- ✅ Consistent error handling
- ✅ Request/response logging
- ✅ Mock-first development capability

---

## Layer 1: HTTP Client (Axios Instance)

**File**: `src/core/api/axiosInstance.js`

### Base Configuration

**Why Axios Over Fetch**:
- Automatic JSON transformation
- Request/response interceptors (middleware)
- Timeout support (fetch doesn't have native timeout)
- Better error handling (4xx/5xx distinction)
- Request cancellation (AbortController integration)

**Configuration**:
```
Base URL: http://localhost:9090  (Spring Boot backend)
Timeout: 10 seconds              (prevents hanging requests)
Headers: Content-Type: application/json
```

### Request Interceptor

**Purpose**: Modify outgoing requests before they're sent

**What It Does**:

1. **JWT Token Injection**
   - Reads token from `localStorage.getItem('token')`
   - Attaches to `Authorization: Bearer <token>` header
   - Every authenticated endpoint automatically receives credentials
   - Components never manually handle token

2. **Request Logging**
   - Logs HTTP method and URL
   - Logs request payload for debugging
   - Color-coded console output (blue for requests)
   - Helps trace API calls during development

**Flow**:
```
Component calls API function
    ↓
Request interceptor runs
    ↓
Check localStorage for 'token'
    ↓
If found: Add Authorization header
    ↓
Log request details to console
    ↓
Send HTTP request to backend
```

### Response Interceptor

**Purpose**: Process responses and errors consistently

**Success Path**:
- Logs response status and data
- Green console output for successful responses
- Returns response to caller (no modification)

**Error Path**:

**Client Errors (4xx)**:
- Expected errors (bad request, unauthorized, not found)
- Yellow console warning
- Return error to caller for handling
- Examples: 400 Bad Request, 401 Unauthorized, 404 Not Found

**Server Errors (5xx)**:
- Unexpected errors (backend crash, database down)
- Red console error
- Could trigger global error notification
- Examples: 500 Internal Server Error, 503 Service Unavailable

**Network Errors**:
- Request timeout
- No internet connection
- Backend server not running
- Logged as critical errors

**Why This Matters**:
- **Observability**: All HTTP traffic visible in console
- **Debugging**: Easy to trace failed requests
- **Consistency**: Same error handling everywhere
- **User Experience**: Appropriate error messages per scenario

---

## Layer 2: API Service Layer

**Pattern**: One API file per domain

**Structure**:
```
src/
├── core/api/
│   └── authApi.ts           (Authentication endpoints)
├── domains/
    ├── public/
    │   ├── login/mocks/authMock.ts
    │   ├── registration/
    │   │   ├── api/registrationApi.ts
    │   │   └── mocks/registrationMock.ts
    │   └── landing/
    │       ├── api/homeApi.ts
    │       └── mocks/homeMock.ts
    ├── member/
    │   └── home/
    │       ├── api/memberApi.ts
    │       └── mocks/memberMock.ts
    └── admin/
        └── dashboard/
            ├── api/adminApi.ts
            └── mocks/adminMock.ts
```

### API Function Pattern

Every API function follows this structure:

```typescript
export const [domain]Api = {
  [operationName]: async (request?: RequestType): Promise<ResponseType> => {
    // 1. Check mock flag
    if (USE_MOCK) {
      return [domain]Mock.[operationName](request);
    }
    
    // 2. Make real HTTP call
    const response = await api.[method]('/endpoint', request);
    
    // 3. Return data (axios auto-extracts response.data)
    return response.data;
  }
};
```

### Authentication API

**File**: `src/core/api/authApi.ts`

**Endpoints**:

#### 1. Login (Send OTP)
```typescript
login: async (request: { mobileNumber: string }): Promise<{ success: boolean }> => {
  if (USE_MOCK) return authMock.login(request.mobileNumber);
  
  const response = await api.post('/api/v1/users/ott/token', {
    username: request.mobileNumber
  });
  return response.data;
}
```

**Backend Action**: Generates OTP, sends SMS via Twilio

**Success Response**:
```json
{ "success": true }
```

#### 2. Verify OTP (Get JWT)
```typescript
verifyOtp: async (request: { mobileNumber: string; otp: string }): Promise<{ token: string }> => {
  if (USE_MOCK) return authMock.verifyOtp(request.mobileNumber, request.otp);
  
  const response = await api.post('/api/v1/users/ott/login', {
    token: request.otp  // OTP is called "token" in backend
  });
  return response.data;
}
```

**Success Response**:
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Registration API

**File**: `src/domains/public/registration/api/registrationApi.ts`

**Endpoints**:

#### 1. Verify Email (Alumni Check)
```typescript
verifyEmail: async (request: { email: string }): Promise<AlumniData> => {
  if (USE_MOCK) return mockRegistrationApi.verifyEmail(request);
  
  const response = await api.post('/public/registration/verify-email', request);
  return response.data;
}
```

**Purpose**: Check if email exists in IRTTAA alumni database

**Success Response**:
```json
{
  "found": true,
  "name": "John Doe",
  "graduationYear": 2015,
  "department": "Computer Science"
}
```

**Failure Response**:
```json
{
  "found": false,
  "message": "Email not found in alumni database"
}
```

#### 2. Verify OTP
```typescript
verifyOtp: async (request: { email: string; otp: string }): Promise<{ success: boolean }> => {
  if (USE_MOCK) return mockRegistrationApi.verifyOtp(request);
  
  const response = await api.post('/public/registration/verify-otp', request);
  return response.data;
}
```

#### 3. Submit Complete Registration
```typescript
submitDetails: async (request: RegistrationSubmitRequest): Promise<{ success: boolean; nesamId: string }> => {
  if (USE_MOCK) return mockRegistrationApi.submitDetails(request);
  
  const response = await api.post('/public/registration/submit', request);
  return response.data;
}
```

**Request Payload** (Complete registration data):
```json
{
  "email": "john@example.com",
  "mobileNumber": "9876543210",
  "fullName": "John Doe",
  "dateOfBirth": "1990-05-15",
  "address": "123 Main St, City",
  "nominees": [
    {
      "name": "Jane Doe",
      "relationship": "SPOUSE",
      "dateOfBirth": "1992-03-20",
      "percentageShare": 100
    }
  ],
  "membershipType": "PATRON",
  "agreeToTerms": true
}
```

---

### Member API

**File**: `src/domains/member/home/api/memberApi.ts`

**Endpoints**:

#### 1. Get Dashboard Summary
```typescript
getDashboardSummary: async (): Promise<MemberDashboardSummaryResponse> => {
  if (USE_MOCK) return mockMemberApi.getDashboardSummary();
  
  const response = await api.get('/member/dashboard/summary');
  return response.data;
}
```

**Response**:
```json
{
  "profile": {
    "nesamId": "NESAM-2024-00123",
    "fullName": "John Doe",
    "memberSince": "2024-01-15"
  },
  "membership": {
    "status": "ACTIVE",
    "membershipType": "PATRON"
  },
  "dfcBalance": {
    "eventsRemaining": 3,
    "perEventAmount": 400,
    "lastPaymentDate": "2024-03-01"
  },
  "recentTransactions": [...]
}
```

#### 2. Get Active DFC Details
```typescript
getActiveDfcDetails: async (): Promise<MemberActiveDfcResponse> => {
  if (USE_MOCK) return mockMemberApi.getActiveDfcDetails();
  
  const response = await api.get('/member/dfc/active');
  return response.data;
}
```

#### 3. Get Impact Statistics
```typescript
getImpactStats: async (request: { startDate: string; endDate: string }): Promise<ImpactStatsResponse> => {
  if (USE_MOCK) return mockMemberApi.getImpactStats(request);
  
  const response = await api.post('/member/impact/stats', request);
  return response.data;
}
```

---

### Admin API

**File**: `src/domains/admin/dashboard/api/adminApi.ts`

**Endpoints**:

#### 1. Get Admin Dashboard
```typescript
getDashboard: async (): Promise<AdminDashboardResponse> => {
  if (USE_MOCK) return mockAdminApi.getDashboard();
  
  const response = await api.get('/admin/dashboard');
  return response.data;
}
```

**Response**:
```json
{
  "pendingApplications": 5,
  "pendingClaims": 2,
  "totalMembers": 247,
  "totalFunds": 2450000,
  "recentActivity": [...]
}
```

---

## Layer 3: Mock System

### Why Mock-First Development?

**Problem**: Backend development often lags frontend, blocking progress.

**Solution**: Mock data allows frontend development without backend.

### How It Works

**Configuration Flag**: `src/shared/constants/config.ts`
```typescript
export const USE_MOCK = true;  // Toggle real vs. mock APIs
```

**In Development**:
- Set `USE_MOCK = true`
- All API calls return instant mock data
- No backend server needed
- Consistent, predictable data

**In Production**:
- Set `USE_MOCK = false`
- All API calls hit real backend
- Component code doesn't change

### Mock File Structure

**Pattern**: Each API file has a corresponding mock file

**Example**: `src/domains/public/login/mocks/authMock.ts`

```typescript
export const authMock = {
  login: async (mobileNumber: string): Promise<{ success: boolean }> => {
    // Simulate network delay
    await delay(500);
    
    // Validate mobile number format
    if (mobileNumber.length !== 10) {
      throw new Error('Invalid mobile number');
    }
    
    console.log(`[MOCK] OTP sent to ${mobileNumber}: 123456`);
    return { success: true };
  },
  
  verifyOtp: async (mobileNumber: string, otp: string): Promise<{ token: string }> => {
    await delay(500);
    
    // Accept any OTP in mock mode
    if (otp.length !== 6) {
      throw new Error('OTP must be 6 digits');
    }
    
    // Return fake JWT
    return {
      token: 'mock-jwt-token-' + Date.now()
    };
  }
};

// Utility to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
```

### Mock Data Realism

**Important**: Mocks should match real API contracts exactly

**What to Mock**:
- ✅ Success responses (happy path)
- ✅ Error responses (validation failures)
- ✅ Edge cases (empty lists, null values)
- ✅ Network delays (simulate real latency)

**What NOT to Mock**:
- ❌ Business logic (that belongs in backend)
- ❌ Authentication enforcement (frontend can't secure itself)
- ❌ Data persistence (mocks reset on reload)

---

## Error Handling Strategy

### Three-Tier Error Handling

#### 1. API Layer Error Detection

**Axios Response Interceptor** categorizes errors:
```typescript
response.interceptor.error((error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    
    if (status >= 400 && status < 500) {
      // Client error (bad request, unauthorized, not found)
      console.warn('Client Error:', error.response.data);
    } else if (status >= 500) {
      // Server error (internal error, service unavailable)
      console.error('Server Error:', error.response.data);
    }
  } else if (error.request) {
    // Request sent but no response (network error)
    console.error('Network Error:', error.message);
  } else {
    // Something else went wrong
    console.error('Error:', error.message);
  }
  
  return Promise.reject(error);
});
```

#### 2. ViewModel Layer Error Handling

**ViewModels catch and translate errors**:
```typescript
const verifyEmail = async (email: string) => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await registrationApi.verifyEmail({ email });
    setData(result);
  } catch (err) {
    // Translate technical error to user-friendly message
    if (err.response?.status === 404) {
      setError('Email not found in alumni database. Please check and try again.');
    } else if (err.response?.status === 500) {
      setError('System error. Please try again later or contact support.');
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};
```

#### 3. Component Layer Error Display

**Components show errors to users**:
```tsx
{error && (
  <div className="error-alert">
    <Icon name="alert-circle" />
    <span>{error}</span>
  </div>
)}
```

### Error Message Best Practices

**❌ Bad Error Messages**:
- "Error: Network request failed" (too technical)
- "Something went wrong" (not actionable)
- "Error code: ERR_CONNECTION_REFUSED" (confusing)

**✅ Good Error Messages**:
- "Unable to connect. Please check your internet connection."
- "Email not found. Are you an IRTTAA alumnus?"
- "Payment failed. Please try again or contact support@nesam.org"

**Guidelines**:
1. Explain what went wrong
2. Suggest how to fix it
3. Offer alternative action (contact support)
4. Use plain language (no jargon)

---

## Request/Response Patterns

### Request Types

#### GET Requests (Fetch Data)
```typescript
// No request body
const response = await api.get('/member/dashboard/summary');
```

#### POST Requests (Create/Submit Data)
```typescript
// With request body
const response = await api.post('/public/registration/submit', {
  email: 'john@example.com',
  mobileNumber: '9876543210',
  // ... more data
});
```

#### PUT Requests (Update Data)
```typescript
// Update entire resource
const response = await api.put('/member/profile', updatedProfile);
```

#### PATCH Requests (Partial Update)
```typescript
// Update specific fields
const response = await api.patch('/member/profile', {
  address: 'New Address'  // Only update address
});
```

#### DELETE Requests (Remove Data)
```typescript
// Usually with ID in URL
const response = await api.delete(`/member/nominees/${nomineeId}`);
```

### Response Patterns

#### Success Response Structure
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

#### Error Response Structure
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Mobile number already registered",
    "field": "mobileNumber"
  }
}
```

#### Pagination Response
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalItems": 97
  }
}
```

---

## Performance Optimizations

### Request Deduplication

**Problem**: Multiple components fetch same data simultaneously

**Solution**: Cache or use a state management library

```typescript
// Simple in-memory cache
const cache = new Map();

export const memberApi = {
  getDashboardSummary: async () => {
    const cacheKey = 'dashboard-summary';
    
    // Check cache first
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    // Fetch from API
    const response = await api.get('/member/dashboard/summary');
    
    // Cache for 5 minutes
    cache.set(cacheKey, response.data);
    setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);
    
    return response.data;
  }
};
```

### Request Cancellation

**Use Case**: User types in search box, cancel previous requests

```typescript
import axios from 'axios';

let cancelToken;

const searchMembers = async (query: string) => {
  // Cancel previous request
  if (cancelToken) {
    cancelToken.cancel('New search initiated');
  }
  
  // Create new cancel token
  cancelToken = axios.CancelToken.source();
  
  try {
    const response = await api.get('/admin/members/search', {
      params: { query },
      cancelToken: cancelToken.token
    });
    return response.data;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log('Request cancelled:', err.message);
    } else {
      throw err;
    }
  }
};
```

### Retry Logic

**Use Case**: Retry failed requests (network glitches)

```typescript
const fetchWithRetry = async (url: string, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (err) {
      if (i === maxRetries - 1) throw err;  // Last attempt failed
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};
```

---

## Security Considerations

### Token Storage

**Current Approach**: `localStorage`

**Pros**:
- Survives page reloads
- Simple to implement
- Works across tabs

**Cons**:
- Vulnerable to XSS attacks
- Not accessible from service workers

**Future Enhancement**: Use `httpOnly` cookies
- More secure (JavaScript can't access)
- Requires backend cooperation

### CORS Configuration

**Requirement**: Backend must allow frontend origin

**Backend Configuration** (Spring Boot):
```java
@CrossOrigin(origins = "http://localhost:5173")
```

**Why**: Browser blocks cross-origin requests by default

### Input Validation

**Always Validate Client-Side AND Server-Side**

**Client-Side** (User Experience):
- Instant feedback
- Prevent invalid submissions
- Reduce server load

**Server-Side** (Security):
- Client validation can be bypassed
- Authoritative validation
- Protect against malicious requests

---

## API Testing Strategies

### Manual Testing

**Tools**:
- Browser DevTools Network tab
- Console logs from interceptors

### API Client Testing

**Tools**:
- Postman / Insomnia
- curl commands
- Backend Swagger UI

### Automated Testing

**Unit Tests** (Mock API calls):
```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useLoginViewModel } from './useLoginViewModel';
import * as authApi from './authApi';

jest.mock('./authApi');

test('logs in successfully', async () => {
  // Mock API response
  authApi.verifyOtp.mockResolvedValue({ token: 'fake-token' });
  
  const { result } = renderHook(() => useLoginViewModel());
  
  await act(async () => {
    await result.current.verifyOtp('123456');
  });
  
  expect(localStorage.getItem('token')).toBe('fake-token');
});
```

---

## Transition from Mock to Real APIs

### Checklist

1. ✅ Verify API contracts match (request/response structure)
2. ✅ Test all endpoints with Postman/curl
3. ✅ Update `USE_MOCK = false`
4. ✅ Test authentication flow end-to-end
5. ✅ Handle real error responses
6. ✅ Test network error scenarios
7. ✅ Verify CORS configuration
8. ✅ Check backend is running on expected port

### Common Issues

**Issue**: CORS error in browser
**Solution**: Add frontend origin to backend CORS config

**Issue**: 401 Unauthorized on protected endpoints
**Solution**: Verify JWT token is being attached and is valid

**Issue**: Timeout errors
**Solution**: Increase axios timeout or optimize backend

**Issue**: Different response structure than expected
**Solution**: Update TypeScript interfaces or backend

---

## Key Takeaways

### ✅ Strengths

1. **Centralized Configuration**: One axios instance, consistent everywhere
2. **Automatic Authentication**: Components don't manually handle tokens
3. **Mock System**: Frontend development independent of backend
4. **Type Safety**: TypeScript interfaces prevent API misuse
5. **Error Handling**: Three-tier strategy from HTTP to UI

### ⚠️ Future Enhancements

1. **Request Caching**: Reduce redundant API calls
2. **Optimistic Updates**: Update UI before server confirms
3. **WebSocket Support**: Real-time updates for admin dashboard
4. **API Versioning**: Support multiple backend API versions
5. **Offline Mode**: Queue requests when offline, sync when online

---

## Related Documentation
- [Authentication Flow](./AUTHENTICATION-FLOW.md)
- [State Management](./STATE-MANAGEMENT.md)
- [Backend API Reference](./BACKEND-API.md)
- [Error Handling Guide](./ERROR-HANDLING.md)
