import React, { useEffect } from 'react';
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  // Khóa cuộn trang khi Modal mở
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);
  
  if (!isOpen) return null;

  const sizeClasses = { 
    sm: 'max-w-md', 
    md: 'max-w-lg', 
    lg: 'max-w-2xl' 
  };
  
  return (
    // 1. Overlay nền tối
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200" 
      onClick={onClose}
    >
      {/* 2. Container Modal (CỐ ĐỊNH NỀN TỐI) */}
      <div 
        className={`
          w-full ${sizeClasses[size]} 
          bg-[#0f172a] /* Nền màu xanh đen đậm cố định (Slate 900) */
          text-white   /* Chữ luôn màu trắng */
          rounded-2xl shadow-2xl 
          border border-gray-700 /* Viền màu xám tối */
          flex flex-col max-h-[90vh] overflow-hidden 
        `} 
        onClick={e => e.stopPropagation()}
      >
        
        {/* 3. Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4. Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* 5. Footer */}
        {footer && (
          <div className="px-6 py-4 bg-[#1e293b]/50 border-t border-gray-700 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;