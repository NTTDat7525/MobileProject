# User Interface Guide

## Overview

The user interface provides customers with a complete booking and order management system, matching the admin interface design language for consistency.

## Structure

```
frontend/app/user/
├── _layout.jsx          # Stack navigation for user section
├── index.jsx            # Dashboard with stats and quick actions
├── profile.jsx          # User profile management
├── bookings.jsx         # Browse and manage bookings
├── bookings-create.jsx  # Create new booking form
├── bookings/[id].jsx    # Booking details and management
├── orders.jsx           # Browse user orders
└── tables.jsx           # Browse available tables

frontend/components/user/
├── UserHeader.jsx       # Header with back button and actions
├── TableCard.jsx        # Table display with selection
├── BookingCard.jsx      # Booking display in lists
└── OrderCard.jsx        # Order display with payment status
```

## Screens

### User Dashboard (`/user`)

**Purpose:** Main landing screen showing user overview and quick access to features

**Components:**

- UserHeader with logout button
- Welcome greeting (user name)
- Statistics tiles: Upcoming, Completed, Total bookings
- Quick action grid: New Booking, Browse Tables, My Bookings, My Orders
- Recent bookings preview (3 latest)
- User info card with profile link

**Data Flow:**

- GET `/users/me` → Fetch user profile
- GET `/users/bookings` → Calculate stats and show recent bookings
- Stats: Count upcoming (bookingDate > now), completed (status='completed')

**Features:**

- Cards with colored icons for visual hierarchy
- Logout confirmation alert
- Focus-based auto-refresh when returning from other screens
- Empty state when no bookings

**Key Code:**

```jsx
const { upcomingBookings, completedBookings, totalBookings } =
  calculateStats(bookings);
// Display recent 3 bookings
// Navigate to booking creation or profile edit
```

### My Profile (`/user/profile`)

**Purpose:** View and edit user profile information

**Sections:**

1. Account Information (read-only)
   - Username
   - Email
   - Role
   - Member Since

2. Edit Profile (editable)
   - Display Name
   - Phone
   - Bio

3. Account Security
   - Logout button

**Data Flow:**

- GET `/users/me` → Load current profile
- PUT `/users/profile` → Save profile changes

**Validation:**

- Display name: Optional
- Phone: Valid format (optional)
- Bio: Optional multiline text

**Features:**

- Pre-filled form with current data
- Cancel/Save buttons
- Logout confirmation
- Success/error alerts
- Loading state during fetch/update

**API Integration:**

```jsx
await axios.put(
  `/users/profile`,
  {
    displayName: "",
    bio: "",
    phone: "",
  },
  { headers: { Authorization: `Bearer token` } },
);
```

### My Bookings (`/user/bookings`)

**Purpose:** Browse all bookings with filtering and management

**Filter Tabs:**

- **All:** All bookings
- **Upcoming:** bookingDate > now AND status != 'cancelled'
- **Completed:** status = 'completed'
- **Cancelled:** status = 'cancelled'

**Features:**

- BookingCard list for each booking
- Cancel button for pending/confirmed bookings
- Confirmation alert before cancellation
- Empty state with "Create Booking" button
- Auto-refresh after cancel action

**Data Flow:**

- GET `/users/bookings` → Fetch all user bookings
- PUT `/users/bookings/:id/cancel` → Cancel booking with reason

**Filtering Logic:**

```jsx
const filtered = bookings.filter((b) => {
  if (filter === "upcoming")
    return new Date(b.bookingDate) > now && b.status !== "cancelled";
  if (filter === "completed") return b.status === "completed";
  if (filter === "cancelled") return b.status === "cancelled";
  return true;
});
```

**Key Features:**

- Swipe-based cancel action (optional enhancement)
- Confirmation alert with cancellation reason
- Real-time list update after cancel
- Navigation to booking detail view

---

### Create Booking (`/user/bookings-create`)

**Purpose:** Create new booking with table selection

**Step 1: Table Selection**

- Navigated from `/tables` with `tableId` in params
- Shows selected table info (optional)

**Step 2: Booking Form**
**Required Fields:**

- **Booking Date** (YYYY-MM-DD format)
- **Number of Guests** (1-30 minimum)
- **Occasion** (radio buttons):
  - Regular
  - Birthday
  - Anniversary
  - Business
  - Family Gathering

**Guest Information** (auto-filled from profile):

- Name
- Email
- Phone

**Optional:**

- Special Requests (multiline text)

**Validation:**

- Date: Required, cannot be in past
- Guests: Required, 1-30 range
- Date/guests validated with error alerts

**Data Flow:**

- GET `/users/me` → Auto-fill guest info
- POST `/users/bookings` → Create booking

**Features:**

- Pre-filled guest info from profile
- Date picker (native)
- Number input with stepper
- Occasion selection as radio buttons
- Form validation with field-level errors
- Success confirmation with navigation options

**Success Flow:**

