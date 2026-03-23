# Hướng Dẫn Chi Tiết Test Toàn Bộ API Backend

## Mục Lục

1. [Chuẩn Bị Môi Trường](#chuẩn-bị-môi-trường)
2. [Thông Tin Chung](#thông-tin-chung)
3. [Authentication APIs](#authentication-apis)
4. [User APIs](#user-apis)
5. [Admin APIs](#admin-apis)
6. [Payment APIs](#payment-apis)
7. [Testing Tools & Methods](#testing-tools--methods)
8. [Troubleshooting](#troubleshooting)

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

## Authentication APIs

### 1. Sign Up (Đăng Ký)

**Endpoint**: `POST /auth/signup`

**Description**: Tạo tài khoản người dùng mới

**Request Body**:

```json
{
  "username": "nguyenvana",
  "email": "a@example.com",
  "password": "Password123!",
  "displayName": "Nguyễn Văn A"
}
```

**Response** (Success - 201):

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "nguyenvana",
    "email": "a@example.com",
    "displayName": "Nguyễn Văn A",
    "role": "user"
  }
}
```

**Response** (Error - 400):

```json
{
  "success": false,
  "message": "Username already exists"
}
```

**cURL Example**:

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nguyenvana",
    "email": "a@example.com",
    "password": "Password123!",
    "displayName": "Nguyễn Văn A"
  }'
```

**Postman Steps**:

1. Set method to `POST`
2. URL: `http://localhost:5001/api/auth/signup`
3. Go to Body tab → select `raw` → JSON
4. Paste request body
5. Click Send

---

### 2. Sign In (Đăng Nhập)

**Endpoint**: `POST /auth/signin`

**Description**: Đăng nhập và nhận JWT token

**Request Body**:

```json
{
  "email": "a@example.com",
  "password": "Password123!"
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "507f1f77bcf86cd799439011",
    "username": "nguyenvana",
    "email": "a@example.com",
    "role": "user"
  }
}
```

**Important**: Lưu lại `token` từ response, sẽ dùng cho các request tiếp theo

**cURL Example**:

```bash
curl -X POST http://localhost:5001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "a@example.com",
    "password": "Password123!"
  }'
```

---

### 3. Sign Out (Đăng Xuất)

**Endpoint**: `POST /auth/signout`

**Description**: Đăng xuất tài khoản

**Headers Required**:

```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**: (Empty)

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**cURL Example**:

```bash
curl -X POST http://localhost:5001/api/auth/signout \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## User APIs

**Note**: Tất cả User APIs yêu cầu authentication (Bearer token)

### 1. Get Current User Info

**Endpoint**: `GET /users/me`

**Description**: Lấy thông tin user hiện tại (từ token)

**Headers Required**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "nguyenvana",
    "email": "a@example.com",
    "displayName": "Nguyễn Văn A",
    "role": "user"
  }
}
```

**cURL Example**:

```bash
curl -X GET http://localhost:5001/api/users/me \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json"
```

---

### 2. Get User Profile

**Endpoint**: `GET /users/profile/:userId`

**Description**: Lấy thông tin profile của một user

**URL Parameters**:

- `userId`: ID của user (String)

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "nguyenvana",
    "email": "a@example.com",
    "displayName": "Nguyễn Văn A",
    "bio": "Love good food",
    "phone": "0912345678",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**cURL Example**:

```bash
curl -X GET http://localhost:5001/api/users/profile/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

### 3. Update User Profile

**Endpoint**: `PUT /users/profile`

**Description**: Cập nhật thông tin profile người dùng

**Request Body**:

```json
{
  "displayName": "Nguyễn Văn A Updated",
  "bio": "Passionate about food",
  "phone": "0987654321"
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "displayName": "Nguyễn Văn A Updated",
    "bio": "Passionate about food",
    "phone": "0987654321"
  }
}
```

**cURL Example**:

```bash
curl -X PUT http://localhost:5001/api/users/profile \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Nguyễn Văn A Updated",
    "bio": "Passionate about food",
    "phone": "0987654321"
  }'
```

---

### 4. Get All Tables

**Endpoint**: `GET /users/tables`

**Description**: Lấy danh sách tất cả các bàn phục vụ

**Query Parameters** (Optional):

- `status`: Filter by status (available, booked)
- `capacity`: Filter by minimum capacity

**Response** (Success - 200):

```json
{
  "success": true,
  "data": [
    {
      "tableId": "507f1f77bcf86cd799439012",
      "tableNumber": "A1",
      "capacity": 2,
      "status": "available",
      "location": "Khu vực A"
    },
    {
      "tableId": "507f1f77bcf86cd799439013",
      "tableNumber": "B1",
      "capacity": 4,
      "status": "booked",
      "location": "Khu vực B"
    }
  ]
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:5001/api/users/tables" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"

# With filters
curl -X GET "http://localhost:5001/api/users/tables?status=available&capacity=2" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

### 5. Get Table by ID

**Endpoint**: `GET /users/tables/:tableId`

**Description**: Lấy thông tin chi tiết của một bàn

**URL Parameters**:

- `tableId`: ID của bàn (String)

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "tableId": "507f1f77bcf86cd799439012",
    "tableNumber": "A1",
    "capacity": 2,
    "status": "available",
    "location": "Khu vực A",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**cURL Example**:

```bash
curl -X GET http://localhost:5001/api/users/tables/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

### 6. Create Booking

**Endpoint**: `POST /users/bookings`

**Description**: Tạo booking mới cho một bàn

**Request Body**:

```json
{
  "tableId": "507f1f77bcf86cd799439012",
  "bookingDate": "2024-02-20",
  "bookingTime": "19:00",
  "numberOfGuests": 2,
  "notes": "Tôi muốn bàn gần cửa sổ"
}
```

**Response** (Success - 201):

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "bookingId": "607f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "tableId": "507f1f77bcf86cd799439012",
    "bookingDate": "2024-02-20",
    "bookingTime": "19:00",
    "numberOfGuests": 2,
    "notes": "Tôi muốn bàn gần cửa sổ",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**cURL Example**:

```bash
curl -X POST http://localhost:5001/api/users/bookings \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "tableId": "507f1f77bcf86cd799439012",
    "bookingDate": "2024-02-20",
    "bookingTime": "19:00",
    "numberOfGuests": 2,
    "notes": "Tôi muốn bàn gần cửa sổ"
  }'
```

---

### 7. Get User Bookings

**Endpoint**: `GET /users/bookings`

**Description**: Lấy danh sách bookings của user

**Query Parameters** (Optional):

- `status`: Filter by status (pending, confirmed, completed, cancelled)
- `sort`: Sort by date (asc, desc)

**Response** (Success - 200):

```json
{
  "success": true,
  "data": [
    {
      "bookingId": "607f1f77bcf86cd799439014",
      "tableId": "507f1f77bcf86cd799439012",
      "tableNumber": "A1",
      "bookingDate": "2024-02-20",
      "bookingTime": "19:00",
      "numberOfGuests": 2,
      "status": "confirmed",
      "notes": "Tôi muốn bàn gần cửa sổ"
    }
  ]
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:5001/api/users/bookings" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"

# With filters
curl -X GET "http://localhost:5001/api/users/bookings?status=confirmed" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

### 8. Get Booking by ID

**Endpoint**: `GET /users/bookings/:bookingId`

**Description**: Lấy thông tin chi tiết của một booking

**URL Parameters**:

- `bookingId`: ID của booking (String)

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "bookingId": "607f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "tableId": "507f1f77bcf86cd799439012",
    "tableNumber": "A1",
    "bookingDate": "2024-02-20",
    "bookingTime": "19:00",
    "numberOfGuests": 2,
    "status": "confirmed",
    "notes": "Tôi muốn bàn gần cửa sổ",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**cURL Example**:

```bash
curl -X GET http://localhost:5001/api/users/bookings/607f1f77bcf86cd799439014 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

### 9. Update Booking

**Endpoint**: `PUT /users/bookings/:bookingId`

**Description**: Cập nhật thông tin booking (chỉ những bookings chưa confirm)

**URL Parameters**:

- `bookingId`: ID của booking (String)

**Request Body**:

```json
{
  "bookingDate": "2024-02-21",
  "bookingTime": "20:00",
  "numberOfGuests": 3,
  "notes": "Bàn gần cửa sổ, có điều hòa"
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Booking updated successfully",
  "data": {
    "bookingId": "607f1f77bcf86cd799439014",
    "bookingDate": "2024-02-21",
    "bookingTime": "20:00",
    "numberOfGuests": 3,
    "notes": "Bàn gần cửa sổ, có điều hòa"
  }
}
```

**cURL Example**:

```bash
curl -X PUT http://localhost:5001/api/users/bookings/607f1f77bcf86cd799439014 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingDate": "2024-02-21",
    "bookingTime": "20:00",
    "numberOfGuests": 3,
    "notes": "Bàn gần cửa sổ, có điều hòa"
  }'
```

---

### 10. Cancel Booking

**Endpoint**: `PUT /users/bookings/:bookingId/cancel`

**Description**: Hủy một booking

**URL Parameters**:

- `bookingId`: ID của booking (String)

**Request Body**: (Optional)

```json
{
  "cancellationReason": "Tôi không thể đến được"
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "bookingId": "607f1f77bcf86cd799439014",
    "status": "cancelled",
    "cancellationReason": "Tôi không thể đến được",
    "cancelledAt": "2024-01-15T11:00:00Z"
  }
}
```

**cURL Example**:

```bash
curl -X PUT http://localhost:5001/api/users/bookings/607f1f77bcf86cd799439014/cancel \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "cancellationReason": "Tôi không thể đến được"
  }'
```

---

### 11. Get User Orders

**Endpoint**: `GET /users/orders`

**Description**: Lấy danh sách đơn hàng của user

**Query Parameters** (Optional):

- `status`: Filter by status (pending, processing, completed, cancelled)
- `limit`: Giới hạn số kết quả (default: 10)
- `skip`: Bỏ qua số kết quả đầu tiên (default: 0)

**Response** (Success - 200):

```json
{
  "success": true,
  "data": [
    {
      "orderId": "507f1f77bcf86cd799439015",
      "bookingId": "607f1f77bcf86cd799439014",
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
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:5001/api/users/orders?status=completed" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

### 12. Get Order by ID

**Endpoint**: `GET /users/orders/:orderId`

**Description**: Lấy thông tin chi tiết của một đơn hàng

**URL Parameters**:

- `orderId`: ID của order (String)

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "orderId": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439011",
    "bookingId": "607f1f77bcf86cd799439014",
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
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**cURL Example**:

```bash
curl -X GET http://localhost:5001/api/users/orders/507f1f77bcf86cd799439015 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## Admin APIs

**Note**: Tất cả Admin APIs yêu cầu:

1. Authentication (Bearer token)
2. Role phải là "admin"

### 1. Get Revenue

**Endpoint**: `GET /admin/revenue`

**Description**: Lấy tổng doanh thu

**Query Parameters** (Optional):

- `startDate`: Ngày bắt đầu (YYYY-MM-DD)
- `endDate`: Ngày kết thúc (YYYY-MM-DD)
- `period`: Day/Week/Month (default: Day)

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "totalRevenue": 5000000,
    "period": "2024-01-15",
    "orderCount": 15,
    "averageOrderValue": 333333
  }
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:5001/api/admin/revenue?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

---

### 2. Get Order Statistics

**Endpoint**: `GET /admin/orders/stats`

**Description**: Lấy thống kê đơn hàng

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "completedOrders": 140,
    "cancelledOrders": 5,
    "pendingOrders": 5,
    "averageOrderValue": 350000
  }
}
```

**cURL Example**:

```bash
curl -X GET http://localhost:5001/api/admin/orders/stats \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

---

### 3. Get Table Status

**Endpoint**: `GET /admin/tables/status`

**Description**: Lấy trạng thái tất cả các bàn

**Response** (Success - 200):

```json
{
  "success": true,
  "data": [
    {
      "tableId": "507f1f77bcf86cd799439012",
      "tableNumber": "A1",
      "status": "available",
      "capacity": 2,
      "currentGuests": 0,
      "lastUsedAt": "2024-01-14T20:00:00Z"
    },
    {
      "tableId": "507f1f77bcf86cd799439013",
      "tableNumber": "B1",
      "status": "occupied",
      "capacity": 4,
      "currentGuests": 3,
      "lastUsedAt": "2024-01-15T19:30:00Z"
    }
  ]
}
```

**cURL Example**:

```bash
curl -X GET http://localhost:5001/api/admin/tables/status \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

---

### 4. Add Table

**Endpoint**: `POST /admin/tables`

**Description**: Thêm một bàn mới

**Request Body**:

```json
{
  "tableNumber": "C1",
  "capacity": 6,
  "location": "Khu vực C"
}
```

**Response** (Success - 201):

```json
{
  "success": true,
  "message": "Table added successfully",
  "data": {
    "tableId": "707f1f77bcf86cd799439018",
    "tableNumber": "C1",
    "capacity": 6,
    "location": "Khu vực C",
    "status": "available",
    "createdAt": "2024-01-15T11:00:00Z"
  }
}
```

**cURL Example**:

```bash
curl -X POST http://localhost:5001/api/admin/tables \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "tableNumber": "C1",
    "capacity": 6,
    "location": "Khu vực C"
  }'
