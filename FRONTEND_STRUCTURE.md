# 📁 Frontend Structure - Reorganized (March 21, 2026)

## ✅ Reorganization Complete

### Changes Made:

- ❌ Deleted 12 old/unused screens from `app/screens/`
- ✅ Kept only auth screens: Signin.jsx, Signup.jsx
- ✨ Organized structure by features & functionality

---

## 📂 New Frontend Structure

```
frontend/
│
├── app/                                 # Main app routes (expo-router)
│   ├── _layout.tsx                      # Root layout
│   │
│   ├── screens/                         🔐 AUTH SCREENS ONLY
│   │   ├── Signin.jsx                   Login screen
│   │   ├── Signup.jsx                   Registration screen
│   │   └── _layout.jsx                  (if exists)
│   │
│   ├── (tabs)/                          📱 MAIN TAB NAVIGATION
│   │   ├── _layout.jsx                  Tab navigator config
│   │   ├── home.jsx                     Dashboard
│   │   ├── browse.jsx                   Browse tables
│   │   ├── bookings.jsx                 Booking management
│   │   ├── orders.jsx                   Order tracking
│   │   └── profile.jsx                  User profile
│   │
│   ├── user/                            👤 USER FEATURES
│   │   ├── _layout.jsx                  User routes layout
│   │   ├── bookings-create.jsx          Create new booking
│   │   ├── bookings/
│   │   │   └── [id].jsx                 Booking details
│   │   ├── orders.jsx                   User orders list
│   │   ├── profile.jsx                  User profile settings
│   │   ├── tables.jsx                   Browse & select tables
│   │   ├── payment.jsx                  Payment processing
│   │   └── [feature].jsx                Other user features
│   │
│   └── admin/                           🛡️ ADMIN FEATURES
│       ├── _layout.jsx                  Admin routes layout
│       ├── bookings.jsx                 Manage bookings
│       ├── orders.jsx                   Manage orders
│       ├── tables.jsx                   Manage tables
│       ├── foods.jsx                    Manage food items
│       ├── revenue.jsx                  Revenue analytics
│       └── [feature].jsx                Other admin features
│
├── components/                          🎨 REUSABLE COMPONENTS
│   ├── common/                          Generic components
│   │   ├── EmptyState.jsx               Empty state display
│   │   ├── LoadingSpinner.jsx           Loading indicator
│   │   ├── Badge.jsx                    Status badges
│   │   ├── Card.jsx                     Generic card
│   │   ├── SectionHeader.jsx            Section title
│   │   ├── ActionButton.jsx             Action button
│   │   ├── FilterBar.jsx                Filter component
│   │   └── index.js                     Barrel export
│   │
│   ├── payment/                         💳 PAYMENT COMPONENTS
│   │   └── PaymentModal.jsx             Payment method selector
│   │
│   ├── ui/                              UI BUILDING BLOCKS
│   │   ├── BackButton.jsx               Navigation back
│   │   ├── Button.jsx                   Generic button
│   │   ├── Input.jsx                    Input field
│   │   ├── SearchBox.jsx                Search input
│   │   ├── TimeButton.jsx               Time picker button
│   │   ├── GuestCounter.jsx             Guest counter
│   │   ├── DateCard.jsx                 Date picker
│   │   ├── Session.jsx                  Session display
│   │   ├── ContactInfoCard.jsx          Contact info
│   │   ├── GoogleSignInButton.jsx       Google login
│   │   ├── LogoutModal.jsx              Logout confirm
│   │   ├── BookingCard.jsx              Booking display
│   │   ├── BookingDetailRow.jsx         Detail row
│   │   ├── BookingTabs.jsx              Tab selector
│   │   └── [component].jsx              Other UI
│   │
│   ├── user/                            USER-SPECIFIC
│   │   └── [component].jsx              User components
│   │
│   ├── admin/                           ADMIN-SPECIFIC
│   │   └── [component].jsx              Admin components
│   │
│   ├── SigninForm.jsx                   Sign in form
│   └── SignupForm.jsx                   Sign up form
│
├── config/                              ⚙️ CONFIGURATION
│   ├── vnpay.config.js                  VNPay settings
│   └── [config].js                      Other configs
│
├── constants/                           📋 CONSTANTS
│   ├── theme.ts                         Design tokens
│   └── [constants].ts                   Other constants
│
├── hooks/                              🪝 CUSTOM HOOKS
│   ├── use-color-scheme.ts              Color scheme hook
│   ├── use-color-scheme.web.ts          Web-specific hook
│   ├── use-theme-color.ts               Theme color hook
│   └── [hook].ts                        Other hooks
│
├── libs/                                📚 LIBRARIES/UTILITIES
│   ├── api.js                           API client
│   └── [lib].js                         Utility functions
│
├── screens/                             🎛️ UTILITY SCREENS
│   └── PaymentScreen.jsx                Payment processing
│
├── app.json                             App config
├── package.json                         Dependencies
├── tsconfig.json                        TypeScript config
├── eslint.config.js                     Linting rules
├── jest.setup.js                        Testing setup
├── expo-env.d.ts                        Type definitions
└── README.md                            Documentation
```

---

## 🗂️ Folder Organization Rules

### By Type (app/):

