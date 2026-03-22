# Frontend Refactoring & Restructuring Guide

## Overview

This document outlines the comprehensive refactoring of the mobile restaurant booking app frontend with improved component architecture, VNPay payment integration, and bottom navigation implementation.

## 📁 New Project Structure

```
frontend/
├── app/
│   ├── (tabs)/              # Bottom tab navigation
│   │   ├── _layout.jsx      # Tab layout configuration
│   │   ├── home.jsx         # Dashboard
│   │   ├── browse.jsx       # Browse tables & restaurants
│   │   ├── bookings.jsx     # My bookings management
│   │   ├── orders.jsx       # My orders
│   │   └── profile.jsx      # User profile & settings
│   ├── admin/               # Admin panel (unchanged)
│   ├── user/                # User detail screens
│   │   ├── bookings/
│   │   │   └── [id].jsx     # Booking detail view
│   │   ├── bookings-create.jsx
│   │   ├── profile.jsx
│   │   └── _layout.jsx
│   ├── screens/             # Auth screens (legacy, kept for compatibility)
│   │   ├── Signin.jsx
│   │   └── Signup.jsx
│   └── _layout.tsx          # Root layout
│
├── components/
│   ├── common/              # Reusable UI components [NEW]
│   │   ├── EmptyState.jsx        # Empty list state
│   │   ├── LoadingSpinner.jsx    # Loading indicator
│   │   ├── Badge.jsx             # Status badges
│   │   ├── Card.jsx              # Generic card wrapper
│   │   ├── SectionHeader.jsx     # Section titles with actions
│   │   ├── ActionButton.jsx      # Icon action buttons
│   │   └── FilterBar.jsx         # Tab/chip filters
│   ├── admin/               # Admin components (unchanged)
│   ├── user/                # User-specific components
│   ├── payment/             # Payment components [NEW]
│   │   └── PaymentModal.jsx
│   ├── ui/                  # Base UI components
│   ├── SigninForm.jsx
│   └── SignupForm.jsx
│
├── config/                  # Configuration files [NEW]
│   └── vnpay.config.js      # VNPay configuration
│
├── screens/                 # Screen components [NEW]
│   └── PaymentScreen.jsx    # Payment processing screen
│
├── hooks/                   # Custom hooks
│   ├── use-color-scheme.ts
│   └── use-refresh-focus.ts
│
└── constants/               # Constants
    └── theme.ts
```

## 🎯 Key Improvements

### 1. **Reusable Common Components** (New)

Extracted 7 commonly used components into `components/common/`:

- **EmptyState.jsx** - Displays when no data available (lists, searches, etc.)
- **LoadingSpinner.jsx** - Centralized loading indicator component
- **Badge.jsx** - Variants: success, warning, danger, info, pending
- **Card.jsx** - Generic card container with customizable styling
- **SectionHeader.jsx** - Section titles with optional right element
- **ActionButton.jsx** - Icon buttons for quick actions (sizes: sm, md, lg)
- **FilterBar.jsx** - Horizontal filter tabs or chips

**Benefits:**

- DRY principle - reduce code duplication
- Consistent styling across app
- Easy to update globally
- Better maintainability

### 2. **Bottom Navigation Layout** (New)

Restructured tab navigation with 5 main tabs:

```jsx
// app/(tabs)/_layout.jsx
<Tabs>
  <Tabs.Screen name="home" /> // Dashboard & overview
  <Tabs.Screen name="browse" /> // Browse tables
  <Tabs.Screen name="bookings" /> // My bookings
  <Tabs.Screen name="orders" /> // My orders
  <Tabs.Screen name="profile" /> // Profile & settings
</Tabs>
```

**Styling:**

- Active color: #ff9e6b (orange)
- Inactive color: #9ca3af (gray)
- Height: 60px
- Border top: 1px #e5e7eb

### 3. **Bottom Tab Screens** (Redesigned)

#### Home Tab (`(tabs)/home.jsx`)

**Purpose:** Dashboard with quick access to all features

**Features:**

- Welcome greeting with user name
- 3 stat tiles (Upcoming, Completed, Total)
- 4 quick action buttons
- Recent bookings preview
- User info card

**API Calls:**

- GET `/users/me`
- GET `/users/bookings`

---

#### Browse Tab (`(tabs)/browse.jsx`)

**Purpose:** Discover and filter available tables

**Features:**

- Type filter (All, Standard, VIP, Bar, Outdoor)
- Capacity filter (minimum guests)
- Date filter (optional)
- Table card displays with select button
- Results count
- Empty state for no matches

**API Call:**

- GET `/users/tables?type=X&capacity=Y&date=YYYY-MM-DD`

**Action:**

- Select table → Navigate to booking creation

---