```

---

### 5. Update Table

**Endpoint**: `PUT /admin/tables/:tableId`

**Description**: Cập nhật thông tin bàn

**URL Parameters**:

- `tableId`: ID của bàn (String)

**Request Body**:

```json
{
  "tableNumber": "C1-Updated",
  "capacity": 8,
  "location": "Khu vực C - Trung tâm"
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Table updated successfully",
  "data": {
    "tableId": "707f1f77bcf86cd799439018",
    "tableNumber": "C1-Updated",
    "capacity": 8,
    "location": "Khu vực C - Trung tâm"
  }
}
```

**cURL Example**:

```bash
curl -X PUT http://localhost:5001/api/admin/tables/707f1f77bcf86cd799439018 \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "tableNumber": "C1-Updated",
    "capacity": 8,
    "location": "Khu vực C - Trung tâm"
  }'
```

---

### 6. Delete Table

**Endpoint**: `DELETE /admin/tables/:tableId`

**Description**: Xóa một bàn

**URL Parameters**:

- `tableId`: ID của bàn (String)

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Table deleted successfully"
}
```

**cURL Example**:

```bash
curl -X DELETE http://localhost:5001/api/admin/tables/707f1f77bcf86cd799439018 \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

---

### 7. Create Food Item

**Endpoint**: `POST /admin/foods`

**Description**: Thêm một mục ăn uống mới

**Request Body**:

```json
{
  "name": "Phở Bò",
  "description": "Phở bò truyền thống Hà Nội",
  "price": 80000,
  "category": "Mains",
  "image": "pho-bo.jpg",
  "available": true
}
```

**Response** (Success - 201):

```json
{
  "success": true,
  "message": "Food item created successfully",
  "data": {
    "foodId": "807f1f77bcf86cd799439019",
    "name": "Phở Bò",
    "description": "Phở bò truyền thống Hà Nội",
    "price": 80000,
    "category": "Mains",
    "image": "pho-bo.jpg",
    "available": true,
    "createdAt": "2024-01-15T11:00:00Z"
  }
}
```

**cURL Example**:

```bash
curl -X POST http://localhost:5001/api/admin/foods \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Phở Bò",
    "description": "Phở bò truyền thống Hà Nội",
    "price": 80000,
    "category": "Mains",
    "image": "pho-bo.jpg",
    "available": true
  }'