```jsx
Alert.alert("Success", "Booking created!", [
  { text: "View", onPress: () => navigate to detail view },
  { text: "Done", onPress: () => navigate to bookings list }
]);
```

---

### Booking Details (`/user/bookings/:id`)

**Purpose:** View complete booking information and manage

**Sections:**

1. **Status Card**
   - Status badge (pending/confirmed/checked-in)
   - Booking ID
   - Color coding: pending (orange), confirmed (green), checked-in (blue)

2. **Booking Information** (Collapsible)
   - Booking Date (formatted with weekday)
   - Time
   - Duration (hours)
   - Number of Guests

3. **Table Information** (Collapsible)
   - Table Number
   - Capacity
   - Location
   - Type (standard/vip/bar/outdoor)

4. **Guest Information** (Collapsible)
   - Name
   - Email
   - Phone

5. **Special Requests** (if present)
   - Full text display

6. **Occasion** (if present)
   - Displayed occasion type

**Data Flow:**

- GET `/users/bookings/:id` → Fetch complete booking details

**Actions (Conditional):**

- **Edit** button (only for pending status)
- **Cancel** button (for pending/confirmed status)

**Features:**

- Collapsible sections with expand/collapse
- Icon + label + value info rows
- Date formatting with full weekday (vi-VN locale)
- Status-specific action availability
- Auto-refresh on screen focus

**Date Formatting:**

```jsx
new Date(bookingDate).toLocaleDateString("vi-VN", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
// Output: "Thứ Năm, 20 tháng 1 năm 2025"
```

---

### My Orders (`/user/orders`)

**Purpose:** Browse and filter user orders with payment status

**Statistics Section:**

- **Total:** All orders count
- **Paid:** paymentStatus = 'paid'
- **Unpaid:** paymentStatus = 'unpaid' or 'partial'

**Filter Tabs:**

- **All:** All orders
- **Paid:** paymentStatus = 'paid'
- **Unpaid:** paymentStatus = 'unpaid'

**Features:**

- OrderCard display for each order
- OrderCard shows: Order number, date, items count, total, payment status
- Empty state message
- Stat boxes with filtered counts

**Data Flow:**

- GET `/users/orders` → Fetch all user orders

**Order Card Details:**

```jsx
<OrderCard
  orderNumber={order._id}
  date={order.createdAt}
  itemCount={order.orderItems.length}
  total={order.totalAmount}
  paymentStatus={order.paymentStatus}
/>
```

---

### Browse Tables (`/user/tables`)

**Purpose:** Browse available tables and select for booking

**Filters:**

- **Type Filter:** Buttons for All, standard, vip, bar, outdoor
- **Capacity Filter:** Input for minimum guests needed
- **Search Button:** Apply filters

**Table Display:**

- TableCard component for each available table
- Shows: Table number, capacity, type, location, features (window, wheelchair)
- Status badge (available, occupied, reserved, maintenance)
- Select button to choose table

**Data Flow:**

- GET `/users/tables?type=X&capacity=Y` → Fetch filtered tables

**Features:**

- Multi-filter with type and capacity
- Selected table indication
- Navigation to booking creation with selected tableId
- Empty state for no results
- Real-time filter application

**Filter Logic:**

```jsx
// Apply filters
if (type !== 'all') params.type = type;
if (capacity) params.capacity = capacity;

// Fetch with params
GET /users/tables?type=vip&capacity=4
```

---

## Components

### UserHeader

**Props:**

- `title` (string): Screen title
- `showBack` (boolean): Show back button
- `onBack` (function): Back button callback
- `rightAction` (function): Right button callback
- `rightActionIcon` (string): Icon name for right button

**Usage:**

```jsx
<UserHeader
  title="My Bookings"
  showBack
  onBack={() => router.back()}
  rightAction={handleFilter}
  rightActionIcon="filter"
/>
```

---

### BookingCard

**Props:**

- `booking` (object): Booking data
- `onPress` (function): Card tap callback
- `onCancel` (function): Cancel button callback
- `showCancel` (boolean): Show cancel button

**Displays:**

- Date and time
- Guest count
- Status badge
- Booking ID

**Usage:**

```jsx
<BookingCard
  booking={booking}
  onPress={() => navigate to detail}
  onCancel={() => confirmCancel}
  showCancel={isPending || isConfirmed}
/>
```

---

### TableCard

**Props:**

- `table` (object): Table data
- `onSelect` (function): Select button callback
- `selected` (boolean): Is table selected

**Displays:**

- Table number
- Capacity and type
- Location and features
- Status badge
- Select button

**Usage:**

```jsx
<TableCard
  table={table}
  onSelect={() => navigate to booking create}
  selected={table._id === selectedTableId}
/>
```

---

### OrderCard

**Props:**

- `order` (object): Order data
- `onPress` (function): Optional detail view callback

**Displays:**

- Order number (abbreviated)
- Order date
- Item count
- Total amount
- Payment status badge

**Usage:**

```jsx
<OrderCard
  order={order}
  onPress={() => navigate to order detail}
/>
```

