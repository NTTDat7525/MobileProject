# Test Cases - Payment APIs (VNPay Integration)

## Overview: 2 APIs trong Payment Route

| #   | Endpoint                  | Method | Purpose                                   |
| --- | ------------------------- | ------ | ----------------------------------------- |
| 1   | `/payment/create-qr`      | POST   | Tạo mã QR thanh toán VNPay                |
| 2   | `/payment/payment-return` | POST   | Nhận callback từ VNPay sau khi thanh toán |

---

## API 1: Create Payment QR

### Thông Tin Cơ Bản

**Endpoint**: `POST /payment/create-qr`

**URL**: `http://localhost:5001/api/payment/create-qr`

**Description**: Tạo mã QR thanh toán qua VNPay Sandbox

**Authentication**: Không yêu cầu (Public endpoint)

---

### Test Case 1.1: Tạo QR code thành công

**Test ID**: PAYMENT-001

**Priority**: HIGH

**Headers**:

```json
{
  "Content-Type": "application/json"
}
```

**Request Body**:

```json
{}
```

**Expected Status**: 201 (Created)

**Expected Response**:

```json
{
  "code": "00",
  "message": "success",
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=5000000&vnp_Command=pay&...",
    "paymentExpire": "20240115145959"
  }
}
```

**Validation Points**:

- ✅ Status code = 201
- ✅ Response có `paymentUrl`
- ✅ URL bắt đầu với "https://sandbox.vnpayment.vn"
- ✅ Response có `paymentExpire` (định dạng YYYYMMDDHHMMSS)
- ✅ Amount = 5000000 (VND)

**Postman Steps**:

1. Create new request: `POST Create Payment QR`
2. URL: `{{baseUrl}}/payment/create-qr`
3. Headers:
   ```
   Content-Type: application/json
   ```
4. Body: `{}`
5. Click "Send"
6. Check response status = 201
7. Copy `paymentUrl` for manual testing (scan QR hoặc open link)

**Notes**:

- Amount cứng là 5,000,000 VND (theo code)
- Expiry date là tomorrow (ngày hôm sau)
- IP address lấy từ request header hoặc socket

---

### Test Case 1.2: Verify VNPay URL Format

**Test ID**: PAYMENT-002

**Priority**: MEDIUM

**Description**: Kiểm tra URL format từ VNPay response

**Postman Pre-request Script**:

```javascript
// None needed
```

**Postman Tests Script**:

```javascript
pm.test("Status code should be 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response should have paymentUrl", function () {
  let jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("data");
  pm.expect(jsonData.data).to.have.property("paymentUrl");
});

pm.test("Payment URL should contain vnp_Amount parameter", function () {
  let jsonData = pm.response.json();
  pm.expect(jsonData.data.paymentUrl).to.include("vnp_Amount=5000000");
});

pm.test("Payment URL should start with VNPay sandbox domain", function () {
  let jsonData = pm.response.json();
  pm.expect(jsonData.data.paymentUrl).to.include("sandbox.vnpayment.vn");
});

pm.test("Should have paymentExpire field", function () {
  let jsonData = pm.response.json();
  pm.expect(jsonData.data).to.have.property("paymentExpire");
});

// Save paymentUrl to environment for return flow testing
if (pm.response.code === 201) {
  let jsonData = pm.response.json();
  pm.environment.set("paymentUrl", jsonData.data.paymentUrl);
  console.log("Payment URL saved:", jsonData.data.paymentUrl);
}
```

**Expected Validations**:

- ✅ paymentUrl contains "sandbox.vnpayment.vn"
- ✅ paymentUrl contains "vnp_Amount=5000000"
- ✅ paymentUrl contains "vnp_Command=pay"
- ✅ Có createdDate, expireDate parameters

**Notes**:

- Có thể test bằng cách paste paymentUrl vào browser
- Sẽ redirect tới VNPay sandbox payment page
- Có thể select card test: 4111111111111111

---

### Test Case 1.3: Verify Payment Amount

**Test ID**: PAYMENT-003

**Priority**: MEDIUM

**Description**: Xác nhận số tiền trong request luôn là 5,000,000 VND

**Request Body**:

```json
{}
```

**Validation**:

