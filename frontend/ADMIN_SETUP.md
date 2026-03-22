# Admin Interface Integration Guide

## Quick Start

The admin interface is already built and ready to use! Here's how to integrate it into your app.

## Files Created

### Admin Screens (`frontend/app/admin/`)

- ✅ `_layout.jsx` - Navigation structure
- ✅ `index.jsx` - Dashboard/Home
- ✅ `tables.jsx` - Table management
- ✅ `orders.jsx` - Order management
- ✅ `foods.jsx` - Food/Menu management
- ✅ `bookings.jsx` - Booking management
- ✅ `revenue.jsx` - Revenue & Statistics

### Admin Components (`frontend/components/admin/`)

- ✅ `StatCard.jsx` - Statistics display
- ✅ `ListItem.jsx` - List item component
- ✅ `FormInput.jsx` - Form input component
- ✅ `AdminHeader.jsx` - Header with navigation

## How to Access Admin Panel

### Option 1: Direct Route

Add a button to navigate to admin panel in your app:

```jsx
import { router } from "expo-router";

// In any screen
<TouchableOpacity onPress={() => router.push("/admin")}>
  <Text>Admin Panel</Text>
</TouchableOpacity>;
```

### Option 2: Add to User Profile

Add admin access from profile screen:

```jsx
// frontend/app/screens/Profile.jsx
import { router } from "expo-router";

export default function Profile() {
  const handleAdminAccess = () => {
    const isAdmin = userRole === "admin";
    if (isAdmin) {
      router.push("/admin");
    } else {
      Alert.alert("Access Denied", "Only admins can access this area");
    }
  };

  return (
    <View>
      {/* ... profile content ... */}
      {isAdmin && (
        <TouchableOpacity onPress={handleAdminAccess}>
          <Text>Admin Panel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

### Option 3: Add via Tab Navigation

Add admin panel as a tab (if you have tab navigation):

```jsx
// frontend/app/(tabs)/_layout.jsx
<BottomTab.Screen
  name="admin"
  component={AdminScreen}
  options={{
    title: "Admin",
    tabBarIcon: ({ color }) => <Ionicons name="settings" color={color} />,
  }}
/>
```

## Admin Interface Workflow

### 1. Dashboard Overview

```
/admin → Shows key metrics and navigation menu
```

### 2. Table Management

```
/admin/tables
├── View all tables
├── Add new table (modal form)
├── Update table status
└── Delete tables
```

### 3. Order Management

```
/admin/orders
├── View all orders
├── Update order status (pending → completed)
├── Mark payment status
└── View order details
```

### 4. Food Management

```
/admin/foods
├── View all menu items
├── Add new food (modal form)
├── Update food properties
└── Delete food items
```

### 5. Booking Management

```
/admin/bookings
├── View all reservations
├── Update booking status
├── Cancel bookings
└── View guest information
```

### 6. Revenue Analysis

```
/admin/revenue
├── View total revenue
├── Filter by period (day/week/month)
├── View order metrics
└── Check success rates
```

## Backend Endpoint Requirements

Make sure your backend has these endpoints:

### Tables

- ✅ `GET /api/admin/tables/status` - Get all tables
- ✅ `POST /api/admin/tables` - Create table
- ✅ `PUT /api/admin/tables/:tableId` - Update table
- ✅ `DELETE /api/admin/tables/:tableId` - Delete table

### Orders

- ✅ `GET /api/admin/orders/stats` - Get statistics
- ✅ `PUT /api/admin/orders/:orderId/status` - Update status
- ✅ `PUT /api/admin/orders/:orderId/pay` - Mark paid
- ✅ `POST /api/admin/orders` - Create order

### Foods

- ✅ `GET /api/admin/foods` - Get all foods
- ✅ `POST /api/admin/foods` - Create food
- ✅ `PUT /api/admin/foods/:foodId` - Update food
- ✅ `DELETE /api/admin/foods/:foodId` - Delete food

### Bookings

- ⚠️ Need to add: `GET /api/admin/bookings` - Get all bookings
- ✅ `PUT /api/admin/bookings/:bookingId/status` - Update status
- ✅ `PUT /api/admin/bookings/:bookingId/cancel` - Cancel booking

### Revenue

- ✅ `GET /api/admin/revenue` - Get revenue data
- ✅ `GET /api/admin/orders/stats` - Get order stats

## Authentication

All admin endpoints require:

```javascript
headers: {
  Authorization: `Bearer ${accessToken}`;
}
```

And the user must have `role: 'admin'` in the backend.

## Component Usage Examples

### Using StatCard

```jsx
import StatCard from "@/components/admin/StatCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";

