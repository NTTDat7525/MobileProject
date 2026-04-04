# Migration từ MongoDB sang Microsoft SQL Server

## Tổng quan

Dự án này đã được chuyển đổi từ MongoDB sang Microsoft SQL Server với Sequelize ORM.

## Yêu cầu

1. **Microsoft SQL Server 2019+** (hoặc SQL Server Express)
2. **Node.js 16+**
3. **npm** hoặc **yarn**

## Cài đặt SQL Server

### Trên Windows

1. Tải SQL Server từ: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
2. Cài đặt SQL Server Express (miễn phí)
3. Khi cài đặt, chọn "Mixed Mode" để sử dụng tài khoản `sa`
4. Đặt mật khẩu cho tài khoản `sa`

### Trên macOS/Linux

```bash
# Docker (khuyến nghị)
docker pull mcr.microsoft.com/mssql/server:2019-latest
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=YourPassword123' \
  -p 1433:1433 -d mcr.microsoft.com/mssql/server:2019-latest
```

## Cấu hình Environment

Cập nhật file `.env` với thông tin SQL Server:

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

**Lưu ý**: Thay đổi `DB_PASSWORD` thành mật khẩu của bạn

## Cài đặt Dependencies

```bash
cd backend
npm install
```

## Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Máy chủ sẽ tự động:

1. Kết nối tới SQL Server
2. Tạo cơ sở dữ liệu nếu chưa tồn tại
3. Tạo các bảng dựa trên models
4. Khởi động trên port 5001

## Các thay đổi chính

### Thay thế Dependencies

- ❌ `mongoose` → ✅ `sequelize` + `mssql`
- UUID được sử dụng thay vì MongoDB ObjectId

### Cấu trúc Dữ liệu

#### Trước (MongoDB):

```javascript
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  // ...
});
const User = mongoose.model("User", userSchema);
const user = await User.findOne({ username });
```

#### Sau (SQL Server + Sequelize):

```javascript
const User = sequelize.define("User", {
  id: { type: DataTypes.UUID, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false },
  // ...
});
const user = await User.findOne({ where: { username } });
```

### Thay đổi API trong Controllers

| MongoDB                       | Sequelize                          |
| ----------------------------- | ---------------------------------- |
| `Model.find({})`              | `Model.findAll({})`                |
| `Model.findOne({})`           | `Model.findOne({ where: {} })`     |
| `Model.findById(id)`          | `Model.findByPk(id)`               |
| `Model.create({})`            | `Model.create({})`                 |
| `doc.save()`                  | `doc.save()` hoặc `doc.update({})` |
| `Model.findByIdAndDelete(id)` | `Model.destroy({ where: { id } })` |
| `.populate()`                 | `.include()` trong options         |
| `._id`                        | `.id`                              |
| `$gte, $lte, $in`             | `Op.gte, Op.lte, Op.in`            |

## Kiểm tra Kết nối

```bash
# Kiểm tra kết nối SQL Server từ terminal
sqlcmd -S localhost -U sa -P YourPassword123

# Nếu thành công sẽ hiển thị prompt: 1>
```

## Quản lý Cơ sở Dữ liệu

### Xem các bảng

```sql
USE restaurant_db;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
```

### Xem cấu trúc bảng

```sql
EXEC sp_columns 'Users';
```

### Xóa cơ sở dữ liệu

```sql
DROP DATABASE restaurant_db;
```

## Troubleshooting

### Lỗi: "Cannot connect to database"

- Kiểm tra SQL Server đang chạy
- Kiểm tra cấu hình host, port, username, password trong `.env`
- Kiểm tra tường lửa cho port 1433

### Lỗi: "Login failed for user 'sa'"

- Kiểm tra mật khẩu `sa` đúng
- Kiểm tra chế độ xác thực: phải là "Mixed Mode"

### Lỗi: "Express Edition with more than reserved processors"

- Sử dụng SQL Server Developer hoặc Enterprise Edition
- Hoặc sử dụng Docker

## Performance Tips

1. **Enable DB Logs** trong development:

   ```env
   DB_LOG=true
   ```

2. **Connection Pool**: Đã được cấu hình với 10 connections tối đa

3. **Indexes**: Các index đã được tự động tạo trên các trường quan trọng

## Backup & Restore

### Backup Database

```sql
BACKUP DATABASE restaurant_db
TO DISK = 'C:\Backup\restaurant_db.bak'
WITH INIT;
```

### Restore Database

```sql
RESTORE DATABASE restaurant_db
FROM DISK = 'C:\Backup\restaurant_db.bak';
```

## Liên hệ Hỗ trợ

Nếu gặp sự cố, hãy kiểm tra:

1. Các log trong terminal
2. File `.env` có đúng cấu hình
3. SQL Server có chạy

## Thông tin Cấp Phép

- SQL Server Express: Miễn phí cho các ứng dụng nhỏ
- Sequelize: MIT License (miễn phí)