#### Bookings Tab (`(tabs)/bookings.jsx`)

**Purpose:** Manage all reservations

**Features:**

- Filter tabs: All, Upcoming, Completed, Cancelled
- Stat boxes showing counts per category
- FAB (floating action button) for new booking
- Cancel action for pending/confirmed bookings
- Empty state with "Create" button
- Auto-refresh on focus

**API Calls:**

- GET `/users/bookings`
- PUT `/users/bookings/:id/cancel`

---

#### Orders Tab (`(tabs)/orders.jsx`)

**Purpose:** Track food orders and payments

**Features:**

- Payment stat boxes: Total, Paid, Unpaid
- Filter tabs: All, Paid, Unpaid
- OrderCard displays
- Empty state message
- Auto-refresh on focus

**API Call:**

- GET `/users/orders`

---

#### Profile Tab (`(tabs)/profile.jsx`)

**Purpose:** User account management

**Sections:**

1. **Avatar & Header** - Display name and role
2. **Account Information** (Read-only)
   - Username
   - Email
   - Member Since
3. **Profile Details** (Edit mode)
   - Display Name
   - Phone
   - Bio
4. **Preferences** (Clickable rows)
   - Notifications
   - Privacy
   - Help & Support
5. **Logout** Button

**API Calls:**

- GET `/users/me`
- PUT `/users/profile`

## 💳 VNPay Payment Integration

### Files Added:

1. **config/vnpay.config.js** - Configuration and constants
2. **components/payment/PaymentModal.jsx** - Payment method selection modal
3. **screens/PaymentScreen.jsx** - Full payment processing screen

### Payment Modal Features:

- 3 payment methods:
  - VNPay (cards, e-wallets)
  - Bank Transfer
  - Pay at Restaurant
- Display total amount & 20% deposit
- Selection feedback
- Info box for VNPay redirect

### Payment Screen Features:

- Service charge display
- Deposit calculation (20% of total)
- Payment terms
- Beautiful payment processing UI

### Configuration:

```javascript
// config/vnpay.config.js
DEPOSIT_PERCENTAGE: 0.2        // 20% tiền cọc
MIN_DEPOSIT: 100000            // 100k VND minimum
PAYMENT_TYPES: {
  BOOKING_DEPOSIT: 'booking_deposit',
  FULL_PAYMENT: 'full_payment',
  ORDER_PAYMENT: 'order_payment'
}
```

### Backend Integration (To be implemented):

```
POST   /payment/create-vnpay      # Generate payment URL
POST   /payment/vnpay-return      # Handle VNPay callback
POST   /payment/vnpay-notify      # Payment notification
```

## 🧩 Component Usage Examples

### EmptyState

```jsx
<EmptyState
  icon="inbox"
  title="No Data"
  message="Nothing found"
  color="#ff9e6b"
/>
```

### Badge

```jsx
<Badge variant="success" label="Confirmed" />
<Badge variant="danger" label="Cancelled" size="lg" />
```

### ActionButton

```jsx
<ActionButton
  icon="plus"
  label="New Booking"
  onPress={handleCreate}
  color="#ff9e6b"
  size="md"
/>
```

### FilterBar

```jsx
<FilterBar
  filters={[
    { id: "all", label: "All" },
    { id: "paid", label: "Paid" },
  ]}
  activeFilter="all"
  onFilterChange={setFilter}
  variant="chips" // or 'tabs'
/>
```

### Card

```jsx
<Card padding={16} gap={0} style={customStyle}>
  <Text>Content here</Text>
</Card>
```

## ⚙️ API Endpoint Mapping

### Tab Navigation Routes

```
/(tabs)/home          → GET /users/me, /users/bookings
/(tabs)/browse        → GET /users/tables?filters
/(tabs)/bookings      → GET /users/bookings
/(tabs)/orders        → GET /users/orders
/(tabs)/profile       → GET /users/me, PUT /users/profile
```

### User Detail Routes

```
/user/bookings/:id          → GET /users/bookings/:id
/user/bookings-create       → POST /users/bookings
```

## 🎨 Design System

### Colors

```
Primary: #ff9e6b (Orange)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)
Danger: #ef4444 (Red)
Info: #3b82f6 (Blue)
Background: #f9fafb (Light Gray)
Card: #fff (White)
Text Dark: #1f2937
Text Medium: #6b7280
Text Light: #9ca3af
```

### Typography

```
H1: 24px, bold      (Screen titles)
H2: 18px, bold      (Section titles)
Body: 14px, normal  (Content)
Small: 12px, normal (Labels, hints)
Tiny: 11px, normal  (Helper text)
```

### Spacing

```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 20px
xxl: 24px
```

## 📊 Component Hierarchy

