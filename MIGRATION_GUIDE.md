# 🔄 Migration Guide - Updated Models

## Overview

Các model đã được viết lại với nhiều fields mới. Hướng dẫn này giúp bạn cập nhật code để phù hợp với các thay đổi.

---

## 1. User Model Changes

### Old vs New

| Old | New           | Notes                               |
| --- | ------------- | ----------------------------------- |
| N/A | firstName     | **NEW** - Tách riêng từ displayName |
| N/A | lastName      | **NEW** - Tách riêng từ displayName |
| N/A | address       | **NEW** - Nested object             |
| N/A | loginAttempts | **NEW** - Security tracking         |
| N/A | lastLogin     | **NEW** - Audit trail               |
| bio | bio           | ✅ Fixed typo: maxlength            |

### Update AuthController

```javascript
// OLD
await User.create({
  username,
  hashPassword,
  email,
  displayName: firstName + " " + lastName,
  role: role && ["user", "admin"].includes(role) ? role : "user",
});

// NEW - Better
const user = await User.create({
  username,
  hashPassword,
  email,
  displayName: firstName + " " + lastName,
  firstName, // NEW
  lastName, // NEW
  role: role && ["user", "admin"].includes(role) ? role : "user",
});

// After signin - Update lastLogin
user.lastLogin = new Date();
user.loginAttempts = 0; // Reset on success
await user.save();
```

---

## 2. Table Model Changes

### Old vs New

| Old                             | New                                                          | Change                   |
| ------------------------------- | ------------------------------------------------------------ | ------------------------ |
| tableId                         | tableNumber                                                  | Renamed                  |
| type                            | type                                                         | ✅ Enum added            |
| N/A                             | capacity                                                     | **NEW** - Required field |
| N/A                             | location                                                     | **NEW** - Required field |
| N/A                             | features                                                     | **NEW** - Nested object  |
| status: ['available', 'booked'] | status: ['available', 'occupied', 'reserved', 'maintenance'] | ✅ Enhanced              |

### Migration Script

```bash
# MongoDB shell
db.tables.updateMany(
  {},
  [
    {
      $set: {
        tableNumber: "$tableId",
        capacity: 4,  // Default
        location: "indoor",
        features: {
          hasWindow: false,
          hasView: false,
          isHighChairs: false,
          wheelchair: false
        }
      }
    },
    { $unset: ["tableId"] }
  ]
);
```

### Update TableController

```javascript
// Creating table
const table = await Table.create({
  tableNumber, // Use this instead of tableId
  capacity, // NEW - Required
  type,
  location, // NEW - Required
  features: {
    // NEW - Optional
    hasWindow,
    hasView,
    wheelchair,
  },
});

// Finding available tables
// OLD: Table.find({ status: 'available' })
// NEW: Table.find({ status: 'available', capacity: { $gte: numberOfGuests } })
```

---

## 3. Booking Model Changes

### Old vs New

| Old                                           | New                                                                      | Change                           |
| --------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| bookingTime                                   | bookingDate                                                              | Renamed (clear date vs datetime) |
| N/A                                           | numberOfGuests                                                           | **NEW** - Critical field         |
| N/A                                           | guestName                                                                | **NEW** - Denormalization        |
| N/A                                           | guestEmail                                                               | **NEW**                          |
| N/A                                           | guestPhone                                                               | **NEW**                          |
| N/A                                           | checkInTime                                                              | **NEW** - Track actual check-in  |
| N/A                                           | checkOutTime                                                             | **NEW** - Track actual check-out |
| N/A                                           | specialRequests                                                          | **NEW**                          |
| N/A                                           | dietaryRestrictions                                                      | **NEW**                          |
| status: ['pending', 'confirmed', 'cancelled'] | status: ['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'] | ✅ Enhanced                      |

### Migration Script

```bash
# MongoDB shell
db.bookings.updateMany(
  {},
  [
    {
      $set: {
        bookingDate: "$bookingTime",
        numberOfGuests: 4,  // Default
        guestName: "",      // Will need manual update
        guestEmail: "",
        guestPhone: "",
        specialRequests: "$notes",  // Migrate from old field
        dietaryRestrictions: []
      }
    },
    { $unset: ["bookingTime", "notes"] }
  ]
);
```

### Update BookingController

```javascript
// Creating booking
const booking = await Booking.create({
  userId,
  tableId,
  bookingDate, // NEW - Date only (0:00)
  numberOfGuests, // NEW - Very important!
  guestName, // NEW
  guestEmail, // NEW
  guestPhone, // NEW
  specialRequests, // NEW
  dietaryRestrictions, // NEW
  status: "pending",
});

// Finding available tables for booking
// Need to check: capacity >= numberOfGuests
const availableTables = await Table.find({
  $and: [
    { status: "available" },
    { capacity: { $gte: numberOfGuests } },
    { location: { $in: ["indoor", "outdoor"] } },
  ],
});

// Check-in
booking.checkInTime = new Date();
booking.status = "checked-in";
await booking.save();

// Check-out / Complete
booking.checkOutTime = new Date();
booking.status = "completed";
await booking.save();
```