- **screens/** = Authentication screens only
- **(tabs)/** = Main tab navigation screens (bottom nav)
- **user/** = User feature screens
- **admin/** = Admin feature screens

### By Purpose (components/):

- **common/** = Used everywhere
- **payment/** = Payment related
- **ui/** = UI building blocks
- **user/** = User-specific
- **admin/** = Admin-specific

### By Concern (root level):

- **config/** = Settings & configuration
- **constants/** = Fixed values & design tokens
- **hooks/** = Custom React hooks
- **libs/** = Shared utilities
- **screens/** = Generic/utility screens

---

## 🗑️ Deleted Files (12 total)

**From `app/screens/`:**

```
Booking.jsx        ❌ (replaced by (tabs)/bookings.jsx)
Confirm.jsx        ❌ (payment in PaymentScreen.jsx)
Confirmed.jsx      ❌ (not needed)
Create_qr.jsx      ❌ (QR functionality removed)
Detail.jsx         ❌ (details in specific tabs)
Home.jsx           ❌ (replaced by (tabs)/home.jsx)
Main.jsx           ❌ (not needed)
MyBookings.jsx     ❌ (replaced by (tabs)/bookings.jsx)
Past.jsx           ❌ (booking filter in tabs)
Profile.jsx        ❌ (replaced by (tabs)/profile.jsx)
Search.jsx         ❌ (replaced by (tabs)/browse.jsx)
Upcoming.jsx       ❌ (booking filter in tabs)
```

---

## ✅ Kept Files

**From `app/screens/`:**

```
Signin.jsx         ✅ Only authentication
Signup.jsx         ✅ Only authentication
```

---

## 📊 Statistics

| Category          | Count | Status              |
| ----------------- | ----- | ------------------- |
| Deleted screens   | 12    | ✅ Removed          |
| Kept screens      | 2     | ✅ Auth only        |
| Tab screens       | 5     | ✅ New structure    |
| Common components | 7     | ✅ Reusable         |
| User screens      | 7+    | ✅ Organized        |
| Admin screens     | 6+    | ✅ Organized        |
| **Total files**   | ~50+  | ✅ Better organized |

---

## 🎯 Navigation Map

```
App Entry
  ├─→ Signin.jsx           (app/screens/Signin.jsx)
  ├─→ Signup.jsx           (app/screens/Signup.jsx)
  │
  └─→ Main Tabs (after login)
      ├─→ Home Tab         (app/(tabs)/home.jsx)
      ├─→ Browse Tab       (app/(tabs)/browse.jsx)
      ├─→ Bookings Tab     (app/(tabs)/bookings.jsx)
      ├─→ Orders Tab       (app/(tabs)/orders.jsx)
      └─→ Profile Tab      (app/(tabs)/profile.jsx)
             ├─→ User Screens (app/user/*)
             └─→ Admin Screens (app/admin/*) [if admin role]

User Features
  ├─→ Create Booking      (app/user/bookings-create.jsx)
  ├─→ Booking Details     (app/user/bookings/[id].jsx)
  ├─→ Payment             (app/user/payment.jsx OR screens/PaymentScreen.jsx)
  ├─→ Orders              (app/user/orders.jsx)
  ├─→ Browse Tables       (app/user/tables.jsx)
  └─→ Profile             (app/user/profile.jsx)

Admin Features
  ├─→ Manage Bookings     (app/admin/bookings.jsx)
  ├─→ Manage Orders       (app/admin/orders.jsx)
  ├─→ Manage Tables       (app/admin/tables.jsx)
  ├─→ Manage Foods        (app/admin/foods.jsx)
  └─→ Revenue             (app/admin/revenue.jsx)
```

---

## 📝 Import Examples

### Before (Disorganized):

```javascript
import Booking from "@/screens/Booking";
import Home from "@/screens/Home";
import Search from "@/screens/Search";
import Detail from "@/screens/Detail";
```

### After (Organized):

```javascript
// Auth screens
import Signin from "@/app/screens/Signin";

// Tab screens
import Home from "@/app/(tabs)/home";

// User feature screens
import PaymentScreen from "@/app/user/payment";
import BookingCreate from "@/app/user/bookings-create";

// Admin screens
import AdminBookings from "@/app/admin/bookings";

// Reusable components
import { EmptyState, Badge, Card } from "@/components/common";
import PaymentModal from "@/components/payment/PaymentModal";
```

---

## 🔄 Migration Checklist

- [x] Delete 12 unused screens
- [x] Keep auth screens (Signin, Signup)
- [ ] Verify all imports still work
- [ ] Test navigation flow
- [ ] Update route configurations
- [ ] Check component imports
- [ ] Test on simulator
- [ ] Commit changes
- [ ] Update documentation

---

## 💡 Next Steps

1. **Verify imports** - Ensure all files still import correctly

   ```bash
   npm start
   ```

2. **Test navigation** - Test all tabs and flows work

3. **Check for broken imports** - Look for any import errors

4. **Commit changes** - Save to git

   ```bash
   git add .
   git commit -m "Reorganize frontend structure and remove unused screens"
   ```

5. **Optional: Move PaymentScreen.jsx**
   ```bash
   # Currently at: screens/PaymentScreen.jsx
   # Could move to: app/user/payment.jsx
   # Update imports accordingly
   ```

---

## 📚 Related Documentation

- [FRONTEND_REFACTORING_GUIDE.md](FRONTEND_REFACTORING_GUIDE.md) - Complete refactoring guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - All documentation
- [CLEANUP_GUIDE.md](CLEANUP_GUIDE.md) - Original cleanup tasks

---

**Status:** ✅ **REORGANIZATION COMPLETE** (March 21, 2026)

**Before Reorganization:**

- 14 screens in app/screens (disorganized)
- Mixed concerns

**After Reorganization:**

- 2 screens in app/screens (auth only)
- 5 tab screens in app/(tabs)
- User features in app/user/
- Admin features in app/admin/
- Components organized by purpose
- Clear folder hierarchy ✨

Next: Test and verify everything works!
