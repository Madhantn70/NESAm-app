# Frontend State Management

> **Purpose**: Deep dive into state management strategies, patterns, and the ViewModel approach used in NESAm frontend.

---

## State Management Philosophy

### The "No Redux" Decision

**Why We Chose Not to Use Redux:**

1. **Complexity Overhead**
   - Redux requires actions, reducers, selectors, and store configuration
   - Boilerplate code significantly exceeds actual business logic
   - Team velocity slows due to ceremony

2. **Unnecessary Global State**
   - Most application state is **local to a feature**
   - Registration state isn't needed in member dashboard
   - Login state isn't needed in admin panel
   - Global state creates invisible dependencies

3. **Learning Curve**
   - New developers must learn Redux concepts (actions, dispatchers, middleware)
   - React hooks are already familiar to React developers
   - Less cognitive overhead = faster onboarding

4. **Over-Engineering**
   - Redux is powerful for complex state machines
   - NESAm's state needs are **straightforward** (forms, API data, UI state)
   - Time-travel debugging rarely used in practice
   - Undo/redo not required for this application

**What We Use Instead: The ViewModel Pattern**

---

## The ViewModel Pattern

### Conceptual Model

The ViewModel pattern comes from **MVVM** (Model-View-ViewModel) architecture:

```
View (React Components)
    ↕ (props & callbacks)
ViewModel (Custom Hooks)
    ↕ (API calls)
Model (Backend APIs / Local Data)
```

**Responsibilities:**

**View Layer (Components)**:
- Render UI based on data
- Capture user interactions
- Display loading/error states
- NO business logic

**ViewModel Layer (Hooks)**:
- Manage local state
- Execute business logic
- Handle API calls
- Provide computed values
- Expose functions for user actions

**Model Layer (APIs)**:
- HTTP communication
- Data persistence
- Backend integration

---

## ViewModel Implementation Pattern

### Anatomy of a ViewModel Hook

Every ViewModel follows this structure:

```typescript
export const use[Feature]ViewModel = (params?) => {
  // 1. STATE DECLARATIONS
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 2. DERIVED STATE (computed values)
  const computedValue = useMemo(() => {
    // Calculate from state
    return someTransformation(data);
  }, [data]);
  
  // 3. SIDE EFFECTS
  useEffect(() => {
    // Load initial data, subscriptions, etc.
  }, [dependencies]);
  
  // 4. ACTION HANDLERS (what user can do)
  const handleAction = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const result = await someApi.call(params);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dependencies]);
  
  // 5. RETURN PUBLIC API
  return {
    // State
    data,
    loading,
    error,
    
    // Computed
    computedValue,
    
    // Actions
    handleAction,
  };
};
```

---

## Real-World Example: Registration ViewModel

### The Challenge

Registration is a **multi-step wizard** with:
- 8 sequential steps
- Data accumulation across steps
- Step-specific validation
- Navigation (next, previous, jump to step)
- API calls at multiple points
- Error handling per step

**Without a ViewModel**, this complexity would be in the page component, making it unmaintainable.

### Implementation

**File**: `src/domains/public/registration/viewModels/useRegistrationViewModel.ts`

**State Management**:

```typescript
export enum RegistrationStep {
  EMAIL = 0,
  OTP = 1,
  CONTACT_DETAILS = 2,
  AGE_DETAILS = 3,
  NOMINEE_DETAILS = 4,
  MEMBERSHIP_BENEFIT = 5,
  FINAL_SUMMARY = 6,
  PAYMENT_METHOD = 7,
}

export const useRegistrationViewModel = () => {
  // Current step tracker
  const [step, setStep] = useState<RegistrationStep>(RegistrationStep.EMAIL);
  
  // Accumulated form data across all steps
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    alumniData: null,
    contactInfo: null,
    ageInfo: null,
    nominees: [],
    membershipType: 'regular',
    paymentInfo: null,
  });
  
  // Loading state per async operation
  const [loading, setLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // API call tracking
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
```

**Navigation Logic**:

```typescript
  // Move forward only if current step is valid
  const goToNextStep = () => {
    if (canProceed) {
      setStep(prev => prev + 1);
      setError(null);
    } else {
      setError('Please complete current step before proceeding');
    }
  };
  
  // Always allow moving backward
  const goToPreviousStep = () => {
    if (step > RegistrationStep.EMAIL) {
      setStep(prev => prev - 1);
      setError(null);
    }
  };
  
  // Jump to specific step (for editing from summary)
  const goToStep = (targetStep: RegistrationStep) => {
    if (targetStep <= step) {  // Only allow revisiting completed steps
      setStep(targetStep);
    }
  };
```

**Step-Specific Actions**:

```typescript
  // Step 1: Verify email is in alumni database
  const verifyEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const alumniData = await registrationApi.verifyEmail({ email });
      
      if (alumniData) {
        setFormData(prev => ({ ...prev, email, alumniData }));
        setEmailVerified(true);
        goToNextStep();
      } else {
        setError('Email not found in IRTTAA alumni database');
      }
    } catch (err) {
      setError('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Step 2: Verify OTP code
  const verifyOtp = async (otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registrationApi.verifyOtp({ 
        email: formData.email, 
        otp 
      });
      
      if (result.success) {
        setOtpVerified(true);
        goToNextStep();
      } else {
        setError('Invalid OTP code. Please try again.');
      }
    } catch (err) {
      setError('OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };
  
  // Step 3: Save contact information
  const saveContactInfo = (contactData: ContactInfo) => {
    setFormData(prev => ({ ...prev, contactInfo: contactData }));
    goToNextStep();
  };
  
  // Step 4: Save age and calculate fees
  const saveAgeInfo = (dateOfBirth: string) => {
    const age = calculateAge(dateOfBirth);
    const feeSlab = getFeeSlab(age);
    
    setFormData(prev => ({
      ...prev,
      ageInfo: { dateOfBirth, age, feeSlab },
    }));
    goToNextStep();
  };
  
  // Step 5: Save nominees (with validation)
  const saveNominees = (nominees: Nominee[]) => {
    const totalPercentage = nominees.reduce((sum, n) => sum + n.percentage, 0);
    
    if (totalPercentage !== 100) {
      setError('Nominee percentages must total exactly 100%');
      return;
    }
    
    if (nominees.length === 0) {
      setError('At least one nominee is required');
      return;
    }
    
    setFormData(prev => ({ ...prev, nominees }));
    goToNextStep();
  };
  
  // Final submission
  const submitRegistration = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await registrationApi.submitDetails(formData);
      
      if (result.success) {
        // Registration successful - could redirect or show success
        return result;
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
```

**Computed Values**:

```typescript
  // Can user proceed to next step?
  const canProceed = useMemo(() => {
    switch (step) {
      case RegistrationStep.EMAIL:
        return emailVerified;
      case RegistrationStep.OTP:
        return otpVerified;
      case RegistrationStep.CONTACT_DETAILS:
        return formData.contactInfo !== null;
      case RegistrationStep.AGE_DETAILS:
        return formData.ageInfo !== null;
      case RegistrationStep.NOMINEE_DETAILS:
        return formData.nominees.length > 0;
      default:
        return true;
    }
  }, [step, emailVerified, otpVerified, formData]);
  
  // Total fee calculation with discounts
  const calculatedFees = useMemo(() => {
    if (!formData.ageInfo) return null;
    
    const { membershipFee, advanceDFC } = formData.ageInfo.feeSlab;
    return calculateTotalPayable(
      membershipFee,
      advanceDFC,
      formData.membershipType
    );
  }, [formData.ageInfo, formData.membershipType]);
```

**Public API (What Components Use)**:

```typescript
  return {
    // State
    step,
    formData,
    loading,
    error,
    
    // Computed
    canProceed,
    calculatedFees,
    
    // Navigation
    goToNextStep,
    goToPreviousStep,
    goToStep,
    
    // Step-specific actions
    verifyEmail,
    verifyOtp,
    saveContactInfo,
    saveAgeInfo,
    saveNominees,
    submitRegistration,
  };
};
```