```

---

### 8. Get All Foods

**Endpoint**: `GET /admin/foods`

**Description**: Lấy danh sách tất cả mục ăn uống

**Query Parameters** (Optional):

- `category`: Lọc theo category
- `available`: Filter by availability (true/false)
- `search`: Tìm kiếm theo tên

**Response** (Success - 200):

```json
{
  "success": true,
  "data": [
    {
      "foodId": "807f1f77bcf86cd799439019",
      "name": "Phở Bò",
      "description": "Phở bò truyền thống Hà Nội",
      "price": 80000,
      "category": "Mains",
      "image": "pho-bo.jpg",
      "available": true
    }
  ]
}
```

**cURL Example**:

```bash
curl -X GET "http://localhost:5001/api/admin/foods?category=Mains&available=true" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

---

### 9. Get Food by ID

**Endpoint**: `GET /admin/foods/:foodId`

**Description**: Lấy thông tin chi tiết của một mục ăn uống

**URL Parameters**:

- `foodId`: ID của food (String)

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "foodId": "807f1f77bcf86cd799439019",
    "name": "Phở Bò",
    "description": "Phở bò truyền thống Hà Nội",
    "price": 80000,
    "category": "Mains",
    "image": "pho-bo.jpg",
    "available": true,
    "createdAt": "2024-01-15T11:00:00Z"
  }
}
```

**cURL Example**:

```bash
curl -X GET http://localhost:5001/api/admin/foods/807f1f77bcf86cd799439019 \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

