import express from "express";
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from "vnpay";

const router = express.Router();

router.post("/create-qr", async (req, res) => {
  try {
    const vnpay = new VNPay({
      tmnCode: process.env.VNPAY_TMN_CODE || "RH70239L", // lấy từ .env
      secureSecret: process.env.VNPAY_SECRET || "JEPSN3V5U9Z8QMHO5WRKWLKB1DJEHHFM",
      vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });

    const formatDate = (date) => {
        const yyyy = date.getFullYear().toString();
        const MM = (date.getMonth() + 1).toString().padStart(2, "0");
        const dd = date.getDate().toString().padStart(2, "0");
        const HH = date.getHours().toString().padStart(2, "0");
        const mm = date.getMinutes().toString().padStart(2, "0");
        const ss = date.getSeconds().toString().padStart(2, "0");
        return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const vnpayResponse = await vnpay.buildPaymentUrl({
      vnp_Amount: 5000000,
      vnp_IpAddr: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      vnp_TxnRef: "12345",
      vnp_OrderInfo: "Payment for order",
      vnp_OrderType: "other",
      vnp_ReturnUrl: "http://localhost:5001/api/payment-return", // cần URL đầy đủ
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: formatDate(new Date()),
      vnp_ExpireDate: formatDate(tomorrow),
    });

    return res.status(201).json(vnpayResponse);
  } catch (error) {
    console.error("Error creating QR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/payment-return", (req, res) => {
  try {
    const data = req.body;
    console.log("Payment return data:", data);

    // TODO: xác minh chữ ký (secure hash) từ VNPay
    // TODO: cập nhật trạng thái đơn hàng trong DB

    return res.status(200).json({
      message: "Payment return received successfully",
      data,
    });
  } catch (error) {
    console.error("Payment return error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


export default router;