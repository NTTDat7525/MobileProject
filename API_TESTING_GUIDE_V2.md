# Hướng Dẫn Chi Tiết Test API Backend Trên Postman

## Mục Lục

1. [Chuẩn Bị Môi Trường](#chuẩn-bị-môi-trường)
2. [Thông Tin Chung](#thông-tin-chung)
3. [Thứ Tự Ưu Tiên Test](#thứ-tự-ưu-tiên-test)
4. [PRIORITY 1: Authentication APIs](#priority-1-authentication-apis)
5. [PRIORITY 2: User Profile APIs](#priority-2-user-profile-apis)
6. [PRIORITY 3: Tables & Bookings APIs](#priority-3-tables--bookings-apis)
7. [PRIORITY 4: Orders APIs](#priority-4-orders-apis)
8. [PRIORITY 5: Admin APIs](#priority-5-admin-apis)
9. [PRIORITY 6: Payment APIs](#priority-6-payment-apis)
10. [Hướng Dẫn Chi Tiết Postman](#hướng-dẫn-chi-tiết-postman)
11. [Biến Môi Trường Postman](#biến-môi-trường-postman)
12. [Troubleshooting](#troubleshooting)

---

## Chuẩn Bị Môi Trường

### 1. Khởi Động Server Backend

```bash
cd backend
npm install
npm run dev
```

Server sẽ chạy tại: `http://localhost:5001`

### 2. Cài Đặt Testing Tools

- **Postman**: https://www.postman.com/downloads/
- **cURL**: Được tích hợp sẵn trong terminal
- **Insomnia**: https://insomnia.rest/download
- **VS Code REST Client**: Cài extension "REST Client"

### 3. Environment Variables

Đảm bảo file `.env` trong thư mục `backend` có các biến:

```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/your_database
VNPAY_TMN_CODE=your_tmn_code
VNPAY_SECRET=your_secret_key
JWT_SECRET=your_jwt_secret
```

---

## Thông Tin Chung

### Base URL

```
http://localhost:5001/api
```

### Headers (cho các request cần authentication)

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

### Response Format

Tất cả responses trả về JSON format với structure:

```json
{
  "success": true/false,
  "data": {},
  "message": "string"
}
```

### HTTP Status Codes

- `200`: OK - Request thành công
- `201`: Created - Resource được tạo thành công
- `400`: Bad Request - Dữ liệu không hợp lệ
- `401`: Unauthorized - Token không hợp lệ hoặc hết hạn
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Resource không tồn tại
- `500`: Internal Server Error - Lỗi server

---

## Thứ Tự Ưu Tiên Test

Để đảm bảo test hiệu quả và logic, thực hiện theo thứ tự ưu tiên này:

### Priority 1: Authentication (PHẢI TEST TRƯỚC)

- Sign Up: Tạo tài khoản
- Sign In: Đăng nhập lấy token
- Sign Out: Đăng xuất

### Priority 2: User Profile (CẦN TOKEN)

- Get Current User (authMe)
- Get User Profile
- Update User Profile

### Priority 3: Tables & Bookings (MAIN FEATURE)

- Get All Tables
- Get Table by ID
- Create Booking
- Get User Bookings
- Get Booking by ID
- Update Booking
- Cancel Booking

### Priority 4: Orders (SERVICE FEATURE)

- Get User Orders
- Get Order by ID

### Priority 5: Admin APIs (REQUIRE ADMIN ROLE)

- Get Revenue
- Get Order Statistics
- Get Table Status
- Add Table
- Update Table
- Delete Table
- Update Booking Status
- Create Food
- Get Foods
- Update Food
- Delete Food
- Create Order
- Update Order Status
- Add Item to Order

### Priority 6: Payment APIs (PAYMENT PROCESSING)

- Create Payment QR
- Payment Return/Callback

---

## PRIORITY 1: Authentication APIs

### 1. Sign Up (Đăng Ký)

**Endpoint**: `POST /auth/signup`

**Description**: Tạo tài khoản người dùng mới

**Request Body**:

```json
{
  "username": "testuser001",
  "email": "testuser001@example.com",
  "password": "Password123!",
  "displayName": "Test User 001"
}
```

**Expected Response** (Success - 201):

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "testuser001",
    "email": "testuser001@example.com",
    "displayName": "Test User 001",
    "role": "user"
  }
}
```

**Error Cases**:

- Email already exists → 400
- Username already exists → 400
- Password too weak → 400
- Missing required fields → 400

---

### 2. Sign In (Đăng Nhập)

**Endpoint**: `POST /auth/signin`

**Description**: Đăng nhập và nhận JWT token

**Request Body**:

```json
{
  "email": "testuser001@example.com",
  "password": "Password123!"
}
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcwNTMxNDYwMCwiZXhwIjoxNzA1NDAxMDAwfQ...",
    "userId": "507f1f77bcf86cd799439011",
    "username": "testuser001",
    "email": "testuser001@example.com",
    "role": "user"
  }
}
```

**⚠️ IMPORTANT**: Lưu token này vào Postman variable (xem phần [Biến Môi Trường Postman](#biến-môi-trường-postman))

**Error Cases**:

- Invalid email/password → 400
- Email not found → 404
- Account locked → 403

---

### 3. Sign Out (Đăng Xuất)

**Endpoint**: `POST /auth/signout`

**Description**: Đăng xuất tài khoản

**Headers Required**:

```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**: (Empty)

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Cases**:

- Invalid token → 401
- Expired token → 401

---

## PRIORITY 2: User Profile APIs

**Prerequisite**: Phải xong Priority 1 (Sign In để có token)

### 1. Get Current User Info (authMe)

**Endpoint**: `GET /users/me`

**Description**: Lấy thông tin user hiện tại (từ token)

**Headers Required**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "testuser001",
    "email": "testuser001@example.com",
    "displayName": "Test User 001",
    "bio": "",
    "phone": "",
    "role": "user"
  }
}
```

---

### 2. Get User Profile

**Endpoint**: `GET /users/profile/:userId`

**Description**: Lấy thông tin profile của một user

**URL Parameters**:

- `userId`: ID của user từ response Sign In (String)

**Example**: `GET /users/profile/507f1f77bcf86cd799439011`

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "testuser001",
    "email": "testuser001@example.com",
    "displayName": "Test User 001",
    "bio": "",
    "phone": "",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3. Update User Profile

**Endpoint**: `PUT /users/profile`

**Description**: Cập nhật thông tin profile người dùng

**Headers Required**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:

```json
{
  "displayName": "Test User Updated",
  "bio": "I love great restaurants",
  "phone": "0912345678"
}
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "displayName": "Test User Updated",
    "bio": "I love great restaurants",
    "phone": "0912345678",
    "email": "testuser001@example.com"
  }
}
```

---

## PRIORITY 3: Tables & Bookings APIs

### 1. Get All Tables

**Endpoint**: `GET /users/tables`

**Description**: Lấy danh sách tất cả các bàn phục vụ

**NO Authentication Required** (Public endpoint)

**Query Parameters** (Optional):

- `status`: available, occupied, reserved, maintenance
- `capacity`: Số người tối thiểu

**Example URLs**:

```
GET /users/tables
GET /users/tables?status=available
GET /users/tables?capacity=2
GET /users/tables?status=available&capacity=4
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "data": [
    {
      "tableId": "507f1f77bcf86cd799439012",
      "tableNumber": "A1",
      "capacity": 2,
      "status": "available",
      "location": "indoor",
      "type": "standard"
    },
    {
      "tableId": "507f1f77bcf86cd799439013",
      "tableNumber": "B1",
      "capacity": 4,
      "status": "available",
      "location": "indoor",
      "type": "standard"
    }
  ]
}
```

---

### 2. Get Table by ID

**Endpoint**: `GET /users/tables/:tableId`

**Description**: Lấy thông tin chi tiết của một bàn

**URL Parameters**:

- `tableId`: ID của bàn từ danh sách tables (String)

**Example**: `GET /users/tables/507f1f77bcf86cd799439012`

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "tableId": "507f1f77bcf86cd799439012",
    "tableNumber": "A1",
    "capacity": 2,
    "status": "available",
    "location": "indoor",
    "type": "standard",
    "description": "Cozy table for 2 guests",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 3. Create Booking

**Endpoint**: `POST /users/bookings`

**Description**: Tạo booking mới cho một bàn

**Headers Required**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:

```json
{
  "tableId": "507f1f77bcf86cd799439012",
  "guestName": "Test User",
  "guestEmail": "testuser001@example.com",
  "guestPhone": "0912345678",
  "numberOfGuests": 2,
  "bookingDate": "2024-02-20",
  "bookingTime": "19:00",
  "notes": "Please seat near the window"
}
```

**Expected Response** (Success - 201):

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "bookingId": "607f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "tableId": "507f1f77bcf86cd799439012",
    "tableNumber": "A1",
    "numberOfGuests": 2,
    "bookingDate": "2024-02-20",
    "bookingTime": "19:00",
    "notes": "Please seat near the window",
    "status": "pending",
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

**⚠️ SAVE**: Lưu `bookingId` từ response cho các request tiếp theo

---

### 4. Get User Bookings

**Endpoint**: `GET /users/bookings`

**Description**: Lấy danh sách bookings của user

**Headers Required**:

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters** (Optional):

- `status`: pending, confirmed, completed, cancelled
- `sort`: asc, desc

**Example URLs**:

```
GET /users/bookings
GET /users/bookings?status=confirmed
GET /users/bookings?sort=desc
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "data": [
    {
      "bookingId": "607f1f77bcf86cd799439014",
      "tableId": "507f1f77bcf86cd799439012",
      "tableNumber": "A1",
      "numberOfGuests": 2,
      "bookingDate": "2024-02-20",
      "bookingTime": "19:00",
      "status": "pending",
      "notes": "Please seat near the window"
    }
  ]
}
```

---

### 5. Get Booking by ID

**Endpoint**: `GET /users/bookings/:bookingId`

**Description**: Lấy thông tin chi tiết của một booking

**Headers Required**:

```
Authorization: Bearer <JWT_TOKEN>
```

**URL Parameters**:

- `bookingId`: ID của booking từ danh sách bookings (String)

**Example**: `GET /users/bookings/607f1f77bcf86cd799439014`

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "bookingId": "607f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "tableId": "507f1f77bcf86cd799439012",
    "tableNumber": "A1",
    "numberOfGuests": 2,
    "bookingDate": "2024-02-20",
    "bookingTime": "19:00",
    "status": "pending",
    "notes": "Please seat near the window",
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

---

### 6. Update Booking

**Endpoint**: `PUT /users/bookings/:bookingId`

**Description**: Cập nhật thông tin booking

**Headers Required**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**URL Parameters**:

- `bookingId`: ID của booking (String)

**Request Body**:

```json
{
  "bookingDate": "2024-02-21",
  "bookingTime": "20:00",
  "numberOfGuests": 3,
  "notes": "Updated request: need AC seat"
}
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Booking updated successfully",
  "data": {
    "bookingId": "607f1f77bcf86cd799439014",
    "bookingDate": "2024-02-21",
    "bookingTime": "20:00",
    "numberOfGuests": 3,
    "notes": "Updated request: need AC seat",
    "status": "pending"
  }
}
```

---

### 7. Cancel Booking

**Endpoint**: `PUT /users/bookings/:bookingId/cancel`

**Description**: Hủy một booking

**Headers Required**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**URL Parameters**:

- `bookingId`: ID của booking (String)

**Request Body** (Optional):

```json
{
  "cancellationReason": "Unable to attend"
}
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "bookingId": "607f1f77bcf86cd799439014",
    "status": "cancelled",
    "cancellationReason": "Unable to attend",
    "cancelledAt": "2024-01-15T13:00:00Z"
  }
}
```

---

## PRIORITY 4: Orders APIs

### 1. Get User Orders

**Endpoint**: `GET /users/orders`

**Description**: Lấy danh sách đơn hàng của user

**Headers Required**:

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters** (Optional):

- `status`: pending, processing, completed, cancelled
- `limit`: Số lượng kết quả (default: 10)
- `skip`: Bỏ qua bao nhiêu kết quả (default: 0)

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "data": [
    {
      "orderId": "507f1f77bcf86cd799439015",
      "bookingId": "607f1f77bcf86cd799439014",
      "tableNumber": "A1",
      "items": [
        {
          "foodId": "507f1f77bcf86cd799439016",
          "foodName": "Cơm Tấm",
          "quantity": 2,
          "price": 50000,
          "totalPrice": 100000
        }
      ],
      "totalAmount": 100000,
      "status": "completed",
      "paymentStatus": "paid",
      "createdAt": "2024-01-15T12:30:00Z"
    }
  ]
}
```