```
App
├── (tabs)
│   ├── home
│   │   ├── SectionHeader
│   │   ├── HomeCard
│   │   ├── ActionButton
│   │   ├── BookingCard
│   │   └── Card
│   ├── browse
│   │   ├── SectionHeader
│   │   ├── FilterBar
│   │   ├── TableCard
│   │   └── EmptyState
│   ├── bookings
│   │   ├── FilterBar
│   │   ├── BookingCard
│   │   ├── EmptyState
│   │   └── FAB
│   ├── orders
│   │   ├── FilterBar
│   │   ├── OrderCard
│   │   └── EmptyState
│   └── profile
│       ├── Card
│       ├── FormInput
│       ├── Button
│       └── Badge
├── admin/
└── user/
    └── bookings/
        └── [id]
```

## 🔄 Data Flow

### Booking Flow

```
Browse Tab
  ↓ (Select table)
Booking Create
  ↓ (Fill form)
Payment Screen
  ↓ (Confirm payment)
Bookings Tab / Detail View
```

### Profile Flow

```
Profile Tab (View Mode)
  ↓ (Click Edit)
Profile Tab (Edit Mode)
  ↓ (Save changes)
Profile Tab (View Mode) + Success Alert
```

## 🗑️ Files to Delete (Cleanup)

**Old screens (replaced by tab navigation):**

- `app/screens/Booking.jsx`
- `app/screens/Confirm.jsx`
- `app/screens/Confirmed.jsx`
- `app/screens/Create_qr.jsx`
- `app/screens/Detail.jsx`
- `app/screens/Home.jsx`
- `app/screens/Main.jsx`
- `app/screens/MyBookings.jsx`
- `app/screens/Past.jsx`
- `app/screens/Search.jsx`
- `app/screens/Upcoming.jsx`

**Old tabs (replaced by new bottom navigation):**

- `app/(tabs)/booking.jsx`
- `app/(tabs)/home.jsx` (old version)
- `app/(tabs)/search.jsx`

**Old UI components (replaced by common components):**

- `components/ui/BookingCard.jsx` (use user/BookingCard)
- `components/ui/BookingTabs.jsx`
- `components/ui/DateCard.jsx`
- `components/ui/TimeButton.jsx`
- `components/ui/GoogleSignInButton.jsx` (if not needed)

## ✅ Migration Checklist

- [x] Create reusable common components
- [x] Implement bottom navigation layout
- [x] Redesign all 5 tab screens
- [x] Add VNPay payment integration
- [x] Extract ActionButton component
- [x] Create PaymentModal component
- [ ] Backend: Implement VNPay endpoints
- [ ] Backend: Add payment status tracking
- [ ] Test payment flow with VNPay sandbox
- [ ] Delete old screen files
- [ ] Delete old tab files
- [ ] Update navigation links
- [ ] Test all navigation flows
- [ ] Performance optimization
- [ ] User testing

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm start
# Select platform: ios, android, or web
```

### 3. Test Payment Integration

```bash
# Run backend
cd backend
npm run dev

# Test VNPay sandbox
# Visit: https://sandbox.vnpayment.vn
```

### 4. Navigate

```
http://localhost:8081 → App opens in simulator
Bottom nav shows: Home | Browse | Bookings | Orders | Profile
```

## 🔧 Backend Integration

### Required New Endpoints:

```
POST   /payment/create-vnpay
POST   /payment/vnpay-return
POST   /payment/vnpay-notify
PUT    /users/bookings/:id/pay      (Update payment status)
```

### Required Model Updates:

```javascript
// Booking model
paymentStatus: {
  type: String,
  enum: ['pending', 'partial', 'paid', 'failed'],
  default: 'pending'
},
paymentMethod: {
  type: String,
  enum: ['vnpay', 'bank_transfer', 'cash'],
  default: 'cash'
},
depositAmount: Number,
depositPaidAt: Date
```

## 📱 Device Testing

### Recommended Test Cases:

1. Tab navigation smooth transitions
2. Data refresh on tab focus
3. Infinite scroll on long lists
4. Filter functionality
5. Payment modal opening/closing
6. Form validation
7. Error alerts
8. Loading states
9. Empty states
10. Logout flow

## 📚 Documentation Files

- **USER_INTERFACE_GUIDE.md** - Initial user interface documentation
- **ADMIN_INTERFACE_GUIDE.md** - Admin panel documentation
- **This file** - Complete refactoring guide

## 🙋 Support & Questions

For issues or questions:

1. Check component prop types in code
2. Review API endpoint responses
3. Test with backend server running
4. Check console for error logs
5. Refer to this documentation

---

**Last Updated:** March 2026
**Status:** ✅ Ready for Testing
**Next Phase:** Backend VNPay Integration
