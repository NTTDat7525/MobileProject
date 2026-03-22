# 📊 Database Models Documentation

## Overview

Toàn bộ các model đã được viết lại một cách hợp lý hơn với các trường chi tiết, validation, và indexes phù hợp cho hệ thống đặt bàn nhà hàng.

---

## 1. User Model (`User.js`)

### Purpose

Lưu thông tin người dùng và xác thực

### Fields

#### Authentication

```javascript
username: String (required, unique, 3-30 chars)
email: String (required, unique, email format)
hashPassword: String (required, bcrypt hashed)
```

#### Profile Information

```javascript
displayName: String (required, max 100)
firstName: String (required, max 50)
lastName: String (required, max 50)
bio: String (max 500)
avatar: String (URL)
phone: String (regex validation)
```

#### Address

```javascript
address: {
  street: String;
  city: String;
  province: String;
  postalCode: String;
}
```

#### Account Settings

```javascript
role: String (enum: 'user', 'admin') - default: 'user'
isActive: Boolean - default: true
emailVerified: Boolean - default: false
verificationToken: String
```

#### Preferences

```javascript
preferences: {
  notifications: Boolean - default: true
  newsletter: Boolean - default: false
}
```

#### Security & Audit

```javascript
lastLogin: Date
loginAttempts: Number - default: 0
lockUntil: Date (account lock timeframe)
timestamps: createdAt, updatedAt
```

### Indexes

- email
- username
- createdAt (descending)

---

## 2. Table Model (`Table.js`)

### Purpose

Quản lý các bàn trong nhà hàng

### Fields

#### Table Identification

```javascript
tableNumber: String(required, unique);
```

#### Characteristics

```javascript
capacity: Number (required, 1-20)
type: String (enum: 'standard', 'vip', 'bar', 'outdoor')
location: String (enum: 'indoor', 'outdoor', 'terrace')
description: String
```

#### Status & Booking

```javascript
status: String (enum: 'available', 'occupied', 'reserved', 'maintenance')
currentBookingId: ObjectId (reference to Booking)
```

#### Features

```javascript
features: {
  hasWindow: Boolean - default: false
  hasView: Boolean - default: false
  isHighChairs: Boolean - default: false
  wheelchair: Boolean - default: false
}
```

#### Pricing

```javascript
surchargePercentage: Number (0-50%)
```

#### Maintenance

```javascript
lastCleaned: Date;
maintenanceNotes: String;
```

### Indexes

- status
- capacity
- type
- currentBookingId

---

## 3. Booking Model (`Booking.js`)

### Purpose

Quản lý các đặt bàn

### Fields

#### Guest Information

```javascript
userId: ObjectId (required, reference to User)
guestName: String (required)
guestEmail: String (required, lowercase)
guestPhone: String (required)
numberOfGuests: Number (required, 1-30)
```

#### Table Assignment

```javascript
tableId: ObjectId (required, reference to Table)
```

#### Date & Time

```javascript
bookingDate: Date (required)
checkInTime: Date
checkOutTime: Date
estimatedDuration: Number (default: 120 mins, 30-480)
```

#### Special Requests

```javascript
specialRequests: String
dietaryRestrictions: String[] (array)
occasion: String (enum: 'regular', 'birthday', 'anniversary', 'business', 'other')
```

#### Status Tracking

```javascript
status: String (enum: 'pending', 'confirmed', 'checked-in', 'completed', 'cancelled')
cancellationReason: String
cancellationDate: Date
```

#### References

```javascript
orderId: ObjectId (reference to Order)
```

#### Additional Info

```javascript
internalNotes: String;
reminderSent: Boolean;
```

### Indexes

- userId + bookingDate (descending)
- tableId + bookingDate
- status + bookingDate (descending)
- bookingDate
- createdAt (descending)

---

## 4. Food Model (`Food.js`)

### Purpose

Quản lý thực phẩm/món ăn trong menu

### Fields

#### Basic Information

```javascript
name: String (required, max 100)
description: String (max 500)
```

#### Classification

```javascript
category: String (enum: 'appetizer', 'soup', 'salad', 'main', 'dessert', 'beverage', 'wine', 'side')
cuisine: String (enum: 'vietnamese', 'asian', 'european', 'fusion', 'vegetarian', 'vegan')
```

#### Pricing

```javascript
price: Number (required, min 0)
discountPrice: Number (optional)
```

#### Nutrition Information