---

### 2. Get Order by ID

**Endpoint**: `GET /users/orders/:orderId`

**Description**: Lấy thông tin chi tiết của một đơn hàng

**Headers Required**:

```
Authorization: Bearer <JWT_TOKEN>
```

**URL Parameters**:

- `orderId`: ID của order (String)

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "orderId": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439011",
    "bookingId": "607f1f77bcf86cd799439014",
    "tableNumber": "A1",
    "items": [
      {
        "foodId": "507f1f77bcf86cd799439016",
        "foodName": "Cơm Tấm",
        "quantity": 2,
        "price": 50000,
        "totalPrice": 100000
      },
      {
        "foodId": "507f1f77bcf86cd799439017",
        "foodName": "Nước Chanh",
        "quantity": 2,
        "price": 15000,
        "totalPrice": 30000
      }
    ],
    "totalAmount": 130000,
    "status": "completed",
    "paymentStatus": "paid",
    "createdAt": "2024-01-15T12:30:00Z"
  }
}
```

---

## PRIORITY 5: Admin APIs

**⚠️ PREREQUISITE**:

1. Phải có tài khoản admin
2. Phải Sign In để có admin token
3. Role phải là "admin"

### 1. Get Revenue

**Endpoint**: `GET /admin/revenue`

**Description**: Lấy tổng doanh thu

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Query Parameters** (Optional):

- `startDate`: Ngày bắt đầu (YYYY-MM-DD)
- `endDate`: Ngày kết thúc (YYYY-MM-DD)
- `period`: Day, Week, Month

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "totalRevenue": 5000000,
    "period": "2024-01-15",
    "orderCount": 15,
    "averageOrderValue": 333333,
    "currency": "VND"
  }
}
```

