import React from 'react';

/**
 * InfoRow - Component hiển thị thông tin dạng key-value
 * @param {string} label - Nhãn (key)
 * @param {string|ReactNode} value - Giá trị (value)
 * @param {string} icon - Icon emoji (optional)
 */
export const InfoRow = ({ label, value, icon }) => {
  return (
    <div className="flex justify-between items-center py-3 border-b last:border-0 theme-border">
      <span className="theme-text-muted flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {label}
      </span>
      <span className="theme-text-primary font-semibold">{value}</span>
    </div>
  );
};

/**
 * InfoSection - Card wrapper cho nhóm InfoRow
 * @param {string} title - Tiêu đề section
 * @param {string} icon - Icon emoji
 * @param {ReactNode} children - InfoRow components
 */
export const InfoSection = ({ title, icon, children }) => {
  return (
    <div className="group theme-card rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.01]">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 theme-text-primary">
        {icon && <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>}
        {title}
      </h3>
      <div className="space-y-0">
        {children}
      </div>
    </div>
  );
};

/**
 * GridCard - Card cho grid layout (dùng cho PromotionList, VehicleList...)
 * @param {ReactNode} children - Nội dung card
 * @param {function} onClick - Xử lý click
 * @param {string} className - Custom classes
 */
export const GridCard = ({ children, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`
        group theme-card rounded-2xl p-6 border
        hover:scale-105 
        transition-all duration-300 cursor-pointer
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/**
 * DetailHeader - Header cho detail pages với back button
 * @param {string} title - Tiêu đề
 * @param {string} subtitle - Phụ đề (optional)
 * @param {function} onBack - Xử lý back
 * @param {ReactNode} badge - Badge component (optional)
 * @param {ReactNode} actions - Action buttons (optional)
 */
export const DetailHeader = ({ title, subtitle, onBack, badge, actions }) => {
  return (
    <div className="mb-8">
      {onBack && (
        <button
          onClick={onBack}
          className="theme-text-muted hover:text-primary mb-4 flex items-center gap-2 transition-colors"
        >
          ← Quay lại
        </button>
      )}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold theme-text-primary">{title}</h1>
            {badge}
          </div>
          {subtitle && (
            <p className="theme-text-muted text-lg">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ListSection - Section wrapper cho danh sách (bullet list)
 * @param {string} title - Tiêu đề
 * @param {string} icon - Icon emoji
 * @param {array} items - Mảng các items (strings)
 * @param {string} itemIcon - Icon cho mỗi item (default: ✓)
 */
export const ListSection = ({ title, icon, items = [], itemIcon = '✓' }) => {
  return (
    <div className="theme-card rounded-2xl p-6 border transition-colors duration-300">
      <h3 className="text-xl font-bold theme-text-primary mb-4 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 theme-text-secondary">
            <span style={{ color: 'var(--accent-primary)' }} className="flex-shrink-0">{itemIcon}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * ActionBar - Bar chứa action buttons (thường ở cuối trang)
 * @param {ReactNode} children - Button components
 * @param {string} align - Alignment: left, center, right (default: left)
 */
export const ActionBar = ({ children, align = 'left' }) => {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[align];

  return (
    <div className="theme-card rounded-2xl p-6 border transition-colors duration-300">
      <div className={`flex gap-4 ${alignClass}`}>
        {children}
      </div>
    </div>
  );
};

/**
 * StatusTimeline - Timeline cho các status/events
 * @param {array} events - Mảng events {date, title, description, status}
 */
export const StatusTimeline = ({ events = [] }) => {
  const getStatusColor = (status) => {
    const colors = {
      success: 'dark:bg-emerald-500 bg-emerald-600',
      warning: 'dark:bg-yellow-500 bg-yellow-600',
      info: 'dark:bg-blue-500 bg-blue-600',
      danger: 'dark:bg-red-500 bg-red-600',
      default: 'dark:bg-gray-500 bg-gray-600'
    };
    return colors[status] || colors.default;
  };

  return (
    <div className="theme-card rounded-2xl p-6 border transition-colors duration-300">
      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`} />
              {index < events.length - 1 && (
                <div className="w-px h-full mt-2" style={{ backgroundColor: 'var(--border-default)' }} />
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="theme-text-muted text-sm mb-1">{event.date}</div>
              <div className="theme-text-primary font-semibold mb-1">{event.title}</div>
              {event.description && (
                <div className="theme-text-muted text-sm">{event.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * MetricCard - Card hiển thị metric với icon và trend
 * @param {string} icon - Icon emoji
 * @param {string} title - Nhãn
 * @param {string|number} value - Giá trị
 * @param {string} trend - up/down/neutral
 * @param {string} change - Mô tả thay đổi
 * @param {string} color - Color theme: emerald, blue, yellow, red
 */
export const MetricCard = ({ icon, title, value, trend, change, color = 'emerald' }) => {
  const colorClasses = {
    emerald: 'dark:border-emerald-500/30 dark:bg-emerald-500/5 border-emerald-300 bg-emerald-50',
    blue: 'dark:border-blue-500/30 dark:bg-blue-500/5 border-blue-300 bg-blue-50',
    yellow: 'dark:border-yellow-500/30 dark:bg-yellow-500/5 border-yellow-300 bg-yellow-50',
    red: 'dark:border-red-500/30 dark:bg-red-500/5 border-red-300 bg-red-50',
    gray: 'dark:border-gray-500/30 dark:bg-gray-500/5 border-gray-300 bg-gray-50'
  };

  const trendIcons = {
    up: '📈',
    down: '📉',
    neutral: '➡️'
  };

  const trendColors = {
    up: 'dark:text-emerald-400 text-emerald-600',
    down: 'dark:text-red-400 text-red-600',
    neutral: 'dark:text-gray-400 text-gray-600'
  };

  return (
    // Lớp "flex flex-col" đảm bảo các phần tử bên trong xếp chồng lên nhau
    <div className={`backdrop-blur-xl rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${colorClasses[color]} flex flex-col justify-between h-full`}>
      
      {/* START: Bố cục mới với Flexbox */}
      {/* Container chính chia 2 cột: Trái (Icon/Text) và Phải (Value) */}
      <div className="flex justify-between items-start">
        
        {/* CỘT BÊN TRÁI: Icon và Text */}
        <div className="flex flex-col">
          {/* Icon và Trend Icon */}
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl">{icon}</span>
            {/* Bỏ trend icon ở đây nếu muốn nó ở cạnh 'change', hoặc giữ lại nếu muốn ở góc trên */}
            {/* {trend && <span className="text-xl ml-2">{trendIcons[trend]}</span>} */}
          </div>
          {/* Title */}
          <div className="theme-text-muted text-sm mb-1">{title}</div>
          {/* Change (Nếu có) */}
          {change && (
            <div className={`text-sm ${trendColors[trend] || 'theme-text-muted'}`}>
              {/* Thêm trend icon vào đây để đi cùng text */}
              {trend && <span className="mr-1">{trendIcons[trend]}</span>} 
              {change}
            </div>
          )}
        </div>

        {/* CỘT BÊN PHẢI: Value */}
        <div className="flex-shrink-0 pl-4">
          <div className="theme-text-primary text-4xl font-bold text-right">{value}</div>
        </div>

      </div>
    </div>
  );
};





/**
 * TabPanel - Tab navigation component
 * @param {array} tabs - Mảng {id, label, icon}
 * @param {string} activeTab - Active tab id
 * @param {function} onTabChange - Callback khi đổi tab
 */
export const TabPanel = ({ tabs = [], activeTab, onTabChange }) => {
  return (
    <div className="theme-card rounded-2xl p-2 border mb-6 transition-colors duration-300">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap
              ${activeTab === tab.id
                ? 'dark:bg-gradient-to-r dark:from-emerald-600 dark:to-emerald-700 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'theme-text-muted hover:opacity-70 dark:hover:bg-gray-700/50 hover:bg-gray-100'
              }
            `}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * QuickStats - Grid of quick stat cards
 * @param {array} stats - Mảng {icon, label, value, color}
 */
export const QuickStats = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="theme-card rounded-xl p-4 border transition-colors duration-300"
        >
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="theme-text-muted text-xs mb-1">{stat.label}</div>
          <div className={`text-xl font-bold ${stat.color || 'theme-text-primary'}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  InfoRow,
  InfoSection,
  GridCard,
  DetailHeader,
  ListSection,
  ActionBar,
  StatusTimeline,
  MetricCard,
  TabPanel,
  QuickStats
};
