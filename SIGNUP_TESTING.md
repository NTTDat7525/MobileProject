# Hướng Dẫn Kiểm Tra Chức Năng Đăng Ký

## 🚀 Quick Start

### 1. Khởi Động Backend

```bash
cd backend
npm install  # Nếu chưa cài
npm run dev
# Output: "Server is running on port 5001"
```

### 2. Khởi Động Frontend

```bash
cd frontend
npm install  # Nếu chưa cài
npm start
# Chọn nền tảng: ios, android, hay web
```

### 3. Navigating to Signup

- Mở Signin screen
- Nhấn "Sign Up." link ở dưới
- Hoặc navigate trực tiếp tới `/screens/Signup`

---

## 📝 Test Cases

### Test 1: Validation - Username

**Scenario**: Người dùng không nhập username

```
1. Nhấn "Create Account" mà không nhập username
2. **Expected**: Alert "Vui lòng nhập tên đăng nhập"
3. **Result**: ✓ Pass / ✗ Fail
```

**Scenario**: Username quá ngắn

```
1. Nhập username: "ab" (chỉ 2 ký tự)
2. Nhấn "Create Account"
3. **Expected**: Alert "Tên đăng nhập phải có ít nhất 3 ký tự"
4. **Result**: ✓ Pass / ✗ Fail
```

### Test 2: Validation - Email

**Scenario**: Không nhập email

```
1. Nhập tất cả trường ngoại trừ email
2. Nhấn "Create Account"
3. **Expected**: Alert "Vui lòng nhập email"
4. **Result**: ✓ Pass / ✗ Fail
```

**Scenario**: Email format sai

```
1. Nhập email: "invalidemail.com" (thiếu @)
2. Nhập tất cả trường khác
3. Nhấn "Create Account"
4. **Expected**: Alert "Email không hợp lệ"
5. **Result**: ✓ Pass / ✗ Fail
```

### Test 3: Validation - Name Fields

**Scenario**: Không nhập First Name

```
1. Nhập tất cả trường ngoại trừ First Name
2. Nhấn "Create Account"
3. **Expected**: Alert "Vui lòng nhập tên"
4. **Result**: ✓ Pass / ✗ Fail
```

**Scenario**: Không nhập Last Name

```
1. Nhập tất cả trường ngoại trừ Last Name
2. Nhấn "Create Account"
3. **Expected**: Alert "Vui lòng nhập họ"
4. **Result**: ✓ Pass / ✗ Fail
```

### Test 4: Validation - Password

**Scenario**: Không nhập password

```
1. Nhập tất cả trường ngoại trừ password
2. Nhấn "Create Account"
3. **Expected**: Alert "Vui lòng nhập mật khẩu"
4. **Result**: ✓ Pass / ✗ Fail
```

**Scenario**: Password quá ngắn

```
1. Nhập password: "12345" (chỉ 5 ký tự)
2. Nhập tất cả trường khác
3. Nhấn "Create Account"
4. **Expected**: Alert "Mật khẩu phải có ít nhất 6 ký tự"
5. **Result**: ✓ Pass / ✗ Fail
```

### Test 5: Validation - Confirm Password

**Scenario**: Không nhập confirm password

```
1. Nhập tất cả trường ngoại trừ confirm password
2. Nhấn "Create Account"
3. **Expected**: Alert "Vui lòng xác nhận mật khẩu"
4. **Result**: ✓ Pass / ✗ Fail
```

**Scenario**: Confirm password khác password

```
1. Nhập:
   - Password: "password123"
   - Confirm: "password456"
2. Nhấn "Create Account"
3. **Expected**: Alert "Mật khẩu xác nhận không khớp"
4. **Result**: ✓ Pass / ✗ Fail
```

### Test 6: Successful Signup

**Scenario**: Điền hợp lệ tất cả trường

```
1. Nhập:
   - Username: "testuser123"
   - Email: "testuser@example.com"
   - First Name: "Test"
   - Last Name: "User"
   - Password: "password123"
   - Confirm: "password123"
2. Nhấn "Create Account"
3. **Expected**:
   - Loading spinner hiển thị
   - Button text là "Creating account..."
   - Inputs vô hiệu hóa
   - Sau 2-3 giây: Alert "Thành công" + "Tài khoản đã được tạo!..."
   - Tự động navigate tới Signin
4. **Result**: ✓ Pass / ✗ Fail
```

### Test 7: Backend Error - Duplicate Username

**Scenario**: Username đã tồn tại

```
1. Tạo 2 tài khoản với username giống nhau
2. First signup: ✓ Thành công
3. Second signup:
   - Nhập username: "testuser123" (đã tồn tại)
   - Nhập email khác: "different@example.com"
   - Nhập tất cả trường khác
   - Nhấn "Create Account"
4. **Expected**: Alert "Tên đăng nhập hoặc email đã tồn tại"
5. **Result**: ✓ Pass / ✗ Fail
```

### Test 8: Backend Error - Duplicate Email

**Scenario**: Email đã tồn tại

```
1. Tạo 2 tài khoản với email giống nhau
2. First signup: ✓ Thành công
3. Second signup:
   - Nhập username: "newuser"
   - Nhập email: "testuser@example.com" (đã tồn tại)
   - Nhập tất cả trường khác
   - Nhấn "Create Account"
4. **Expected**: Alert "Tên đăng nhập hoặc email đã tồn tại"
5. **Result**: ✓ Pass / ✗ Fail
```

