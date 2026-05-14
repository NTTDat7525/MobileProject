# Hướng dẫn test API Golden Spoons bằng Postman

## 1. Chuẩn bị và chạy backend

1. Tạo database MySQL:

```sql
CREATE DATABASE mobile CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Tạo file `backend/.env` từ `backend/.env.example`, sau đó cấu hình các biến DB, `ACCESS_TOKEN_SECRET` và mail nếu cần test OTP/email.

3. Cài dependency và chạy backend:

```bash
cd backend
npm install
npm run dev
```

Base URL mặc định:

```text
http://localhost:5001/api
```

Frontend hiện đang hardcode API LAN:

```text
http://192.168.1.8:5001/api
```

Nếu test bằng điện thoại thật, máy chạy backend và điện thoại phải cùng mạng LAN, đồng thời IP phải đúng với máy backend.

## 2. Header dùng chung

Route public không cần token: `/auth/*`, `/verification/*`, `/health`.

Route user/admin cần header:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Route upload ảnh bàn dùng `form-data`, không tự gõ `Content-Type`.

## 3. Thứ tự test đề xuất

1. Auth
2. User
3. Tables
4. Bookings
5. Payments
6. Admin
7. Reports

## 4. Auth

### Đăng ký

`POST http://localhost:5001/api/auth/signup`

Body:

```json
{
  "username": "user02",
  "email": "user02@gmail.com",
  "password": "123456"
}
```

Thành công `201`:

```json
{
  "message": "Đăng ký tài khoản thành công",
  "user": {
    "id": "uuid",
    "username": "user02",
    "email": "user02@gmail.com",
    "role": "user"
  }
}
```

Lỗi mẫu `409`:

```json
{ "message": "Tên đăng nhập đã tồn tại" }
```

### Đăng nhập

`POST http://localhost:5001/api/auth/signin`

Body:

```json
{
  "username": "user02",
  "password": "123456"
}
```

Thành công `200`: lưu `accessToken` để test route cần đăng nhập.

```json
{
  "message": "Đăng nhập thành công",
  "accessToken": "jwt",
  "user": {
    "id": "uuid",
    "username": "user02",
    "email": "user02@gmail.com",
    "role": "user"
  }
}
```

### Đăng xuất

`POST http://localhost:5001/api/auth/signout`

Thành công:

```json
{ "message": "Đăng xuất thành công" }
```

## 5. Verification OTP

### Gửi OTP

`POST http://localhost:5001/api/verification/send-otp`

Body:

```json
{ "email": "user02@gmail.com" }
```

Thành công:

```json
{
  "success": true,
  "message": "Mã xác thực đã được gửi đến email của bạn"
}
```

### Xác thực OTP

`POST http://localhost:5001/api/verification/verify-otp`

Body:

```json
{
  "email": "user02@gmail.com",
  "otp": "123456"
}
```

Lỗi mẫu:

```json
{
  "success": false,
  "message": "Mã xác thực không đúng"
}
```

## 6. User

### Lấy thông tin tài khoản

`GET http://localhost:5001/api/users/me`

Quyền: user/admin đã đăng nhập.

### Cập nhật hồ sơ

`PUT http://localhost:5001/api/users/profile`

Body:

```json
{
  "phone": "0912345678",
  "bio": "Khách hàng thân thiết"
}
```

Thành công:

```json
{
  "message": "Cập nhật hồ sơ thành công",
  "user": {}
}
```

## 7. Tables

### User xem danh sách bàn

`GET http://localhost:5001/api/users/tables`

Query params tùy chọn:

```text
location=Trong nhà
capacity=4
```

Thành công:

```json
{
  "tables": [
    {
      "id": "uuid",
      "tableName": "T01",
      "capacity": 2,
      "location": "Trong nhà",
      "status": "Có sẵn",
      "price": "50000.00"
    }
  ]
}
```

### User xem chi tiết bàn

`GET http://localhost:5001/api/users/tables/:id`

### Admin xem trạng thái bàn

`GET http://localhost:5001/api/admin/tables/status`

Quyền: admin.

### Admin thêm bàn

`POST http://localhost:5001/api/admin/tables`

Quyền: admin. Dùng `form-data`.

Fields:

```text
tableName: T10
capacity: 4
location: Trong nhà
price: 150000
status: Có sẵn
image: file ảnh, optional
```

Thành công:

```json
{
  "message": "Thêm bàn thành công",
  "table": {}
}
```

### Admin cập nhật bàn

`PUT http://localhost:5001/api/admin/tables/:id`

Quyền: admin. Dùng `form-data` tương tự thêm bàn. Nếu không gửi `image`, ảnh cũ được giữ nguyên.

### Admin xóa bàn

`DELETE http://localhost:5001/api/admin/tables/:id`

Lỗi mẫu nếu bàn có booking hoạt động:

```json
{ "message": "Không thể xóa bàn đang có đặt bàn hoạt động" }
```

## 8. Bookings

### User tạo đặt bàn

`POST http://localhost:5001/api/users/bookings`

Body:

```json
{
  "tableId": "uuid",
  "time": "2026-05-20T12:00:00.000Z",
  "numberOfGuests": 4,
  "guestEmail": "user02@gmail.com",
  "guestPhone": "0912345678",
  "specialRequests": "Ngồi gần cửa sổ",
  "PaymentMethod": "tiền mặt"
}
```

`PaymentMethod` hợp lệ:

```text
tiền mặt
chuyển khoản ngân hàng
```

Thành công:

```json
{
  "message": "Đặt bàn thành công",
  "booking": {
    "id": "uuid",
    "status": "đang chờ",
    "paymentStatus": "chưa thanh toán"
  }
}
```

### User xem lịch sử đặt bàn

`GET http://localhost:5001/api/users/bookings`

### User xem chi tiết đặt bàn

`GET http://localhost:5001/api/users/bookings/:id`

### User sửa đặt bàn

`PUT http://localhost:5001/api/users/bookings/:id`

Chỉ sửa được booking trạng thái `đang chờ`.

Body:

```json
{
  "time": "2026-05-21T13:00:00.000Z",
  "numberOfGuests": 3,
  "guestEmail": "user02@gmail.com",
  "guestPhone": "0912345678",
  "specialRequests": "Không gian yên tĩnh",
  "PaymentMethod": "chuyển khoản ngân hàng"
}
```

### User hủy đặt bàn

`PUT http://localhost:5001/api/users/bookings/:id/cancel`

Thành công:

```json
{ "message": "Hủy đặt bàn thành công" }
```

## 9. Payments

### User cập nhật trạng thái thanh toán

`PUT http://localhost:5001/api/users/bookings/:id/payment`

Body:

```json
{ "paymentStatus": "đã thanh toán" }
```

### User lấy thông tin QR VietQR

`GET http://localhost:5001/api/users/bookings/:id/payment-info`

Quyền: user sở hữu booking. Chỉ dùng cho booking có `PaymentMethod` là `chuyển khoản ngân hàng`.

Response mẫu:

```json
{
  "payment": {
    "bankCode": "MB",
    "accountNo": "123456789",
    "accountName": "Golden Spoons",
    "amount": 120000,
    "paymentCode": "GS123456789ABC",
    "addInfo": "GS123456789ABC",
    "qrImageUrl": "https://img.vietqr.io/image/MB-123456789-compact2.png?amount=120000&addInfo=GS123456789ABC&accountName=Golden%20Spoons"
  },
  "booking": {}
}
```

Giá trị hợp lệ:

```text
chưa thanh toán
đã thanh toán
```

### Admin cập nhật trạng thái thanh toán

`PUT http://localhost:5001/api/admin/bookings/:id/payment`

Quyền: admin.

Body:

```json
{ "paymentStatus": "đã thanh toán" }
```

### Webhook SePay

`POST http://localhost:5001/api/payments/sepay/webhook`

Route public. Cấu hình URL này trên SePay để nhận IPN biến động số dư.

Header theo API Key:

```http
Authorization: Apikey <SEPAY_SECRET>
Content-Type: application/json
```

Hoặc HMAC:

```http
X-SePay-Timestamp: 1768312100
X-SePay-Signature: sha256=<hmac_sha256(timestamp.raw_body, SEPAY_SECRET)>
Content-Type: application/json
```

Body giả lập:

```json
{
  "gateway": "MBBank",
  "transaction_date": "2026-05-20 12:00:00",
  "account_number": "123456789",
  "payment_code": null,
  "content": "GS123456789ABC",
  "transfer_type": "credit",
  "amount": 120000,
  "reference_code": "FT123",
  "accumulated": 0,
  "transaction_id": "sepay_tx_001"
}
```

Thành công:

```json
{
  "success": true,
  "message": "Cập nhật thanh toán thành công",
  "bookingId": "uuid"
}
```

## 10. Admin

### Admin xem toàn bộ đặt bàn

`GET http://localhost:5001/api/admin/bookings`

### Admin cập nhật trạng thái đặt bàn

`PUT http://localhost:5001/api/admin/bookings/:id/status`

Body:

```json
{ "status": "đã xác nhận" }
```

Trạng thái hợp lệ:

```text
đang chờ
đã xác nhận
đã check-in
hoàn thành
đã hủy
```

### Admin hủy đặt bàn

`PUT http://localhost:5001/api/admin/bookings/:id/cancel`

### Admin xem danh sách người dùng

`GET http://localhost:5001/api/admin/users`

Quyền: admin.

## 11. Reports

### Admin xem báo cáo

`GET http://localhost:5001/api/admin/reports`

Quyền: admin.

Response mẫu:

```json
{
  "report": {
    "totalUsers": 2,
    "totalBookings": 5,
    "totalTables": 3,
    "paidBookings": 1,
    "revenue": 150000,
    "byStatus": {
      "đang chờ": 1,
      "đã xác nhận": 1,
      "đã check-in": 0,
      "hoàn thành": 2,
      "đã hủy": 1
    }
  }
}
```

## 12. Health check

`GET http://localhost:5001/api/health`

Response:

```json
{ "message": "Backend Golden Spoons đang hoạt động" }
```