---

### 10. Update Food Item

**Endpoint**: `PUT /admin/foods/:foodId`

**Description**: Cập nhật thông tin mục ăn uống

**URL Parameters**:

- `foodId`: ID của food (String)

**Request Body**:

```json
{
  "name": "Phở Bò Đặc Biệt",
  "price": 95000,
  "description": "Phở bò ngon nhất Hà Nội",
  "available": true
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Food item updated successfully",
  "data": {
    "foodId": "807f1f77bcf86cd799439019",
    "name": "Phở Bò Đặc Biệt",
    "price": 95000
  }
}
```

**cURL Example**:

```bash
curl -X PUT http://localhost:5001/api/admin/foods/807f1f77bcf86cd799439019 \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Phở Bò Đặc Biệt",
    "price": 95000,
    "description": "Phở bò ngon nhất Hà Nội",
    "available": true
  }'
```

---

### 11. Delete Food Item

**Endpoint**: `DELETE /admin/foods/:foodId`

**Description**: Xóa một mục ăn uống

**URL Parameters**:

- `foodId`: ID của food (String)

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Food item deleted successfully"
}
```

**cURL Example**:

```bash
curl -X DELETE http://localhost:5001/api/admin/foods/807f1f77bcf86cd799439019 \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

---

### 12. Update Booking Status

