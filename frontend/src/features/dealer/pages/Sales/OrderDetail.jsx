import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { notifications } from '@utils/notifications';
import { 
  PageContainer, 
  PageHeader, 
  Button, 
  Badge,
  InfoSection,
  InfoRow,
  Card
} from '../../components';
import { 
  ShoppingCart, 
  User, 
  Car, 
  Calendar, 
  DollarSign, 
  Package, 
  Truck, 
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  AlertCircle
} from 'lucide-react';

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadOrderDetail();
  }, [id]);

  const loadOrderDetail = async () => {
    setIsLoading(true);
    try {
      const result = await dealerAPI.getOrderById(id);
      if (result.success && result.data) {
        setOrder(result.data);
      } else {
        notifications.error('Lỗi', 'Không thể tải thông tin đơn hàng');
        navigate('/dealer/orders');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      notifications.error('Lỗi', 'Có lỗi xảy ra khi tải dữ liệu');
      navigate('/dealer/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    notifications.confirm(
      'Xác nhận cập nhật',
      `Xác nhận cập nhật trạng thái thành "${getStatusLabel(newStatus)}"?`,
      async () => {
        setIsUpdating(true);
        try {
          const result = await dealerAPI.updateOrderStatus(id, newStatus);
          if (result.success) {
            notifications.success('Thành công', 'Cập nhật trạng thái thành công!');
            await loadOrderDetail();
          } else {
            notifications.error('Lỗi', result.message);
          }
        } catch (error) {
          console.error('Error updating status:', error);
          notifications.error('Lỗi', 'Có lỗi xảy ra khi cập nhật trạng thái');
        } finally {
          setIsUpdating(false);
        }
      }
    );
  };

  const handleCancelOrder = async () => {
    const reason = prompt('Lý do hủy đơn hàng:');
    if (!reason) return;

    setIsUpdating(true);
    try {
      const result = await dealerAPI.cancelOrder(id, reason);
      if (result.success) {
        notifications.success('Thành công', 'Đã hủy đơn hàng thành công!');
        await loadOrderDetail();
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      notifications.error('Lỗi', 'Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'warning',
      'confirmed': 'info',
      'processing': 'primary',
      'shipping': 'primary',
      'delivered': 'success',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return statusMap[status?.toLowerCase()] || 'gray';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'processing': 'Đang xử lý',
      'manufacturing': 'Đang sản xuất',
      'shipping': 'Đang giao hàng',
      'delivered': 'Đã giao hàng',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return labelMap[status?.toLowerCase()] || status;
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      'unpaid': 'warning',
      'partial': 'info',
      'paid': 'success',
      'refunded': 'danger'
    };
    return statusMap[status?.toLowerCase()] || 'gray';
  };

  const getPaymentStatusLabel = (status) => {
    const labelMap = {
      'unpaid': 'Chưa thanh toán',
      'partial': 'Thanh toán một phần',
      'paid': 'Đã thanh toán',
      'refunded': 'Đã hoàn tiền'
    };
    return labelMap[status?.toLowerCase()] || status;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateEstimatedDelivery = (orderDate, status) => {
    if (!orderDate) return 'N/A';
    
    // Thời gian dự kiến: 30-45 ngày từ khi đặt hàng
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 30); // Thêm 30 ngày
    const minDate = date.toLocaleDateString('vi-VN');
    
    date.setDate(date.getDate() + 15); // Thêm 15 ngày nữa (tổng 45)
    const maxDate = date.toLocaleDateString('vi-VN');
    
    return `${minDate} - ${maxDate}`;
  };

  const calculateManufacturingDate = (orderDate) => {
    if (!orderDate) return 'N/A';
    
    // Xuất xưởng dự kiến: 20-25 ngày từ khi đặt hàng
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 20);
    const minDate = date.toLocaleDateString('vi-VN');
    
    date.setDate(date.getDate() + 5);
    const maxDate = date.toLocaleDateString('vi-VN');
    
    return `${minDate} - ${maxDate}`;
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Chi tiết đơn hàng"
          icon={<ShoppingCart className="w-16 h-16" />}
        />
        <Card>
          <div className="text-center py-16">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-xl font-bold text-gray-400">
              Đang tải thông tin...
            </p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <PageContainer>
      <PageHeader
        title="🛒 Chi tiết đơn hàng"
        subtitle={`Mã đơn: ${order.orderNumber || `ORD-${String(order.orderId).padStart(6, '0')}`}`}
        icon={<ShoppingCart className="w-16 h-16" />}
        showBackButton
        onBack={() => navigate('/dealer/orders')}
        badge={
          <Badge variant={getStatusBadge(order.status)}>
            {getStatusLabel(order.status)}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Thông tin khách hàng */}
          <InfoSection 
            title="Thông tin khách hàng" 
            icon="👤"
            className="bg-gray-800 border-gray-700"
          >
            <InfoRow
              icon={<User className="w-5 h-5" />}
              label="Tên khách hàng"
              value={order.customerName}
            />
            {order.customerPhone && (
              <InfoRow
                icon={<Phone className="w-5 h-5" />}
                label="Số điện thoại"
                value={order.customerPhone}
              />
            )}
            {order.customerEmail && (
              <InfoRow
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                value={order.customerEmail}
              />
            )}
            {order.deliveryAddress && (
              <InfoRow
                icon={<MapPin className="w-5 h-5" />}
                label="Địa chỉ giao hàng"
                value={order.deliveryAddress}
              />
            )}
            <div className="pt-4 border-t border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dealer/customers/${order.customerId}`)}
              >
                👤 Xem hồ sơ khách hàng
              </Button>
            </div>
          </InfoSection>

          {/* Thông tin xe */}
          <InfoSection 
            title="Thông tin xe điện" 
            icon="🚗"
            className="bg-gray-800 border-gray-700"
          >
            <InfoRow
              icon={<Car className="w-5 h-5" />}
              label="Tên xe"
              value={order.vehicleName || order.vehicleModel}
            />
            {order.vehicleBrand && (
              <InfoRow
                label="Hãng"
                value={order.vehicleBrand}
              />
            )}
            {order.vehicleColor && (
              <InfoRow
                label="Màu sắc"
                value={order.vehicleColor}
              />
            )}
            {order.vehicleYear && (
              <InfoRow
                label="Năm sản xuất"
                value={order.vehicleYear}
              />
            )}
            <InfoRow
              label="Số lượng"
              value={order.quantity || 1}
            />
            {order.vehiclePrice && (
              <InfoRow
                label="Đơn giá"
                value={formatCurrency(order.vehiclePrice)}
              />
            )}
          </InfoSection>

          {/* Thông tin đơn hàng */}
          <InfoSection 
            title="Thông tin đơn hàng" 
            icon="📋"
            className="bg-gray-800 border-gray-700"
          >
            <InfoRow
              icon={<Calendar className="w-5 h-5" />}
              label="Ngày đặt hàng"
              value={formatDate(order.orderDate || order.createdAt)}
            />
            <InfoRow
              icon={<Calendar className="w-5 h-5" />}
              label="Ngày xác nhận"
              value={formatDate(order.confirmedDate)}
            />
            <InfoRow
              icon={<Package className="w-5 h-5" />}
              label="Ngày xuất xưởng dự kiến"
              value={order.manufacturingDate 
                ? formatDate(order.manufacturingDate)
                : calculateManufacturingDate(order.orderDate || order.createdAt)
              }
            />
            <InfoRow
              icon={<Truck className="w-5 h-5" />}
              label="Ngày giao hàng dự kiến"
              value={order.estimatedDeliveryDate 
                ? formatDate(order.estimatedDeliveryDate)
                : calculateEstimatedDelivery(order.orderDate || order.createdAt, order.status)
              }
            />
            {order.actualDeliveryDate && (
              <InfoRow
                icon={<CheckCircle className="w-5 h-5" />}
                label="Ngày giao hàng thực tế"
                value={formatDate(order.actualDeliveryDate)}
              />
            )}
            {order.dealerName && (
              <InfoRow
                label="Đại lý"
                value={order.dealerName}
              />
            )}
            {order.salesRepName && (
              <InfoRow
                label="Nhân viên phụ trách"
                value={order.salesRepName}
              />
            )}
          </InfoSection>

          {/* Thông tin thanh toán */}
          <InfoSection 
            title="Thông tin thanh toán" 
            icon="💰"
            className="bg-gray-800 border-gray-700"
          >
            <InfoRow
              icon={<DollarSign className="w-5 h-5" />}
              label="Tổng tiền"
              value={<span className="text-2xl font-bold text-emerald-400">{formatCurrency(order.totalAmount)}</span>}
            />
            {order.deposit && (
              <InfoRow
                label="Đặt cọc"
                value={formatCurrency(order.deposit)}
              />
            )}
            {order.paidAmount && (
              <InfoRow
                label="Đã thanh toán"
                value={formatCurrency(order.paidAmount)}
              />
            )}
            <InfoRow
              label="Còn lại"
              value={formatCurrency((order.totalAmount || 0) - (order.paidAmount || 0))}
            />
            <InfoRow
              label="Trạng thái thanh toán"
              value={
                <Badge variant={getPaymentStatusBadge(order.paymentStatus)}>
                  {getPaymentStatusLabel(order.paymentStatus)}
                </Badge>
              }
            />
            {order.paymentMethod && (
              <InfoRow
                label="Phương thức thanh toán"
                value={order.paymentMethod}
              />
            )}
          </InfoSection>

          {/* Ghi chú */}
          {order.notes && (
            <InfoSection 
              title="Ghi chú" 
              icon="📝"
              className="bg-gray-800 border-gray-700"
            >
              <p className="text-gray-300 whitespace-pre-wrap">
                {order.notes}
              </p>
            </InfoSection>
          )}

          {/* Lý do hủy */}
          {order.status?.toLowerCase() === 'cancelled' && order.cancellationReason && (
            <InfoSection 
              title="Lý do hủy" 
              icon="❌"
              className="bg-red-900/20 border-red-700"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-1" />
                <p className="text-red-300">
                  {order.cancellationReason}
                </p>
              </div>
            </InfoSection>
          )}
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Timeline Card */}
          <Card className="bg-gray-800 border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Tiến trình đơn hàng
            </h3>
            <div className="space-y-4">
              {/* Timeline items */}
              <div className="relative pl-8 pb-4 border-l-2 border-gray-700">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500"></div>
                <div className="text-sm text-gray-400">Đã đặt hàng</div>
                <div className="text-xs text-gray-500">{formatDate(order.orderDate || order.createdAt)}</div>
              </div>

              {order.confirmedDate && (
                <div className="relative pl-8 pb-4 border-l-2 border-gray-700">
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500"></div>
                  <div className="text-sm text-gray-400">Đã xác nhận</div>
                  <div className="text-xs text-gray-500">{formatDate(order.confirmedDate)}</div>
                </div>
              )}

              {order.status?.toLowerCase() === 'processing' && (
                <div className="relative pl-8 pb-4 border-l-2 border-gray-700">
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
                  <div className="text-sm text-blue-400 font-semibold">Đang xử lý</div>
                </div>
              )}

              {order.status?.toLowerCase() === 'manufacturing' && (
                <div className="relative pl-8 pb-4 border-l-2 border-gray-700">
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
                  <div className="text-sm text-blue-400 font-semibold">Đang sản xuất</div>
                </div>
              )}

              {order.status?.toLowerCase() === 'shipping' && (
                <div className="relative pl-8 pb-4 border-l-2 border-gray-700">
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
                  <div className="text-sm text-blue-400 font-semibold">Đang giao hàng</div>
                </div>
              )}

              {order.actualDeliveryDate && (
                <div className="relative pl-8 pb-4 border-l-2 border-gray-700">
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500"></div>
                  <div className="text-sm text-gray-400">Đã giao hàng</div>
                  <div className="text-xs text-gray-500">{formatDate(order.actualDeliveryDate)}</div>
                </div>
              )}

              {order.status?.toLowerCase() === 'completed' && (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500"></div>
                  <div className="text-sm text-emerald-400 font-semibold">Hoàn thành</div>
                </div>
              )}

              {order.status?.toLowerCase() === 'cancelled' && (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500"></div>
                  <div className="text-sm text-red-400 font-semibold">Đã hủy</div>
                  {order.cancelledDate && (
                    <div className="text-xs text-gray-500">{formatDate(order.cancelledDate)}</div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Actions Card */}
          <Card className="bg-gray-800 border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-white">
              ⚡ Hành động
            </h3>
            <div className="space-y-3">
              {order.status?.toLowerCase() === 'pending' && (
                <>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleUpdateStatus('confirmed')}
                    disabled={isUpdating}
                  >
                    ✓ Xác nhận đơn hàng
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={handleCancelOrder}
                    disabled={isUpdating}
                  >
                    ✗ Hủy đơn hàng
                  </Button>
                </>
              )}
              
              {order.status?.toLowerCase() === 'confirmed' && (
                <>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleUpdateStatus('processing')}
                    disabled={isUpdating}
                  >
                    ⚙️ Chuyển sang xử lý
                  </Button>
                  <Button
                    variant="warning"
                    className="w-full"
                    onClick={handleCancelOrder}
                    disabled={isUpdating}
                  >
                    ✗ Hủy đơn hàng
                  </Button>
                </>
              )}

              {order.status?.toLowerCase() === 'processing' && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleUpdateStatus('manufacturing')}
                  disabled={isUpdating}
                >
                  🏭 Chuyển sang sản xuất
                </Button>
              )}

              {order.status?.toLowerCase() === 'manufacturing' && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleUpdateStatus('shipping')}
                  disabled={isUpdating}
                >
                  🚚 Chuyển sang giao hàng
                </Button>
              )}

              {order.status?.toLowerCase() === 'shipping' && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleUpdateStatus('delivered')}
                  disabled={isUpdating}
                >
                  📦 Xác nhận đã giao hàng
                </Button>
              )}

              {order.status?.toLowerCase() === 'delivered' && (
                <Button
                  variant="success"
                  className="w-full"
                  onClick={() => handleUpdateStatus('completed')}
                  disabled={isUpdating}
                >
                  ✓ Hoàn thành đơn hàng
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/dealer/customers/${order.customerId}`)}
              >
                👤 Xem khách hàng
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/dealer/orders/${id}/edit`)}
                disabled={order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'cancelled'}
              >
                ✏️ Chỉnh sửa đơn hàng
              </Button>

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => window.print()}
              >
                🖨️ In đơn hàng
              </Button>
            </div>
          </Card>

          {/* Delivery Info */}
          {(order.status?.toLowerCase() === 'shipping' || order.status?.toLowerCase() === 'delivered') && (
            <Card className="bg-blue-900/20 border-blue-700">
              <h3 className="text-lg font-bold mb-3 text-blue-400 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Thông tin giao hàng
              </h3>
              <div className="space-y-2 text-sm">
                {order.shippingCompany && (
                  <div>
                    <span className="text-gray-400">Đơn vị vận chuyển:</span>
                    <div className="text-blue-300 font-semibold">{order.shippingCompany}</div>
                  </div>
                )}
                {order.trackingNumber && (
                  <div>
                    <span className="text-gray-400">Mã vận đơn:</span>
                    <div className="text-blue-300 font-mono">{order.trackingNumber}</div>
                  </div>
                )}
                {order.driverName && (
                  <div>
                    <span className="text-gray-400">Tài xế:</span>
                    <div className="text-blue-300">{order.driverName}</div>
                  </div>
                )}
                {order.driverPhone && (
                  <div>
                    <span className="text-gray-400">SĐT tài xế:</span>
                    <div className="text-blue-300">{order.driverPhone}</div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default OrderDetail;