---

### 2. Get Order Statistics

**Endpoint**: `GET /admin/orders/stats`

**Description**: Lấy thống kê đơn hàng

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "completedOrders": 140,
    "cancelledOrders": 5,
    "pendingOrders": 5,
    "processingOrders": 0,
    "averageOrderValue": 350000,
    "totalRevenue": 52500000
  }
}
```

---

### 3. Get Table Status

**Endpoint**: `GET /admin/tables/status`

**Description**: Lấy trạng thái tất cả các bàn

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "data": [
    {
      "tableId": "507f1f77bcf86cd799439012",
      "tableNumber": "A1",
      "capacity": 2,
      "status": "available",
      "type": "standard",
      "location": "indoor",
      "currentGuests": 0,
      "lastUsedAt": "2024-01-14T20:00:00Z"
    },
    {
      "tableId": "507f1f77bcf86cd799439013",
      "tableNumber": "B1",
      "capacity": 4,
      "status": "occupied",
      "type": "standard",
      "location": "indoor",
      "currentGuests": 3,
      "lastUsedAt": "2024-01-15T19:30:00Z"
    }
  ]
}
```

---

### 4. Add Table

**Endpoint**: `POST /admin/tables`

**Description**: Thêm một bàn mới

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:

```json
{
  "tableNumber": "C5",
  "capacity": 6,
  "type": "standard",
  "location": "indoor",
  "description": "VIP table for special occasions"
}
```

