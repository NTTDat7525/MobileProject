/**
 * VNPay Configuration
 * Sandbox configuration for table deposit payments
 */

export const VNPAY_CONFIG = {
  // Sandbox credentials
  tmn_code: 'TESTTMNCODE', // Will be replaced with actual code
  secret_key: 'TESTSECRETKEY', // Will be replaced with actual key
  
  // API Endpoints
  sandbox_url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  sandbox_query_url: 'https://sandbox.vnpayment.vn/merchant_weblogic/querydr',
  sandbox_refund_url: 'https://sandbox.vnpayment.vn/merchant_weblogic/refund',
  
  production_url: 'https://payment.vnpayment.vn/vpcpay.html',
  production_query_url: 'https://api.vnpayment.vn/merchant_weblogic/querydr',
  production_refund_url: 'https://api.vnpayment.vn/merchant_weblogic/refund',
  
  // Return routes  
  return_url_base: 'http://192.168.1.9:5001/api/payment/vnpay-return',
  notify_url_base: 'http://192.168.1.9:5001/api/payment/vnpay-notify',
  
  // Payment info
  version: '2.1.0',
  command: 'pay',
  currency_code: 'VND',
  orderType: 'other',
};

export const PAYMENT_TYPES = {
  BOOKING_DEPOSIT: 'booking_deposit',    // Tiền cọc bàn
  FULL_PAYMENT: 'full_payment',          // Thanh toán toàn bộ
  ORDER_PAYMENT: 'order_payment',        // Thanh toán đơn hàng
};

export const DEPOSIT_PERCENTAGE = 0.2;  // 20% tiền cọc
export const MIN_DEPOSIT = 100000;      // 100k VND minimum
