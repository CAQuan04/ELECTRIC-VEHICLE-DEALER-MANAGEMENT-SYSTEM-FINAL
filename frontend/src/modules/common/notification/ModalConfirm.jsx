import React, { useState } from 'react';
import Modal from 'react-modal';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

// Set app element cho accessibility
if (typeof document !== 'undefined') {
  Modal.setAppElement('#root');
}

const ModalConfirm = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Xác nhận', cancelText = 'Hủy', type = 'warning' }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => {
    if (isProcessing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      handleClose();
    } catch (error) {
      console.error('Error in confirm action:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-20 h-20 text-rose-500 drop-shadow-xl animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-20 h-20 text-emerald-500 drop-shadow-xl animate-pulse" />;
      case 'warning':
      default:
        return <AlertTriangle className="w-20 h-20 text-amber-500 drop-shadow-xl animate-pulse" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-lg shadow-rose-500/50';
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/50';
      case 'warning':
      default:
        return 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-lg shadow-amber-500/50';
    }
  };

  const getHeaderBackground = () => {
    switch (type) {
      case 'danger':
        return 'bg-gradient-to-br from-rose-50 to-red-100 dark:from-rose-950 dark:to-red-900';
      case 'success':
        return 'bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900';
      case 'warning':
      default:
        return 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900';
    }
  };

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      position: 'relative',
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto',
      border: 'none',
      background: 'transparent',
      overflow: 'visible',
      padding: 0,
      inset: 'auto',
      maxWidth: '500px',
      width: '90%',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles}
      className={`confirm-modal ${isClosing ? 'closing' : ''}`}
      closeTimeoutMS={300}
    >
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden
          transform transition-all duration-300
          ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        `}
      >
        {/* Header with gradient background and icon */}
        <div className={`${getHeaderBackground()} px-8 py-8 flex items-center justify-center gap-4 border-b border-gray-200 dark:border-gray-700`}>
          {getIcon()}
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            {title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-center mb-6">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`flex-1 px-6 py-3 ${getButtonColor()} text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95`}
            >
              {isProcessing && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
