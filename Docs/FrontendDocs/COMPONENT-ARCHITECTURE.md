# Frontend Component Architecture

> **Purpose**: Detailed analysis of component structure, hierarchy, and organization patterns in the NESAm frontend.

---

## Component Organization Strategy

### Three-Tier Component Hierarchy

The application uses a three-tier component organization:

1. **Pages** - Route-level components (entry points for URLs)
2. **Domain Components** - Business-logic-specific UI within a feature
3. **Shared Components** - Generic, reusable UI primitives

This hierarchy creates clear **dependency rules**:
- Pages can use Domain Components and Shared Components
- Domain Components can use Shared Components
- Shared Components depend on nothing (pure UI primitives)
- **Violations** of this flow create coupling and are avoided

---

## Tier 1: Page Components

**Location Pattern**: `src/domains/{domain}/*/pages/`

### What Makes a Page Component

Pages are **route entry points** - the components React Router renders when a URL is visited.

**Responsibilities:**
- Orchestrate layout structure
- Initialize ViewModels for business logic
- Compose Domain Components into a full view
- Handle top-level error boundaries
- Manage page-level loading states

**What Pages Should NOT Do:**
- Direct API calls (delegate to ViewModels)
- Complex business logic (delegate to ViewModels)
- Form validation logic (delegate to components)
- Data transformation (delegate to utilities)

### Public Domain Pages

#### HomePage (`domains/public/landing/pages/HomePage.tsx`)

**Purpose**: Marketing landing page for unauthenticated visitors

**Structure**:
```
Header (branding, navigation)
↓
ImpactHero (hero section with key messaging)
↓
ImpactStats (program metrics: total members, funds distributed, families helped)
↓
Footer (links, contact)
```

**Data Source**: 
- Calls `homeApi.getImpactStats()` 
- Mock mode returns static impressive numbers
- Real mode fetches live statistics from backend

**Key Feature**: No authentication required, optimized for SEO and first impressions

---

#### LoginPage (`domains/public/login/pages/LoginPage.tsx`)

**Purpose**: Authentication entry point

**Component Composition**:
```
Header
↓
LoginForm (handles mobile number entry and OTP verification)
```

**Flow**:
1. User enters mobile number
2. Clicks "Send OTP" → Triggers SMS via backend
3. Enters OTP code
4. On success → JWT stored in localStorage → Redirect to `/member`

**Security Note**: This page is **public** but redirects authenticated users away

---

#### RegistrationPage (`domains/public/registration/pages/RegistrationPage.tsx`)

**Purpose**: Complex multi-step membership application wizard

**Why This Is Complex**:
Registration isn't a simple form - it's a **guided journey** through 8 distinct steps, each with validation gates.

**Step Breakdown**:

| Step | Component | Purpose | Validation |
|------|-----------|---------|------------|
| 1 | RegistrationEnterEmail | Verify applicant is IRTTAA alumni | Email exists in alumni database |
| 2 | RegistrationOTP | Confirm email ownership | OTP matches backend |
| 3 | RegistrationContact | Collect contact details | Mobile, address required |
| 4 | RegistrationAge | Calculate membership fees | Age 18-60, determines fee slab |
| 5 | RegistrationNominee | Designate beneficiaries | Shares total 100% |
| 6 | RegistrationMembershipBenefit | Show calculated fees with discounts | User confirms amounts |
| 7 | RegistrationSummary | Final review before payment | User acceptance |
| 8 | RegistrationPaymentMethod | Payment gateway integration | Transaction confirmation |

**State Management**:
- Uses `useRegistrationViewModel()` hook
- Accumulates data across all steps
- Provides `goToNextStep()` / `goToPreviousStep()` navigation
- Validates each step before allowing forward progress

**Visual Feedback**:
- `ProgressStepper` component shows current position
- Disabled "Back" button on first step
- "Next" button disabled until current step validates

**Why Not Separate Routes**:
- State would be lost on browser back/forward
- Harder to implement step-by-step validation
- URL changes would allow users to skip validation
- Single route with sub-state is cleaner

---

### Member Domain Pages

