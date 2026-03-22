# Admin Interface Documentation

## Overview

The admin interface provides comprehensive management tools for the restaurant booking system. It's built with React Native and uses only the libraries already installed in the project.

## Project Structure

```
frontend/
├── app/
│   └── admin/
│       ├── _layout.jsx          # Navigation layout for admin screens
│       ├── index.jsx            # Dashboard/Home screen
│       ├── tables.jsx           # Table management
│       ├── orders.jsx           # Order management
│       ├── foods.jsx            # Menu/Food management
│       ├── bookings.jsx         # Booking management
│       └── revenue.jsx          # Revenue & Statistics
│
└── components/
    └── admin/
        ├── StatCard.jsx         # Statistics display component
        ├── ListItem.jsx         # Reusable list item component
        ├── FormInput.jsx        # Reusable form input component
        └── AdminHeader.jsx      # Header with navigation
```

## Components

### StatCard

Displays statistics with title, value, icon, and colored left border.

**Props:**

- `title` (string): Stat title
- `value` (string/number): Stat value
- `icon` (component): Icon component
- `color` (string): Color for the border and icon

**Usage:**

```jsx
<StatCard
  title="Total Revenue"
  value="₫50M"
  icon={(props) => <MaterialCommunityIcons name="currency-usd" {...props} />}
  color="#10b981"
/>
```

### ListItem

Displays list items with title, subtitle, status badge, and action buttons.

**Props:**

- `title` (string): Main title
- `subtitle` (string): Secondary text
- `status` (string): Status badge
- `onPress` (function): Tap handler
- `onEdit` (function): Edit handler
- `onDelete` (function): Delete handler
- `rightContent` (component): Custom right content

**Usage:**

```jsx
<ListItem
  title="Table 1"
  subtitle="Capacity: 4"
  status="available"
  onDelete={() => handleDelete(item._id)}
/>
```

### FormInput

Text input field with label and optional multiline support.

**Props:**

- `label` (string): Input label
- `placeholder` (string): Placeholder text
- `value` (string): Current value
- `onChangeText` (function): Change handler
- `multiline` (boolean): Enable multiline
- `keyboardType` (string): Keyboard type
- `editable` (boolean): Edit state

**Usage:**

```jsx
<FormInput
  label="Table Number"
  placeholder="e.g., 1"
  value={tableNumber}
  onChangeText={setTableNumber}
/>
```

### AdminHeader

Header component with back button, title, and action buttons.

**Props:**

- `title` (string): Header title
- `onAdd` (function): Add button handler
- `onFilter` (function): Filter button handler
- `onSearch` (function): Search button handler

**Usage:**

```jsx
<AdminHeader
  title="Tables"
  onAdd={() => setModalVisible(true)}
  onFilter={() => {}}
/>
```

## Screens

### 1. Dashboard (index.jsx)

Main admin panel showing:

- Quick statistics (revenue, tables, orders)
- Menu grid with quick access to all management screens
- Refresh data button

**Features:**

- Fetches data from multiple endpoints
- Displays real-time stats
- Quick navigation to management screens

### 2. Tables Management (tables.jsx)

Manage restaurant tables:

- **View**: List all tables with status indicators
- **Add**: Create new table with capacity, type, location
- **Delete**: Remove tables

**Endpoints Used:**

- `GET /api/admin/tables/status` - Get all tables
- `POST /api/admin/tables` - Create table
- `DELETE /api/admin/tables/:tableId` - Delete table
- `PUT /api/admin/tables/:tableId` - Update table

**Status Colors:**

- Green: Available
- Orange: Occupied
- Blue: Reserved
- Red: Maintenance

### 3. Orders Management (orders.jsx)

Track and manage orders:

- **View**: List all orders with status and total
- **Update**: Change order status (pending → preparing → ready → served → completed)
- **Payment**: Mark orders as paid

**Endpoints Used:**

- `GET /api/admin/orders/stats` - Get order statistics
- `PUT /api/admin/orders/:orderId/status` - Update status
- `PUT /api/admin/orders/:orderId/pay` - Mark as paid

**Order Statuses:**

- pending (orange)
- preparing (orange)
- ready (orange)
- served (orange)
- completed (green)
- cancelled (red)

### 4. Foods Management (foods.jsx)

Manage menu items:

- **View**: List all foods with price and category
- **Add**: Create new food item with description, category, cuisine, price, spice level
- **Edit**: Update food properties
- **Delete**: Remove food items

**Endpoints Used:**

- `GET /api/admin/foods` - Get all foods
- `POST /api/admin/foods` - Create food
- `PUT /api/admin/foods/:foodId` - Update food
- `DELETE /api/admin/foods/:foodId` - Delete food