```javascript
calories: Number;
protein: Number(grams);
fat: Number(grams);
carbs: Number(grams);
```

#### Allergens & Diet

```javascript
allergens: String[] (enum: peanuts, tree nuts, milk, eggs, soy, wheat, fish, shellfish, sesame)
isVegetarian: Boolean
isVegan: Boolean
isGluten: Boolean
```

#### Media

```javascript
image: String (URL)
images: String[] (array of URLs)
```

#### Availability

```javascript
isAvailable: Boolean - default: true
availableFrom: String (time, e.g., "10:00")
availableUntil: String (time, e.g., "22:00")
```

#### Inventory

```javascript
stockQuantity: Number;
lowStockThreshold: Number;
```

#### Popularity

```javascript
rating: Number(0 - 5);
ratingCount: Number;
orderCount: Number;
```

#### Preparation

```javascript
preparationTime: Number (minutes, default: 15)
difficulty: String (enum: 'easy', 'medium', 'hard')
spiceLevel: Number (0-5)
```

#### Additional

```javascript
portions: Number - default: 1
tags: String[] (array)
status: String (enum: 'active', 'inactive', 'archived')
```

### Indexes

- category + isAvailable
- cuisine
- rating (descending)
- price
- name + description (text search)
- tags
- createdAt (descending)

---

## 5. Order Model (`Order.js`)

### Purpose

Quản lý các đơn hàng/hóa đơn

### Fields

#### Order Identification

```javascript
orderNumber: String(unique);
```

#### References

```javascript
userId: ObjectId (required, reference to User)
bookingId: ObjectId (required, reference to Booking)
tableId: ObjectId (required, reference to Table)
```

#### Order Items

```javascript
items: {
  foodId: ObjectId (required, reference to Food)
  foodName: String (required)
  quantity: Number (required, min 1)
  unitPrice: Number (required, min 0)
  specialInstructions: String
  addedAt: Date
}[]
```

#### Pricing

```javascript
subtotal: Number (required, min 0)
tax: Number (default: 0)
serviceCharge: Number (default: 0)
discount: Number (default: 0)
discountReason: String
totalAmount: Number (required)
```

#### Payment

```javascript
paymentMethod: String (enum: 'cash', 'credit_card', 'debit_card', 'mobile_wallet', 'bank_transfer')
paymentStatus: String (enum: 'unpaid', 'paid', 'partial', 'refunded')
paidAmount: Number (default: 0)
paymentDate: Date
transactionId: String
```

#### Status

```javascript
status: String (enum: 'pending', 'preparing', 'ready', 'served', 'completed', 'cancelled')
```

#### Timing

```javascript
orderedAt: Date;
startedAt: Date;
completedAt: Date;
```

#### Notes & Invoice

```javascript
notes: String;
internalNotes: String;
invoiceNumber: String;
cancellationReason: String;
```

#### Loyalty Points

```javascript
loyaltyPointsUsed: Number;
loyaltyPointsEarned: Number;
```

### Indexes

- userId + createdAt (descending)
- bookingId
- tableId
- paymentStatus
- status + createdAt (descending)
- paymentMethod
- orderedAt

---

## 6. Session Model (`Session.js`)

### Purpose

Quản lý phiên đăng nhập người dùng

### Fields

#### User Reference

```javascript
userId: ObjectId (required, reference to User)
```

#### Token Information

```javascript
refreshToken: String(required, unique);
accessToken: String(optional);
```

#### Expiry

```javascript
expiresAt: Date(required);
```

#### Device Information

```javascript
deviceInfo: {
  userAgent: String
  deviceType: String (enum: 'mobile', 'tablet', 'desktop')
  deviceName: String
  osType: String (enum: 'iOS', 'Android', 'Windows', 'macOS', 'Linux', 'Other')
  osVersion: String
  browser: String
}
```

#### Network

```javascript
ipAddress: String(optional);
```

#### Status

```javascript
isActive: Boolean - default: true
```

#### Location (Optional)

```javascript
location: {
  country: String;
  city: String;
  latitude: Number;
  longitude: Number;
}
```

#### Activity

```javascript
lastActivityAt: Date;
loginAt: Date;
logoutAt: Date;
```

### Indexes

- userId + isActive
- refreshToken
- lastActivityAt (descending)
- loginAt (descending)
- expiresAt (auto-cleanup)

---

## 📋 Relationships Diagram

