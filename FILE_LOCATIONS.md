# 🗺️ Frontend File Locations Guide

**Quick Reference for Developers**  
**Updated:** March 21, 2026

---

## 🔍 Find What You Need

### Authentication

```
app/screens/Signin.jsx      ← Login screen
app/screens/Signup.jsx      ← Registration screen
```

### Main Navigation (Bottom Tabs)

```
app/(tabs)/_layout.jsx      ← Tab navigator configuration
app/(tabs)/home.jsx         ← Home/Dashboard
app/(tabs)/browse.jsx       ← Browse & search tables
app/(tabs)/bookings.jsx     ← View bookings
app/(tabs)/orders.jsx       ← View orders
app/(tabs)/profile.jsx      ← User profile
```

### User Features

```
app/user/_layout.jsx                ← User routes config
app/user/index.jsx                  ← User root page
app/user/bookings-create.jsx        ← Create booking
app/user/bookings.jsx               ← View bookings
app/user/bookings/[id].jsx          ← Booking details
app/user/orders.jsx                 ← View orders
app/user/profile.jsx                ← Profile settings
app/user/tables.jsx                 ← Browse tables
app/user/payment.jsx                ← Payment processing ✨ NEW
```

### Admin Features

```
app/admin/_layout.jsx       ← Admin routes config
app/admin/index.jsx         ← Admin dashboard
app/admin/bookings.jsx      ← Manage bookings
app/admin/orders.jsx        ← Manage orders
app/admin/tables.jsx        ← Manage tables
app/admin/foods.jsx         ← Manage menu items
app/admin/revenue.jsx       ← Revenue analytics
```

### Reusable Components

```
components/common/EmptyState.jsx       ← Empty state display
components/common/LoadingSpinner.jsx   ← Loading indicator
components/common/Badge.jsx            ← Status badges
components/common/Card.jsx             ← Card container
components/common/SectionHeader.jsx    ← Section header
components/common/ActionButton.jsx     ← Action buttons
components/common/FilterBar.jsx        ← Filter selector
components/common/index.js             ← Barrel exports

components/payment/PaymentModal.jsx    ← Payment method picker

components/ui/Button.jsx               ← Generic button
components/ui/Input.jsx                ← Text input
components/ui/SearchBox.jsx            ← Search bar
components/ui/TimeButton.jsx           ← Time selector
components/ui/DateCard.jsx             ← Date picker
components/ui/GuestCounter.jsx         ← Guest counter
components/ui/Session.jsx              ← Session display
components/ui/ContactInfoCard.jsx      ← Contact info
components/ui/GoogleSignInButton.jsx   ← Google auth button
components/ui/LogoutModal.jsx          ← Logout confirm
components/ui/BackButton.jsx           ← Back button

components/SigninForm.jsx              ← Sign in form component
components/SignupForm.jsx              ← Sign up form component
```

### Configuration & Constants

```
config/vnpay.config.js                 ← VNPay settings
constants/theme.ts                     ← Colors, typography, spacing
hooks/use-color-scheme.ts              ← Color scheme hook
hooks/use-color-scheme.web.ts          ← Web color scheme hook
hooks/use-theme-color.ts               ← Theme color hook
```

---

## 📍 Where to Add New Features

### I'm adding a new user feature

```
➜ Add screen to: app/user/[feature-name].jsx
➜ Add components to: components/user/
➜ Example: app/user/notifications.jsx
```

### I'm adding admin functionality

```
➜ Add screen to: app/admin/[feature-name].jsx
➜ Add components to: components/admin/
➜ Example: app/admin/statistics.jsx
```

### I'm making a reusable component

```
➜ Add to: components/common/[ComponentName].jsx
➜ Export in: components/common/index.js
➜ Use anywhere: import { ComponentName } from '@/components/common'
```

### I'm adding UI elements

```
➜ Add to: components/ui/[ElementName].jsx
➜ Import from: components/ui/[ElementName]
➜ Example: components/ui/CustomSwitch.jsx
```

---

## 🔗 Import Patterns

### Option 1: Direct Import (Specific)

```javascript
import Signin from "@/app/screens/Signin";
import PaymentModal from "@/components/payment/PaymentModal";
import Button from "@/components/ui/Button";
```

### Option 2: Barrel Import (Common Components)

```javascript
// Import multiple from components/common/index.js
import { EmptyState, Badge, Card, SectionHeader } from "@/components/common";
```

### Option 3: Named Import (If exported as named)

```javascript
import { useColorScheme } from "@/hooks/use-color-scheme";
```

---

## 📊 File Count by Location

| Location            | Type           | Count | Size    |
| ------------------- | -------------- | ----- | ------- |
| app/screens/        | Auth screens   | 2     | 6.2 KB  |
| app/(tabs)/         | Tab screens    | 6     | ~1.5 MB |
| app/user/           | User features  | 9     | 50.9 KB |
| app/admin/          | Admin features | 6     | ~1.2 MB |
| components/common/  | Reusable       | 8     | ~700 KB |
| components/ui/      | UI blocks      | 10+   | ~1.5 MB |
| components/payment/ | Payment        | 1     | ~160 KB |
| config/             | Config         | 1     | ~37 KB  |
| constants/          | Constants      | 1     | -       |
| hooks/              | Custom hooks   | 3     | -       |
| **TOTAL**           |                | ~50+  | ~5 MB   |

---

## 🧭 Navigation Tree

