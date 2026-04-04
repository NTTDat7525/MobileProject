# 📐 Cơ Sở Dữ Liệu Schema - SQL Server

## 📊 Tổng Quan

Dự án sử dụng **6 bảng chính** với quan hệ như sau:

```
Users
├── Sessions (1:N - một user có nhiều sessions)
├── Bookings (1:N - một user có nhiều bookings)
└── Orders (1:N - một user có nhiều orders)

Tables
├── current_booking_id (relationship với Booking)
└── được sử dụng bởi Bookings (1:N)

Foods
└── được sử dụng bởi Orders items (Json)

Bookings
├── userId (FK → Users)
├── tableId (FK → Tables)
└── orderId (có thể null)

Orders
├── userId (FK → Users)
├── bookingId (FK → Bookings)
└── tableId (FK → Tables)

Sessions
└── userId (FK → Users)
```

## 🔐 Bảng Users

Lưu trữ thông tin người dùng.

```sql
CREATE TABLE Users (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    username            VARCHAR(100) UNIQUE NOT NULL,
    hashPassword        VARCHAR(255) NOT NULL,
    email               VARCHAR(100) UNIQUE NOT NULL,
    displayName         VARCHAR(150) NOT NULL,
    bio                 VARCHAR(500),
    phone               VARCHAR(20),
    role                VARCHAR(20) CHECK (role IN ('user', 'admin')) DEFAULT 'user',
    createdAt           DATETIME DEFAULT GETDATE(),
    updatedAt           DATETIME DEFAULT GETDATE()
);

-- Indexes
CREATE INDEX idx_Users_username ON Users(username);
CREATE INDEX idx_Users_email ON Users(email);
CREATE INDEX idx_Users_role ON Users(role);
```

