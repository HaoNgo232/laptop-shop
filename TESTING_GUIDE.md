## Manual Testing Guide for Reserved Stock Implementation

### Backend Testing Checklist

#### 1. Reserved Stock Functionality
**Test Case**: Create an order and verify stock is reserved (not decremented)

**Steps**:
1. Start backend: `npm run dev`
2. Create a product with stockQuantity = 10, reservedQuantity = 0
3. Create an order with quantity = 3
4. Verify: stockQuantity = 10, reservedQuantity = 3
5. Order status should be PENDING, payment status PENDING

**Expected Result**: 
- Product stock not immediately decremented
- Reserved quantity increased by order quantity
- Available stock = stockQuantity - reservedQuantity = 7

#### 2. Payment Success Flow
**Test Case**: Complete payment and verify stock is decremented

**Steps**:
1. From previous test, update payment status to PAID
2. Verify: stockQuantity = 7, reservedQuantity = 0  
3. Order status should be PROCESSING

**Expected Result**:
- Stock decremented by order quantity
- Reserved quantity decreased by order quantity
- Net effect: available stock unchanged, but actual stock decremented

#### 3. Order Cancellation Flow
**Test Case**: Cancel order and verify reserved stock is restored

**Steps**:
1. Create order (stockQuantity = 10, reservedQuantity = 3)
2. Cancel order or set payment to FAILED
3. Verify: stockQuantity = 10, reservedQuantity = 0

**Expected Result**:
- Reserved quantity restored to 0
- Actual stock quantity unchanged
- Available stock = stockQuantity = 10

#### 4. Stock Validation
**Test Case**: Verify available stock calculation

**Steps**:
1. Product: stockQuantity = 10, reservedQuantity = 7
2. Try to create order with quantity = 5
3. Should fail with "không đủ hàng. Còn lại: 3, yêu cầu: 5"

**Expected Result**:
- Validation uses available stock (10 - 7 = 3)
- Order creation fails with appropriate error message

#### 5. Order Timeout Job
**Test Case**: Verify orders expire after 30 minutes

**Steps**:
1. Create order with expiresAt set to 30 minutes from now
2. Manually set expiresAt to past time (for testing)
3. Run job or wait for cron execution
4. Verify order is cancelled and reserved stock restored

**Expected Result**:
- Order status = CANCELLED, payment status = CANCELLED
- Reserved stock restored
- Proper logging in console

### Frontend Testing Checklist

#### 1. Order Success Page
**Test Case**: Navigate to success page after order completion

**Steps**:
1. Start frontend: `npm run dev`
2. Add items to cart
3. Complete checkout flow
4. Verify redirect to `/checkout/success`

**Expected Result**:
- Success page displays order information
- Shows payment status and shipping details  
- Provides "Create New Order" and "View Details" buttons

#### 2. Navigation Flow
**Test Case**: Test navigation from success page

**Steps**:
1. On success page, click "View Details"
2. Should navigate to `/orders/{orderId}`
3. Go back to success page, click "Create New Order"
4. Should navigate to `/products` and reset checkout state

**Expected Result**:
- Proper navigation between pages
- Checkout state properly reset for new orders

#### 3. COD vs QR Payment
**Test Case**: Test different payment methods

**Steps**:
1. Create order with COD - should redirect immediately to success
2. Create order with QR - should show payment waiting, then redirect on payment

**Expected Result**:
- Different flow for different payment methods
- Proper status display on success page

### API Testing Examples

#### Reserved Stock API Test
```bash
# 1. Create product
POST /api/products
{
  "name": "Test Laptop",
  "price": 1000000,
  "stockQuantity": 10,
  "reservedQuantity": 0
}

# 2. Create order
POST /api/orders
{
  "items": [{"productId": "...", "quantity": 3}],
  "shippingAddress": "Test Address",
  "paymentMethod": "COD"
}

# 3. Verify stock
GET /api/products/{id}
# Should show: stockQuantity: 10, reservedQuantity: 3

# 4. Update payment
PATCH /api/orders/{id}/payment
{
  "paymentStatus": "PAID",
  "transactionId": "test123"
}

# 5. Verify final stock
GET /api/products/{id}  
# Should show: stockQuantity: 7, reservedQuantity: 0
```

### Database Verification Queries

```sql
-- Check product stock
SELECT id, name, stock_quantity, reserved_quantity, 
       (stock_quantity - reserved_quantity) as available_stock
FROM products 
WHERE id = 'product-id';

-- Check order status
SELECT id, status, payment_status, expires_at,
       CASE WHEN expires_at < NOW() THEN 'EXPIRED' ELSE 'VALID' END as expiry_status
FROM orders 
WHERE status = 'PENDING';

-- Check order items
SELECT oi.quantity, oi.product_id, p.stock_quantity, p.reserved_quantity
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = 'order-id';
```

### Acceptance Criteria Verification

✅ **Stock không bị trừ ngay khi tạo order PENDING**
- Verify stockQuantity unchanged, reservedQuantity increased

✅ **Pending orders auto cancel sau 30 phút**  
- Verify job runs every 5 minutes and cancels expired orders

✅ **Hiển thị trang success sau khi đặt hàng thành công**
- Verify redirect to /checkout/success with proper UI

✅ **User có thể tạo đơn hàng mới sau khi hoàn tất**
- Verify startNewOrder() resets state and allows new orders

✅ **Reserved stock được quản lý chính xác**
- Verify all stock operations maintain data integrity