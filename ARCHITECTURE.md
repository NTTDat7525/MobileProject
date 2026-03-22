# Frontend Architecture & Component Diagram

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       App Entry                             │
│                    app/_layout.tsx                          │
└────────────────────────────┬────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
        ┌───────▼────────┐       ┌───────▼────────┐
        │   Auth Screens │       │  (tabs) Layout │
        │ Signin/Signup  │       │  Bottom NavBar │
        └────────────────┘       └───────┬────────┘
                                         │
        ┌────────────┬─────────┬─────────┼─────────┬────────┐
        │            │         │         │         │        │
   ┌────▼──┐  ┌─────▼──┐ ┌────▼──┐ ┌─────▼──┐ ┌──▼────┐ ┌──▼──┐
   │ Home  │  │Browse  │ │Bookings│ │Orders  │ │Profile│ │Admin│
   │ Tab   │  │ Tab    │ │ Tab    │ │ Tab    │ │ Tab   │ │Tab* │
   └───┬───┘  └────┬───┘ └───┬────┘ └────┬───┘ └───┬───┘ └──────┘
       │           │         │           │         │
       │     Common Components Library   │         │
       │     ┌──────────────────────┐    │         │
       └─────┤ EmptyState           │◄───┴─────────┘
       │     │ LoadingSpinner       │    │
       │     │ Badge               │    │ (User Detail Screens)
       │     │ Card                │    │
       │     │ SectionHeader       │    │ bookings/[id]
       │     │ ActionButton        │    │ bookings-create
       │     │ FilterBar           │    ├─────────────────
       │     └──────────────────────┘    │
       │                                 │
       └─────────────┬───────────────────┘
                     │
              ┌──────▼─────────┐
              │ Shared Utils   │
              ├────────────────┤
              │ Hooks          │
              │ Constants      │
              │ Config         │
              └────────────────┘
```

## 🧩 Component Hierarchy

### Home Tab Hierarchy

```
Home Screen
├── Header (Welcome)
├── Stats Row
│   ├── StatTile (Upcoming)
│   ├── StatTile (Completed)
│   └── StatTile (Total)
├── Quick Actions (Section)
│   ├── ActionButton (New Booking)
│   ├── ActionButton (Browse)
│   ├── ActionButton (My Bookings)
│   └── ActionButton (My Orders)
├── Recent Bookings (Section)
│   └── BookingCard (x3)
└── User Info Card
    └── Inforow (Email)
    └── Inforow (Phone)
    └── Inforow (Bio)
```

### Browse Tab Hierarchy

```
Browse Screen
├── Header
├── Section (Type Filter)
│   └── FilterBar (chips variant)
├── Section (Filters)
│   └── Card
│       ├── FormInput (Capacity)
│       └── FormInput (Date)
├── Results Info
└── FlatList
    └── TableCard (x many)
        ├── Table Info
        ├── Features
        └── Select Button
```

### Bookings Tab Hierarchy

```
Bookings Screen
├── Header
├── FilterBar (tabs variant)
├── Stats Row
│   ├── StatBox (Total)
│   ├── StatBox (Upcoming)
│   └── StatBox (Completed)
└── FlatList
    └── BookingCard (x many)
        ├── Date/Time
        ├── Guests
        ├── Status Badge
        └── Cancel Button
└── FAB (New Booking)
```

### Orders Tab Hierarchy

```
Orders Screen
├── Header
├── Stats Grid
│   ├── StatCard (Total)
│   ├── StatCard (Paid)
│   └── StatCard (Unpaid)
├── FilterBar (tabs variant)
└── FlatList
    └── OrderCard (x many)
        ├── Order Number
        ├── Items & Total
        ├── Payment Status Badge
```

### Profile Tab Hierarchy

```
Profile Screen
├── Header (Avatar)
├── Account Section (Read-only)
│   └── Card
│       ├── InfoRow (Username)
│       ├── InfoRow (Email)
│       └── InfoRow (Member Since)
├── Profile Section (Edit Mode)
│   └── Card
│       ├── FormInput (Display Name)
│       ├── FormInput (Phone)
│       ├── FormInput (Bio)
│       └── Buttons (Cancel/Save)
├── Preferences Section
│   └── Card
│       ├── Pref Row (Notifications)
│       ├── Pref Row (Privacy)
│       └── Pref Row (Help)
└── Logout Button
```

## 🔄 Data Flow Diagram

### Booking Creation Flow

```
Home/Browse Screen
        │
        ├─ Select Table
        │   ├─ GET /users/tables/:id
        │   └──► TableCard Display
        │
        ├─ New Booking Button
        │   └──► Navigate to Create Screen
        │
Create Booking Screen
        │
        ├─ GET /users/me (Pre-fill)
        │
        ├─ Fill Form
        │   ├─ Date
        │   ├─ Guests
        │   └─ Details
        │
        ├─ Submit
        │   ├─ POST /users/bookings
        │   │
        │   ├─ Success
        │   │   ├─ Show Payment Modal
        │   │   │   ├─ Select Method
        │   │   │   └─ Confirm Payment
        │   │   │
        │   │   └─ Navigate to Detail/List
        │   │
        │   └─ Error
        │       └─ Show Alert