**Expected Response** (Success - 201):

```json
{
  "success": true,
  "message": "Table added successfully",
  "data": {
    "tableId": "707f1f77bcf86cd799439018",
    "tableNumber": "C5",
    "capacity": 6,
    "type": "standard",
    "location": "indoor",
    "description": "VIP table for special occasions",
    "status": "available",
    "createdAt": "2024-01-15T14:00:00Z"
  }
}
```

---

### 5. Update Table

**Endpoint**: `PUT /admin/tables/:tableId`

**Description**: Cập nhật thông tin bàn

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**URL Parameters**:

- `tableId`: ID của bàn (String)

**Request Body**:

```json
{
  "capacity": 8,
  "type": "vip",
  "description": "Premium VIP table with view"
}
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Table updated successfully",
  "data": {
    "tableId": "707f1f77bcf86cd799439018",
    "tableNumber": "C5",
    "capacity": 8,
    "type": "vip",
    "location": "indoor",
    "description": "Premium VIP table with view"
  }
}
```

---

### 6. Delete Table

**Endpoint**: `DELETE /admin/tables/:tableId`

**Description**: Xóa một bàn

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**URL Parameters**:

- `tableId`: ID của bàn (String)

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Table deleted successfully",
  "data": {
    "tableId": "707f1f77bcf86cd799439018",
    "deletedAt": "2024-01-15T14:05:00Z"
  }
}
```

---

### 7. Update Booking Status

**Endpoint**: `PUT /admin/bookings/:bookingId/status`

**Description**: Cập nhật trạng thái booking (chỉ admin)

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**URL Parameters**:

- `bookingId`: ID của booking (String)

**Request Body**:

```json
{
  "status": "confirmed"
}
```

**Valid Status Values**: pending, confirmed, completed, cancelled

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": {
    "bookingId": "607f1f77bcf86cd799439014",
    "status": "confirmed",
    "updatedAt": "2024-01-15T14:10:00Z"
  }
}
```

