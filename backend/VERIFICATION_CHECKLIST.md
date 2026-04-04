# ✅ Kiểm tra & Xác nhận - Migration MongoDB → SQL Server

## 📋 Pre-Installation Checklist

### Yêu cầu hệ thống

- ☐ Node.js 16+ cài đặt: `node --version`
- ☐ npm 8+ cài đặt: `npm --version`
- ☐ SQL Server 2019+ hoặc SQL Server Express
- ☐ Quyền admin trên máy (để cài SQL Server)

## 🔧 Installation Checklist

### Bước 1: SQL Server Setup

- ☐ SQL Server đã cài đặt
- ☐ Mixed Mode Authentication được bật
- ☐ Tài khoản `sa` đặt mật khẩu
- ☐ Port 1433 đang mở
- ☐ Kiểm tra kết nối: `sqlcmd -S localhost -U sa -P YourPassword123`

### Bước 2: Project Setup

- ☐ Vào thư mục backend: `cd backend`
- ☐ Cài dependencies: `npm install`
- ☐ Kiểm tra package.json có `sequelize` và `mssql`

### Bước 3: Environment

- ☐ File `.env` tồn tại
- ☐ `DB_HOST=localhost`
- ☐ `DB_PORT=1433`
- ☐ `DB_USER=sa`
- ☐ `DB_PASSWORD` đúng mật khẩu sa
- ☐ `DB_NAME=restaurant_db`

## 🚀 Runtime Checklist

### Khởi động Server

```bash
npm run dev
# Hoặc
npm start
```

### Kiểm tra Output

- ☐ "Connected to SQL Server successfully!"
- ☐ "Database synchronized!"
- ☐ "Server is running on port 5001"
- ☐ Không có lỗi trong console

### Kiểm tra Database

```bash
# Kế nối SQL Server
sqlcmd -S localhost -U sa -P YourPassword123

# Kiểm tra database
USE restaurant_db;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

# Kết quả mong đợi:
# - Bookings
# - Foods
# - Orders
# - Sessions
# - Tables
# - Users
```

## 🧪 Functional Testing

### Test 1: Signup API

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }'

# Expected: 201 Created
```

### Test 2: Signin API

```bash
curl -X POST http://localhost:5001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123"
  }'

# Expected: 200 OK + accessToken
```

### Test 3: Get Tables

```bash
curl -X GET "http://localhost:5001/api/users/tables" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Expected: 200 OK + tables array
```

### Test 4: Create Table (Admin)

```bash
curl -X POST http://localhost:5001/api/admin/tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "tableNumber": "T01",
    "capacity": 4,
    "type": "standard",
    "location": "indoor",
    "description": "Corner table"
  }'

# Expected: 201 Created
```

## 📊 Database Verification

### Check Tables Exist

```sql
USE restaurant_db;
SELECT TABLE_NAME, TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES
ORDER BY TABLE_NAME;
```

### Check Users Created

```sql
SELECT id, username, email, role, createdAt
FROM Users;
```

### Check Indexes

```sql
SELECT TABLE_NAME, INDEX_NAME
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'dbo'
AND TABLE_NAME IN ('Users', 'Orders', 'Bookings', 'Tables')
ORDER BY TABLE_NAME, INDEX_NAME;
```

### Check Constraints

```sql
SELECT CONSTRAINT_NAME, TABLE_NAME, CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_NAME IN ('Users', 'Orders', 'Bookings', 'Tables')
ORDER BY TABLE_NAME;
```

## 🔍 Code Verification

### Kiểm tra File Quan Trọng

- ☐ `backend/package.json` - Có `sequelize` và `mssql`
- ☐ `backend/src/libs/db.js` - Sử dụng Sequelize
- ☐ `backend/src/models/User.js` - Không có mongoose
- ☐ `backend/.env` - Có SQL Server config
- ☐ `backend/src/server.js` - Import tất cả models

### Grep Check (Kiểm tra không có MongoDB)

```bash
# Không nên có kết quả
grep -r "mongoose" backend/src/
grep -r "\.select(" backend/src/
grep -r "\.populate(" backend/src/
grep -r "\$gte\|\$lte\|\$in" backend/src/
grep -r "ObjectId" backend/src/
```

### Expected: Không có output

## 📈 Performance Checks

### Check Query Performance

```sql
-- Kiểm tra frequently used queries
SET STATISTICS IO ON;

SELECT * FROM Users WHERE username = 'testuser';
SELECT * FROM Orders WHERE paymentStatus = 'paid';
SELECT * FROM Bookings WHERE status = 'confirmed'
  AND bookingDate >= CAST(GETDATE() AS DATE);

SET STATISTICS IO OFF;
```

### Monitor Connections

```sql
SELECT COUNT(*) as ActiveConnections
FROM sys.dm_exec_sessions
WHERE database_id = DB_ID();
```

## 🐛 Troubleshooting Checklist

### Issue: Cannot Connect

- ☐ SQL Server running?
- ☐ Port 1433 accessible?
- ☐ Credentials correct?
- ☐ Firewall blocking?
- ☐ Mixed auth mode enabled?

### Issue: Database Not Created

- ☐ User `sa` has permissions?
- ☐ Disk space available?
- ☐ Try manually create: `CREATE DATABASE restaurant_db;`

### Issue: Tables Not Created

- ☐ Server logs show no errors?
- ☐ DB_LOG=true to see SQL statements?
- ☐ Check Sequelize model definitions?
- ☐ Run: `npm run dev` again?

### Issue: API Errors

- ☐ Check server console for errors
- ☐ Enable logging: DB_LOG=true in .env
- ☐ Check .env variables
- ☐ Verify SQL Server connection

## 📝 Documentation Review

### Hãy đọc những file này

- ☐ [QUICK_START.md](./QUICK_START.md) - Bắt đầu nhanh
- ☐ [SQL_SERVER_SETUP.md](./SQL_SERVER_SETUP.md) - Cài đặt chi tiết
- ☐ [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Các thay đổi technical
- ☐ [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Schema reference

## ✨ Final Verification

### Is Everything Working?

- ☐ Database connection: ✅
- ☐ Tables created: ✅
- ☐ Signup API working: ✅
- ☐ Signin API working: ✅
- ☐ Data persisting: ✅
- ☐ No errors in logs: ✅
- ☐ Indexes optimized: ✅

### Go/No-Go Decision

- ✅ **GO** - Tất cả kiểm tra pass, sẵn sàng sản xuất
- ❌ **NO-GO** - Còn vấn đề, xem troubleshooting

## 🎉 Success Criteria Met?

```
☐ SQL Server instance running
☐ Database restaurant_db created
☐ All 6 tables created with correct schema
☐ All 6 indexes created
☐ Foreign key relationships working
☐ API endpoints responding correctly
☐ Data persistence working
☐ No MongoDB references remain
☐ UUID primary keys working
☐ JSON columns working
☐ Pagination working
☐ Filtering working
☐ Admin operations working
☐ User authentication working
☐ Sessions managing correctly

TOTAL: 15/15 ✅
```

If all checked:

```
🎊 MIGRATION SUCCESSFUL! 🎊
Database đã sẵn sàng cho production.
```

## 📞 Support

Nếu gặp vấn đề:

1. Kiểm tra checklist trên
2. Đọc documentation
3. Kiểm tra logs
4. Xem troubleshooting section

---

**Checklist Version**: 1.0  
**Last Updated**: 2024