**Endpoint**: `PUT /admin/bookings/:bookingId/status`

**Description**: Cập nhật trạng thái booking (confirm, reject, pending)

**URL Parameters**:

- `bookingId`: ID của booking (String)

**Request Body**:

```json
{
  "status": "confirmed",
  "adminNotes": "Đã xác nhận, bàn A1 lúc 19:00"
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": {
    "bookingId": "607f1f77bcf86cd799439014",
    "status": "confirmed",
    "adminNotes": "Đã xác nhận, bàn A1 lúc 19:00"
  }
}
```

**cURL Example**:

```bash
curl -X PUT http://localhost:5001/api/admin/bookings/607f1f77bcf86cd799439014/status \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "adminNotes": "Đã xác nhận, bàn A1 lúc 19:00"
  }'
```

---

### 13. Cancel Booking (Admin)

**Endpoint**: `PUT /admin/bookings/:bookingId/cancel`

**Description**: Admin hủy một booking

**URL Parameters**:

- `bookingId`: ID của booking (String)

**Request Body**:

```json
{
  "cancellationReason": "Bàn đã được đặt bởi khách VIP",
  "refund": true
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Booking cancelled by admin",
  "data": {
    "bookingId": "607f1f77bcf86cd799439014",
    "status": "cancelled",
    "cancellationReason": "Bàn đã được đặt bởi khách VIP"
  }
}
```