```
User
  ├── 1:N → Booking (userId)
  ├── 1:N → Order (userId)
  └── 1:N → Session (userId)

Table
  ├── 1:N → Booking (tableId)
  └── 1:N → Order (tableId)

Booking
  ├── N:1 → User (userId)
  ├── N:1 → Table (tableId)
  ├── 1:1 → Order (orderId)
  └── Status: pending → confirmed → checked-in → completed

Food
  └── 1:N → Order.items (foodId)

Order
  ├── N:1 → User (userId)
  ├── N:1 → Booking (bookingId)
  ├── N:1 → Table (tableId)
  └── Items → N:1 Food (items.foodId)

Session
  └── N:1 → User (userId)
```

---

## 🔑 Key Improvements

### 1. User Model

✅ Added firstName, lastName (separate from displayName)
✅ Added address (nested object)
✅ Added preferences
✅ Added security fields (lastLogin, loginAttempts, lockUntil)
✅ Added email verification
✅ Fixed bio typo (maxlength)

### 2. Table Model

✅ Renamed tableId → tableNumber
✅ Added capacity (required)
✅ Added location (indoor/outdoor/terrace)
✅ Added features (window, view, wheelchair)
✅ Added surcharge percentage
✅ Added maintenance fields
✅ Enhanced status options

### 3. Booking Model

✅ Added numberOfGuests (critical missing field)
✅ Added guestName, guestEmail, guestPhone
✅ Renamed bookingTime → bookingDate for clarity
✅ Added checkInTime, checkOutTime
✅ Added specialRequests, dietaryRestrictions
✅ Added occasion type
✅ Enhanced status tracking (checked-in, completed)
✅ Added cancellation tracking

### 4. Food Model

✅ Complete rewrite with comprehensive fields
✅ Added description
✅ Added detailed categorization
✅ Added nutrition info
✅ Added allergen tracking
✅ Added images support
✅ Added availability schedule
✅ Added inventory management
✅ Added rating and order tracking

### 5. Order Model

✅ Added orderNumber
✅ Added userId (was missing)
✅ Added tableId reference
✅ Renamed price → unitPrice for clarity
✅ Added food name (denormalization for reporting)
✅ Added full pricing breakdown
✅ Added payment method details
✅ Enhanced status tracking
✅ Added timing fields
✅ Added loyalty points
✅ Added special instructions per item

### 6. Session Model

✅ Added access token
✅ Added device information
✅ Added IP address
✅ Added location data
✅ Added session activity tracking
✅ Improved timestamps

---

## ✅ Database Indexes

All models now have proper indexes for:

- Frequently queried fields
- Foreign key references
- Status tracking
- Date ranges
- Text search (where applicable)

This ensures optimal query performance.

---

## 🔐 Validation

All models include:

- Type validation (String, Number, etc.)
- Enum validation (specific allowed values)
- Min/Max constraints
- Format validation (email, phone)
- Required fields
- Reference integrity (ObjectId)

---

## 🚀 Usage Example

### Create User

```javascript
const user = new User({
  username: "johndoe",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  // ... other fields
});
```

### Create Booking

```javascript
const booking = new Booking({
  userId: userObjectId,
  guestName: "John Doe",
  numberOfGuests: 4,
  tableId: tableObjectId,
  bookingDate: new Date("2026-03-25"),
  specialRequests: "Window seat preferred",
});
```

### Create Order

```javascript
const order = new Order({
  userId: userObjectId,
  bookingId: bookingObjectId,
  tableId: tableObjectId,
  items: [
    {
      foodId: foodObjectId,
      foodName: "Pho Beef",
      quantity: 2,
      unitPrice: 85000,
      specialInstructions: "Extra basil",
    },
  ],
  paymentMethod: "credit_card",
  totalAmount: 170000,
});
```

---

## 📊 Best Practices Implemented

✅ Use of ObjectId references instead of duplicating data
✅ Proper field naming conventions (camelCase)
✅ Nested objects for related data (features, deviceInfo, address)
✅ Pre-computed fields (subtotal, tax, etc.)
✅ Immutable audit fields (timestamps)
✅ Enum validation for status fields
✅ Indexes for performance optimization
✅ Default values for optional fields
✅ Text search indexes for searching
✅ TTL indexes for auto-cleanup (Session)

---

## 📝 Next Steps

1. Run migrations if needed
2. Update controllers to use new fields
3. Update routes to handle new fields
4. Update frontend to display/input new fields
5. Create database backup before deploying
6. Test all CRUD operations
7. Monitor query performance
