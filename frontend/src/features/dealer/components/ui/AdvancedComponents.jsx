import React from 'react';

/**
 * InfoRow - Component hiển thị thông tin dạng key-value
 * @param {string} label - Nhãn (key)
 * @param {string|ReactNode} value - Giá trị (value)
 * @param {string} icon - Icon emoji (optional)
 */
export const InfoRow = ({ label, value, icon }) => {
  return (
    <div className="flex justify-between items-center py-3 dark:border-white/10 border-gray-200 border-b last:border-0">
      <span className="dark:text-gray-400 text-gray-600 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {label}
      </span>
      <span className="dark:text-white text-gray-900 font-semibold">{value}</span>
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
    <div className="group dark:bg-white/5 bg-white backdrop-blur-xl rounded-2xl p-6 shadow-lg dark:border-white/10 border-gray-200 border dark:hover:border-emerald-500/30 hover:border-cyan-500/30 transition-all duration-300">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
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
        group dark:bg-white/5 bg-white backdrop-blur-xl rounded-2xl p-6 shadow-lg
        dark:border-white/10 border-gray-200 border
        dark:hover:bg-white/10 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/20 dark:hover:shadow-2xl
        hover:bg-cyan-50/50 hover:border-cyan-500 hover:shadow-cyan-500/20 hover:shadow-2xl hover:scale-105 
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
          className="dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900 mb-4 flex items-center gap-2 transition-colors"
        >
          ← Quay lại
        </button>
      )}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold dark:text-white text-gray-900">{title}</h1>
            {badge}
          </div>
          {subtitle && (
            <p className="dark:text-gray-400 text-gray-600 text-lg">{subtitle}</p>
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
    <div className="dark:bg-white/5 bg-white backdrop-blur-xl rounded-2xl p-6 shadow-lg dark:border-white/10 border-gray-200 border transition-colors duration-300">
      <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 dark:text-gray-300 text-gray-700">
            <span className="text-emerald-400 flex-shrink-0">{itemIcon}</span>
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
    <div className="dark:bg-white/5 bg-white backdrop-blur-xl rounded-2xl p-6 shadow-lg dark:border-white/10 border-gray-200 border transition-colors duration-300">
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
      success: 'bg-emerald-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500',
      danger: 'bg-red-500',
      default: 'bg-gray-500'
    };
    return colors[status] || colors.default;
  };

  return (
    <div className="dark:bg-white/5 bg-white backdrop-blur-xl rounded-2xl p-6 shadow-lg dark:border-white/10 border-gray-200 border transition-colors duration-300">
      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`} />
              {index < events.length - 1 && (
                <div className="w-px h-full dark:bg-white/10 bg-gray-300 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="dark:text-gray-400 text-gray-600 text-sm mb-1">{event.date}</div>
              <div className="dark:text-white text-gray-900 font-semibold mb-1">{event.title}</div>
              {event.description && (
                <div className="dark:text-gray-400 text-gray-600 text-sm">{event.description}</div>
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
 * @param {string} label - Nhãn
 * @param {string|number} value - Giá trị
 * @param {string} trend - up/down/neutral
 * @param {string} change - Mô tả thay đổi
 * @param {string} color - Color theme: emerald, blue, yellow, red
 */
export const MetricCard = ({ icon, label, value, trend, change, color = 'emerald' }) => {
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
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  };

  return (
    <div className={`backdrop-blur-xl rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{icon}</span>
        {trend && <span className="text-xl">{trendIcons[trend]}</span>}
      </div>
      <div className="dark:text-gray-400 text-gray-600 text-sm mb-1">{label}</div>
      <div className="dark:text-white text-gray-900 text-3xl font-bold mb-2">{value}</div>
      {change && (
        <div className={`text-sm ${trendColors[trend] || 'text-gray-400'}`}>
          {change}
        </div>
      )}
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
    <div className="dark:bg-white/5 bg-white backdrop-blur-xl rounded-2xl p-2 shadow-lg dark:border-white/10 border-gray-200 border mb-6 transition-colors duration-300">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap
              ${activeTab === tab.id
                ? 'bg-emerald-500 text-white'
                : 'dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900 dark:hover:bg-white/5 hover:bg-gray-100'
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
          className="dark:bg-white/5 bg-white backdrop-blur-xl rounded-xl p-4 dark:border-white/10 border-gray-200 border transition-colors duration-300"
        >
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="dark:text-gray-400 text-gray-600 text-xs mb-1">{stat.label}</div>
          <div className={`text-xl font-bold ${stat.color || 'dark:text-white text-gray-900'}`}>
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