---

### 8. Create Food Item

**Endpoint**: `POST /admin/foods`

**Description**: Tạo món ăn mới

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "Cơm Tấm Trứng Ốp La",
  "description": "Delicious broken rice with fried egg",
  "category": "main",
  "cuisine": "vietnamese",
  "price": 50000,
  "discountPrice": 45000,
  "image": "https://example.com/image.jpg"
}
```

**Expected Response** (Success - 201):

```json
{
  "success": true,
  "message": "Food item created successfully",
  "data": {
    "foodId": "807f1f77bcf86cd799439019",
    "name": "Cơm Tấm Trứng Ốp La",
    "description": "Delicious broken rice with fried egg",
    "category": "main",
    "cuisine": "vietnamese",
    "price": 50000,
    "discountPrice": 45000,
    "createdAt": "2024-01-15T14:15:00Z"
  }
}
```

---

### 9. Get All Foods

**Endpoint**: `GET /admin/foods`

**Description**: Lấy danh sách tất cả món ăn

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Query Parameters** (Optional):

- `category`: appetizer, soup, salad, main, dessert, beverage, wine, side
- `cuisine`: vietnamese, asian, european, fusion, vegetarian, vegan
- `limit`: Số lượng kết quả

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "data": [
    {
      "foodId": "807f1f77bcf86cd799439019",
      "name": "Cơm Tấm Trứng Ốp La",
      "category": "main",
      "cuisine": "vietnamese",
      "price": 50000,
      "discountPrice": 45000
    }
  ]
}
```

---

### 10. Update Food Item

**Endpoint**: `PUT /admin/foods/:foodId`

**Description**: Cập nhật thông tin món ăn

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**URL Parameters**:

- `foodId`: ID của food (String)

**Request Body**:

```json
{
  "price": 55000,
  "discountPrice": 50000,
  "description": "Updated description - even more delicious!"
}
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Food item updated successfully",
  "data": {
    "foodId": "807f1f77bcf86cd799439019",
    "name": "Cơm Tấm Trứng Ốp La",
    "price": 55000,
    "discountPrice": 50000,
    "updatedAt": "2024-01-15T14:20:00Z"
  }
}
```

---

### 11. Delete Food Item

**Endpoint**: `DELETE /admin/foods/:foodId`

**Description**: Xóa một món ăn

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**URL Parameters**:

- `foodId`: ID của food (String)

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Food item deleted successfully",
  "data": {
    "foodId": "807f1f77bcf86cd799439019",
    "deletedAt": "2024-01-15T14:25:00Z"
  }
}
```

---

### 12. Create Order (Admin)

**Endpoint**: `POST /admin/orders`

**Description**: Tạo đơn hàng từ phía admin (POS system)

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "bookingId": "607f1f77bcf86cd799439014",
  "tableId": "507f1f77bcf86cd799439012",
  "items": [
    {
      "foodId": "807f1f77bcf86cd799439019",
      "quantity": 2
    },
    {
      "foodId": "807f1f77bcf86cd799439020",
      "quantity": 1
    }
  ],
  "notes": "No spicy"
}
```