#### MemberDashboardPage (`domains/member/home/pages/MemberDashboardPage.tsx`)

**Purpose**: Authenticated member's home screen after login

**Component Composition**:
```
Header (with logout button)
↓
MemberProfileSummary (name, NESAM ID, membership status)
↓
ActiveDfcSummary (current contribution balance, next payment due)
↓
QuickActions (Pay DFC, Update Profile, View Nominees)
↓
RecentTransactions (last 5 transactions)
```

**Data Requirements**:
- Calls `memberApi.getDashboardSummary()`
- Requires JWT authentication (auto-attached by axios interceptor)
- Returns: profile, membership status, DFC balance, upcoming payments

**Protection**: Wrapped in `<PrivateLayout>` - unauthenticated users redirected to login

---

#### MemberActiveDfcPage (`domains/member/contributions/pages/MemberActiveDfcPage.tsx`)

**Purpose**: Detailed view of Death Fraternity Contribution tracking

**What It Shows**:
- Current DFC balance (how many prepaid events remaining)
- Contribution history (past payments)
- Upcoming payment schedule
- Per-event contribution amount (based on age slab)

**Business Logic**:
- If balance < 1 event → Show warning banner
- If balance = 0 → Member enters "Notice Period" (60 days to pay or membership lapses)
- Payment button triggers payment gateway integration

---

#### MemberImpactPage (`domains/member/impact/pages/MemberImpactPage.tsx`)

**Purpose**: Show member how their contributions have helped families

**Emotional Appeal**:
This page is about **member retention** - showing tangible impact of their contributions.

**Content**:
- Total amount contributed by this member
- Number of families helped (across all members)
- Timeline of claim settlements
- Success stories (anonymized)

**Data Visualization**:
- Uses Recharts library for graphs
- Year-over-year contribution trends
- Member count growth over time

---

### Admin Domain Pages

#### AdminDashboardPage (`domains/admin/dashboard/pages/AdminDashboardPage.tsx`)

**Purpose**: Administrative oversight and operations

**User**: IRTTAA administrators managing the NESAm program

**Key Widgets**:
- Pending membership applications (requiring approval)
- Recent claim submissions (requiring verification)
- Financial summary (total funds, disbursements)
- Member lifecycle status distribution (active, lapsed, deceased)
- System alerts (members entering notice period, overdue payments)

**Actions**:
- Approve/reject applications
- Verify and process claims
- Generate financial reports
- Send bulk notifications

**Security**: Requires admin role (future enhancement - currently uses same JWT)

---

## Tier 2: Domain-Specific Components

**Location Pattern**: `src/domains/{domain}/*/components/`

These components contain **business logic** specific to a feature domain.

### Registration Domain Components

#### RegistrationEnterEmail

**Purpose**: First step of registration - verify alumni status

**Props**:
```typescript
{
  onSubmit: (email: string) => void;
  loading: boolean;
}
```

**Business Logic**:
- Validates email format
- Calls `registrationApi.verifyEmail()`
- If found in alumni DB → Shows alumni info (name, graduation year)
- If NOT found → Error: "Not found in IRTTAA alumni database"

**Why This Matters**:
Only IRTTAA alumni can join NESAm. This is the eligibility gate.

---

#### RegistrationOTP

**Purpose**: Verify email ownership via OTP

**Component Structure**:
- Uses `<OTPInput length={6}>` shared component
- Auto-focuses first digit
- Auto-submits when all 6 digits entered
- Calls `registrationApi.verifyOtp()`

**User Experience Enhancement**:
- Shows timer: "Code expires in 9:45"
- "Resend OTP" button (disabled until timer expires)
- Auto-advances between input boxes

---

#### RegistrationContact

**Purpose**: Collect contact information

**Form Fields**:
- Full Name (pre-filled from alumni DB, editable)
- Mobile Number (10 digits, becomes login credential)
- Alternate Mobile (optional)
- Address (multi-line text)
- City, State, Postal Code

**Validation**:
- Mobile must be unique (checked against existing members)
- Postal code format validation

---

#### RegistrationAge

**Purpose**: Determine membership fee based on age