**Form Fields:**

- Food Name (required)
- Description
- Category (required)
- Cuisine
- Price (required)
- Spice Level (0-5)

### 5. Bookings Management (bookings.jsx)

Manage customer reservations:

- **View**: List all bookings with guest info and date
- **Update**: Change booking status (pending → confirmed → checked-in → completed)
- **Cancel**: Cancel bookings with reason

**Endpoints Used:**

- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:bookingId/status` - Update status
- `PUT /api/admin/bookings/:bookingId/cancel` - Cancel booking

**Booking Statuses:**

- pending (orange)
- confirmed (blue)
- checked-in (orange)
- completed (green)
- cancelled (red)

### 6. Revenue & Statistics (revenue.jsx)

View financial and operational statistics:

- **Revenue Breakdown**: Total revenue, average order value
- **Order Analytics**: Total, completed, paid, cancelled orders
- **Period Filtering**: View by day, week, or month
- **Success Metrics**: Success rate, cancellation rate

**Endpoints Used:**

- `GET /api/admin/orders/stats?period=month` - Get statistics

**Metrics Displayed:**

- Total Revenue
- Total Orders
- Completed Orders
- Paid Orders
- Cancelled Orders
- Average Order Value
- Success Rate
- Cancellation Rate

## API Integration

All screens use Axios with Bearer token authentication:

```javascript
const token = await AsyncStorage.getItem("accessToken");
const headers = { Authorization: `Bearer ${token}` };
```

### API Base URL

```
http://192.168.1.9:5001/api
```

## Styling

The admin interface uses React Native StyleSheet with consistent design:

**Color Scheme:**

- Primary Orange: `#ff9e6b`
- Dark Text: `#1f2937`
- Light Gray: `#f9fafb`, `#e5e7eb`
- Status Colors:
  - Green (success): `#10b981`
  - Blue (info): `#3b82f6`
  - Orange (warning): `#f59e0b`
  - Red (error): `#ef4444`
  - Purple (accent): `#8b5cf6`

## Usage Examples

### Access Admin Dashboard

```javascript
// From user profile or settings menu
import { router } from "expo-router";

router.push("/admin");
```

### Add a New Table

1. Navigate to Tables screen
2. Tap "Add" button
3. Fill in form (table number, capacity, type, location)
4. Tap "Add Table"
5. Lists updates automatically

### Manage Orders

1. Navigate to Orders screen
2. Tap an order to view details
3. Change status using status buttons
4. Tap "Update" to save

### View Revenue

1. Navigate to Revenue screen
2. Select time period (Day/Week/Month)
3. View statistics in cards
4. Check summary metrics

## Error Handling

All screens include:

- Error alerts with descriptive messages
- Loading indicators during data fetch
- Empty state messages
- Network error handling with try-catch blocks

## Best Practices

1. **Always get token** before API calls:

   ```javascript
   const token = await AsyncStorage.getItem("accessToken");
   ```

2. **Handle errors gracefully**:

   ```javascript
   try {
     // API call
   } catch (error) {
     Alert.alert("Error", error.response?.data?.message);
   }
   ```

3. **Refresh data after mutations**:

   ```javascript
   await axios.post(...);
   fetchData(); // Refresh list
   ```

4. **Use modals for forms**:
   ```javascript
   <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
     {/* Form content */}
   </Modal>
   ```

## Extending the Interface

### Add a new management screen:

1. Create new file in `frontend/app/admin/newfeature.jsx`
2. Import components:
   ```jsx
   import AdminHeader from "@/components/admin/AdminHeader";
   import ListItem from "@/components/admin/ListItem";
   import FormInput from "@/components/admin/FormInput";
   ```
3. Add screen to `_layout.jsx`:
   ```jsx
   <Stack.Screen name="newfeature" />
   ```

### Create custom admin component:

1. Create file in `frontend/components/admin/`
2. Use React Native and existing libraries only
3. Follow component pattern with StyleSheet

## Testing

To test the admin interface:

1. **Ensure backend is running** on `http://192.168.1.9:5001`
2. **Login with admin account**
3. **Navigate to `/admin`**
4. **Test each feature**:
   - Add items
   - Update status
   - Delete items
   - Verify data updates

## Troubleshooting

### Components not showing

- Check token is stored in AsyncStorage
- Verify backend endpoints exist
- Check API_BASE URL is correct

### Actions not working

- Verify admin role is set on user
- Check network connectivity
- Review API error messages in Alert

### Layout issues

- Clear React Native cache: `npm start -- -c`
- Restart development server
- Check StyleSheet styles

---

**Created**: March 2026
**Technology**: React Native (Expo), Axios, AsyncStorage
**Maintained by**: Restaurant System Team