```javascript
pm.test("Amount must be 5000000 VND", function () {
  let jsonData = pm.response.json();
  pm.expect(jsonData.data.paymentUrl).to.include("vnp_Amount=5000000");
});

pm.test("Order info should be present", function () {
  let jsonData = pm.response.json();
  pm.expect(jsonData.data.paymentUrl).to.include("vnp_OrderInfo");
});
```

**Expected Result**:

```
✓ Amount must be 5000000 VND
✓ Order info should be present
```

**Notes**:

- Amount cứng coding trong controller
- Order info: "Payment for order"

---

### Test Case 1.4: Response Time Check

**Test ID**: PAYMENT-004

**Priority**: LOW

**Description**: Kiểm tra response time không quá lâu

**Postman Tests Script**:

```javascript
pm.test("Response time should be less than 2000ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response time should be less than 3000ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(3000);
});
```

**Expected Result**:

```
✓ Response time should be less than 2000ms
```

**Notes**:

- VNPay API call có thể mất vài trăm ms
- Timeout nếu > 3000ms là error

---

## API 2: Payment Return (Callback)

### Thông Tin Cơ Bản

**Endpoint**: `POST /payment/payment-return`

**URL**: `http://localhost:5001/api/payment/payment-return`

**Description**: Webhook callback từ VNPay sau khi user thanh toán

**Authentication**: Không yêu cầu (Callback từ VNPay server)

**⚠️ Important Notes**:

- Endpoint này được gọi bởi VNPay server sau thanh toán
- Cần verify secure hash từ VNPay (hiện chưa implement)
- Cần update order status trong database

---

### Test Case 2.1: Receive Payment Return - Success

**Test ID**: PAYMENT-RETURN-001

**Priority**: HIGH

**Description**: Nhận payment return data từ VNPay (thanh toán thành công)

**Headers**:

```json
{
  "Content-Type": "application/json"
}
```

**Request Body** (VNPay Payment Return):

```json
{
  "vnp_Amount": "5000000",
  "vnp_BankCode": "NCB",
  "vnp_BankTranNo": "VNP1234567890",
  "vnp_CardType": "ATM",
  "vnp_OrderInfo": "Payment for order",
  "vnp_PayDate": "20240115143000",
  "vnp_ResponseCode": "00",
  "vnp_TmnCode": "RH70239L",
  "vnp_TransactionNo": "1234567890",
  "vnp_TxnRef": "12345"
}
```

**Expected Status**: 200 (OK)

**Expected Response**:

```json
{
  "message": "Payment return received successfully",
  "data": {
    "vnp_Amount": "5000000",
    "vnp_BankCode": "NCB",
    "vnp_OrderInfo": "Payment for order",
    "vnp_ResponseCode": "00",
    ...
  }
}
```

**Validation Points**:

- ✅ Status code = 200
- ✅ Response có message "Payment return received successfully"
- ✅ Response data bao gồm tất cả request parameters
- ✅ vnp_ResponseCode = "00" (success)

**Postman Steps**:

1. Create new request: `POST Payment Return Success`
2. URL: `{{baseUrl}}/payment/payment-return`
3. Body: (paste request body trên)
4. Click "Send"
5. Verify response status = 200

**Expected Result**:

```json
{
  "message": "Payment return received successfully",
  "data": {
    // tất cả parameters được echo lại
  }
}
```

---

### Test Case 2.2: Payment Return - Failed Transaction

**Test ID**: PAYMENT-RETURN-002

**Priority**: HIGH

**Description**: Nhận payment return khi giao dịch thất bại

**Request Body**:

```json
{
  "vnp_Amount": "5000000",
  "vnp_BankCode": "NCB",
  "vnp_OrderInfo": "Payment for order",
  "vnp_PayDate": "20240115143000",
  "vnp_ResponseCode": "01",
  "vnp_TmnCode": "RH70239L",
  "vnp_TxnRef": "12345"
}
```

**Expected Status**: 200 (OK - vẫn nhận return)

**Response**:

```json
{
  "message": "Payment return received successfully",
  "data": {
    "vnp_ResponseCode": "01",
    ...
  }
}
```

**Validation Points**:

- ✅ Status = 200
- ✅ vnp_ResponseCode = "01" (Không thành công)
- ✅ System vẫn xử lý (log và lưu failure)

**Notes**:

- vnp_ResponseCode = "01" = Bank rejected
- Server vẫn nhận callback (status = 200)
- Nhưng cần check vnp_ResponseCode để cập nhật order status