### Test 9: Network Error

**Scenario**: Không kết nối được server

```
1. Tắt backend
2. Điền hợp lệ tất cả trường
3. Nhấn "Create Account"
4. **Expected**: Alert "Không thể kết nối đến server. Kiểm tra kết nối mạng."
5. **Result**: ✓ Pass / ✗ Fail
```

### Test 10: UX - Loading State

**Scenario**: Kiểm tra UI khi đang load

```
1. Điền hợp lệ tất cả trường
2. Nhấn "Create Account"
3. **Expected**:
   - ✓ Loading spinner hiển thị
   - ✓ Button text đổi thành "Creating account..."
   - ✓ Inputs không thể edit
   - ✓ Button disabled (không thể nhấn lại)
4. **Result**: ✓ Pass / ✗ Fail
```

### Test 11: Navigation to Signin

**Scenario**: Chuyển hướng sau signup thành công

```
1. Tạo tài khoản thành công
2. Alert sẽ có button "OK"
3. Nhấn "OK"
4. **Expected**: Tự động navigate tới Signin screen
5. **Result**: ✓ Pass / ✗ Fail
```

### Test 12: Form Clear After Success

**Scenario**: Form xóa sạch sau signup thành công

```
1. Tạo tài khoản thành công
2. Quay lại Signup screen
3. **Expected**: Tất cả input fields trống
4. **Result**: ✓ Pass / ✗ Fail
```

### Test 13: Case Insensitive Username & Email

**Scenario**: Username và email được convert thành lowercase

```
1. Nhập:
   - Username: "TestUser123"
   - Email: "TestUser@Example.COM"
   - Tất cả trường khác
2. Nhấn "Create Account"
3. **Expected**:
   - ✓ Thành công
   - Kiểm tra DB: username là "testuser123" (lowercase)
   - Kiểm tra DB: email là "testuser@example.com" (lowercase)
4. **Result**: ✓ Pass / ✗ Fail
```

---

## 🔍 Database Verification

### Kiểm tra User được tạo trong MongoDB

**Bằng MongoDB Shell:**

```bash
# Kết nối tới MongoDB
mongosh

# Chọn database
use restaurant_db

# Xem tất cả users
db.users.find()

# Xem user cụ thể
db.users.find({ username: "testuser123" })

# Output:
{
  "_id": ObjectId("..."),
  "username": "testuser123",
  "email": "testuser@example.com",
  "hashPassword": "$2b$10$...", // mã hóa bcrypt
  "displayName": "Test User",
  "bio": "",
  "phone": null,
  "role": "user",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

**Kiểm tra Points:**

- [ ] Username là lowercase
- [ ] Email là lowercase
- [ ] DisplayName là "First Last"
- [ ] Password được hash (bcrypt)
- [ ] Role là "user"
- [ ] Timestamps được set

---

## 📊 Test Summary

| Test Case | Description      | Expected           |
| --------- | ---------------- | ------------------ |
| 1         | Empty username   | Error Alert        |
| 2         | Short username   | Error Alert        |
| 3         | Empty email      | Error Alert        |
| 4         | Invalid email    | Error Alert        |
| 5         | Empty first name | Error Alert        |
| 6         | Empty last name  | Error Alert        |
| 7         | Empty password   | Error Alert        |
| 8         | Short password   | Error Alert        |
| 9         | Empty confirm    | Error Alert        |
| 10        | Mismatched pass  | Error Alert        |
| 11        | Valid input      | Success + Navigate |
| 12        | Duplicate user   | Error 409          |
| 13        | Duplicate email  | Error 409          |
| 14        | Network error    | Error Alert        |
| 15        | Loading state    | UI updates         |
| 16        | Navigation       | Redirect to Signin |
| 17        | Form clear       | Inputs empty       |
| 18        | Case handling    | Lowercase saved    |

---

## 🐛 Debugging Tips

### Check Console Logs

```javascript
// Network request logs
// Success: "Success"
// Error: "Sign up error: ..."

// Check DevTools Network tab
// POST /api/auth/signup
// Status: 201 (success) or 400/409 (error)
```

### Check Backend Logs

```bash
# Terminal running backend
# Kiểm tra xem request đến backend không
# Kiểm tra validation errors
```

### Check Database

```bash
# Kiểm tra user được tạo chưa
db.users.count()
db.users.find()
```

### Common Issues

**Issue**: Button không responsive

```
Fix: Kiểm tra loading state, restart app
```

**Issue**: Form không submit

```
Fix: Kiểm tra validation, console log
```

**Issue**: User không được tạo trong DB

```
Fix: Kiểm tra backend logs, MongoDB connection
```

---

## ✅ Final Checklist

Trước khi coi là hoàn thành:

- [ ] Tất cả validation tests pass (1-10)
- [ ] Successful signup test pass (11)
- [ ] Backend duplicate tests pass (12-13)
- [ ] Network error handling pass (14)
- [ ] Loading state displays correctly (15)
- [ ] Auto-navigation works (16)
- [ ] Form clears after success (17)
- [ ] Username/email case handling works (18)
- [ ] User được tạo đúng trong database
- [ ] Password được hash (không plaintext)
- [ ] Có thể đăng nhập với tài khoản vừa tạo

🎉 **Nếu tất cả pass → Signup feature hoàn thành!**