### How Components Use This ViewModel

**Page Component**:

```tsx
export function RegistrationPage() {
  const vm = useRegistrationViewModel();
  
  return (
    <div>
      <Header />
      
      {vm.loading && <LoadingSpinner />}
      {vm.error && <ErrorAlert message={vm.error} />}
      
      <ProgressStepper 
        steps={REGISTRATION_STEPS} 
        currentStep={vm.step} 
      />
      
      {/* Conditional rendering based on step */}
      {vm.step === RegistrationStep.EMAIL && (
        <RegistrationEnterEmail 
          onSubmit={vm.verifyEmail}
          loading={vm.loading}
        />
      )}
      
      {vm.step === RegistrationStep.OTP && (
        <RegistrationOTP 
          onSubmit={vm.verifyOtp}
          onBack={vm.goToPreviousStep}
          loading={vm.loading}
        />
      )}
      
      {vm.step === RegistrationStep.CONTACT_DETAILS && (
        <RegistrationContact 
          onSubmit={vm.saveContactInfo}
          onBack={vm.goToPreviousStep}
          initialData={vm.formData.contactInfo}
        />
      )}
      
      {/* ... more steps */}
      
      {vm.step === RegistrationStep.FINAL_SUMMARY && (
        <RegistrationSummary 
          data={vm.formData}
          fees={vm.calculatedFees}
          onEdit={vm.goToStep}
          onSubmit={vm.submitRegistration}
          loading={vm.loading}
        />
      )}
    </div>
  );
}
```

**Benefits of This Approach**:

✅ **Separation of Concerns**: Components are pure presentation  
✅ **Testability**: ViewModel can be tested without rendering components  
✅ **Reusability**: Same ViewModel could power different UI implementations  
✅ **Type Safety**: Full TypeScript support with inference  
✅ **Maintainability**: Business logic in one file, easy to find and modify  

---

## Other ViewModel Examples

### Login ViewModel

**File**: `src/domains/public/login/viewModels/useLoginViewModel.ts`

**Purpose**: Handle two-phase authentication (mobile → OTP → JWT)

**State**:
```typescript
- phase: 'mobile' | 'otp'  // Which input to show
- mobileNumber: string     // Captured mobile number
- loading: boolean
- error: string | null
- otpSent: boolean         // Track if OTP was sent
```

**Actions**:
```typescript
- sendOtp(mobileNumber)    // Phase 1: Request OTP
- verifyOtp(otp)           // Phase 2: Verify and get JWT
- resendOtp()              // Resend OTP code
- changeMobileNumber()     // Go back to phase 1
```

**Flow**:
1. User enters mobile number
2. Calls `sendOtp()` → Backend sends SMS
3. UI switches to OTP input (`phase = 'otp'`)
4. User enters OTP code
5. Calls `verifyOtp()` → Backend validates and returns JWT
6. JWT stored in localStorage
7. Redirect to `/member`

---

### Member Dashboard ViewModel

**File**: `src/domains/member/home/viewModels/useMemberDashboardViewModel.ts`

**Purpose**: Fetch and manage member dashboard data

**State**:
```typescript
- profile: UserProfile | null
- membership: MembershipData | null
- dfcBalance: number
- recentTransactions: Transaction[]
- loading: boolean
- error: string | null
```

**Actions**:
```typescript
- loadDashboardData()      // Fetch all dashboard data
- refreshBalance()         // Refresh just DFC balance
- logout()                 // Clear token and redirect
```

**Lifecycle**:
```typescript
useEffect(() => {
  loadDashboardData();  // Load on mount
}, []);
```

**Computed Values**:
```typescript
- needsPayment: boolean (true if dfcBalance < 1)
- membershipStatus: 'active' | 'notice_period' | 'lapsed'
- daysUntilLapse: number (if in notice period)
```

---

## State Persistence Strategies

### Local State (Component-Level)

**When to Use**:
- UI state (modals open/closed, tabs selected)
- Form state (before submission)
- Temporary data (search queries, filters)