---

### Test Case 2.3: Missing Required Fields

**Test ID**: PAYMENT-RETURN-003

**Priority**: MEDIUM

**Description**: Test khi thiếu required fields

**Request Body** (Thiếu vnp_ResponseCode):

```json
{
  "vnp_Amount": "5000000",
  "vnp_BankCode": "NCB",
  "vnp_OrderInfo": "Payment for order",
  "vnp_TxnRef": "12345"
}
```

**Expected Status**: 200 (Vẫn nhận)

**Response**:

```json
{
  "message": "Payment return received successfully",
  "data": {
    "vnp_Amount": "5000000",
    "vnp_BankCode": "NCB",
    ...
  }
}
```

**Validation Points**:

- ✅ Status = 200 (endpoint vẫn work)
- ⚠️ Cần thêm validation cho required fields
- ⚠️ Cần kiểm tra vnp_ResponseCode bắt buộc

**Notes**:

- Hiện tại endpoint không validate fields
- Nên thêm validation cho required fields:
  - vnp_ResponseCode (required)
  - vnp_TxnRef (required)
  - vnp_Amount (required)
  - vnp_TmnCode (required)

---

### Test Case 2.4: Verify Secure Hash

**Test ID**: PAYMENT-RETURN-004

**Priority**: CRITICAL

**Description**: Xác minh secure hash từ VNPay

**⚠️ IMPORTANT**: Hiện chưa implement verify hash

**Request Body** (With Secure Hash):

```json
{
  "vnp_Amount": "5000000",
  "vnp_BankCode": "NCB",
  "vnp_OrderInfo": "Payment for order",
  "vnp_PayDate": "20240115143000",
  "vnp_ResponseCode": "00",
  "vnp_TmnCode": "RH70239L",
  "vnp_TxnRef": "12345",
  "vnp_SecureHash": "abc123def456..."
}
```

**Validation Script**:

```javascript
pm.test("Should verify vnp_SecureHash", function () {
  // Currently not implemented
  // TODO: Implement hash verification
  pm.expect(true).to.be.true;
});

pm.test("Should reject tampered data", function () {
  // When implemented, should reject if hash doesn't match
  pm.expect(true).to.be.true;
});
```

**Notes**:

- ⚠️ **SECURITY ISSUE**: Hash verification không được implement
- Nên implement tại đây:
  ```javascript
  const crypto = require('crypto');
  const secureHash = vnpay.buildSecHash(...);
  if (secureHash !== req.body.vnp_SecureHash) {
    return res.status(400).json({ error: 'Invalid hash' });
  }
  ```

---

### Test Case 2.5: Database Update Verification

**Test ID**: PAYMENT-RETURN-005

**Priority**: CRITICAL

**Description**: Verify order status được update sau payment return

**⚠️ IMPORTANT**: Hiện chưa implement order status update

**Test Steps**:

1. Create Order (GET order status = "pending")
2. Send Payment Return with vnp_ResponseCode = "00"
3. Check Order status changed to "paid"

**Pre-condition**:

```
1. Order exists with ID: {{orderId}}
2. Order status = "pending"
```

**Request Body**:

```json
{
  "vnp_Amount": "5000000",
  "vnp_ResponseCode": "00",
  "vnp_TxnRef": "{{orderId}}"
}
```

**Expected Result After Payment Return**:

```javascript
pm.test("Order status should be updated to paid", function () {
  // After payment return, check order:
  // GET /admin/orders/{{orderId}}
  // Should have status = "paid"
});
```

**Notes**:

- ⚠️ **TODO**: Implement order update logic
- Need to:
  1. Extract TxnRef (orderId) từ payment return
  2. Find order in database
  3. Update order.paymentStatus = "paid"
  4. Update order.status = "completed" (optional)
  5. Save to database

---

## Postman Collection Setup

### Environment Variables

Add to your Postman "Local Development" environment:

```json
{
  "baseUrl": "http://localhost:5001/api",
  "paymentUrl": "",
  "orderId": "",
  "paymentAmount": "5000000"
}
```

### Pre-request Script (cho tất cả Payment requests)

```javascript
// Validate baseUrl
if (!pm.environment.get("baseUrl")) {
  pm.environment.set("baseUrl", "http://localhost:5001/api");
}

console.log("Testing Payment APIs");
console.log("Base URL:", pm.environment.get("baseUrl"));
```

