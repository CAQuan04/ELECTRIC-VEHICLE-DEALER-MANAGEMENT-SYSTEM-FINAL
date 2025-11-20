# Hướng dẫn sử dụng Dịch vụ API Đại lý (Dealer API Service)

Tài liệu này hướng dẫn cách sử dụng `dealerAPI` service (từ file `dealer.api.js`) để tương tác với backend từ các component React trong dự án.

## 1. Khái niệm cốt lõi: Singleton Instance

File `dealer.api.js` export một **instance (thể hiện) duy nhất** của class `DealerAPI` tên là `dealerAPI`. Bạn không cần phải `new DealerAPI()` ở bất kỳ đâu.

Chỉ cần import nó vào component của bạn:

```jsx
import { dealerAPI } from '@/utils/api/services/dealer.api.js';


<---------------------------------------------------------->



## 2. Cách gọi một phương thức

Tất cả các phương thức trong dealerAPI đều là bất đồng bộ (async) và trả về một Promise. Bạn phải luôn sử dụng async / await khi gọi chúng.

Cấu trúc Phản hồi (Response)
Tất cả các hàm đã được chuẩn hóa để luôn trả về một object có cấu trúc:

TypeScript

{
  success: boolean,
  data?: any, // Dữ liệu nếu thành công
  message?: string // Thông báo lỗi nếu thất bại
}
Nếu result.success === true: Lệnh gọi API thành công. Dữ liệu trả về nằm trong result.data.

Nếu result.success === false: Lệnh gọi API thất bại. Lý do lỗi nằm trong result.message.

<---------------------------------------------------------->


## 3. Xử lý Lỗi (Rất quan trọng)
Vì dealerAPI đã tự xử lý try...catch bên trong, bạn không cần try...catch ở component.

Thay vào đó, bạn PHẢI luôn kiểm tra if (result.success) để xử lý lỗi.

Ví dụ: Xử lý Submit Form
JavaScript

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  // Gọi API
  const result = await dealerAPI.createOrder(formData);

  if (result.success) {
    // THÀNH CÔNG
    alert('Tạo đơn hàng thành công!');
    navigate('/dealer/orders');
  } else {
    // THẤT BẠI
    alert('Lỗi: ' + result.message);
  }

  setIsSubmitting(false);
};

<---------------------------------------------------------->

## 4. Các Phương thức API chính (Ví dụ)

Dưới đây là các ví dụ về cách gọi các hàm phổ biến nhất.

Lấy danh sách (GET)
Thường dùng trong useEffect để tải dữ liệu khi trang mở.

JavaScript

useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    
    // Gọi API lấy danh sách đơn hàng
    const result = await dealerAPI.getOrders({ status: 'pending' });

    if (result.success && result.data) {
      // API có thể trả về { data: [...] } hoặc { data: { data: [...] } }
      const orderList = Array.isArray(result.data) ? result.data : result.data.data || [];
      setOrders(orderList);
    } else {
      alert('Không thể tải đơn hàng: ' + result.message);
    }
    
    setIsLoading(false);
  };

  loadData();
}, []);
Tạo mới (POST)
Thường dùng trong các hàm handleSubmit.

JavaScript

const handleCreateQuotation = async () => {
  if (!validateForm()) return; // Kiểm tra form
  
  setIsSubmitting(true);
  
  const result = await dealerAPI.createQuotation(formData);
  
  if (result.success) {
    alert('Tạo báo giá thành công!');
    navigate('/dealer/quotations');
  } else {
    alert('Lỗi: ' + result.message);
  }
  
  setIsSubmitting(false);
};
Lấy chi tiết bằng ID (GET by ID)
JavaScript

const loadStockDetail = async (stockId) => {
  setIsLoading(true);
  
  const result = await dealerAPI.getStockById(stockId);
  
  if (result.success && result.data) {
    setStockDetail(result.data);
  } else {
    alert('Lỗi: ' + result.message);
    navigate('/dealer/inventory'); // Quay lại nếu lỗi
  }
  
  setIsLoading(false);
};

<---------------------------------------------------------->

## 5. Danh sách các hàm API (Tóm tắt)
getDashboard(): Lấy số liệu dashboard.

getVehicles(params): Lấy danh sách xe (cho trang catalogue).

getVehicleById(id): Lấy chi tiết xe.

getInventory(filters): Lấy kho hàng (xe của đại lý).

getStockById(stockId): Lấy chi tiết xe trong kho (theo VIN).

requestStock(requestData): Gửi yêu cầu nhập kho (Purchase Request).

getCustomers(params): Lấy danh sách khách hàng.

getCustomerById(id): Lấy chi tiết khách hàng.

getOrders(params): Lấy danh sách đơn hàng.

getOrderById(id): Lấy chi tiết đơn hàng.

createOrder(orderData): Tạo đơn hàng mới.

getQuotations(params): Lấy danh sách báo giá.

createQuotation(quotationData): Tạo báo giá mới.

getPayments(params): Lấy lịch sử thanh toán.

processPayment(orderId, paymentData): Ghi nhận thanh toán cho đơn hàng.

... và nhiều hàm khác (xem chi tiết trong file dealer.api.js).