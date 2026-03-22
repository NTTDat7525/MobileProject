# Hướng Dẫn Chức Năng Đăng Ký (Sign Up)

## Tổng quan

Chức năng đăng ký đã được cập nhật với các tính năng:

- Validate input chi tiết (username, email, mật khẩu, tên)
- Kiểm tra email hợp lệ
- Kiểm tra mật khẩu khớp
- Gửi request tới backend API
- Xử lý lỗi với thông báo cụ thể
- Loading state tốt (vô hiệu hóa input khi đang xử lý)
- Auto-redirect tới Signin sau khi tạo tài khoản thành công

## Quy trình Đăng Ký

### Frontend Flow:

```
1. Người dùng điền tất cả trường (6 trường)
2. Nhấn nút "Create Account"
3. Validation kiểm tra:
   ✓ Username (3+ ký tự)
   ✓ Email (format hợp lệ)
   ✓ First Name (không trống)
   ✓ Last Name (không trống)
   ✓ Password (6+ ký tự)
   ✓ Confirm Password (khớp với Password)
4. Nếu validation thất bại → Hiển thị Alert lỗi
5. Nếu validation thành công → Gửi POST request tới /api/auth/signup
6. Payload:
   {
     "username": "johndoe",
     "email": "john@example.com",
     "firstName": "John",
     "lastName": "Doe",
     "password": "securepass123"
   }
7. Backend xử lý:
   - Kiểm tra duplicate username
   - Kiểm tra duplicate email
   - Mã hóa password bằng bcrypt
   - Lưu user vào database
   - Trả response 201 (Created)
8. Nếu thành công:
   - Hiển thị Alert "Tài khoản đã được tạo"
   - Xóa form
   - Điều hướng tới Signin
9. Nếu thất bại:
   - Hiển thị Alert lỗi cụ thể
   - Giữ lại form
```

## Validation Rules

| Trường         | Rule                   | Ví dụ              |
| -------------- | ---------------------- | ------------------ |
| **Username**   | 3+ ký tự, lowercase    | ✓ johndoe          |
| **Email**      | Định dạng email hợp lệ | ✓ john@example.com |
| **First Name** | Không trống            | ✓ John             |
| **Last Name**  | Không trống            | ✓ Doe              |
| **Password**   | 6+ ký tự               | ✓ securepass123    |
| **Confirm**    | Phải khớp Password     | ✓ securepass123    |

## Các File Đã Thay Đổi

### Frontend:

1. **`frontend/components/SignupForm.jsx`** (HOÀN TOÀN CẬP NHẬT):
   - Thêm các input mới: email, firstName, lastName
   - Implement validation logic chi tiết
   - Gửi API request tới signup endpoint
   - Xử lý response thành công/thất bại
   - Loading state với spinner
   - Vô hiệu hóa inputs khi loading

2. **`frontend/app/screens/Signup.jsx`** (CẬP NHẬT):
   - Thêm KeyboardAvoidingView để xử lý keyboard
   - Thêm ScrollView để form dài hơn
   - Cải thiện layout và padding

## Cách Sử Dụng

### API Request:

```bash
curl -X POST http://192.168.1.9:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepass123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Success Response (201):

```json
{
  "success": true
}
```

### Error Response:

```json
// 400 - Missing fields
{
  "message": "All fields are required"
}

// 409 - Username exists
{
  "message": "Username already exists"
}

// 409 - Email exists
{
  "message": "Email already exists"
}

// 500 - Server error
{
  "message": "Internal server error"
}
```

## Validation Error Messages

Frontend sẽ hiển thị các lỗi sau:

| Lỗi                                     | Nguyên Nhân                 |
| --------------------------------------- | --------------------------- |
| "Vui lòng nhập tên đăng nhập"           | Username rỗng               |
| "Tên đăng nhập phải có ít nhất 3 ký tự" | Username < 3 ký tự          |
| "Vui lòng nhập email"                   | Email rỗng                  |
| "Email không hợp lệ"                    | Email không đúng format     |
| "Vui lòng nhập tên"                     | First Name rỗng             |
| "Vui lòng nhập họ"                      | Last Name rỗng              |
| "Vui lòng nhập mật khẩu"                | Password rỗng               |
| "Mật khẩu phải có ít nhất 6 ký tự"      | Password < 6 ký tự          |
| "Vui lòng xác nhận mật khẩu"            | Confirm Password rỗng       |
| "Mật khẩu xác nhận không khớp"          | Password ≠ Confirm Password |

## Backend Validation

Backend sẽ kiểm tra thêm:

- Username không trùng (unique: true)
- Email không trùng (unique: true)
- Tất cả fields bắt buộc phải có
- Password được mã hóa trước khi lưu

## Testing Checklist

- [ ] Để trống username → Lỗi
- [ ] Username 2 ký tự → Lỗi
- [ ] Để trống email → Lỗi
- [ ] Email sai format → Lỗi
- [ ] Để trống first name → Lỗi
- [ ] Để trống last name → Lỗi
- [ ] Để trống password → Lỗi
- [ ] Password 5 ký tự → Lỗi
- [ ] Để trống confirm password → Lỗi
- [ ] Password ≠ Confirm → Lỗi
- [ ] Nhập hợp lệ → Tạo tài khoản thành công
- [ ] Username đã tồn tại → Lỗi 409 từ backend
- [ ] Email đã tồn tại → Lỗi 409 từ backend
- [ ] Không kết nối mạng → Lỗi "Không thể kết nối"

## UX Features

✅ Loading spinner hiển thị khi đang submit
✅ Button text đổi thành "Creating account..."
✅ Inputs vô hiệu hóa khi loading
✅ Focus xử lý keyboard tốt (KeyboardAvoidingView)
✅ ScrollView cho form dài
✅ Alert thông báo khi thành công
✅ Auto-navigate tới Signin sau khi tạo xong

## Security Notes

1. **Password**:
   - Được gửi plaintext tới server (nên dùng HTTPS)
   - Được mã hóa bcrypt trên server
   - Không bao giờ lưu plaintext

2. **Email**:
   - Validate format trên client
   - Validate format + unique trên server

3. **Username**:
   - Validate độ dài trên client
   - Validate unique + length trên server

## So Sánh Signin vs Signup

| Tính Năng    | Signin         | Signup         |
| ------------ | -------------- | -------------- |
| API Endpoint | `/auth/signin` | `/auth/signup` |
| Input        | 2 trường       | 6 trường       |
| Validation   | Cơ bản         | Chi tiết       |
| Response     | Token + User   | Status 201     |
| Redirect     | Home           | Signin         |
| Database     | Select         | Insert         |

## Troubleshooting

### "Không thể kết nối đến server"

- Kiểm tra IP: 192.168.1.9
- Kiểm tra port: 5001
- Chạy backend: `npm run dev`

### "Tên đăng nhập hoặc email đã tồn tại"

- Username/Email đã được dùng trước đó
- Kiểm tra database
- Dùng username/email khác

### Loading spinner không biến mất

- Kiểm tra server response
- Xem console log để debug
- Restart backend

### Form không scroll

- Nếu trên thiết bị nhỏ, test trên web
- Kiểm tra ScrollView được add đúng
