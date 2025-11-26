import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  size = 'md',
  className = '' 
}) => {
  // Logic: Khóa cuộn trang (scroll) khi Modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Định nghĩa kích thước Modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  return (
    // Overlay (Click ra ngoài để đóng)
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Modal Content (Ngăn sự kiện click đóng khi click vào nội dung) */}
      <div 
        className={`
          relative overflow-hidden
          bg-white/95 dark:bg-gradient-to-br dark:from-gray-800/95 dark:to-gray-900/95
          backdrop-blur-xl rounded-3xl 
          border border-gray-200 dark:border-gray-700/50
          shadow-2xl dark:shadow-cyan-500/10
          w-full ${sizeClasses[size] || sizeClasses.md} 
          flex flex-col max-h-[90vh] 
          transform transition-all scale-100 animate-in zoom-in-95 duration-300
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-600/5 pointer-events-none" />
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="group text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 p-2 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body (Có scroll nếu nội dung dài) */}
        <div className="relative z-10 p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Footer (Optional) */}
        {footer && (
          <div className="relative z-10 px-8 py-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-b-3xl flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  className: PropTypes.string,
};

export default Modal;