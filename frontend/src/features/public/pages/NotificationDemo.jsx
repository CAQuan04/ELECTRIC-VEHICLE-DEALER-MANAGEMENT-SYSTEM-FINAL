import React from 'react';
import { notifications } from '@utils/notifications';

const NotificationDemo = () => {
  const handleSuccessNotification = () => {
    notifications.success(
      'Thành công!',
      'Thao tác của bạn đã được thực hiện thành công',
      5000
    );
  };

  const handleErrorNotification = () => {
    notifications.error(
      'Lỗi!',
      'Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.',
      5000
    );
  };

  const handleWarningNotification = () => {
    notifications.warning(
      'Cảnh báo!',
      'Vui lòng kiểm tra lại thông tin trước khi tiếp tục',
      5000
    );
  };

  const handleInfoNotification = () => {
    notifications.info(
      'Thông tin',
      'Đây là một thông báo thông tin quan trọng',
      5000
    );
  };

  const handleConfirm = async () => {
    const result = await notifications.confirm(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.',
      async () => {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        notifications.success('Đã xóa', 'Mục đã được xóa thành công');
      },
      {
        confirmText: 'Xóa',
        cancelText: 'Hủy',
        type: 'danger'
      }
    );
    console.log('Confirm result:', result);
  };

  const handleConfirmSuccess = async () => {
    await notifications.confirm(
      'Xác nhận thực hiện',
      'Bạn có muốn thực hiện thao tác này không?',
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        notifications.success('Hoàn tất', 'Thao tác đã được thực hiện');
      },
      {
        confirmText: 'Đồng ý',
        cancelText: 'Không',
        type: 'success'
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          🔔 React Modal Notification Demo
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
            Notification Types
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleSuccessNotification}
              className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ✅ Success Notification
            </button>

            <button
              onClick={handleErrorNotification}
              className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ❌ Error Notification
            </button>

            <button
              onClick={handleWarningNotification}
              className="px-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ⚠️ Warning Notification
            </button>

            <button
              onClick={handleInfoNotification}
              className="px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ℹ️ Info Notification
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
            Confirm Dialogs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleConfirm}
              className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🗑️ Danger Confirm (Delete)
            </button>

            <button
              onClick={handleConfirmSuccess}
              className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ✔️ Success Confirm (Action)
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            💡 Usage Instructions
          </h3>
          <ul className="text-blue-700 dark:text-blue-300 space-y-2 text-sm">
            <li>• <strong>Notifications:</strong> Hiển thị tự động ở góc trên màn hình, tự động đóng sau 5 giây</li>
            <li>• <strong>Confirm:</strong> Modal xác nhận ở giữa màn hình, chờ người dùng lựa chọn</li>
            <li>• <strong>Auto-close:</strong> Có progress bar hiển thị thời gian còn lại</li>
            <li>• <strong>Animations:</strong> Smooth slide-in/out animations với backdrop blur</li>
            <li>• <strong>Async Support:</strong> Confirm dialogs hỗ trợ async operations với loading state</li>
          </ul>
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-2">🎨 Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>✓ React Modal based</div>
            <div>✓ Beautiful gradients</div>
            <div>✓ Smooth animations</div>
            <div>✓ Progress bar</div>
            <div>✓ Async support</div>
            <div>✓ Multiple queues</div>
            <div>✓ Accessible (ARIA)</div>
            <div>✓ Dark mode ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;