---

## 4. Food Model Changes

### Old vs New - Major Upgrade

| Old              | New            | Change                                  |
| ---------------- | -------------- | --------------------------------------- |
| name             | name           | ✅ Added max 100 chars                  |
| N/A              | description    | **NEW** - Important                     |
| category: String | category: Enum | ✅ Enum: appetizer, soup, main, etc.    |
| price            | price          | ✅ Keep same                            |
| N/A              | discountPrice  | **NEW**                                 |
| N/A              | cuisine        | **NEW** - Enum: vietnamese, asian, etc. |
| N/A              | calories       | **NEW**                                 |
| N/A              | allergens      | **NEW** - Array of allergen types       |
| N/A              | isVegetarian   | **NEW**                                 |
| N/A              | isVegan        | **NEW**                                 |
| N/A              | images         | **NEW** - Array of URLs                 |
| N/A              | rating         | **NEW**                                 |
| N/A              | spiceLevel     | **NEW** - 0-5                           |

### Migration Script

```bash
# MongoDB shell
db.food.updateMany(
  {},
  [
    {
      $set: {
        description: "",
        cuisine: "vietnamese",
        allergens: [],
        isVegetarian: false,
        isVegan: false,
        isGluten: false,
        images: [],
        rating: 0,
        ratingCount: 0,
        preparationTime: 15,
        spiceLevel: 0,
        tags: [],
        status: "active"
      }
    }
  ]
);
```

### Update FoodController

```javascript
// Create food
const food = await Food.create({
  name,
  description, // NEW
  category, // NOW ENUM
  cuisine, // NEW - ENUM
  price,
  discountPrice, // NEW
  calories, // NEW
  allergens, // NEW - Array
  isVegetarian, // NEW
  isVegan, // NEW
  images, // NEW - Array
  spiceLevel, // NEW
  tags, // NEW - Array
  status: "active",
});

// Search by dietary needs
const vegetarianFoods = await Food.find({
  status: "active",
  isAvailable: true,
  isVegetarian: true, // NEW
});

// Search with allergen filter
const noNutsFoods = await Food.find({
  status: "active",
  allergens: { $nin: ["peanuts", "tree nuts"] },
});
```

---

## 5. Order Model Changes

### Old vs New

| Old                        | New                                                                           | Change                               |
| -------------------------- | ----------------------------------------------------------------------------- | ------------------------------------ |
| N/A                        | orderNumber                                                                   | **NEW** - Unique order ID            |
| N/A                        | userId                                                                        | **NEW** - Who placed the order       |
| bookingId                  | bookingId                                                                     | ✅ Keep                              |
| N/A                        | tableId                                                                       | **NEW**                              |
| items[].price              | items[].unitPrice                                                             | Renamed                              |
| N/A                        | items[].foodName                                                              | **NEW** - Denormalization            |
| N/A                        | items[].specialInstructions                                                   | **NEW**                              |
| totalAmount                | totalAmount                                                                   | ✅ Keep                              |
| N/A                        | subtotal                                                                      | **NEW** - Calculate separately       |
| N/A                        | tax                                                                           | **NEW**                              |
| N/A                        | serviceCharge                                                                 | **NEW**                              |
| N/A                        | discount                                                                      | **NEW**                              |
| status: ['paid', 'unpaid'] | status: ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'] | ✅ Major change                      |
| N/A                        | paymentMethod                                                                 | **NEW** - Enum                       |
| N/A                        | paymentStatus                                                                 | **NEW** - Separate from order status |

### Migration Script

```bash
# MongoDB shell
db.orders.updateMany(
  {},
  [
    {
      $set: {
        orderNumber: { $toString: "$_id" },  // Use ObjectId as fallback
        userId: "$userId",  // Must be added manually if missing
        tableId: "$tableId", // Must be added manually if missing
        subtotal: "$totalAmount",
        tax: 0,
        serviceCharge: 0,
        discount: 0,
        paymentMethod: "cash",
        paymentStatus: {
          $cond: [
            { $eq: ["$status", "paid"] },
            "paid",
            "unpaid"
          ]
        },
        status: "pending"
      }
    }
  ]
);

# Update items structure
db.orders.updateMany(
  {},
  [
    {
      $set: {
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              foodId: "$$item.foodId",
              foodName: "$$item.foodName",  // Add from Food collection if missing
              quantity: "$$item.quantity",
              unitPrice: "$$item.price",    // Migrate from price
              specialInstructions: ""
            }
          }
        }
      }
    }
  ]
);
```

### Update OrderController

```javascript
// Generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD${timestamp}${random}`;
}

