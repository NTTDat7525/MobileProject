# Hướng dẫn Chức Năng Đăng Nhập

## Tổng quan

Chức năng đăng nhập đã được cập nhật với các tính năng sau:

- Xác thực người dùng với username và password từ database
- Lưu trữ access token an toàn trong AsyncStorage
- Tự động kiểm tra trạng thái đăng nhập
- Xử lý lỗi chi tiết với thông báo lỗi rõ ràng
- Loading state tốt (vô hiệu hóa input khi đang xử lý)

## Quy trình Đăng Nhập

### Frontend Flow:

```
1. Người dùng nhập username và password
2. Nhấn nút "Continue"
3. Frontend gửi POST request tới: http://192.168.1.9:5001/api/auth/signin
4. Payload: { username: "...", password: "..." }
5. Backend xác minh credentials với database
6. Nếu thành công:
   - Trả về: { accessToken, user, message }
   - Frontend lưu accessToken vào AsyncStorage
   - Frontend lưu user info vào AsyncStorage
   - Điều hướng tới trang home
7. Nếu thất bại:
   - Hiển thị Alert với lỗi cụ thể
   - Giữ lại form để người dùng thử lại
```

### Backend Authentication:

1. **SignUp** (`POST /api/auth/signup`):
   - Kiểm tra input
   - Kiểm tra username duplicate
   - Mã hóa password bằng bcrypt
   - Tạo user trong database

2. **SignIn** (`POST /api/auth/signin`):
   - Kiểm tra input
   - Tìm user từ username
   - So sánh password với bcrypt hash
   - Tạo JWT access token (30 phút)
   - Tạo refresh token ngẫu nhiên (14 ngày)
   - Lưu refresh token trong Session
   - Trả access token và user info

3. **Protected Routes**:
   - Tất cả routes sau `/api/users` cần token
   - Token phải được gửi trong header: `Authorization: Bearer <token>`
   - Middleware kiểm tra token hợp lệ

## Các File Đã Thay Đổi

### Frontend:

1. **`frontend/app/screens/Signin.jsx`**:
   - Thêm validation input
   - Lưu token vào AsyncStorage
   - Xử lý lỗi chi tiết
   - Kiểm tra login status khi mở app
   - Thêm loading state

2. **`frontend/components/SigninForm.jsx`**:
   - Thêm loading prop
   - Vô hiệu hóa inputs khi loading
   - Hiển thị loading indicator
   - Đổi button text thành "Đang đăng nhập..."

3. **`frontend/components/ui/Button.jsx`**:
   - Thêm disabled prop
   - Giảm opacity khi disabled

4. **`frontend/components/ui/Input.jsx`**:
   - Thêm editable prop
   - Thay đổi style khi disabled

5. **`frontend/libs/axiosConfig.js`** (NEW):
   - Cấu hình axios interceptor
   - Tự động thêm token vào requests
   - Xử lý token hết hạn

6. **`frontend/hooks/useAuth.js`** (NEW):
   - Hook để quản lý user info
   - Hook để lấy token

### Backend:

1. **`backend/src/server.js`**:
   - Cấu hình CORS để cho phép credentials
   - Cho phép tất cả origin trong development

## Cách Sử Dụng API

### Đăng Nhập:

```bash
curl -X POST http://192.168.1.9:5001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

**Response thành công (200):**

```json
{
  "message": "User John Doe signed in successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "displayName": "John Doe",
    "role": "user"
  }
}
```

### Gọi API Có Bảo Vệ:

```bash
curl -X GET http://192.168.1.9:5001/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

## Kiểm tra trong Database

### Tạo user test (nếu chưa có):

```bash
# Gọi SignUp endpoint
curl -X POST http://192.168.1.9:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Kiểm tra user trong MongoDB:

```javascript
db.users.find();
// Sẽ hiển thị các user đã tạo
```

## Troubleshooting

### Lỗi "Không thể kết nối đến server":

- Kiểm tra IP server: `192.168.1.9`
- Kiểm tra port: `5001`
- Chạy backend: `npm run dev` trong folder backend
- Mở terminal mới và kiểm tra server chạy

### Lỗi "Tên đăng nhập hoặc mật khẩu không chính xác":

- Kiểm tra Username đúng (không phân biệt HOA/thường)
- Kiểm tra Password đúng (có phân biệt HOA/thường)
- Kiểm tra user tồn tại trong database

### Token hết hạn:

- Access token hết hạn sau 30 phút
- Frontend sẽ xóa token và yêu cầu đăng nhập lại
- (Có thể thêm refresh token logic sau)

## Bảo Mật

1. **Password**:
   - Được mã hóa bằng bcrypt (salt rounds = 10)
   - Không bao giờ lưu plaintext
   - Không bao giờ gửi về client

2. **Token**:
   - JWT với secret key từ .env
   - Hết hạn sau 30 phút
   - Lưu trong AsyncStorage (safer than localStorage trên mobile)

3. **Refresh Token**:
   - Lưu trong database và cookie
   - httpOnly cookie (không access từ JS)
   - Secure flag (chỉ gửi qua HTTPS)

## Các Cải Tiến Trong Tương Lai

- [ ] Thêm refresh token logic
- [ ] Thêm "Remember me" checkbox
- [ ] Thêm forgot password feature
- [ ] Thêm 2FA (Two-factor authentication)
- [ ] Rate limiting để tránh brute force
- [ ] Social login (Google, Facebook)