```

### Payment Flow

```
Booking Confirmed
        │
        ├─ Show Payment Modal
        │   ├─ Display Options
        │   ├─ Select Method
        │   └─ Confirm
        │
        ├─ If VNPay
        │   ├─ POST /payment/create-vnpay
        │   ├─ Get Payment URL
        │   ├─ Open in Browser/WebView
        │   └─ Return with Status
        │
        ├─ If Bank Transfer
        │   ├─ PUT /users/bookings/:id
        │   ├─ Set Status: "pending"
        │   └─ Show Confirmation
        │
        └─ If Cash
            ├─ PUT /users/bookings/:id
            ├─ Set Status: "pending"
            └─ Show Instructions
```

## 📊 State Management Patterns

### Per-Screen State

```jsx
const [data, setData] = useState([]); // Main data
const [loading, setLoading] = useState(true); // Loading state
const [filter, setFilter] = useState("all"); // Active filter
```

### API Integration

```jsx
useFocusEffect(
  useCallback(() => {
    fetchData(); // Auto-refresh on tab focus
  }, []),
);
```

### Error Handling

```jsx
try {
  const response = await axios.get(url, { headers });
  setData(response.data);
} catch (error) {
  Alert.alert("Error", error.response?.data?.message);
}
```

## 🎨 Design Token System

### Colors

```javascript
const COLORS = {
  primary: "#ff9e6b", // Orange
  success: "#10b981", // Green
  warning: "#f59e0b", // Amber
  danger: "#ef4444", // Red
  info: "#3b82f6", // Blue
  bg: "#f9fafb", // Light Gray
  card: "#fff", // White
  textDark: "#1f2937", // Dark
  textMid: "#6b7280", // Medium
  textLight: "#9ca3af", // Light
};
```

### Typography

```javascript
const FONTS = {
  h1: { size: 24, weight: "bold" }, // Screen titles
  h2: { size: 18, weight: "bold" }, // Section titles
  body: { size: 14, weight: "500" }, // Main content
  small: { size: 12, weight: "500" }, // Labels
  tiny: { size: 11, weight: "500" }, // Helper text
};
```

### Spacing Scale

```javascript
const SPACING = {
  xs: 4, // Small gaps
  sm: 8, // Component internal
  md: 12, // Between elements
  lg: 16, // Section padding
  xl: 20, // Large sections
  xxl: 24, // Screen padding
};
```

## 🔌 API Integration Points

```
Frontend Routes          Backend Endpoints
────────────────────────────────────────────────────
Home Tab            ↔  GET /users/me
                    ↔  GET /users/bookings

Browse Tab          ↔  GET /users/tables
                    ↔  GET /users/tables?type=X&capacity=Y

Bookings Tab        ↔  GET /users/bookings
                    ↔  PUT /users/bookings/:id/cancel

Orders Tab          ↔  GET /users/orders

Profile Tab         ↔  GET /users/me
                    ↔  PUT /users/profile

Detail Views        ↔  GET /users/bookings/:id
                    ↔  GET /users/orders/:id

Create Booking      ↔  GET /users/me
                    ↔  POST /users/bookings

Payment             ↔  POST /payment/create-vnpay
                    ↔  POST /payment/vnpay-return
                    ↔  POST /payment/vnpay-notify
```

## 📦 File Size Reference

```
Component File Sizes:

Large (500+ lines):
├── app/(tabs)/home.jsx          ~250 lines
├── app/(tabs)/profile.jsx       ~300 lines
└── components/payment/*         ~400 lines combined

Medium (200-500 lines):
├── app/(tabs)/browse.jsx        ~180 lines
├── app/(tabs)/bookings.jsx      ~200 lines
├── app/(tabs)/orders.jsx        ~200 lines

Small (<200 lines):
├── components/common/*          ~35-90 lines each
└── UI components                ~30-60 lines each

Best Practice: Keep components < 300 lines
If larger: Break into smaller sub-components
```

## 🔗 Import Patterns

### Common Components (Easy Import)

```jsx
// OLD: Import one by one
import EmptyState from "@/components/common/EmptyState";
import Badge from "@/components/common/Badge";

// NEW: Use index file
import { EmptyState, Badge } from "@/components/common";
```

### Feature Components

```jsx
// Admin components
import StatCard from "@/components/admin/StatCard";

// User components
import BookingCard from "@/components/user/BookingCard";
import TableCard from "@/components/user/TableCard";

// UI components
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
```

### Screens

```jsx
import PaymentScreen from "@/screens/PaymentScreen";
```

## 🚀 Optimization Techniques Used

1. **Component Memoization**
   - Stat cards don't re-render unnecessarily
   - Filter buttons only re-render on filter change

2. **FlatList Optimization**
   - keyExtractor for proper item tracking
   - removeClippedSubviews={true}
   - updateCellsBatchingPeriod={50}

3. **API Call Optimization**
   - Promise.all for parallel requests
   - useFocusEffect only on focus (not on every render)
   - Caching with useState (basic)

4. **Asset Optimization**
   - MaterialCommunityIcons (single bundle)
   - No image assets (icons only)
   - Vector graphics preferred

## 🧪 Testing Points

```
Unit Tests:
├── Components render correctly
├── Props validation
└── Event handlers work

Integration Tests:
├── Tab navigation works
├── API calls succeed
└── Data displays correctly

E2E Tests:
├── Full booking flow
├── Payment process
├── Profile editing
└── Logout flow
```

---

**Architecture Version:** 2.0 (Refactored)  
**Last Updated:** March 2026  
**Status:** ✅ Production Ready