// Create order
const order = await Order.create({
  orderNumber: generateOrderNumber(), // NEW
  userId, // NEW
  bookingId,
  tableId, // NEW
  items: items.map((item) => ({
    foodId: item.foodId,
    foodName: item.name, // Get from Food model
    quantity: item.quantity,
    unitPrice: item.price, // Renamed
    specialInstructions: item.instructions, // NEW
  })),
  subtotal, // NEW - calculated
  tax: calculateTax(subtotal), // NEW
  serviceCharge: calculateServiceCharge(subtotal), // NEW
  discount: 0, // NEW
  totalAmount,
  paymentMethod, // NEW - Enum
  paymentStatus: "unpaid", // NEW - Separate
  status: "pending", // Changed from 'paid'/'unpaid'
});

// Update order payment
order.paidAmount = totalAmount;
order.paymentStatus = "paid"; // NEW - Separate from status
order.paymentDate = new Date();
order.transactionId = transactionId;
order.status = "completed"; // Order status separate
await order.save();

// Track order preparation
order.status = "preparing";
await order.save();

// Mark ready
order.status = "ready";
await order.save();

// Mark served
order.status = "served";
await order.save();
```

---

## 6. Session Model Changes

### New Fields

```javascript
// OLD - Minimal fields
userId;
refreshToken;
expiresAt;

// NEW - Enhanced with device tracking
userId;
refreshToken;
accessToken; // NEW
deviceInfo: {
  // NEW
  userAgent;
  deviceType;
  osType;
  browser;
}
ipAddress; // NEW
isActive; // NEW
location; // NEW
lastActivityAt; // NEW
loginAt; // NEW
logoutAt; // NEW
```

### Update AuthController

```javascript
// After successful signin
const session = await Session.create({
  userId: user._id,
  refreshToken,
  accessToken, // NEW
  expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  deviceInfo: {
    // NEW
    userAgent: req.headers["user-agent"],
    deviceType: getDeviceType(req.headers["user-agent"]),
    osType: getOSType(req.headers["user-agent"]),
    browser: getBrowser(req.headers["user-agent"]),
  },
  ipAddress: req.ip, // NEW
  isActive: true, // NEW
  loginAt: new Date(),
});

// On logout
const session = await Session.findOne({ refreshToken });
session.isActive = false; // NEW
session.logoutAt = new Date(); // NEW
await session.save();
```

---

## 🔀 Database Migration Steps

### 1. Backup Database

```bash
mongodump --uri="mongodb://..." --out=./backup
```

### 2. Run Migration Scripts (in MongoDB shell)

```javascript
// 1. Update User
// 2. Update Table
// 3. Update Booking
// 4. Update Food
// 5. Update Order
// 6. Update Session
```

### 3. Verify Data

```bash
# Check a few documents from each collection
db.users.findOne()
db.tables.findOne()
db.bookings.findOne()
db.food.findOne()
db.orders.findOne()
db.sessions.findOne()
```

### 4. Update Controllers

- Update all CRUD operations
- Update API routes
- Update data validation

### 5. Update Frontend

- Update API calls
- Update form fields
- Update display logic

### 6. Test Thoroughly

```javascript
// Test each endpoint
POST /api/auth/signup      ✓
POST /api/auth/signin      ✓
GET /api/users/profile     ✓
POST /api/bookings         ✓
GET /api/bookings          ✓
POST /api/orders           ✓
GET /api/orders            ✓
```

---

## ⚠️ Breaking Changes

### 1. Table Model

- `tableId` → `tableNumber` (rename field)
- Must set `capacity` (new required field)
- Must set `location` (new required field)
- Status enum changed: `'booked'` → `'occupied'`, `'reserved'` added

### 2. Booking Model

- `bookingTime` → `bookingDate` (rename field)
- Must set `numberOfGuests` (new required field)
- Status values changed: `'checked-in'`, `'completed'` added

### 3. Order Model

- Status enum completely changed
- `paymentStatus` (new field) separate from order `status`
- `price` → `unitPrice` in items
- Must set `subtotal`, `tax`, `serviceCharge` (new required)

### 4. Food Model

- `category` now uses enum (may need data update)
- Added `cuisine` as required

---

## ✅ Checklist

- [ ] Backup MongoDB
- [ ] Run migration scripts
- [ ] Verify migrated data
- [ ] Update User controller
- [ ] Update Table controller
- [ ] Update Booking controller
- [ ] Update Food controller
- [ ] Update Order controller
- [ ] Update Session controller
- [ ] Update all routes
- [ ] Update API documentation
- [ ] Update frontend code
- [ ] Test all endpoints
- [ ] Deploy to production

---

## 🆘 Rollback Plan

If issues occur:

```bash
# Restore from backup
mongorestore --uri="mongodb://..." --dir=./backup
```

---

## 📞 Support

For questions about specific fields, see:

- `MODELS_DOCUMENTATION.md` - Detailed field descriptions
- `API_DOCUMENTATION.md` - API endpoint details
- Model files in `backend/src/models/`
