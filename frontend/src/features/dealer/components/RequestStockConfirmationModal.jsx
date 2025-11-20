import React, { useState, useEffect } from 'react';

// Import các UI component

import Button from '@/features/dealer/components/ui/Button'; 
import Card  from '@/features/dealer/components/ui/Card'; 
import { FormGroup, Label, Input } from '@/features/dealer/components/ui/FormComponents'; 
import { InfoRow } from '@/features/dealer/components/ui/AdvancedComponents';
/**
 * Modal xác nhận yêu cầu nhập kho
 * @param {boolean} open - Trạng thái hiển thị modal
 * @param {function} onClose - Hàm gọi khi đóng modal
 * @param {function} onConfirm - Hàm gọi khi xác nhận (trả về password)
 * @param {boolean} isLoading - Trạng thái loading
 * @param {object} selectedVehicle - Thông tin xe được chọn
 * @param {number|string} quantity - Số lượng yêu cầu
 */
const RequestStockConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  selectedVehicle,
  quantity,
}) => {
  const [password, setPassword] = useState('');

  // Reset password khi modal bị đóng từ bên ngoài
  useEffect(() => {
    if (!open) {
      setPassword('');
    }
  }, [open]);

  // Xử lý xác nhận
  const handleConfirm = (e) => {
    e.preventDefault();
    if (!password) {
      alert('Vui lòng nhập mật khẩu để xác nhận.');
      return;
    }
    // Gửi mật khẩu lên cho component cha xử lý
    onConfirm(password);
  };

  // Xử lý đóng
  const handleClose = () => {
    setPassword(''); // Xóa password khi hủy
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-2xl">
          <form onSubmit={handleConfirm}>
            <h3 className="text-2xl font-bold mb-4 theme-text-primary">Xác nhận yêu cầu</h3>
            <p className="theme-text-secondary mb-6">
              Vui lòng xem lại thông tin và nhập mật khẩu của bạn để hoàn tất.
            </p>

            {/* -- Tóm tắt thông tin -- */}
            <div className="mb-6">
              <InfoRow
                label="Xe yêu cầu"
                value={selectedVehicle?.name || 'N/A'}
                icon="🚗"
              />
              <InfoRow
                label="Màu sắc"
                value={selectedVehicle?.color || 'N/A'}
                icon="🎨"
              />
              <InfoRow
                label="Số lượng"
                value={quantity}
                icon="🔢"
              />
            </div>

            {/* -- Nhập mật khẩu -- */}
            <FormGroup>
              <Label htmlFor="password" required>Mật khẩu xác nhận</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                autoFocus // Tự động focus vào ô password
              />
            </FormGroup>

            {/* -- Nút hành động -- */}
            <div className="flex justify-end gap-3 mt-8">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xác nhận...' : 'Xác nhận & Gửi'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RequestStockConfirmationModal;