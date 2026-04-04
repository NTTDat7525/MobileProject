# 🚀 SQL Server - Hướng Dẫn Bắt Đầu Nhanh

## ✅ Những gì đã được hoàn thành

Toàn bộ dự án đã được chuyển đổi từ **MongoDB** sang **Microsoft SQL Server** với **Sequelize ORM**.

### Các thay đổi chính:

- ✅ Thay thế mongoose bằng sequelize + mssql driver
- ✅ Chuyển đổi 6 models (User, Table, Food, Order, Booking, Session)
- ✅ Cập nhật 3 controllers (auth, user, admin)
- ✅ Cơ sở dữ liệu tự động tạo bảng khi server khởi động
- ✅ Hỗ trợ UUID thay vì MongoDB ObjectId

## 📋 Yêu Cầu Hệ Thống

```bash
Node.js >= 16.x
npm >= 8.x
Microsoft SQL Server 2019+ (hoặc SQL Server Express - miễn phí)
```

## 🔧 Cài Đặt SQL Server

### Option 1: Windows (SQL Server Express - Miễn Phí)

1. **Tải SQL Server Express** từ:
   https://www.microsoft.com/en-us/sql-server/sql-server-downloads

2. **Cài đặt**: Chọn "Express Edition"

3. **Tùy chọn quan trọng**:
   - ☑️ Mixed Mode Authentication
   - ☑️ Đặt mật khẩu cho tài khoản `sa`
   - ☑️ Port mặc định: 1433

4. **Xác nhận**: Kiểm tra kết nối
   ```bash
   sqlcmd -S localhost -U sa -P YourPassword123
   # Nếu thành công sẽ hiển thị: 1>
   # Gõ: exit
   ```

### Option 2: Docker (Windows/Mac/Linux)

```bash
docker pull mcr.microsoft.com/mssql/server:2019-latest

docker run -e 'ACCEPT_EULA=Y' \
  -e 'SA_PASSWORD=YourPassword123' \
  -p 1433:1433 \
  -d mcr.microsoft.com/mssql/server:2019-latest
```

## 📝 Cấu Hình Environment

Sửa file `backend/.env`:

```env
PORT=5001

# SQL Server Configuration
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourPassword123
DB_NAME=restaurant_db
DB_LOG=false

ACCESS_TOKEN_SECRET=337853655c5d7e54055b9b8fcd431457bacc0a6eef2e1f05c333a9028fa8ca3ec6ff79028e5c80621193be4cbf0a788f23b0c8e7eae5dbb4752d793545ae03d5
```

⚠️ **GHI CHÚ**: Thay `YourPassword123` bằng mật khẩu của bạn

## 🚀 Chạy Dự Án

### Step 1: Cài Dependencies

```bash
cd backend
npm install
```

### Step 2: Khởi động

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

### Step 3: Xác nhận kết nối

Nếu thành công, bạn sẽ thấy:

```
Server is running on port 5001
Connected to SQL Server successfully!
Database synchronized!
```

## 📊 Kiểm tra Cơ Sở Dữ Liệu

### Xem các bảng đã tạo

```bash
sqlcmd -S localhost -U sa -P YourPassword123

# Sau khi kết nối:
USE restaurant_db;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;

# Kết quả:
# Users
# Sessions
# Tables
# Foods
# Orders
# Bookings
```

## 🔗 API Endpoints (không thay đổi)

```bash
# Authentication
POST   /api/auth/signup
POST   /api/auth/signin
POST   /api/auth/signout

# User APIs
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/tables
POST   /api/users/bookings
GET    /api/users/bookings/:id
PUT    /api/users/bookings/:id
DELETE /api/users/bookings/:id
GET    /api/users/orders
GET    /api/users/orders/:id

# Admin APIs (yêu cầu role=admin)
GET    /api/admin/revenue
GET    /api/admin/tables
POST   /api/admin/tables
PUT    /api/admin/tables/:id
DELETE /api/admin/tables/:id
POST   /api/admin/foods
GET    /api/admin/foods
PUT    /api/admin/foods/:id
DELETE /api/admin/foods/:id
```

## 🛠️ Troubleshooting

### ❌ "Cannot connect to SQL Server"

```
Kiểm tra:
1. SQL Server đang chạy? (Services → SQL Server)
2. Port 1433 có được mở? (firewall)
3. Credentials đúng trong .env?
4. Try: telnet localhost 1433
```

### ❌ "Login failed for user 'sa'"

```
Giải pháp:
1. Kiểm tra mật khẩu 'sa' trong .env
2. Đảm bảo Mixed Mode Authentication được bật
3. Reset mật khẩu sa nếu cần
```

### ❌ "Database already exists"

```sql
-- Xóa database cũ (nếu cần)
DROP DATABASE restaurant_db;
-- Chạy lại npm run dev để tạo mới
```

## 📚 Tài Liệu Thêm

- **Chi tiết chuyển đổi**: `MIGRATION_SUMMARY.md`
- **Setup đầy đủ**: `SQL_SERVER_SETUP.md`
- **Sequelize Docs**: https://sequelize.org/docs/
- **SQL Server Docs**: https://docs.microsoft.com/en-us/sql/

## 💾 Backup Database

```bash
# Backup
sqlcmd -S localhost -U sa -P YourPassword123
BACKUP DATABASE restaurant_db
TO DISK = 'C:\Backup\restaurant_db.bak';

# Restore
RESTORE DATABASE restaurant_db
FROM DISK = 'C:\Backup\restaurant_db.bak';
```

## 🎯 Tiếp Theo

1. ✅ SQL Server đã cài đặt
2. ✅ `.env` đã cấu hình
3. ✅ Dependencies đã cài
4. ✅ Server đang chạy
5. **▶ Bắt đầu phát triển!**

```bash
# Frontend (nếu có)
cd ../frontend
npm install
npm run dev
```

## ❓ FAQ

**Q: Có cần phải thay đổi Frontend không?**
A: Không, frontend vẫn hoạt động bình thường. ID thay đổi từ ObjectId → UUID nhưng cấu trúc API vẫn như cũ.

**Q: Sao dùng SQL Server thay vì MongoDB?**
A: SQL Server tốt hơn cho dữ liệu có cấu trúc rõ ràng, transactions, và performance.

**Q: Có thể quay về MongoDB không?**
A: Có, nhưng cần chuyển đổi lại models. Xem hướng dẫn rollback trong MIGRATION_SUMMARY.md

**Q: Có phí không?**
A: Không! SQL Server Express hoàn toàn miễn phí.

---

**Trạng thái**: ✅ Sẵn sàng sản xuất  
**Phiên bản**: 1.0  
**Cập nhật**: 2024
