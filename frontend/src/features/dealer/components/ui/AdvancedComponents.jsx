import React from 'react';

/**
 * InfoRow - Component hiển thị thông tin dạng key-value
 */
export const InfoRow = ({ label, value, icon }) => {
  return (
    <div className="group flex justify-between items-center py-4 border-b last:border-0 border-gray-200/50 dark:border-gray-700/50 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-transparent dark:hover:from-emerald-500/5 dark:hover:to-transparent transition-all duration-300 rounded-lg px-2">
      <span className="flex items-center gap-3 text-gray-600 dark:text-gray-400 font-medium">
        {icon && <span className="text-xl group-hover:scale-110 transition-transform duration-300">{icon}</span>}
        {label}
      </span>
      <span className="font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-emerald-400 transition-colors duration-300">{value}</span>
    </div>
  );
};

/**
 * InfoSection - Card wrapper cho nhóm InfoRow
 */
export const InfoSection = ({ title, icon, children }) => {
  return (
    <div className="group relative overflow-hidden bg-white/80 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700/50 shadow-xl dark:shadow-emerald-500/5 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] hover:border-cyan-300 dark:hover:border-emerald-500/50">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 dark:from-emerald-500/5 dark:to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
          {icon && <span className="text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">{icon}</span>}
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">{title}</span>
        </h3>
        <div className="space-y-0">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * GridCard - Card cho grid layout
 */
export const GridCard = ({ children, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden
        bg-white/80 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-gray-900/90
        backdrop-blur-xl rounded-3xl p-8 
        border border-gray-200 dark:border-gray-700/50
        shadow-lg dark:shadow-emerald-500/5
        hover:shadow-2xl hover:scale-105 hover:-translate-y-2
        hover:border-cyan-400 dark:hover:border-emerald-500
        transition-all duration-500 cursor-pointer
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-emerald-500/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/**
 * DetailHeader - Header cho detail pages
 */
export const DetailHeader = ({ title, subtitle, onBack, badge, actions }) => {
  return (
    <div className="mb-10">
      {onBack && (
        <button
          onClick={onBack}
          className="group flex items-center gap-2 mb-6 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-emerald-400 hover:bg-cyan-50 dark:hover:bg-emerald-500/10 transition-all duration-300"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="font-semibold">Quay lại</span>
        </button>
      )}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">{subtitle}</p>
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
 * ListSection - Section wrapper cho danh sách
 */
export const ListSection = ({ title, icon, items = [], itemIcon = '✓' }) => {
  return (
    <div className="group relative overflow-hidden bg-white/80 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700/50 shadow-xl dark:shadow-emerald-500/5 transition-all duration-500 hover:shadow-2xl hover:border-cyan-300 dark:hover:border-emerald-500/50">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 dark:from-emerald-500/5 dark:to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          {icon && <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</span>}
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">{title}</span>
        </h3>
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={index} className="group/item flex items-start gap-4 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-emerald-400 transition-colors duration-300">
              <span className="flex-shrink-0 text-cyan-600 dark:text-emerald-400 text-xl group-hover/item:scale-125 transition-transform duration-300">{itemIcon}</span>
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/**
 * ActionBar - Bar chứa action buttons
 */
export const ActionBar = ({ children, align = 'left' }) => {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[align];

  return (
    <div className="bg-white/80 dark:bg-gradient-to-r dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700/50 shadow-xl dark:shadow-emerald-500/5 transition-all duration-300">
      <div className={`flex gap-4 ${alignClass}`}>
        {children}
      </div>
    </div>
  );
};

/**
 * StatusTimeline - Timeline cho các status/events
 */
export const StatusTimeline = ({ events = [] }) => {
  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-emerald-500 shadow-emerald-500/50',
      warning: 'bg-yellow-500 shadow-yellow-500/50',
      info: 'bg-blue-500 shadow-blue-500/50',
      danger: 'bg-red-500 shadow-red-500/50',
      default: 'bg-gray-500 shadow-gray-500/50'
    };
    return colors[status] || colors.default;
  };

  return (
    <div className="bg-white/80 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700/50 shadow-xl dark:shadow-emerald-500/5 transition-all duration-300">
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={index} className="group flex gap-6">
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full shadow-lg ${getStatusColor(event.status)} group-hover:scale-125 transition-transform duration-300`} />
              {index < events.length - 1 && (
                <div className="w-0.5 h-full mt-2 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
              )}
            </div>
            <div className="flex-1 pb-8">
              <div className="text-sm font-semibold text-cyan-600 dark:text-emerald-400 mb-2">{event.date}</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-emerald-400 transition-colors duration-300">{event.title}</div>
              {event.description && (
                <div className="text-gray-600 dark:text-gray-400">{event.description}</div>
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
 */
export const MetricCard = ({ icon, title, value, trend, change, color = 'emerald' }) => {
  const colorClasses = {
    emerald: 'border-emerald-300/50 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-600/5 shadow-emerald-500/20',
    blue: 'border-blue-300/50 dark:border-blue-500/30 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-500/10 dark:to-blue-600/5 shadow-blue-500/20',
    yellow: 'border-yellow-300/50 dark:border-yellow-500/30 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-500/10 dark:to-yellow-600/5 shadow-yellow-500/20',
    red: 'border-red-300/50 dark:border-red-500/30 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-500/10 dark:to-red-600/5 shadow-red-500/20',
    gray: 'border-gray-300/50 dark:border-gray-500/30 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-500/10 dark:to-gray-600/5 shadow-gray-500/20'
  };

  const trendIcons = {
    up: '📈',
    down: '📉',
    neutral: '➡️'
  };

  const trendColors = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <div className={`group relative overflow-hidden backdrop-blur-xl rounded-3xl p-8 shadow-xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl ${colorClasses[color]} flex flex-col justify-between h-full`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <span className="text-5xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">{icon}</span>
          </div>
          <div className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">{title}</div>
          {change && (
            <div className={`text-sm font-semibold ${trendColors[trend] || 'text-gray-600 dark:text-gray-400'} flex items-center gap-1`}>
              {trend && <span>{trendIcons[trend]}</span>} 
              {change}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 pl-6">
          <div className="text-5xl font-black text-gray-900 dark:text-white text-right group-hover:scale-110 transition-transform duration-500">{value}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * TabPanel - Tab navigation component
 */
export const TabPanel = ({ tabs = [], activeTab, onTabChange }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-3 border border-gray-200 dark:border-gray-700/50 mb-8 shadow-xl dark:shadow-emerald-500/5 transition-all duration-300">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-8 py-4 rounded-2xl font-bold transition-all duration-300 whitespace-nowrap
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-emerald-500 dark:to-emerald-600 text-white shadow-lg scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }
            `}
          >
            {tab.icon && <span className="mr-2 text-lg">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * QuickStats - Grid of quick stat cards
 */
export const QuickStats = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group bg-white/80 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-lg dark:shadow-emerald-500/5 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-cyan-400 dark:hover:border-emerald-500"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
          <div className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">{stat.label}</div>
          <div className={`text-3xl font-black ${stat.color || 'text-gray-900 dark:text-white'}`}>
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