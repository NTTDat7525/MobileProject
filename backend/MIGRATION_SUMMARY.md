# Tóm tắt Chuyển đổi Cơ sở Dữ liệu: MongoDB → SQL Server

## Ngày Hoàn thành

2024 - Chuyển đổi toàn bộ dự án từ MongoDB sang Microsoft SQL Server

## Các tệp Đã Thay đổi

### 1. Dependencies & Configuration

- ✅ **package.json**: Thay thế `mongoose` bằng `sequelize` và `mssql`
- ✅ **.env**: Cập nhật cấu hình từ MongoDB Connection String sang SQL Server credentials
- ✅ **backend/src/libs/db.js**: Chuyển đổi kết nối từ Mongoose sang Sequelize

### 2. Models (Chuyển đổi từ Mongoose Schema → Sequelize Model)

- ✅ **backend/src/models/User.js**
  - UUID primary key (thay vì ObjectId)
  - ENUM cho role, validation cho email
- ✅ **backend/src/models/Sesstion.js**
  - Association với User
  - JSON columns cho deviceInfo và location
- ✅ **backend/src/models/Table.js**
  - JSON columns cho features
  - Multiple indexes cho performance
- ✅ **backend/src/models/Food.js**
  - Complex schema với enums và JSON arrays
  - Decimal types cho prices
- ✅ **backend/src/models/Order.js**
  - Association với User, Booking, Table
  - JSON column cho items với chi tiết đơn hàng
- ✅ **backend/src/models/Booking.js**
  - Association với User, Table
  - JSON column cho dietaryRestrictions

### 3. Controllers (Cập nhật Database Queries)

#### Authentication Controller

- ✅ `findOne({where: {username}})` thay vì `findOne({username})`
- ✅ `destroy({where: {...}})` thay vì `deleteOne()`
- ✅ `user.id` thay vì `user._id`

#### User Controller

- ✅ `findByPk()` thay vì `findById()`
- ✅ `findAll({where: {...}})` thay vì `find()`
- ✅ `update()` thay vì `.save()` cho update operations
- ✅ Sequelize Operators: `Op.gte, Op.lt, Op.in` thay vì `$gte, $lt, $in`
- ✅ Associations với includes giả lập populate()

#### Admin Controller

- ✅ `create()` thay vì `new Model()` + `save()`
- ✅ `destroy()` thay vì `findByIdAndDelete()`
- ✅ `update()` với object thay vì property assignment + `save()`
- ✅ Decimal types để xử lý prices và currencies

### 4. Middleware

- ✅ **backend/src/middlewares/authMiddleware.js**
  - `findByPk()` với attributes exclusion
  - UUID handling

### 5. Server

- ✅ **backend/src/server.js**
  - Import tất cả models để đảm bảo Sequelize registration
  - Promise handling cho database connection

## Các Thay Đổi Kỹ Thuật Chính

### 1. ID Management

```
Trước: ObjectId (MongoDB Object reference)
Sau:  UUID (Universal Unique Identifier)
```

### 2. Query Syntax

```javascript
// Trước (Mongoose)
User.findOne({username: "test"})
User.find({role: "admin"})
User.findByIdAndUpdate(id, {...})

// Sau (Sequelize)
User.findOne({where: {username: "test"}})
User.findAll({where: {role: "admin"}})
await user.update({...})
```

### 3. Operators

```javascript
// Trước (MongoDB Operators)
{price: {$gte: 100, $lte: 500}}
{status: {$in: ["pending", "confirmed"]}}

// Sau (Sequelize Operators)
{price: {[Op.gte]: 100, [Op.lte]: 500}}
{status: {[Op.in]: ["pending", "confirmed"]}}
```

### 4. Relationships (Associations)

```javascript
// Trước (Mongoose populate)
const booking = await Booking.findById(id).populate("user").populate("table");

// Sau (Sequelize include)
const booking = await Booking.findByPk(id, {
  include: [{ association: "user" }, { association: "table" }],
});
```

### 5. Data Types

```javascript
// Trước: Mongoose Schema Types
{price: Number, items: [String]}

// Sau: Sequelize Data Types
{price: DataTypes.DECIMAL(10, 2), items: DataTypes.JSON}
```

## Lợi Ích của SQL Server

✅ **Mạnh mẽ**: Enterprise-grade database
✅ **Miễn phí**: SQL Server Express edition
✅ **Hiệu suất**: Tốt cho dữ liệu có cấu trúc
✅ **Hỗ trợ**: Cộng đồng rộng lớn
✅ **Tích hợp**: Tốt với .NET stack
✅ **JSON Support**: Native JSON handling

## Hướng Dẫn Thiết Lập

Xem chi tiết trong `SQL_SERVER_SETUP.md`

### Nhanh chóng:

1. Cài SQL Server hoặc Docker
2. Cập nhật `.env` với credentials
3. `npm install`
4. `npm run dev`

## Test & Xác Nhận

- ✅ Tất cả models đã được chuyển đổi
- ✅ Tất cả controllers đã được cập nhật
- ✅ Middleware đã được sửa
- ✅ Không còn MongoDB imports
- ✅ UUID được sử dụng cho tất cả IDs
- ✅ Sequelize associations được thiết lập

## Breaking Changes

⚠️ **Các ứng dụng frontend cần lưu ý:**

1. **ID Format**:
   - Trước: `507f1f77bcf86cd799439011` (24 chars MongoDB ObjectId)
   - Sau: `550e8400-e29b-41d4-a716-446655440000` (36 chars UUID)

2. **Query Response**: Cấu trúc response vẫn giống nhưng ID được thay đổi

3. **Timestamp**: `createdAt` và `updatedAt` được SQL Server quản lý tự động

## Rollback Plan (Nếu cần quay lại MongoDB)

1. Restore package.json với `mongoose`
2. Chuyển đổi lại models từ Sequelize → Mongoose
3. Cập nhật `.env` với MongoDB connection string
4. Cập nhật lại tất cả queries

## Performance Metrics

| Yếu tố       | MongoDB    | SQL Server |
| ------------ | ---------- | ---------- |
| Query Speed  | Medium     | Fast       |
| Indexing     | Built-in   | Advanced   |
| Transactions | Limited    | Full ACID  |
| JSON Support | Native     | Native     |
| Scaling      | Horizontal | Vertical   |

## Hỗ Trợ

Tài liệu tham khảo:

- Sequelize Docs: https://sequelize.org/
- SQL Server Docs: https://docs.microsoft.com/sql/sql-server/
- Troubleshooting: Xem `SQL_SERVER_SETUP.md`

---

**Trạng thái**: ✅ Hoàn thành  
**Kiểm tra cuối cùng**: V1.0
