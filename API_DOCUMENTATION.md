# API Documentation - Authentication Endpoints

## Base URL

```
http://192.168.1.9:5001/api
```

---

## 1. Sign Up (Đăng Ký)

### Request

```
POST /auth/signup
Content-Type: application/json

{
  "username": "string (required, unique, 3+ chars)",
  "password": "string (required, 6+ chars)",
  "email": "string (required, unique, valid email)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "role": "string (optional: 'user' or 'admin', default: 'user')"
}
```

### Success Response (201)

```json
{
  "success": true
}
```

### Error Response

```json
// 400 - Missing fields
{
  "message": "All fields are required"
}

// 409 - Username exists
{
  "message": "Username already exists"
}

// 500 - Server error
{
  "message": "Internal server error"
}
```

### Example

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

---

## 2. Sign In (Đăng Nhập)

### Request

```
POST /auth/signin
Content-Type: application/json

{
  "username": "string (required)",
  "password": "string (required)"
}
```

### Success Response (200)

```json
{
  "message": "User John Doe signed in successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "displayName": "John Doe",
    "bio": "",
    "phone": null,
    "role": "user",
    "createdAt": "2024-03-21T10:30:00Z",
    "updatedAt": "2024-03-21T10:30:00Z"
  }
}
```

### Error Response

```json
// 400 - Missing fields
{
  "message": "Username and password are required"
}

// 401 - Invalid credentials
{
  "message": "User or password is incorrect"
}

// 500 - Server error
{
  "message": "Internal server error"
}
```

### Important Notes

- **Refresh Token**: Được tự động gửi thông qua HTTP-only cookie
- **Access Token TTL**: 30 phút
- **Token trong Response**: Dùng ngay để set Authorization header

### Example

```bash
curl -X POST http://192.168.1.9:5001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepass123"
  }'

# Response headers sẽ chứa cookie:
# Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=none
```

---

## 3. Sign Out (Đăng Xuất)

### Request

```
POST /auth/signout
Authorization: Bearer <accessToken>
```

### Success Response (204)

```
(No content)
```

### Error Response

```json
// 401 - No token provided
{
  "message": "Access token is required"
}

// 500 - Server error
{
  "message": "Internal server error"
}
```

### Example