**Expected Response** (Success - 201):

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "907f1f77bcf86cd799439021",
    "orderNumber": "ORD-001",
    "booking": "607f1f77bcf86cd799439014",
    "items": [
      {
        "foodName": "Cơm Tấm Trứng Ốp La",
        "quantity": 2,
        "price": 50000,
        "totalPrice": 100000
      }
    ],
    "totalAmount": 100000,
    "status": "pending",
    "createdAt": "2024-01-15T14:30:00Z"
  }
}
```

---

### 13. Update Order Status

**Endpoint**: `PUT /admin/orders/:orderId/status`

**Description**: Cập nhật trạng thái đơn hàng

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**URL Parameters**:

- `orderId`: ID của order (String)

**Request Body**:

```json
{
  "status": "completed"
}
```

**Valid Status Values**: pending, processing, completed, cancelled

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "orderId": "907f1f77bcf86cd799439021",
    "status": "completed",
    "updatedAt": "2024-01-15T14:35:00Z"
  }
}
```

---

### 14. Add Item to Order

**Endpoint**: `PUT /admin/orders/:orderId/add-item`

**Description**: Thêm item vào đơn hàng đang xử lý

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**URL Parameters**:

- `orderId`: ID của order (String)

**Request Body**:

```json
{
  "foodId": "807f1f77bcf86cd799439020",
  "quantity": 2
}
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Item added to order successfully",
  "data": {
    "orderId": "907f1f77bcf86cd799439021",
    "totalAmount": 130000,
    "items": [
      {
        "foodName": "Cơm Tấm Trứng Ốp La",
        "quantity": 2,
        "price": 50000,
        "totalPrice": 100000
      },
      {
        "foodName": "Nước Chanh",
        "quantity": 2,
        "price": 15000,
        "totalPrice": 30000
      }
    ]
  }
}
```

---

### 15. Pay Order (Admin)

**Endpoint**: `PUT /admin/orders/:orderId/pay`

**Description**: Xác nhận thanh toán đơn hàng

**Headers Required**:

```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**URL Parameters**:

- `orderId`: ID của order (String)

**Request Body**:

```json
{
  "paymentMethod": "cash",
  "paymentStatus": "paid"
}
```

**Expected Response** (Success - 200):

```json
{
  "success": true,
  "message": "Order payment confirmed",
  "data": {
    "orderId": "907f1f77bcf86cd799439021",
    "paymentMethod": "cash",
    "paymentStatus": "paid",
    "paidAt": "2024-01-15T14:40:00Z"
  }
}
```

---

## PRIORITY 6: Payment APIs

### 1. Create Payment QR (VNPay)

**Endpoint**: `POST /payment/create-qr`

**Description**: Tạo mã QR thanh toán VNPay

**Headers Required**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "orderId": "907f1f77bcf86cd799439021",
  "amount": 100000,
  "orderInfo": "Payment for order ORD-001"
}
```

**Expected Response** (Success - 201):