**cURL Example**:

```bash
curl -X PUT http://localhost:5001/api/admin/bookings/607f1f77bcf86cd799439014/cancel \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "cancellationReason": "Bàn đã được đặt bởi khách VIP",
    "refund": true
  }'
```

---

### 14. Create Order (Admin)

**Endpoint**: `POST /admin/orders`

**Description**: Admin tạo order cho khách hàng

**Request Body**:

```json
{
  "bookingId": "607f1f77bcf86cd799439014",
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
  "notes": "Không cay"
}
```

**Response** (Success - 201):

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "507f1f77bcf86cd799439015",
    "bookingId": "607f1f77bcf86cd799439014",
    "items": [
      {
        "foodId": "807f1f77bcf86cd799439019",
        "foodName": "Phở Bò",
        "quantity": 2,
        "price": 80000,
        "totalPrice": 160000
      }
    ],
    "totalAmount": 160000,
    "status": "pending",
    "notes": "Không cay"
  }
}
```

**cURL Example**:

```bash
curl -X POST http://localhost:5001/api/admin/orders \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "607f1f77bcf86cd799439014",
    "items": [
      {
        "foodId": "807f1f77bcf86cd799439019",
        "quantity": 2
      }
    ],
    "notes": "Không cay"
  }'
```

---

### 15. Update Order Status

**Endpoint**: `PUT /admin/orders/:orderId/status`

**Description**: Cập nhật trạng thái order (pending, processing, completed, cancelled)

**URL Parameters**:

- `orderId`: ID của order (String)

**Request Body**:

```json
{
  "status": "processing"
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "orderId": "507f1f77bcf86cd799439015",
    "status": "processing"
  }
}
```

**cURL Example**:

```bash
curl -X PUT http://localhost:5001/api/admin/orders/507f1f77bcf86cd799439015/status \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "processing"
  }'
```

---

### 16. Add Item to Order

**Endpoint**: `PUT /admin/orders/:orderId/add-item`

**Description**: Thêm mục ăn uống vào order hiện có

**URL Parameters**:

- `orderId`: ID của order (String)

**Request Body**:

```json
{
  "foodId": "807f1f77bcf86cd799439020",
  "quantity": 2
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Item added to order successfully",
  "data": {
    "orderId": "507f1f77bcf86cd799439015",
    "items": [
      {
        "foodId": "807f1f77bcf86cd799439019",
        "foodName": "Phở Bò",
        "quantity": 2
      },
      {
        "foodId": "807f1f77bcf86cd799439020",
        "foodName": "Cơm Tấm",
        "quantity": 2
      }
    ],
    "totalAmount": 260000
  }
}
```

**cURL Example**:

```bash
curl -X PUT http://localhost:5001/api/admin/orders/507f1f77bcf86cd799439015/add-item \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "foodId": "807f1f77bcf86cd799439020",
    "quantity": 2
  }'
```

---

### 17. Pay Order

**Endpoint**: `PUT /admin/orders/:orderId/pay`

**Description**: Xử lý thanh toán cho order

**URL Parameters**:

- `orderId`: ID của order (String)

**Request Body**:

```json
{
  "paymentMethod": "cash",
  "amount": 260000
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "orderId": "507f1f77bcf86cd799439015",
    "paymentStatus": "paid",
    "amount": 260000,
    "paymentMethod": "cash"
  }
}
```

**cURL Example**:

```bash
curl -X PUT http://localhost:5001/api/admin/orders/507f1f77bcf86cd799439015/pay \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "cash",
    "amount": 260000
  }'