```bash
curl -X POST http://192.168.1.9:5001/api/auth/signout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 4. Protected Routes (Các Route Cần Token)

Tất cả routes sau đây yêu cầu **Authorization header** với **Bearer token**:

```
GET /users/*
POST /users/*
PUT /users/*
DELETE /users/*
GET /admin/*
POST /admin/*
```

### Request Header

```
GET https://192.168.1.9:5001/api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response

```json
{
  "user": { ... }
}
```

### Error Response

```json
// 401 - No token
{
  "message": "Access token is required"
}

// 403 - Invalid/expired token
{
  "message": "Invalid or expired access token"
}

// 404 - User not found
{
  "message": "User not found"
}

// 500 - Server error
{
  "message": "Internal server error"
}
```

---

## Token Format

### Access Token (JWT)

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1711012200,
  "exp": 1711013800
}

Signature: HMAC_SHA256(base64url(header) + '.' + base64url(payload), secret)
```

**TTL**: 30 phút (1800 giây)

### Refresh Token

- Chuỗi ngẫu nhiên 128 ký tự hexa
- Lưu trong database
- TTL: 14 ngày
- Gửi qua HTTP-only cookie

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. USER ENTERS CREDENTIALS                              │
└────────────┬────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────┐
│ 2. FRONTEND SENDS POST /auth/signin                      │
│    { username, password }                                │
└────────────┬────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────┐
│ 3. BACKEND VALIDATES CREDENTIALS                         │
│    - Find user by username                               │
│    - Compare password with bcrypt hash                   │
└────────────┬────────────────────────────────────────────┘
             │
       ┌─────┴──────┐
       │             │
   Invalid      Valid
       │             │
       │    ┌────────▼────────┐
       │    │ 4. CREATE TOKENS│
       │    │ - JWT access    │
       │    │ - Random refresh│
       │    └────────┬────────┘
       │             │
       │    ┌────────▼────────┐
       │    │ 5. SAVE SESSION │
       │    │ - refresh token │
       │    │ - expires_at    │
       │    └────────┬────────┘
       │             │
       │    ┌────────▼────────────────┐
       │    │ 6. RETURN RESPONSE       │
       │    │ - accessToken (body)    │
       │    │ - user (body)           │
       │    │ - refreshToken (cookie) │
       │    └────────┬────────────────┘
       │             │
   ┌───▼──────────┐  │
   │ 401 ERROR    │  │  ┌────────────────┐
   │              │  │  │ FRONTEND SAVES │
   │ "Incorrect   │  ├─►│ - token        │
   │  credentials"│  │  │ - user info    │
   └──────────────┘  │  └────────┬───────┘
                     │           │
                     │  ┌────────▼──────────┐
                     │  │ 7. MAKE REQUESTS  │
                     │  │ WITH AUTH HEADER  │
                     │  │ Bearer: accessToken
                     │  └───────────────────┘
                     │
                     └─► LOGGED IN ✓
```

---

## Security Best Practices

### Frontend

```javascript
// ✅ DO: Save token in AsyncStorage
await AsyncStorage.setItem("accessToken", token);

// ✅ DO: Send with Authorization header
headers: {
  Authorization: `Bearer ${token}`;
}

// ✅ DO: Clear on logout
await AsyncStorage.removeItem("accessToken");

// ❌ DON'T: Save password
await AsyncStorage.setItem("password", password);

// ❌ DON'T: Send password multiple times
// only send on signin/signup
```

### Backend

```javascript
// ✅ DO: Hash password with bcrypt (salt rounds >= 10)
const hash = await bcrypt.hash(password, 10);

// ✅ DO: Use strong JWT secret
process.env.ACCESS_TOKEN_SECRET = 'complex-random-string-256+'

// ✅ DO: Set proper token expiry
expiresIn: '30m'

// ✅ DO: Use HTTP-only cookies for refresh token
httpOnly: true,
secure: true,
sameSite: 'none'

// ❌ DON'T: Store plaintext passwords
user.password = password; // WRONG!

// ❌ DON'T: Send password in response
res.json({...user, password}); // WRONG!

// ❌ DON'T: Use weak secrets
const secret = 'abc123'; // WRONG!
```

---

## Testing dengan Postman

### 1. Sign Up

```
POST http://192.168.1.9:5001/api/auth/signup
Headers: Content-Type: application/json
Body:
{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com",
  "firstName": "Test",
  "lastName": "User"
}
```

### 2. Sign In

```
POST http://192.168.1.9:5001/api/auth/signin
Headers: Content-Type: application/json
Body:
{
  "username": "testuser",
  "password": "password123"
}
```

**Salin `accessToken` từ response**

### 3. Protected Request

```
GET http://192.168.1.9:5001/api/users/profile
Headers: Authorization: Bearer <accessToken yang disalin>
```

### 4. Sign Out

```
POST http://192.168.1.9:5001/api/auth/signout
Headers: Authorization: Bearer <accessToken>
```

---

## Environment Variables (.env)

```
MONGODB_CONNECTION_STRING=mongodb+srv://user:pass@cluster.mongodb.net/dbname
ACCESS_TOKEN_SECRET=your-super-secret-key-min-32-chars
PORT=5001
```

---

## Status Codes

| Code | Meaning        | Condition                          |
| ---- | -------------- | ---------------------------------- |
| 200  | OK             | Sign in successful                 |
| 201  | Created        | Sign up successful                 |
| 204  | No Content     | Sign out successful                |
| 400  | Bad Request    | Missing/invalid fields             |
| 401  | Unauthorized   | Missing token or wrong credentials |
| 403  | Forbidden      | Token expired or invalid           |
| 404  | Not Found      | User not found                     |
| 409  | Conflict       | Duplicate username/email           |
| 500  | Internal Error | Server error                       |
