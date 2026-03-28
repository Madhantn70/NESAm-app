# NESAm Frontend Architecture Documentation

> **Purpose**: This document explains the architectural decisions, organizational patterns, and design principles behind the NESAm frontend application.

---

## Technology Stack Rationale

### Core Technologies

**React 19** - Chosen for:
- Latest features including improved concurrent rendering
- Strong ecosystem and community support
- Component-based architecture enabling reusability
- Excellent TypeScript integration

**TypeScript** - Provides:
- Type safety reducing runtime errors
- Better IDE support with autocomplete and refactoring
- Self-documenting code through type definitions
- Easier collaboration in team environments

**Vite** - Selected over Create React App because:
- Dramatically faster development server startup (instant in most cases)
- Hot Module Replacement (HMR) that actually works reliably
- Optimized production builds using Rollup
- Native ES modules support

**Tailwind CSS** - Utility-first approach offers:
- Rapid UI development without leaving HTML/JSX
- Consistent design system through standardized utilities
- Smaller bundle sizes (only used classes are included)
- No CSS naming conflicts or specificity wars

**React Router v7** - Handles:
- Declarative routing matching React's component model
- Nested routes with layout inheritance
- Programmatic navigation
- Protected route mechanisms

**React Hook Form + Zod** - Form handling strategy:
- Minimal re-renders (better performance than controlled components)
- Built-in validation with schema-based approach
- Type-safe form data through Zod inference
- Great developer experience with minimal boilerplate

---

## Architectural Philosophy

### 1. Domain-Driven Design (Feature-First Organization)

**The Problem with Traditional Structures:**
Most React applications organize code by technical concerns:
```
src/
├── components/      # All components mixed together
├── services/        # All API calls in one place
├── hooks/           # All hooks together
└── utils/           # Everything else
```

**Why This Fails at Scale:**
- Related code is scattered across folders
- Difficult to understand feature boundaries
- Hard to find what you need as the app grows
- Coupling between unrelated features
- Difficult to assign ownership to teams

**Our Solution: Domain-Based Organization**

The application is divided into **business domains** that mirror how users think about the system:

- **`public/`** - Everything an unauthenticated visitor can access (landing page, login, registration)
- **`member/`** - Features for authenticated members (dashboard, contributions, impact tracking)
- **`admin/`** - Administrative functions (member management, financial oversight)

**Within each domain**, related code lives together:
- **`pages/`** - The route-level components users navigate to
- **`components/`** - UI pieces specific to this domain
- **`api/`** - Functions that call backend endpoints for this domain
- **`viewModels/`** - Business logic and state management for this domain
- **`models/`** - TypeScript interfaces and types
- **`mocks/`** - Fake data for development

**Benefits:**
- **Discoverability**: Need to change the registration flow? Everything is in `domains/public/registration/`
- **Isolation**: Changes to member features don't accidentally break admin features
- **Team Ownership**: Different teams can own different domains
- **Cognitive Load**: Developers only need to understand one domain at a time
- **Code Splitting**: Easy to lazy-load entire domains

---

### 2. The ViewModel Pattern (Instead of Redux)

**Why Not Redux?**
Redux adds significant complexity:
- Three files minimum per feature (actions, reducers, selectors)
- Boilerplate ceremony for every state change
- Global store creates invisible dependencies
- Time-traveling debugging rarely used in practice
- Over-engineering for most application needs

**The ViewModel Approach:**

Each feature has a custom React hook (the "ViewModel") that encapsulates:
- Local state for that feature
- Business logic
- API calls
- Derived state and computations
- Event handlers

**How It Works:**
The ViewModel hook is imported by page/component and provides everything needed:
- Current state values
- Functions to change state
- Loading/error states
- Async operations

**Example: Multi-Step Registration**
The registration process has 8 steps. The ViewModel manages:
- Which step the user is currently on
- Form data accumulated across all steps
- Navigation between steps (next, previous, jump to)
- API calls to validate email, verify OTP, submit final data
- Loading states during async operations
- Error handling and validation

**Why This Works:**
- **Co-location**: Logic lives next to the components that use it
- **Simplicity**: Just React hooks, no new concepts to learn
- **Type Safety**: Full TypeScript support without Redux's type gymnastics
- **Testability**: Pure functions easy to test in isolation
- **Performance**: Only the components using this hook re-render
- **No Global State**: Each feature is isolated, reducing bugs

---

### 3. Mock-First Development Strategy

**The Development Challenge:**
Frontend and backend teams often work in parallel. Waiting for backend APIs blocks frontend progress.

**The Solution: Mock Toggle**

A single configuration flag controls whether the app uses real or fake data:
```
USE_MOCK = true   // Development: use mock data
USE_MOCK = false  // Production: use real backend APIs
```

**How It's Implemented:**
Every API function checks this flag and branches accordingly:
- If mocking: Return fake data from local files
- If real: Make HTTP request to backend

**The Mock Data Structure:**
Each domain has a `mocks/` folder with realistic fake data that matches the real API contract exactly.