**Ví dụ dữ liệu:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "email": "john@example.com",
  "displayName": "John Doe",
  "bio": "Restaurant enthusiast",
  "phone": "+84123456789",
  "role": "user"
}
```

## 🛡️ Bảng Sessions

Quản lý phiên đăng nhập của người dùng.

```sql
CREATE TABLE Sessions (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userId              UNIQUEIDENTIFIER NOT NULL,
    refreshToken        TEXT UNIQUE NOT NULL,
    accessToken         TEXT,
    expiresAt           DATETIME NOT NULL,
    deviceInfo          NVARCHAR(MAX), -- JSON
    ipAddress           VARCHAR(50),
    isActive            BIT DEFAULT 1,
    location            NVARCHAR(MAX), -- JSON
    lastActivityAt      DATETIME DEFAULT GETDATE(),
    loginAt             DATETIME DEFAULT GETDATE(),
    logoutAt            DATETIME,
    createdAt           DATETIME DEFAULT GETDATE(),
    updatedAt           DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_Sessions_userId ON Sessions(userId);
CREATE INDEX idx_Sessions_expiresAt ON Sessions(expiresAt);
CREATE INDEX idx_Sessions_isActive ON Sessions(isActive);
CREATE INDEX idx_Sessions_ipAddress ON Sessions(ipAddress);
```

**JSON Structure - deviceInfo:**

```json
{
  "userAgent": "Mozilla/5.0...",
  "deviceType": "mobile",
  "deviceName": "iPhone 12",
  "osType": "iOS",
  "osVersion": "15.0",
  "browser": "Safari"
}
```

## 🍽️ Bảng Tables

Thông tin các bàn nhà hàng.

```sql
CREATE TABLE Tables (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    tableNumber         VARCHAR(50) UNIQUE NOT NULL,
    capacity            INT CHECK (capacity BETWEEN 1 AND 20) NOT NULL,
    type                VARCHAR(20) CHECK (type IN ('standard', 'vip', 'bar', 'outdoor')) DEFAULT 'standard',
    location            VARCHAR(20) CHECK (location IN ('indoor', 'outdoor', 'terrace')) NOT NULL,
    description         VARCHAR(500),
    status              VARCHAR(20) CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')) DEFAULT 'available',
    currentBookingId    UNIQUEIDENTIFIER,
    features            NVARCHAR(MAX), -- JSON
    surchargePercentage DECIMAL(5, 2) CHECK (surchargePercentage BETWEEN 0 AND 50) DEFAULT 0,
    lastCleaned         DATETIME,
    maintenanceNotes    VARCHAR(500),
    createdAt           DATETIME DEFAULT GETDATE(),
    updatedAt           DATETIME DEFAULT GETDATE()
);

-- Indexes
CREATE INDEX idx_Tables_status ON Tables(status);
CREATE INDEX idx_Tables_capacity ON Tables(capacity);
CREATE INDEX idx_Tables_type ON Tables(type);
CREATE INDEX idx_Tables_currentBookingId ON Tables(currentBookingId);
```

**JSON Structure - features:**

```json
{
  "hasWindow": true,
  "hasView": false,
  "isHighChairs": false,
  "wheelchair": true
}
```

## 🍲 Bảng Foods

Danh mục các món ăn.

```sql
CREATE TABLE Foods (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name                VARCHAR(100) NOT NULL,
    description         VARCHAR(500),
    category            VARCHAR(50) CHECK (category IN ('appetizer', 'soup', 'salad', 'main', 'dessert', 'beverage', 'wine', 'side')) NOT NULL,
    cuisine             VARCHAR(50) CHECK (cuisine IN ('vietnamese', 'asian', 'european', 'fusion', 'vegetarian', 'vegan')) DEFAULT 'vietnamese',
    price               DECIMAL(10, 2) CHECK (price >= 0) NOT NULL,
    discountPrice       DECIMAL(10, 2),
    calories            INT,
    protein             DECIMAL(8, 2),
    fat                 DECIMAL(8, 2),
    carbs               DECIMAL(8, 2),
    allergens           NVARCHAR(MAX), -- JSON Array
    isVegetarian        BIT DEFAULT 0,
    isVegan             BIT DEFAULT 0,
    isGluten            BIT DEFAULT 0,
    image               VARCHAR(500),
    images              NVARCHAR(MAX), -- JSON Array
    isAvailable         BIT DEFAULT 1,
    availableFrom       VARCHAR(20),
    availableUntil      VARCHAR(20),
    stockQuantity       INT,
    lowStockThreshold   INT DEFAULT 10,
    rating              DECIMAL(3, 2) CHECK (rating BETWEEN 0 AND 5) DEFAULT 0,
    ratingCount         INT DEFAULT 0,
    orderCount          INT DEFAULT 0,
    preparationTime     INT CHECK (preparationTime >= 5) DEFAULT 15,
    difficulty          VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
    spiceLevel          INT CHECK (spiceLevel BETWEEN 0 AND 5) DEFAULT 0,
    portions            INT DEFAULT 1,
    tags                NVARCHAR(MAX), -- JSON Array
    status              VARCHAR(20) CHECK (status IN ('active', 'inactive', 'archived')) DEFAULT 'active',
    createdAt           DATETIME DEFAULT GETDATE(),
    updatedAt           DATETIME DEFAULT GETDATE()
);

-- Indexes
CREATE INDEX idx_Foods_name ON Foods(name);
CREATE INDEX idx_Foods_category ON Foods(category);
CREATE INDEX idx_Foods_isAvailable ON Foods(isAvailable);
CREATE INDEX idx_Foods_cuisine ON Foods(cuisine);
CREATE INDEX idx_Foods_status ON Foods(status);
```

## 📅 Bảng Bookings

Quản lý đặt bàn nhà hàng.

```sql
CREATE TABLE Bookings (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userId              UNIQUEIDENTIFIER NOT NULL,
    guestName           VARCHAR(150) NOT NULL,
    guestEmail          VARCHAR(100) NOT NULL,
    guestPhone          VARCHAR(20) NOT NULL,
    numberOfGuests      INT CHECK (numberOfGuests BETWEEN 1 AND 30) NOT NULL,
    tableId             UNIQUEIDENTIFIER NOT NULL,
    bookingDate         DATETIME NOT NULL,
    checkInTime         DATETIME,
    checkOutTime        DATETIME,
    estimatedDuration   INT CHECK (estimatedDuration BETWEEN 30 AND 480) DEFAULT 120,
    specialRequests     VARCHAR(500),
    dietaryRestrictions NVARCHAR(MAX), -- JSON Array
    occasion            VARCHAR(50) CHECK (occasion IN ('regular', 'birthday', 'anniversary', 'business', 'other')) DEFAULT 'regular',
    status              VARCHAR(50) CHECK (status IN ('pending', 'confirmed', 'checked-in', 'completed', 'cancelled')) DEFAULT 'pending',
    cancellationReason  VARCHAR(500),
    cancellationDate    DATETIME,
    orderId             UNIQUEIDENTIFIER,
    internalNotes       VARCHAR(500),
    reminderSent        BIT DEFAULT 0,
    createdAt           DATETIME DEFAULT GETDATE(),
    updatedAt           DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (tableId) REFERENCES Tables(id)
);

-- Indexes
CREATE INDEX idx_Bookings_userId ON Bookings(userId);
CREATE INDEX idx_Bookings_tableId ON Bookings(tableId);
CREATE INDEX idx_Bookings_status ON Bookings(status);
CREATE INDEX idx_Bookings_bookingDate ON Bookings(bookingDate);
```

## 🛍️ Bảng Orders

Quản lý đơn hàng.

```sql
CREATE TABLE Orders (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    orderNumber         VARCHAR(50),
    userId              UNIQUEIDENTIFIER NOT NULL,
    bookingId           UNIQUEIDENTIFIER NOT NULL,
    tableId             UNIQUEIDENTIFIER NOT NULL,
    items               NVARCHAR(MAX) NOT NULL, -- JSON Array
    subtotal            DECIMAL(10, 2) CHECK (subtotal >= 0) NOT NULL,
    tax                 DECIMAL(10, 2) CHECK (tax >= 0) DEFAULT 0,
    serviceCharge       DECIMAL(10, 2) CHECK (serviceCharge >= 0) DEFAULT 0,
    discount            DECIMAL(10, 2) CHECK (discount >= 0) DEFAULT 0,
    discountReason      VARCHAR(500),
    totalAmount         DECIMAL(10, 2) CHECK (totalAmount >= 0) NOT NULL,
    paymentMethod       VARCHAR(50) CHECK (paymentMethod IN ('cash', 'credit_card', 'debit_card', 'mobile_wallet', 'bank_transfer')) NOT NULL,
    paymentStatus       VARCHAR(50) CHECK (paymentStatus IN ('unpaid', 'paid', 'partial', 'refunded')) DEFAULT 'unpaid',
    paidAmount          DECIMAL(10, 2) CHECK (paidAmount >= 0) DEFAULT 0,
    paymentDate         DATETIME,
    transactionId       VARCHAR(100),
    status              VARCHAR(50) CHECK (status IN ('pending', 'preparing', 'ready', 'served', 'completed', 'cancelled')) DEFAULT 'pending',
    orderedAt           DATETIME DEFAULT GETDATE(),
    startedAt           DATETIME,
    completedAt         DATETIME,
    notes               VARCHAR(500),
    internalNotes       VARCHAR(500),
    invoiceNumber       VARCHAR(50),
    cancellationReason  VARCHAR(500),
    loyaltyPointsUsed   INT DEFAULT 0,
    loyaltyPointsEarned INT DEFAULT 0,
    createdAt           DATETIME DEFAULT GETDATE(),
    updatedAt           DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (bookingId) REFERENCES Bookings(id),
    FOREIGN KEY (tableId) REFERENCES Tables(id)
);

-- Indexes
CREATE INDEX idx_Orders_userId ON Orders(userId);
CREATE INDEX idx_Orders_bookingId ON Orders(bookingId);
CREATE INDEX idx_Orders_tableId ON Orders(tableId);
CREATE INDEX idx_Orders_paymentStatus ON Orders(paymentStatus);
CREATE INDEX idx_Orders_status ON Orders(status);
```

**JSON Structure - items:**

```json
[
  {
    "foodId": "550e8400-e29b-41d4-a716-446655440001",
    "foodName": "Phở Bò",
    "quantity": 2,
    "unitPrice": 50000,
    "specialInstructions": "No basil",
    "addedAt": "2024-01-15T10:30:00Z"
  }
]
```

## 🔗 Relationships

```
Users (1) ──→ (N) Sessions
       ├──→ (N) Bookings
       └──→ (N) Orders

Tables (1) ──→ (N) Bookings
       └──→ (N) Orders

Bookings (1) ──→ (N) Orders

Foods (1) ──→ (N) Orders.items (JSON)
```

## 🔍 Các View Hữu Ích

### View: Orders ngày hôm nay

```sql
CREATE VIEW OrdersToday AS
SELECT * FROM Orders
WHERE CAST(orderedAt AS DATE) = CAST(GETDATE() AS DATE);
```

### View: Available Tables

```sql
CREATE VIEW AvailableTables AS
SELECT * FROM Tables
WHERE status = 'available' AND currentBookingId IS NULL;
```

### View: Revenue by Payment Method

```sql
CREATE VIEW RevenueByMethod AS
SELECT
    paymentMethod,
    COUNT(*) as OrderCount,
    SUM(totalAmount) as TotalRevenue,
    AVG(totalAmount) as AvgOrderValue
FROM Orders
WHERE paymentStatus = 'paid'
GROUP BY paymentMethod;
```

## 📏 Data Type Mappings

| MongoDB  | SQL Server       | Sequelize       |
| -------- | ---------------- | --------------- |
| ObjectId | UNIQUEIDENTIFIER | UUID            |
| String   | VARCHAR(n)       | STRING          |
| Number   | INT/DECIMAL      | INTEGER/DECIMAL |
| Boolean  | BIT              | BOOLEAN         |
| Date     | DATETIME         | DATE            |
| Array    | JSON             | JSON            |
| Object   | JSON             | JSON            |
| Mixed    | NVARCHAR(MAX)    | JSON            |

---

**Schema Version**: 1.0  
**Last Updated**: 2024