**Critical Business Logic**:

Age determines **lifetime membership fee**:
- Age 18-25: ₹2,000
- Age 26-30: ₹3,500
- Age 31-35: ₹5,500
- Age 36-40: ₹8,000
- Age 41-45: ₹11,000
- Age 46-50: ₹15,000
- Age 51-55: ₹20,000
- Age 56-60: ₹26,000

**Component Behavior**:
- User enters date of birth
- System calculates current age
- Displays applicable age slab and fees
- Highlights "Join younger to save money!" message

**Why This Design**:
Actuarial fairness - younger members pay less because they'll contribute over more years.

---

#### RegistrationNominee

**Purpose**: Designate beneficiaries who receive claim payouts

**Complex Validation Rules**:

1. **Minimum 1 nominee required**
2. **Maximum 4 nominees allowed**
3. **Total percentage shares MUST equal 100%**
4. **No duplicate nominees** (same name + relationship)

**Per-Nominee Fields**:
- Full Name
- Relationship (dropdown: Spouse, Child, Parent, Sibling, Other)
- Date of Birth
- Percentage Share (1-100%)

**Dynamic UI**:
- "Add Another Nominee" button (until 4 reached)
- Real-time percentage total display
- Visual indicator when total ≠ 100%
- Cannot proceed until total = 100%

**Business Context**:
On member's death, the claim payout is split among nominees according to these percentages.

---

#### RegistrationMembershipBenefit

**Purpose**: Show calculated fees with available discounts

**Discount Types**:
- **Regular**: 0% discount (base price)
- **Patron Member**: 5% discount (₹500 additional contribution)
- **Founding Member**: 10% discount (join before program launch)
- **Patron + Founding**: 15% discount (both conditions)

**Component Display**:
```
Base Membership Fee:        ₹8,000
- Founding Member Discount: -₹1,200 (15%)
  Membership After Discount: ₹6,800
  
Advance DFC (5 events):     ₹2,000
  
TOTAL PAYABLE:             ₹8,800
```

**Why Show This**:
Transparency builds trust. Member sees exactly what they're paying for.

---

#### RegistrationSummary

**Purpose**: Final confirmation before payment

**Displays**:
- All entered personal information
- Selected nominees with percentages
- Fee breakdown
- Terms and conditions checkbox
- "I confirm all information is accurate" checkbox

**User Actions**:
- Edit any section (goes back to that step)
- Confirm and proceed to payment

---

#### RegistrationPaymentMethod

**Purpose**: Payment gateway integration (planned)

**Payment Options** (future):
- UPI
- Credit/Debit Card
- Net Banking
- Payment Link (pay later via SMS link)

**Current Implementation**: Mock payment success

---

### Login Domain Components

#### LoginForm

**Purpose**: Handle mobile number OTP authentication

**Two-Phase UI**:

**Phase 1: Enter Mobile**
- Input field for 10-digit mobile number
- "Send OTP" button
- Calls `authApi.login({ mobileNumber })`
- Backend sends SMS via Twilio

**Phase 2: Enter OTP**
- Shows: "OTP sent to +91-987-654-3210"
- 6-digit OTP input (auto-focus, auto-submit)
- "Resend OTP" link
- Calls `authApi.verifyOtp({ mobileNumber, otp })`
- On success: JWT stored, redirect to `/member`

**Error Handling**:
- "Mobile number not registered" → Suggest registration
- "Invalid OTP" → Allow retry (3 attempts max)
- "OTP expired" → Automatically show resend option

---

### Member Domain Components

#### MemberProfileSummary

**Purpose**: Display member's core information

**Content**:
- Profile photo (placeholder if not uploaded)
- Full Name
- NESAM ID (e.g., "NESAM-2024-00123")
- Membership Status Badge (Active / Notice Period / Lapsed)
- Member Since date
- Membership Type (Regular / Patron)

**Visual Design**:
- Status badge color-coded:
  - Green: Active
  - Yellow: Notice Period
  - Red: Lapsed

---

#### ActiveDfcSummary

**Purpose**: Quick view of contribution balance