---

## Navigation Flow

```
Dashboard
├── Edit Profile → Profile Screen
├── New Booking → Table Browse → Booking Create → Detail
└── My Bookings → Booking List → Detail
    ├── Edit (pending only) → Edit Form
    └── Cancel (pending/confirmed)

Quick Actions:
├── New Booking → Table Browse → Booking Create
├── Browse Tables → Table List → Booking Create
├── My Bookings → Booking List
└── My Orders → Order List
```

---

## API Endpoints Integration

### User Endpoints

```
GET    /users/me                          → Profile and stats
PUT    /users/profile                     → Update profile
GET    /users/bookings                    → All bookings (with filter param)
GET    /users/bookings/:id                → Booking detail
POST   /users/bookings                    → Create booking
PUT    /users/bookings/:id                → Update booking
PUT    /users/bookings/:id/cancel         → Cancel booking
GET    /users/tables                      → Browse tables (with filters)
GET    /users/tables/:id                  → Table detail
GET    /users/orders                      → All orders (with filter param)
GET    /users/orders/:id                  → Order detail
```

---

## Authentication & Token Management

All requests include Authorization header:

```jsx
const token = await AsyncStorage.getItem("accessToken");
headers: {
  Authorization: `Bearer ${token}`;
}
```

**Token Storage:**

- `accessToken`: Short-lived (30 minutes)
- `refreshToken`: Long-lived (14 days)
- Stored in AsyncStorage for persistence
- Auto-refresh on 401 response (future implementation)

---

## Color Scheme

| Element     | Color   | Usage                      |
| ----------- | ------- | -------------------------- |
| Primary     | #ff9e6b | Buttons, icons, highlights |
| Background  | #f9fafb | Screen background          |
| Card        | #fff    | Card backgrounds           |
| Border      | #e5e7eb | Dividers, borders          |
| Dark Text   | #1f2937 | Main text                  |
| Medium Text | #6b7280 | Secondary text             |
| Light Text  | #9ca3af | Labels, hints              |
| Success     | #10b981 | Confirmed, completed       |
| Info        | #3b82f6 | Info, upcoming             |
| Warning     | #f59e0b | Pending, attention         |
| Danger      | #ef4444 | Cancelled, errors          |

---

## Status Indicators

**Booking Status:**

- **Pending** → Orange (#f59e0b) - Awaiting confirmation
- **Confirmed** → Green (#10b981) - Booking confirmed
- **Checked-in** → Blue (#3b82f6) - Guest checked in
- **Completed** → Green (#10b981) - Booking finished
- **Cancelled** → Red (#ef4444) - Booking cancelled

**Payment Status:**

- **Paid** → Green (#10b981)
- **Unpaid/Partial** → Orange (#f59e0b)
- **Completed** → Green (#10b981)

**Table Status:**

- **Available** → Green
- **Occupied** → Red
- **Reserved** → Orange
- **Maintenance** → Gray

---

## Error Handling

All screens implement:

1. **Loading state** - ActivityIndicator while fetching
2. **Error alerts** - Alert.alert() for failures
3. **Empty states** - Message when no data available
4. **Server validation** - Field error messages from API
5. **Network errors** - Catch and display axios errors

**Example:**

```jsx
try {
  const response = await axios.post(endpoint, data, { headers });
  // Success handling
} catch (error) {
  Alert.alert("Error", error.response?.data?.message || "Request failed");
}
```

---

## Performance Optimization

1. **Focus-based refresh** - Data reloads when screen gains focus (useFocusEffect)
2. **Lazy loading** - Show recent bookings only, "See all" for complete list
3. **Client-side filtering** - Filter already-fetched data without new requests
4. **Image caching** - MaterialCommunityIcons cached by default
5. **Memo optimization** - Reusable cards memoized to prevent re-renders

---

## Future Enhancements

1. **Booking Edit Screen** - Edit pending bookings
2. **Order Detail Screen** - Complete order information
3. **Payment Integration** - Online payment for orders
4. **Notifications** - Push notifications for booking updates
5. **Star Ratings** - Rate restaurants and food
6. **Wishlist** - Save favorite restaurants/tables
7. **Advanced Filters** - Date range, multiple filters
8. **QR Code Check-in** - Scan QR for restaurant entry tracking
9. **Historical View** - Past booking reviews and photos
10. **Integration with Google Maps** - Location display and directions

---

## Testing Checklist

- [ ] Login and verify token storage
- [ ] Dashboard loads profile and bookings
- [ ] Profile edit saves changes correctly
- [ ] Create booking with all field validations
- [ ] Browse tables with filters
- [ ] Cancel booking with confirmation
- [ ] View booking details
- [ ] Browse orders with payment filtering
- [ ] Logout clears tokens
- [ ] Auto-refresh on screen focus
- [ ] Error handling for network failures
- [ ] Loading states appear correctly
- [ ] Navigation flows work properly
- [ ] Date formatting shows correctly
- [ ] Status colors display as designed