```

---

## Payment APIs

### 1. Create QR Code for Payment

**Endpoint**: `POST /create-qr`

**Description**: Tạo QR code thanh toán VNPay

**Request Body** (Optional - sử dụng values mặc định):

```json
{}
```

**Response** (Success - 201):

```json
{
  "success": true,
  "data": {
    "paymentLink": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
    "qrCode": "...",
    "transactionId": "12345"
  }
}
```

**cURL Example**:

```bash
curl -X POST http://localhost:5001/api/create-qr \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

### 2. Payment Return

**Endpoint**: `POST /payment-return`

**Description**: Nhận callback từ VNPay sau khi thanh toán

**Request Body**:

```json
{
  "vnp_TransactionNo": "12345",
  "vnp_Amount": "5000000",
  "vnp_OrderInfo": "Payment for order",
  "vnp_ResponseCode": "00"
}
```

**Response** (Success - 200):

```json
{
  "message": "Payment return received successfully",
  "data": {
    "vnp_TransactionNo": "12345",
    "vnp_Amount": "5000000"
  }
}
```

**cURL Example**:

```bash
curl -X POST http://localhost:5001/api/payment-return \
  -H "Content-Type: application/json" \
  -d '{
    "vnp_TransactionNo": "12345",
    "vnp_Amount": "5000000",
    "vnp_OrderInfo": "Payment for order",
    "vnp_ResponseCode": "00"
  }'
```

---

## Testing Tools & Methods

### Option 1: Postman (Recommended)

**Step 1: Create Collection**

1. Open Postman
2. Click "Create" → "Collection"
3. Name it "Restaurant API Testing"

**Step 2: Setup Variables**

1. Click on collection → "Variables" tab
2. Add variables:
   - `baseUrl`: `http://localhost:5001/api`
   - `token`: (będzie ustawiony po login)
   - `adminToken`: (token admin account)

**Step 3: Import Requests**
Create requests cho từng endpoint sử dụng variables:

```
POST {{baseUrl}}/auth/signin
Authorization: Bearer {{token}}
```

**Step 4: Set Token dynamically**

1. In Sign In request → Tests tab, add:

```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.data.token);
```

### Option 2: cURL (Command Line)

**Basic usage:**

```bash
curl -X GET http://localhost:5001/api/users/me \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json"
```

**Save token to variable:**

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.data.token')

# Use token
curl -X GET http://localhost:5001/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

### Option 3: REST Client (VS Code Extension)

**Install Extension:**

1. Open Extensions (Ctrl+Shift+X)
2. Search "REST Client"
3. Install by Huachao Mao

**Create file `test.http`:**

```http
### Sign In
POST http://localhost:5001/api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

### Get Current User (use token from signin response)
GET http://localhost:5001/api/users/me
Authorization: Bearer <TOKEN_FROM_SIGNIN>
```

**Click "Send Request" above each request**

### Option 4: Insomnia

**Similar to Postman:**

1. Create Request
2. Set method and URL
3. Add headers
4. Add body (if needed)
5. Click "Send"

---

## Test Scenarios

### Scenario 1: Complete User Booking Flow

1. **Sign Up** → Create new user
2. **Sign In** → Get JWT token
3. **Get Tables** → View available tables
4. **Create Booking** → Book a table
5. **Get Bookings** → Verify booking created
6. **Update Booking** → Change time/date
7. **Cancel Booking** → Cancel the booking

### Scenario 2: Admin Order Management Flow

1. **Sign In as Admin** → Get admin token
2. **Get Foods** → View available food items
3. **Get Table Status** → Check table availability
4. **Create Order** → Create new order
5. **Add Item to Order** → Add more items
6. **Update Order Status** → Change status to "completed"
7. **Get Revenue** → Check total revenue

### Scenario 3: Payment Flow

1. **Create QR** → Generate payment QR code
2. **Simulate Payment** → Use QR code to pay
3. **Payment Return** → Verify payment callback
4. **Update Order Status** → Mark order as paid

---

## Troubleshooting

### Issue 1: "Unauthorized" (401) Error

**Possible Causes:**

- Token has expired
- Token is invalid or malformed
- Header format incorrect

**Solution:**

