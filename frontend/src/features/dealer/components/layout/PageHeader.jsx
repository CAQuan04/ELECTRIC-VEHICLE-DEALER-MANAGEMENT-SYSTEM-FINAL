import React from 'react'; // Đảm bảo đã import React
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

/**
 * PageHeader Component - Redesigned (Absolute Layout - Full Width)
 * Layout:
 * - Container: position: relative
 * - Hàng 1: Breadcrumbs (Top)
 * - Hàng 2: Content (Icon + Title/Desc) - Dùng Flexbox
 * - Hàng 3: Actions (position: absolute, bottom-right)
 */
const PageHeader = ({
  title,
  subtitle,
  description,
  icon,
  showBackButton = false,
  onBack,
  breadcrumbs = [],
  actions,
  badge,
  className = '',
  variant = 'default',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Variant styles
  const variantStyles = {
    default: 'bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800',
    gradient: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800',
    minimal: 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800',
    darkTheme: 'bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700',
  };

  return (
    <div className={`${variantStyles[variant] || variantStyles['default']} ${className} rounded-3xl shadow-2xl overflow-hidden`}>
      {/* Container BÊN TRONG */}
      {/* Tăng min-h lên 300px để có không gian cho icon lớn */}
      <div className={`px-8 py-6 relative min-h-[300px] pb-20`}>

        {/* HÀNG 1: Breadcrumbs (Giữ nguyên) */}
        <div className="flex items-center mb-6 min-h-[32px]">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-400/30 hover:bg-purple-400/50 text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Quay lại</span>
            </button>
          )}

          {breadcrumbs.length > 0 && (
            <nav className={`flex ${showBackButton ? 'ml-4' : ''}`} aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-2">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="inline-flex items-center">
                    {index > 0 && (
                      <ChevronRight className="w-4 h-4 mx-1 text-white/50" />
                    )}
                    {crumb.path ? (
                      <button
                        onClick={() => navigate(crumb.path)}
                        className="text-sm font-medium text-white/90 hover:text-white transition-colors hover:underline"
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span className="text-sm font-semibold text-white">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>

        {/* HÀNG 2: Content (Dùng FLEX, không dùng GRID) */}
        {/* ✨ THAY ĐỔI: 'items-start' -> 'items-center' để căn giữa logo */}
        <div className="flex flex-col md:flex-row items-center gap-8">

          {/* CỘT TRÁI: Icon */}
          <div className="flex-shrink-0">
            {icon && (
              // Box chứa (w-36 h-36)
              <div className="w-36 h-36 rounded-3xl bg-slate-700/50 backdrop-blur-sm flex items-center justify-center shadow-xl border border-slate-600">
                {typeof icon === 'string' ? (
                  <span className="text-8xl">{icon}</span>
                ) : (
                  // Div bọc (w-24 h-24)
                  <div className="text-cyan-400 w-24 h-24">
                    {/* Icon thật (dùng cloneElement để ép kích thước) */}
                    {React.cloneElement(icon, {
                      className: 'w-full h-full'
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CỘT GIỮA: Title, Subtitle, Badge, Description */}
          {/* Xóa 'md:pt-4' vì 'items-center' đã tự động căn chỉnh */}
          <div className="flex flex-col justify-center min-w-0 py-2">
            {/* Title + Badge */}
            <div className="flex items-center space-x-3 mb-3">
              {/* Title đã là text-white */}
              <h1 className="text-3xl lg:text-4xl font-serif text-cyan-50 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                {title}
              </h1>

              {badge && (
                <span className={`flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${badge.variant === 'success' ? 'bg-green-400/30 text-green-100 border border-green-300/50' :
                    badge.variant === 'warning' ? 'bg-yellow-400/30 text-yellow-100 border border-yellow-300/50' :
                      badge.variant === 'error' ? 'bg-red-400/30 text-red-100 border border-red-300/50' :
                        badge.variant === 'info' ? 'bg-blue-400/30 text-cyan-100 border border-blue-300/50' :
                          'bg-white/20 text-white border border-white/30'
                  }`}>
                  {badge.icon && <span className="mr-1.5">{badge.icon}</span>}
                  {badge.text}
                </span>
              )}
            </div>

            {/* Subtitle */}
            {subtitle && (
              /* ✨ THAY ĐỔI: 'text-lg' -> 'text-xl' và thêm 'pl-1.5' */
              <p className="text-xl font-medium text-white/80 mb-2 pl-1.5">
                {subtitle}
              </p>
            )}

            {/* Description */}
            {description && (
              /* ✨ THAY ĐỔI: 'text-base' -> 'text-lg' và thêm 'pl-1.5' */
              <p className="text-lg text-white/70 leading-relaxed max-w-3xl pl-1.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* HÀNG 3: Action Buttons (CỐ ĐỊNH) */}
        {actions && (
          <div className="absolute bottom-6 right-8 flex items-center justify-end space-x-3">
            {actions}
          </div>
        )}

      </div>
    </div>
  );
};

// PropTypes
PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  showBackButton: PropTypes.bool,
  onBack: PropTypes.func,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    })
  ),
  actions: PropTypes.node,
  badge: PropTypes.shape({
    text: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'default']),
    icon: PropTypes.node,
  }),
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'gradient', 'minimal', 'darkTheme']),
};

export default PageHeader;