**Benefits:**
- **Parallel Development**: Frontend doesn't wait for backend
- **Reliable Development**: No database setup or backend running required
- **Consistent Testing**: Same mock data every time
- **Faster Iteration**: No network latency, instant responses
- **API Design Validation**: Forces frontend and backend to agree on contracts early

**Production Transition:**
When backend is ready, flip `USE_MOCK = false` and the real APIs are used. The component code doesn't change at all.

---

### 4. Layout-Based Route Protection

**The Security Requirement:**
Some pages require authentication (member dashboard, admin panel). Others are public (landing page, login).

**Traditional Approach Problems:**
- Wrapping every protected route with `<ProtectedRoute>` is repetitive
- Easy to forget, creating security holes
- Difficult to add common layout elements (headers, sidebars)

**Our Solution: Layout-Based Protection**

Two layout components act as gatekeepers:

**PublicLayout** - For unauthenticated pages:
- No authentication check
- Minimal UI (just the page content)
- Used by: Home, Login, Registration

**PrivateLayout** - For authenticated pages:
- **Checks for JWT token in localStorage**
- **If no token**: Redirects to login page
- **If token exists**: Renders the page
- Can add common UI like navigation, logout button

**How Routes Are Organized:**
Routes are nested under layouts. This creates a hierarchy where protection is automatic:
- All routes under `<PrivateLayout>` are automatically protected
- No need to remember to protect each individual route
- Adding a new protected route? Just nest it under PrivateLayout

**Benefits:**
- **Security by Default**: Impossible to accidentally expose protected pages
- **DRY Principle**: Authentication check written once, applied everywhere
- **Layout Inheritance**: Common UI elements (headers, nav) defined once
- **Clear Intent**: Looking at routes instantly shows what's public vs. protected

---

### 5. Centralized HTTP Client with Interceptors

**The Challenge:**
Every API call needs to:
- Include authentication token
- Handle errors consistently
- Log requests for debugging
- Set proper headers

Doing this manually in every API function is error-prone and repetitive.

**The Solution: Axios with Interceptors**

A single configured Axios instance handles all HTTP communication.

**Request Interceptor (Runs Before Every Request):**
- Automatically reads JWT token from localStorage
- Attaches it to `Authorization: Bearer <token>` header
- Logs outgoing requests for debugging

**Response Interceptor (Runs After Every Response):**
- Logs successful responses for debugging
- Categorizes errors (4xx client errors vs 5xx server errors)
- Provides consistent error messages
- Could add retry logic for failed requests

**Benefits:**
- **Automatic Authentication**: Components never worry about tokens
- **Consistent Error Handling**: Same error behavior across all API calls
- **Observability**: All HTTP traffic is logged for debugging
- **DRY**: Configuration written once, applied to all requests
- **Easy Updates**: Need to change error handling? Update one file

---

### 6. Form Handling Philosophy

**The Problem with Controlled Components:**
Traditional React form handling re-renders on every keystroke:
- User types one character
- State updates
- Entire form re-renders
- Expensive validation runs

For large forms (registration has dozens of fields), this becomes sluggish.

**React Hook Form Solution:**
- Uses **uncontrolled components** (refs instead of state)
- Only re-renders when necessary (validation, submission)
- Built-in validation triggers (onBlur, onChange, onSubmit)
- Minimal performance impact

**Zod Schema Validation:**
Instead of writing validation logic manually, define a schema:
- Mobile number must be exactly 10 digits
- Email must be valid format
- Age must be between 18-60
- Nominee shares must total 100%

**Why This Combination:**
- **Performance**: No unnecessary re-renders
- **Type Safety**: Zod schemas generate TypeScript types automatically
- **Validation Logic**: Defined once, reused everywhere
- **Error Messages**: Automatically mapped to form fields
- **Developer Experience**: Less code to write and maintain

---

## Shared vs. Domain-Specific Components

**Shared Components** (`src/shared/components/shared/`):
These are generic, reusable UI building blocks used across multiple domains:
- Button (with variants: primary, secondary, danger)
- InputField (text input with label and error display)
- SelectField (dropdown)
- OTPInput (multi-digit input with auto-focus)
- ProgressStepper (visual step indicator)

**Characteristics:**
- No business logic
- Highly configurable through props
- Generic styling with customization options
- Can be used anywhere in the application

**Domain-Specific Components:**
These live inside domain folders and contain business logic:
- `LoginForm` - Knows about authentication API
- `RegistrationNominee` - Understands nominee validation rules
- `MemberDashboardSummary` - Displays member-specific data

**Why This Distinction:**
- Shared components stay simple and reusable
- Domain components can be complex and opinionated
- Clear boundary between generic UI and business logic
- Easier to maintain and test

---

## The Role of Business Logic Utilities

**Example: Contribution Calculator**

The NESAm program has complex financial rules:
- Membership fees vary by age (8 different age brackets)
- Different member types get different discounts (0%, 5%, 10%, 15%)
- Advance DFC calculation based on per-event contribution

