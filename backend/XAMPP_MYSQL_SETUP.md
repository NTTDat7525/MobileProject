# 🗄️ Hướng Dẫn Cấu Hình MySQL từ XAMPP

## ✅ Các thay đổi đã được thực hiện

Dự án đã được chuyển đổi từ **SQL Server** sang **MySQL** (XAMPP) hoàn toàn. Tất cả API và Controller đều đã được cập nhật.

### Các file đã sửa:
- ✅ `src/libs/db.js` - Cập nhật dialect từ `mssql` sang `mysql`
- ✅ `.env` - Cấu hình MySQL XAMPP
- ✅ Package.json - Hỗ trợ `mysql2` (đã có sẵn)

## 📋 Yêu Cầu Hệ Thống

```bash
Node.js >= 16.x
npm >= 8.x
XAMPP với MySQL được kích hoạt
```

## 🔧 Cấu Hình XAMPP MySQL

### Bước 1: Cài Đặt & Khởi Động XAMPP

1. **Tải XAMPP** từ: https://www.apachefriends.org/
2. **Cài đặt** XAMPP (chọn folder cài đặt)
3. **Khởi động XAMPP Control Panel**
4. **Bật MySQL**:
   - Nhấp vào nút "Start" cạnh MySQL
   - Chờ cho đến khi hiển thị "Running" (màu xanh)

### Bước 2: Xác Minh Kết Nối MySQL

**Phương pháp 1: Qua phpMyAdmin (Giao diện Web)**
```
1. Truy cập: http://localhost/phpmyadmin
2. Đăng nhập với username: root (không có mật khẩu)
3. Kiểm tra MySQL đang chạy tốt
```

**Phương pháp 2: Qua Command Line**
```bash
# Windows
"C:\xampp\mysql\bin\mysql" -u root -p
# Nhấn Enter khi được yêu cầu nhập mật khẩu (để trống)

# macOS/Linux
/Applications/XAMPP/xamppfiles/bin/mysql -u root -p
```

### Bước 3: Tạo Database

**Phương pháp 1: Qua phpMyAdmin**
1. Truy cập http://localhost/phpmyadmin
2. Click "New" hoặc "Tạo"
3. Nhập tên database: `restaurant_db`
4. Chọn charset: `utf8mb4`
5. Click "Create"

**Phương pháp 2: Qua Command Line**
```bash
mysql -u root -p
# Nhấn Enter khi được yêu cầu mật khẩu

# Sau đó chạy:
CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

## 🚀 Cấu Hình Ứng Dụng

### Bước 1: Kiểm Tra File `.env`

File `.env` trong folder `backend/` đã được cấu hình sẵn:

```env
# File: backend/.env
PORT=5001

# MySQL Configuration (XAMPP)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=restaurant_db
DB_LOG=false

ACCESS_TOKEN_SECRET=337853655c5d7e54055b9b8fcd431457bacc0a6eef2e1f05c333a9028fa8ca3ec6ff79028e5c80621193be4cbf0a788f23b0c8e7eae5dbb4752d793545ae03d5
```

### Bước 2: Cài Đặt Dependencies

```bash
cd backend
npm install
```

### Bước 3: Khởi Động Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

## ✅ Kiểm Tra Kết Nối Thành Công

Khi server khởi động thành công, bạn sẽ thấy các dòng trong terminal:

```
Connected to MySQL successfully!
Database synchronized!
```

## 🔍 Xử Lý Sự Cố

### Lỗi: "connect ECONNREFUSED 127.0.0.1:3306"
**Giải pháp:**
- Kiểm tra MySQL đang chạy trong XAMPP Control Panel (phải có status "Running")
- Khởi động lại XAMPP
- Kiểm tra port 3306 không bị chiếm dụng

### Lỗi: "Access denied for user 'root'@'localhost'"
**Giải pháp:**
- Mật khẩu MySQL mặc định của XAMPP là **trống**
- Đảm bảo `DB_PASSWORD=` trong file `.env` (để trống)

### Lỗi: "database 'restaurant_db' not found"
**Giải pháp:**
- Tạo database `restaurant_db` trong phpMyAdmin hoặc Command Line
- Kiểm tra tên database trong `.env` khớp với tên đã tạo

### Lỗi: "ER_NOT_SUPPORTED_AUTH_PLUGIN"
**Giải pháp:**
```bash
# Trong MySQL command line:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
```

## 📊 Xem Dữ Liệu trong Database

**Qua phpMyAdmin:**
1. Truy cập: http://localhost/phpmyadmin
2. Chọn database `restaurant_db` từ danh sách bên trái
3. Xem tất cả bảng được tạo tự động (Users, Tables, Foods, Orders, Bookings, Sessions)

**Qua Command Line:**
```bash
mysql -u root
USE restaurant_db;
SHOW TABLES;
SELECT * FROM Users;
```

## 🔄 Cấu Hình Tùy Chỉnh

Nếu bạn muốn sử dụng cấu hình khác (tên database khác, mật khẩu khác, host khác):

1. **Tạo database mới** trong MySQL
2. **Cập nhật file `.env`**:
```env
DB_HOST=your_host          # (mặc định: localhost)
DB_PORT=3306               # (mặc định: 3306)
DB_USER=your_username      # (mặc định: root)
DB_PASSWORD=your_password  # (trống cho XAMPP mặc định)
DB_NAME=your_database_name # (mặc định: restaurant_db)
```
3. **Khởi động lại server**

## 📝 Ghi Chú Quan Trọng

- **UUID Support**: MySQL hỗ trợ UUID từ 5.7+ (XAMPP sử dụng phiên bản mới hơn)
- **Auto Sync**: Sequelize sẽ tự động tạo bảng khi server khởi động lần đầu
- **Charset**: Cơ sở dữ liệu được cấu hình dùng `utf8mb4` để hỗ trợ emoji và ký tự đặc biệt
- **Timestamps**: Tất cả bảng có `createdAt` và `updatedAt` tự động

## 📞 Cần Giúp Đỡ?

Nếu gặp vấn đề:
1. Kiểm tra MySQL đang chạy
2. Kiểm tra cấu hình trong `.env`
3. Xem logs trong terminal khi server khởi động
4. Kiểm tra database và bảng trong phpMyAdmin

---

**Cập nhật lần cuối**: April 4, 2026
**Phiên bản**: MySQL (XAMPP)