```
📱 App Entry Point
│
├─ 🔐 Authentication
│  ├─ Signin → app/screens/Signin.jsx
│  └─ Signup → app/screens/Signup.jsx
│
├─ 📊 Main Application (After Login)
│  └─ Bottom Tabs → app/(tabs)/_layout.jsx
│     ├─ 🏠 Home → app/(tabs)/home.jsx
│     ├─ 🔍 Browse → app/(tabs)/browse.jsx
│     ├─ 📅 Bookings → app/(tabs)/bookings.jsx
│     ├─ 📦 Orders → app/(tabs)/orders.jsx
│     └─ 👤 Profile → app/(tabs)/profile.jsx
│
├─ 👤 User Features (Conditional Routes)
│  └─ app/user/
│     ├─ home → app/user/index.jsx
│     ├─ browse → app/user/tables.jsx
│     ├─ create → app/user/bookings-create.jsx
│     ├─ booking/:id → app/user/bookings/[id].jsx
│     ├─ payment → app/user/payment.jsx ✨
│     ├─ orders → app/user/orders.jsx
│     └─ profile → app/user/profile.jsx
│
├─ 🛡️ Admin Features (If admin role)
│  └─ app/admin/
│     ├─ home → app/admin/index.jsx
│     ├─ bookings → app/admin/bookings.jsx
│     ├─ orders → app/admin/orders.jsx
│     ├─ tables → app/admin/tables.jsx
│     ├─ foods → app/admin/foods.jsx
│     └─ revenue → app/admin/revenue.jsx
│
└─ 🎨 Components (Used Everywhere)
   ├─ common/ (Reusable across app)
   ├─ payment/ (Payment specific)
   ├─ ui/ (UI building blocks)
   ├─ user/ (User-specific)
   └─ admin/ (Admin-specific)
```

---

## 🔄 Common File Locations Cheat Sheet

**Search for...**  
| I want to... | File location | Shortcut |
|--------------|---------------|----------|
| Login screen | `app/screens/Signin.jsx` | `Signin` |
| Sign up screen | `app/screens/Signup.jsx` | `Signup` |
| Home tab | `app/(tabs)/home.jsx` | `home` |
| Browse tab | `app/(tabs)/browse.jsx` | `browse` |
| Bookings tab | `app/(tabs)/bookings.jsx` | `bookings` |
| Orders tab | `app/(tabs)/orders.jsx` | `orders` |
| Profile tab | `app/(tabs)/profile.jsx` | `profile` |
| Payment screen | `app/user/payment.jsx` | `payment` ✨ |
| Create booking | `app/user/bookings-create.jsx` | `bookings-create` |
| Empty state | `components/common/EmptyState.jsx` | `EmptyState` |
| Loading spinner | `components/common/LoadingSpinner.jsx` | `LoadingSpinner` |
| Status badge | `components/common/Badge.jsx` | `Badge` |
| Card component | `components/common/Card.jsx` | `Card` |
| Button | `components/ui/Button.jsx` | `Button` |
| Text input | `components/ui/Input.jsx` | `Input` |
| Payment modal | `components/payment/PaymentModal.jsx` | `PaymentModal` |
| Colors & design | `constants/theme.ts` | `theme` |
| VNPay config | `config/vnpay.config.js` | `vnpay.config` |

---

## 🚀 Quick Actions

### Find all screens

```bash
# List all screen files
find frontend/app -name "*.jsx" -type f
```

### Find imports of a component

```bash
# Find where PaymentModal is used
grep -r "PaymentModal" frontend/
```

### Check file sizes

```bash
# See size of all screens
ls -lh frontend/app/(tabs)/
ls -lh frontend/app/user/
```

### View directory structure

```bash
# Windows
tree frontend\app /F

# Mac/Linux
tree frontend/app
```

---

## 📝 File Location Quick Copy

```javascript
// Auth
import Signin from "@/app/screens/Signin";
import Signup from "@/app/screens/Signup";

// Tabs
import Home from "@/app/(tabs)/home";
import Browse from "@/app/(tabs)/browse";
import Bookings from "@/app/(tabs)/bookings";
import Orders from "@/app/(tabs)/orders";
import Profile from "@/app/(tabs)/profile";

// User
import Payment from "@/app/user/payment";
import BookingCreate from "@/app/user/bookings-create";
import UserTables from "@/app/user/tables";

// Admin
import AdminBookings from "@/app/admin/bookings";
import AdminOrders from "@/app/admin/orders";

// Common Components
import {
  EmptyState,
  LoadingSpinner,
  Badge,
  Card,
  SectionHeader,
  ActionButton,
  FilterBar,
} from "@/components/common";

import PaymentModal from "@/components/payment/PaymentModal";

// UI Components
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SearchBox from "@/components/ui/SearchBox";
```

---

## 🎯 Organization Summary

✅ **Auth screens** → `app/screens/` (Signin, Signup only)  
✅ **Tab screens** → `app/(tabs)/` (5 main screens)  
✅ **User features** → `app/user/` (bookings, orders, payment, etc.)  
✅ **Admin features** → `app/admin/` (management, analytics)  
✅ **Components** → `components/` (organized by purpose)  
✅ **Config** → `config/` (settings and configuration)  
✅ **Constants** → `constants/` (design tokens)

---

**Happy Coding! 🚀**

_For more details, see [FRONTEND_STRUCTURE.md](FRONTEND_STRUCTURE.md) and [REORGANIZATION_SUMMARY.md](REORGANIZATION_SUMMARY.md)_