**Displays**:
- Current Balance: "5 events prepaid"
- Next Payment Due: Date or "No payment due"
- Per-Event Contribution: "₹400 per event"
- "Pay DFC" button (if balance < 3)

**Business Context**:
Members prepay for 5 events at a time. When balance drops below 1, they have 60 days to replenish or membership lapses.

---

## Tier 3: Shared Components

**Location**: `src/shared/components/shared/`

### Design Principles

Shared components are **pure UI primitives** with:
- **No business logic** (no API calls, no domain knowledge)
- **Highly configurable** (props control all behavior)
- **Accessible** (ARIA labels, keyboard navigation)
- **Consistent styling** (Tailwind CSS variants)
- **Well-documented** (TypeScript props with JSDoc)

---

### Button

**Purpose**: Standardized button across the app

**Variants**:
- `primary` - Main actions (blue, high contrast)
- `secondary` - Alternative actions (gray, lower emphasis)
- `danger` - Destructive actions (red, e.g., "Delete Account")
- `ghost` - Minimal styling (text-like)

**Sizes**:
- `sm` - Compact UI (32px height)
- `md` - Default (40px height)
- `lg` - Prominent actions (48px height)

**States**:
- `disabled` - Grayed out, not clickable
- `loading` - Shows spinner, prevents clicks

**Props Interface**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Usage Patterns**:
```tsx
// Primary action
<Button variant="primary" onClick={handleSubmit}>
  Submit Application
</Button>

// Loading state during async operation
<Button loading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? 'Processing...' : 'Pay Now'}
</Button>

// Destructive action with confirmation
<Button variant="danger" onClick={handleDelete}>
  Cancel Membership
</Button>
```

---

### InputField

**Purpose**: Text input with label, validation, and error display

**Features**:
- Integrated label (always visible)
- Required indicator (`*` asterisk)
- Error message display (below input)
- Help text (instructional hints)
- Icon support (prefix/suffix icons)

**Types Supported**:
- `text` - General text
- `email` - Email with validation
- `tel` - Phone number
- `password` - Obscured text with show/hide toggle
- `number` - Numeric input

**Props Interface**:
```typescript
interface InputFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}
```

**Accessibility**:
- Label properly associated with input (`htmlFor` + `id`)
- Error announced to screen readers (`aria-describedby`)
- Required indicated visually and via `aria-required`

---

### SelectField

**Purpose**: Dropdown selection with validation

**Features**:
- Native `<select>` element (better mobile UX)
- Placeholder option
- Error state styling
- Disabled state
- Grouped options support

**Props Interface**:
```typescript
interface SelectFieldProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}
```

**Usage Example**:
```tsx
<SelectField
  label="Relationship"
  name="relationship"
  options={[
    { value: 'spouse', label: 'Spouse' },
    { value: 'child', label: 'Child' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
  ]}
  required
/>
```

---

### CheckboxField

**Purpose**: Boolean selection with label

**Use Cases**:
- Terms and conditions acceptance
- Feature toggles
- Multi-select options

**Props Interface**:
```typescript
interface CheckboxFieldProps {
  label: string | ReactNode;  // Allows rich content in label
  name: string;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}
```

**Special Feature**: Label can be rich content (links, bold text)

---

### OTPInput

**Purpose**: Multi-digit OTP entry with smooth UX

**Advanced Features**:
1. **Auto-focus**: First box focused on mount
2. **Auto-advance**: Typing a digit moves to next box
3. **Auto-backspace**: Deleting moves to previous box
4. **Paste support**: Pasting "123456" fills all boxes
5. **Keyboard navigation**: Arrow keys move between boxes

**Props Interface**:
```typescript
interface OTPInputProps {
  length?: number;  // Default: 6
  onComplete: (otp: string) => void;  // Called when all digits filled
  autoSubmit?: boolean;  // Auto-trigger onComplete
}
```

**Implementation Details**:
- Uses array of refs for each input box
- Listens to input, keydown, and paste events
- Validates that only digits are entered
- Visual feedback: filled boxes have darker border

---

### ProgressStepper

**Purpose**: Visual indicator for multi-step processes