**Example**: Dropdown menu open/closed state
```typescript
const [isOpen, setIsOpen] = useState(false);
```

**Lifetime**: Lost on component unmount

---

### ViewModel State (Feature-Level)

**When to Use**:
- Feature-specific data (registration form across steps)
- Data needed across multiple components in a feature
- State that shouldn't be global

**Example**: Registration form data accumulation

**Lifetime**: Lost on page navigation (unless persisted)

---

### localStorage Persistence

**When to Use**:
- Authentication tokens (survive page reload)
- User preferences (theme, language)
- Draft data (save form progress)

**Implementation**:
```typescript
// Save to localStorage
localStorage.setItem('token', jwtToken);

// Read from localStorage
const token = localStorage.getItem('token');

// Remove from localStorage
localStorage.removeItem('token');
```

**Security Consideration**:
- ⚠️ XSS attacks can read localStorage
- ✅ Acceptable for JWTs (they expire)
- ❌ Never store sensitive data (passwords, credit cards)

---

### Server-Side State (API-Driven)

**When to Use**:
- User data (profile, membership)
- Financial data (transactions, balances)
- Authoritative data (system parameters)

**Pattern**: Fetch on mount, cache in component state
```typescript
useEffect(() => {
  const fetchData = async () => {
    const data = await memberApi.getDashboardSummary();
    setDashboardData(data);
  };
  fetchData();
}, []);
```

**Cache Invalidation**:
- User action triggers mutation → Refetch data
- Time-based invalidation (reload every 5 minutes)
- Event-based (WebSocket notification → reload)

---

## State Sharing Patterns

### Problem: Multiple Components Need Same Data

**Scenario**: Both `Header` and `MemberDashboardPage` need user profile.

**❌ Bad Solution: Duplicate API Calls**
- Header fetches profile
- Dashboard fetches profile
- Two network requests, inconsistent data

**✅ Good Solution: Lift State Up**
- Parent component fetches profile once
- Passes as props to Header and Dashboard

```tsx
function MemberLayout() {
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      const data = await memberApi.getProfile();
      setProfile(data);
    };
    fetchProfile();
  }, []);
  
  return (
    <>
      <Header profile={profile} />
      <Outlet context={{ profile }} />  {/* Available to child routes */}
    </>
  );
}
```

---

### Context API for Deep Prop Drilling

**Problem**: Passing props through 5 levels of components

**Solution**: React Context
```typescript
// Create context
const AuthContext = createContext<AuthContextValue | null>(null);

// Provider at app root
export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // Decode JWT to get user info
    const userData = decodeJWT(newToken);
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for consuming
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Usage**:
```tsx
function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header>
      <span>Welcome, {user.name}</span>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
```

**When NOT to Use Context**:
- Frequently changing state (causes all consumers to re-render)
- Data only needed by 2-3 components (just use props)
- Large objects (split into multiple contexts)

---

## State Update Patterns

### Immutable Updates

**Why Immutability Matters**:
React's re-render detection relies on reference equality. Mutating objects breaks this.

**❌ Mutation (Doesn't Trigger Re-render)**:
```typescript
const [user, setUser] = useState({ name: 'John', age: 30 });

// BAD: Mutating object
user.age = 31;
setUser(user);  // Same reference, React won't re-render
```

**✅ Immutable Update**:
```typescript
// GOOD: Create new object
setUser({ ...user, age: 31 });  // New reference, React re-renders
```

### Array Updates

**Adding Item**:
```typescript
setItems([...items, newItem]);
```

**Removing Item**:
```typescript
setItems(items.filter(item => item.id !== idToRemove));
```

**Updating Item**:
```typescript
setItems(items.map(item => 
  item.id === idToUpdate 
    ? { ...item, name: 'New Name' }
    : item
));
```

### Nested Object Updates

**Problem**: Updating deeply nested state is verbose

**Solution**: Use Immer library (optional enhancement)
```typescript
import { produce } from 'immer';