```json
{
  "success": true,
  "message": "Payment QR created successfully",
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=10000000&...",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

---

### 2. Payment Callback/Return

**Endpoint**: `POST /payment/payment-return`

**Description**: Nhận callback từ VNPay sau thanh toán

**Note**: Endpoint này được gọi tự động bởi VNPay server

**Expected Response**:

```json
{
  "success": true,
  "message": "Payment processed successfully"
}
```

---

## Hướng Dẫn Chi Tiết Postman

### Cách 1: Import Collection từ File

1. **Tạo Postman Collection**:
   - Click "Collections" → "+" → "Create collection"
   - Đặt tên: "Restaurant API Tests"

2. **Thêm Folders** (theo Priority):
   - Priority 1 - Authentication
   - Priority 2 - User Profile
   - Priority 3 - Tables & Bookings
   - Priority 4 - Orders
   - Priority 5 - Admin
   - Priority 6 - Payment

3. **Thêm Requests** cho mỗi endpoint

### Cách 2: Setup Environment Variables

1. **Tạo Environment**:
   - Click "Environments" → "+"
   - Đặt tên: "Local Development"

2. **Thêm Variables** (xem phần [Biến Môi Trường Postman](#biến-môi-trường-postman))

### Cách 3: Test One by One (Priority Order)

**Step 1: Sign Up**

```
POST {{baseUrl}}/auth/signup
```

**Step 2: Sign In** (Save token)

```
POST {{baseUrl}}/auth/signin
```

**Step 3: Verify Token Works**

```
GET {{baseUrl}}/users/me
```

**Step 4: Continue với Priority 2, 3, 4...**

---

## Biến Môi Trường Postman

### Tạo Postman Environment

1. Click "Environments" → "+" → "Create environment"
2. Đặt tên: "Local Development"
3. Thêm các variables sau:

| Variable  | Type    | Initial Value             | Current Value                     |
| --------- | ------- | ------------------------- | --------------------------------- |
| baseUrl   | default | http://localhost:5001/api | http://localhost:5001/api         |
| token     | string  | (empty)                   | (sẽ được set sau Sign In)         |
| userId    | string  | (empty)                   | (sẽ được set sau Sign Up/Sign In) |
| bookingId | string  | (empty)                   | (sẽ được set sau Create Booking)  |
| tableId   | string  | (empty)                   | (sẽ được set sau Get Tables)      |
| orderId   | string  | (empty)                   | (sẽ được set sau Get Orders)      |

### Cách Extract Token tự động

Thêm script vào tab "Tests" của Sign In request:

```javascript
if (pm.response.code === 200) {
  const responseBody = pm.response.json();
  if (responseBody.data.token) {
    pm.environment.set("token", responseBody.data.token);
    pm.environment.set("userId", responseBody.data.userId);
    console.log("Token saved:", responseBody.data.token);
  }
}
```

### Cách Extract Other IDs tự động

**Sau Create Booking**:

```javascript
if (pm.response.code === 201) {
  const responseBody = pm.response.json();
  if (responseBody.data.bookingId) {
    pm.environment.set("bookingId", responseBody.data.bookingId);
  }
}
```

**Sau Get Tables**:

```javascript
if (pm.response.code === 200) {
  const responseBody = pm.response.json();
  if (responseBody.data.length > 0) {
    pm.environment.set("tableId", responseBody.data[0].tableId);
  }
}
```

---

## Troubleshooting

### 1. Error: "401 Unauthorized"

**Nguyên nhân**: Token không hợp lệ hoặc hết hạn

**Giải pháp**:

- Re-login bằng Sign In endpoint
- Copy token mới vào header
- Hoặc set lại Postman variable `{{token}}`

### 2. Error: "403 Forbidden"

**Nguyên nhân**: Tài khoản không phải admin hoặc không có quyền

**Giải pháp**:

- Dùng tài khoản admin để test Admin APIs
- Kiểm tra role của tài khoản

### 3. Error: "400 Bad Request"

**Nguyên nhân**: Dữ liệu gửi không đúng format

**Giải pháp**:

- Kiểm tra request body format JSON
- Kiểm tra các required fields
- Kiểm tra kiểu dữ liệu (string, number, etc.)

### 4. Error: "404 Not Found"

**Nguyên nhân**: Resource không tồn tại hoặc URL sai

**Giải pháp**:

- Kiểm tra lại URL endpoint
- Kiểm tra ID có tồn tại không
- Đảm bảo baseUrl đúng: `http://localhost:5001/api`

### 5. Server Not Responding

**Nguyên nhân**: Backend server chưa chạy

**Giải pháp**:

```bash
cd backend
npm run dev
```

### 6. MongoDB Connection Error

**Nguyên nhân**: MongoDB không kết nối được

**Giải pháp**:

- Kiểm tra MongoDB URI trong `.env`
- Đảm bảo MongoDB service đang chạy
- Kiểm tra credentials

### 7. CORS Error

**Nguyên nhân**: Request từ front-end bị block

**Giải pháp**:

- Kiểm tra CORS configuration trong backend
- Đảm bảo frontend URL được whitelist

### Tips & Best Practices

✅ **Luôn test theo Priority Order**

- Khỏi vấn đề dependency

✅ **Lưu IDs vào Postman Variables**

- Dễ reuse cho các request tiếp theo

✅ **Kiểm tra Response Status Code**

- 200/201: Success
- 400: Bad Request (check input)
- 401: Unauthorized (check token)
- 403: Forbidden (check role)
- 404: Not Found (check ID)
- 500: Server Error (check logs)

✅ **Sử dụng Tests Script**

- Auto-extract IDs từ response
- Auto-validate response format
- Tư động set environment variables

✅ **Documentasi Response**

- Lưu response examples
- Ghi chú special cases
- Test error scenarios

---

**Version**: 2.0
**Last Updated**: 2024-01-15
**Status**: Production Ready