- Login again to get fresh token
- Ensure header format: `Authorization: Bearer <TOKEN>`
- Check token in jwt.io validator

### Issue 2: "Forbidden" (403) Error

**Possible Causes:**

- User role is not "admin" but endpoint requires admin
- User doesn't own the resource

**Solution:**

- Check user role: call `GET /users/me`
- For admin endpoints, use admin account token
- For user resources, ensure you own the resource

### Issue 3: "Not Found" (404) Error

**Possible Causes:**

- Resource ID doesn't exist
- Wrong endpoint URL
- Typo in URL path

**Solution:**

- Verify resource exists first
- Double-check endpoint URL and parameters
- Check database for valid IDs

### Issue 4: "Bad Request" (400) Error

**Possible Causes:**

- Missing required fields
- Invalid data format
- Invalid data type

**Solution:**

- Check request body against examples
- Ensure all required fields are present
- Verify data types (string, number, etc.)

### Issue 5: Server Not Starting

**Possible Causes:**

- Port 5001 already in use
- MongoDB not connected
- Missing environment variables

**Solution:**

```bash
# Check if port is in use
netstat -ano | findstr :5001

# Kill process if needed (Windows)
taskkill /PID <PID> /F

# Restart server
npm run dev
```

### Issue 6: CORS Error

**Message:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:**

- Server CORS is configured to allow all origins
- Check if origin is in allowedHeaders
- Frontend should include proper headers

---

## Best Practices for Testing

### 1. Test Order

- Always test authentication first
- Test valid scenarios before error cases
- Test with valid IDs before non-existent IDs

### 2. Data Validation

- Test with empty strings
- Test with null values
- Test with invalid email formats
- Test with very long strings

### 3. Authentication Testing

- Test with no token
- Test with invalid token
- Test with expired token
- Test with wrong role

### 4. Performance Testing

- Test with large data sets
- Check response times
- Monitor server memory usage

### 5. Documentation

- Save test collections for future use
- Document any API quirks
- Keep track of successful requests

---

## Quick Reference

| Method | Endpoint                   | Auth Required | Role  | Description           |
| ------ | -------------------------- | ------------- | ----- | --------------------- |
| POST   | /auth/signup               | No            | —     | Đăng ký tài khoản     |
| POST   | /auth/signin               | No            | —     | Đăng nhập             |
| POST   | /auth/signout              | Yes           | —     | Đăng xuất             |
| GET    | /users/me                  | Yes           | user  | Lấy info user         |
| GET    | /users/profile/:id         | Yes           | user  | Lấy profile user      |
| PUT    | /users/profile             | Yes           | user  | Cập nhật profile      |
| GET    | /users/tables              | Yes           | user  | Lấy danh sách bàn     |
| POST   | /users/bookings            | Yes           | user  | Tạo booking           |
| GET    | /users/bookings            | Yes           | user  | Lấy bookings của user |
| PUT    | /users/bookings/:id        | Yes           | user  | Cập nhật booking      |
| PUT    | /users/bookings/:id/cancel | Yes           | user  | Hủy booking           |
| GET    | /users/orders              | Yes           | user  | Lấy orders của user   |
| GET    | /admin/revenue             | Yes           | admin | Lấy doanh thu         |
| POST   | /admin/tables              | Yes           | admin | Thêm bàn mới          |
| POST   | /admin/foods               | Yes           | admin | Thêm mục ăn mới       |
| POST   | /admin/orders              | Yes           | admin | Tạo order             |
| PUT    | /admin/orders/:id/status   | Yes           | admin | Cập nhật status order |
| POST   | /create-qr                 | No            | —     | Tạo QR thanh toán     |

---

## Additional Resources

- **JWT Token**: https://jwt.io
- **Postman Documentation**: https://learning.postman.com
- **REST API Best Practices**: https://restfulapi.net
- **HTTP Status Codes**: https://httpwg.org/specs/rfc9110.html

---

**Last Updated**: 2024-01-15
**Backend Version**: 1.0.0
**Database**: MongoDB