setFormData(produce(draft => {
  draft.contact.address.city = 'New City';
  // Immer handles immutability automatically
}));
```

---

## Loading States

### Three-State Pattern

Every async operation has 3 states:
1. **Idle**: Not started, no data
2. **Loading**: Request in progress
3. **Success / Error**: Request completed

**Implementation**:
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const result = await api.getData();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**UI Handling**:
```tsx
{loading && <Spinner />}
{error && <ErrorAlert message={error} />}
{data && <DataDisplay data={data} />}
```

---

## Error Handling Strategies

### Local Error State

**Scope**: Single component/feature

```typescript
const [error, setError] = useState<string | null>(null);

try {
  await someOperation();
} catch (err) {
  setError(err.message);
}
```

**UI**: Show error below form, inline with action

---

### Error Boundaries

**Scope**: Catch errors in component tree

```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

**Usage**: Wrap routes to prevent entire app crash

---

### Global Error Toast

**Scope**: Application-wide notifications

```typescript
// Could use Context or event emitter
showErrorToast('Payment failed. Please try again.');
```

**UI**: Toast notification in corner

---

## Performance Optimization

### Prevent Unnecessary Re-renders

**Problem**: Parent re-renders cause all children to re-render

**Solution 1: React.memo**
```typescript
export const ExpensiveComponent = React.memo(({ data }) => {
  // Only re-renders if `data` prop changes
  return <div>{data}</div>;
});
```

**Solution 2: useMemo**
```typescript
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);  // Only recalculates if data changes
```

**Solution 3: useCallback**
```typescript
const handleClick = useCallback(() => {
  doSomething(dependency);
}, [dependency]);  // Stable function reference
```

---

### Lazy Loading Components

**Pattern**: Load components only when needed

```typescript
const AdminDashboard = React.lazy(() => 
  import('./domains/admin/dashboard/pages/AdminDashboardPage')
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboard />
    </Suspense>
  );
}
```

**Benefits**:
- Smaller initial bundle
- Faster first paint
- On-demand loading

---

## State Management Evolution Path

### Current: ViewModels (Simple)
✅ Sufficient for current complexity  
✅ Easy to understand  
✅ Fast development  

### Future: Context (If Needed)
When multiple features need shared state:
- Add AuthContext for user/token
- Add ThemeContext for dark mode
- Add NotificationContext for toasts

### Future: External Library (If Needed)
When ViewModels become unwieldy:
- **Zustand**: Simplest Redux alternative
- **Jotai**: Atomic state management
- **Redux Toolkit**: If complex state machines needed

**Decision Point**: When you have >10 ViewModels sharing state

---

## Testing ViewModels

### Unit Testing Hooks

**Library**: @testing-library/react-hooks

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useRegistrationViewModel } from './useRegistrationViewModel';

test('goes to next step when email verified', async () => {
  const { result } = renderHook(() => useRegistrationViewModel());
  
  expect(result.current.step).toBe(RegistrationStep.EMAIL);
  
  await act(async () => {
    await result.current.verifyEmail('test@example.com');
  });
  
  expect(result.current.step).toBe(RegistrationStep.OTP);
});
```

---

## Key Takeaways

### ✅ What Works Well

1. **ViewModels**: Simple, effective for current complexity
2. **Co-location**: Business logic near components
3. **Type Safety**: TypeScript prevents state bugs
4. **Local State**: Features isolated, no global dependencies

### ⚠️ Trade-offs Accepted

1. **No Time-Travel Debugging**: Lost Redux DevTools advantage
2. **No State Persistence**: ViewModels reset on unmount (could add localStorage)
3. **Limited State Sharing**: Context needed if this becomes a problem

### 🔮 Future Enhancements

1. **AuthContext**: Centralize authentication state
2. **State Persistence**: Save registration progress to localStorage
3. **Optimistic Updates**: UI responds before API confirms
4. **WebSocket Integration**: Real-time updates for admin dashboard

---

## Related Documentation
- [Component Architecture](./COMPONENT-ARCHITECTURE.md)
- [Frontend Architecture](./FRONTEND-ARCHITECTURE.md)
- [API Integration Guide](./API-INTEGRATION.md)
- [Testing Strategy](./TESTING-STRATEGY.md)
