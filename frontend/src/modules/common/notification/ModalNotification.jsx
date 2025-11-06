import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// Set app element cho accessibility
if (typeof document !== 'undefined') {
  Modal.setAppElement('#root');
}

const ModalNotification = ({ isOpen, onClose, type = 'info', title, message, duration = 2000, autoClose = true }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen && autoClose && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-14 h-14 text-emerald-500 drop-shadow-lg animate-bounce-once" />;
      case 'error':
        return <XCircle className="w-14 h-14 text-rose-500 drop-shadow-lg animate-shake" />;
      case 'warning':
        return <AlertTriangle className="w-14 h-14 text-amber-500 drop-shadow-lg animate-pulse" />;
      case 'info':
      default:
        return <Info className="w-14 h-14 text-cyan-500 drop-shadow-lg animate-pulse" />;
    }
  };

  const getBackgroundStyle = () => {
    switch (type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          boxShadow: '0 20px 60px -10px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(16, 185, 129, 0.1)',
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(225, 29, 72, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(244, 63, 94, 0.3)',
          boxShadow: '0 20px 60px -10px rgba(244, 63, 94, 0.3), 0 0 0 1px rgba(244, 63, 94, 0.1)',
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          boxShadow: '0 20px 60px -10px rgba(245, 158, 11, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.1)',
        };
      case 'info':
      default:
        return {
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(8, 145, 178, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(6, 182, 212, 0.3)',
          boxShadow: '0 20px 60px -10px rgba(6, 182, 212, 0.3), 0 0 0 1px rgba(6, 182, 212, 0.1)',
        };
    }
  };

  const getProgressBarColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-green-400';
      case 'error':
        return 'bg-gradient-to-r from-rose-500 to-red-400';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-yellow-400';
      case 'info':
      default:
        return 'bg-gradient-to-r from-cyan-500 to-blue-400';
    }
  };

  const customStyles = {
    overlay: {
      backgroundColor: 'transparent', // Không làm tối nền
      backdropFilter: 'none', // Không làm mờ
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-end', // Căn bên phải
      paddingTop: '100px',
      paddingRight: '20px', // Khoảng cách từ mép phải
      animation: 'fadeIn 0.3s ease-in-out',
      pointerEvents: 'none', // Cho phép click qua overlay
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
      maxWidth: '420px',
      width: '90%',
      pointerEvents: 'auto', // Chỉ notification box mới nhận click
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles}
      className={`notification-modal ${isClosing ? 'closing' : ''}`}
      closeTimeoutMS={300}
    >
      <div
        className={`
          bg-white dark:bg-gray-800
          rounded-2xl
          p-6
          transform transition-all duration-300
          ${isClosing ? 'scale-95 opacity-0 -translate-y-4' : 'scale-100 opacity-100 translate-y-0'}
          border
        `}
        style={{
          ...getBackgroundStyle(),
          animation: isClosing ? 'slideOut 0.3s ease-out' : 'slideIn 0.3s ease-out',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-200 hover:rotate-90 hover:scale-110"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex items-start space-x-4 pr-6">
          {/* Icon */}
          <div className="flex-shrink-0">
            {getIcon()}
          </div>

          {/* Text Content */}
          <div className="flex-1 pt-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            {message && (
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar (nếu autoClose) */}
        {autoClose && duration > 0 && (
          <div className="mt-5 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressBarColor()} shadow-lg`}
              style={{
                animation: `progressBar ${duration}ms linear`,
                transformOrigin: 'left',
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes progressBar {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-bounce-once {
          animation: bounce-once 0.6s ease-in-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </Modal>
  );
};

export default ModalNotification;