**Visual Design**:
```
(1) → (2) → (3) → (4) → (5)
 ●     ●     ○     ○     ○
Done  Active  Next  Next  Next
```

**Features**:
- Completed steps: Green checkmark
- Active step: Blue circle with number
- Future steps: Gray circle with number
- Connecting lines between steps

**Props Interface**:
```typescript
interface ProgressStepperProps {
  steps: Array<{ label: string; description?: string }>;
  currentStep: number;  // 0-indexed
  orientation?: 'horizontal' | 'vertical';
}
```

**Responsive Behavior**:
- Horizontal on desktop (steps in a row)
- Vertical on mobile (steps stacked)

---

### Header

**Purpose**: Top navigation bar

**Variants**:

**Public Header** (unauthenticated):
- Logo (clickable → home)
- Navigation links (Home, About, Login)
- "Register" button (CTA)

**Private Header** (authenticated):
- Logo
- Navigation (Dashboard, Contributions, Impact)
- User dropdown (Profile, Settings, Logout)
- Notification bell icon

**Responsive**:
- Mobile: Hamburger menu collapses navigation
- Desktop: Full horizontal menu

---

## Component Communication Patterns

### Props Down, Events Up

**Standard Pattern**:
- Parent components pass data via **props**
- Child components emit events via **callback props**
- No direct child-to-child communication

**Example**:
```
RegistrationPage (parent)
  ↓ props: { currentStep, onNext }
RegistrationNominee (child)
  ↑ calls: onNext()
```

### ViewModel Mediator

**Pattern**:
- Page component creates ViewModel hook
- ViewModel manages state
- Page passes ViewModel state/functions to children
- Children are "dumb" presentational components

**Benefits**:
- Easy to test (mock ViewModel)
- Components stay simple
- Business logic centralized

---

## Component Reusability Analysis

### High Reusability (Used 10+ times)
- Button
- InputField
- SelectField

### Medium Reusability (Used 3-10 times)
- Header (public vs private variants)
- OTPInput (login + registration)
- ProgressStepper (registration, claim submission)

### Low Reusability (Used 1-2 times)
- RegistrationNominee (specific to registration)
- ActiveDfcSummary (specific to member dashboard)

### Why Some Components Aren't Reused
Not every component needs to be reusable. **Domain-specific components** contain business logic that's unique to their feature. Forcing them to be generic would add unnecessary complexity.

---

## Testing Strategy (Recommendations)

### What to Test

**Shared Components**: High priority
- Unit test all props and variants
- Visual regression tests (Storybook)
- Accessibility tests (axe-core)

**Domain Components**: Medium priority
- Integration tests with mocked ViewModels
- Critical user flows (registration, payment)

**Pages**: Low priority (tested via E2E)
- E2E tests for full user journeys
- Less unit testing (mostly orchestration)

---

## Component Performance Considerations

### Optimization Techniques Used

1. **React.memo()** - Prevent unnecessary re-renders
2. **useMemo()** - Cache expensive calculations
3. **useCallback()** - Stabilize callback references
4. **Code Splitting** - Lazy load pages with React.lazy()

### Performance Bottlenecks to Avoid

❌ Inline function definitions in props (creates new reference on every render)  
❌ Large component trees without memo  
❌ Expensive operations in render (move to useMemo)  
❌ Too many controlled form inputs (use React Hook Form's uncontrolled mode)  

---

## Future Component Enhancements

### Planned Additions
- **DatePicker** - Better than native date input
- **Modal** - Dialogs and confirmations
- **Toast** - Non-blocking notifications
- **Table** - Data grids for admin
- **Pagination** - For long lists
- **Search** - Autocomplete input

### Component Library Consideration
As shared components grow, consider extracting to separate package for:
- Independent versioning
- Documentation with Storybook
- Testing in isolation
- Reuse in future projects

---

## Related Documentation
- [State Management Patterns](./STATE-MANAGEMENT.md)
- [Form Handling Guide](./FORM-HANDLING.md)
- [UI Design System](./DESIGN-SYSTEM.md)
- [Frontend Architecture](./FRONTEND-ARCHITECTURE.md)