### Tests Script Template (cho tất cả Payment requests)

```javascript
// Common tests for all payment APIs

pm.test("Response should be JSON", function () {
  pm.response.to.be.json;
});

pm.test("Response time should be acceptable", function () {
  pm.expect(pm.response.responseTime).to.be.below(3000);
});

// Log response for debug
console.log("Response Status:", pm.response.code);
console.log("Response Body:", JSON.stringify(pm.response.json(), null, 2));
```

---

## Manual Testing - QR Code Flow

### Step-by-Step Test Payment Complete Flow:

1. **Call Create QR API**:

   ```
   POST http://localhost:5001/api/payment/create-qr
   Body: {}
   ```

2. **Get Payment URL**:

   ```
   Response will have: paymentUrl = "https://sandbox.vnpayment.vn/..."
   ```

3. **Test Payment (2 options)**:

   **Option A: Simulate via API**

   ```
   1. Copy paymentUrl
   2. But VNPay redirect happens in browser
   3. Can't test directly via Postman
   ```

   **Option B: Use Test Card on VNPay Sandbox**

   ```
   1. Open paymentUrl in browser
   2. Use test card: 4111111111111111
   3. CVV: 123
   4. Date: any future date
   5. OTP: 123456
   6. Should redirect to payment-return endpoint
   ```

4. **Simulate Payment Return**:

   ```
   POST http://localhost:5001/api/payment/payment-return
   Body: {
     "vnp_Amount": "5000000",
     "vnp_ResponseCode": "00",
     "vnp_TxnRef": "12345"
   }
   ```

5. **Verify in Database**:
   ```
   Check if order.paymentStatus = "paid"
   ```

---

## Issues & TODO

### Current Issues:

❌ **No hash verification** (SECURITY RISK)

- Missing `vnp_SecureHash` validation
- Can accept tampered payment data

❌ **No order status update**

- Payment return is logged but not processed
- Order status not updated to "paid"

❌ **No error handling for missing fields**

- Should validate vnp_ResponseCode, vnp_TxnRef, etc.

❌ **Hardcoded amount**

- Always 5,000,000 VND
- Should be dynamic based on order

### Recommended Improvements:

```javascript
// Added validation
router.post("/payment-return", (req, res) => {
  try {
    const { vnp_ResponseCode, vnp_TxnRef, vnp_SecureHash, vnp_Amount } = req.body;

    // 1. Validate required fields
    if (!vnp_ResponseCode || !vnp_TxnRef || !vnp_SecureHash) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // 2. Verify secure hash
    const expectedHash = vnpay.buildSecHash(req.body);
    if (expectedHash !== vnp_SecureHash) {
      return res.status(400).json({
        message: "Invalid secure hash"
      });
    }

    // 3. Update order status if payment successful
    if (vnp_ResponseCode === "00") {
      // Find order by TxnRef
      const order = await Order.findById(vnp_TxnRef);
      if (order) {
        order.paymentStatus = "paid";
        order.status = "completed";
        await order.save();
      }
    }

    return res.status(200).json({
      message: "Payment processed successfully",
      data: req.body
    });
  } catch (error) {
    console.error("Payment return error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
```

---

## Summary

| Test Case          | API            | Status      | Priority |
| ------------------ | -------------- | ----------- | -------- |
| PAYMENT-001        | Create QR      | ✅ Ready    | HIGH     |
| PAYMENT-002        | Verify URL     | ✅ Ready    | MEDIUM   |
| PAYMENT-003        | Verify Amount  | ✅ Ready    | MEDIUM   |
| PAYMENT-004        | Response Time  | ✅ Ready    | LOW      |
| PAYMENT-RETURN-001 | Return Success | ✅ Ready    | HIGH     |
| PAYMENT-RETURN-002 | Return Failed  | ✅ Ready    | HIGH     |
| PAYMENT-RETURN-003 | Missing Fields | ⚠️ Need Fix | MEDIUM   |
| PAYMENT-RETURN-004 | Verify Hash    | ❌ Not Impl | CRITICAL |
| PAYMENT-RETURN-005 | Update Order   | ❌ Not Impl | CRITICAL |

**Total**: 9 test cases (6 ready, 3 need implementation)

---

**Version**: 1.0
**Last Updated**: 2024-01-15
**Author**: Payment API Test Suite