**Why Extract to Utility:**
- **Single Source of Truth**: Rules defined once, used everywhere
- **Testability**: Pure functions easy to unit test
- **Reusability**: Used in registration form, admin panel, payment calculator
- **Maintainability**: When rules change, update one file
- **Documentation**: Code becomes specification

**What Belongs in Utilities:**
- Calculations (fees, discounts, dates)
- Data transformations (API response → UI format)
- Validation logic (nominee shares must total 100%)
- Constants (age brackets, discount percentages)

**What Doesn't:**
- API calls (those go in `api/`)
- Component logic (that goes in components/viewModels)
- State management (that's in ViewModels)

---

## Build and Development Workflow

### Development Mode

**The Development Experience:**
1. Developer runs `npm run dev`
2. Vite starts in seconds (not minutes like Webpack)
3. Browser opens to `http://localhost:5173`
4. `USE_MOCK = true` so no backend needed
5. Make a code change
6. Browser updates instantly without losing state (HMR)

**Why This Matters:**
- Fast feedback loop = more productive development
- No context switching waiting for builds
- No backend setup frustration for frontend developers
- Mock data is consistent and reliable

### Production Build

**The Build Process:**
1. Set `USE_MOCK = false` to use real APIs
2. Run `npm run build`
3. Vite uses Rollup to create optimized bundle
4. Output goes to `dist/` folder
5. Code splitting creates separate bundles per route
6. CSS is extracted and minified
7. Assets are fingerprinted for cache busting

**Optimizations:**
- Tree shaking removes unused code
- Minification reduces file sizes
- Code splitting means users only download what they need
- Lazy loading for routes not visited

---

## Authentication Flow Architecture

**The Journey:**

1. **User arrives at site**: Sees public pages (home, login)

2. **Clicks "Login"**: Enters mobile number, clicks "Send OTP"

3. **Backend sends OTP**: Via SMS (Twilio integration)

4. **User enters OTP**: Frontend sends for verification

5. **Backend validates**: Returns JWT token if correct

6. **Frontend stores token**: In localStorage (accessible across page reloads)

7. **User navigates to protected page**: PrivateLayout checks for token

8. **Subsequent API calls**: Axios interceptor auto-attaches token to Authorization header

9. **Backend validates token**: On every protected endpoint

**Why This Design:**
- **Stateless Backend**: JWT carries all authentication info
- **Persistent Login**: Token survives page reloads (localStorage)
- **Automatic**: Components don't manually handle authentication
- **Secure**: Token only stored client-side, validated server-side
- **Scalable**: No session storage in backend

---

## Why This Architecture Scales

**For Small Teams (1-3 developers):**
- Simple mental model (just React hooks)
- Less code to maintain (no Redux)
- Quick to understand and onboard
- Mock data enables fast iteration

**For Growing Teams (4-10 developers):**
- Domain organization prevents conflicts
- Features are isolated, multiple developers can work in parallel
- Clear ownership boundaries (who owns which domain)
- ViewModels keep complexity manageable

**For Large Applications:**
- Code splitting loads only what's needed
- Domains can be extracted to separate packages
- Easy to lazy-load entire domains on demand
- Type safety prevents cross-domain coupling

---

## Trade-offs and Limitations

**What We Gained:**
✅ Simplicity over Redux complexity  
✅ Fast development with mocks  
✅ Clear domain boundaries  
✅ Type safety everywhere  
✅ Performance (no global state re-renders)  

**What We Lost:**
⚠️ No time-travel debugging (Redux DevTools)  
⚠️ ViewModel state doesn't persist across page reloads (could add localStorage)  
⚠️ Sharing state between domains requires props/callbacks (could add Context if needed)  
⚠️ No centralized action log (Redux advantage for debugging)  

**When This Architecture Might Not Fit:**
- Apps with heavy cross-domain state (e.g., collaborative editing)
- Need for pessimistic UI updates with complex rollback
- Requirements for offline-first architecture with sync
- Very complex state machines better suited to XState

---

## Key Principles Summary

1. **Feature Organization Over Technical Organization**  
   Group code by what users do, not by file types

2. **Simplicity Over Premature Optimization**  
   Use simple patterns until complexity demands more

3. **Co-location Over Separation**  
   Keep related code together, even if it's different types

4. **Type Safety Over Runtime Checks**  
   Catch errors at compile time with TypeScript

5. **Explicit Over Implicit**  
   Clear, obvious code beats clever, concise code

6. **Developer Experience Matters**  
   Fast feedback loops and good tooling make better products

---

## Related Documentation
- [Backend Architecture](./BACKEND-ARCHITECTURE.md) - How the Spring Boot API works
- [Authentication Flow](./AUTHENTICATION-FLOW.md) - Detailed auth sequence diagrams
- [Database Schema](./DATABASE-SCHEMA.md) - Data model and relationships
- [Developer Onboarding](./DEVELOPER-GUIDE.md) - How to set up and contribute