<StatCard
  title="Total Revenue"
  value="₫50M"
  icon={(props) => <MaterialCommunityIcons name="currency-usd" {...props} />}
  color="#10b981"
/>;
```

### Using ListItem

```jsx
import ListItem from "@/components/admin/ListItem";

<ListItem
  title="Table 1"
  subtitle="Capacity: 4 - Standard"
  status="available"
  onPress={() => console.log("Pressed")}
  onEdit={() => console.log("Edit")}
  onDelete={() => console.log("Delete")}
/>;
```

### Using FormInput

```jsx
import FormInput from "@/components/admin/FormInput";

<FormInput
  label="Table Number"
  placeholder="e.g., 1"
  value={tableNumber}
  onChangeText={setTableNumber}
  keyboardType="numeric"
/>;
```

### Using AdminHeader

```jsx
import AdminHeader from "@/components/admin/AdminHeader";

<AdminHeader
  title="Tables"
  onAdd={() => setModalVisible(true)}
  onFilter={() => handleFilter()}
  onSearch={() => handleSearch()}
/>;
```

## Styling Consistency

The admin interface uses the same design system as your app:

- **Primary Color**: `#ff9e6b` (orange)
- **Background**: `#f9fafb` (light gray)
- **Text Dark**: `#1f2937`
- **Borders**: `#e5e7eb`

All components follow React Native best practices and use `StyleSheet` for performance.

## Testing the Admin Interface

1. **Prerequisites**
   - Backend running on `http://192.168.1.9:5001`
   - User with `role: 'admin'`
   - Valid authentication token

2. **Test Steps**

   ```bash
   # Start development server
   npm start

   # Navigate to admin
   # http://localhost:8081/admin (web)
   # or use navigation in app
   ```

3. **Test Each Section**
   - Add new table → Verify in list
   - Add new food → Verify in list
   - Update order status → Check update
   - View revenue → Check calculations

## Common Issues & Solutions

### Issue: "Cannot find admin endpoint"

**Solution**: Make sure backend has the admin controller and routes

### Issue: "Not authorized to access"

**Solution**: Check if logged-in user has `role: 'admin'`

### Issue: "Data not updating"

**Solution**: Make sure to call `fetchData()` after mutations

### Issue: "Token expired"

**Solution**: Implement token refresh in Axios interceptor

## Next Steps

1. ✅ Admin interface is ready to use
2. ⏳ Add admin access button to profile screen
3. ⏳ Test with admin user account
4. ⏳ Create bookings listing endpoint (optional enhancement)
5. ⏳ Add admin role check middleware

## File Structure Summary

```
frontend/
├── app/
│   └── admin/                    # NEW Admin Section
│       ├── _layout.jsx
│       ├── index.jsx
│       ├── tables.jsx
│       ├── orders.jsx
│       ├── foods.jsx
│       ├── bookings.jsx
│       └── revenue.jsx
│
├── components/
│   └── admin/                    # NEW Admin Components
│       ├── StatCard.jsx
│       ├── ListItem.jsx
│       ├── FormInput.jsx
│       └── AdminHeader.jsx
│
└── ADMIN_INTERFACE_GUIDE.md     # NEW Documentation
```

## Support

For issues or questions:

1. Check `ADMIN_INTERFACE_GUIDE.md` for detailed component docs
2. Review screen implementations for usage examples
3. Verify backend endpoints match API documentation
4. Check token and authentication setup

---

**Version**: 1.0.0
**Created**: March 2026
**Stack**: React Native (Expo), Axios, AsyncStorage
