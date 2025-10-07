import React from 'react';

const NavigationPills = ({ 
  activeSection, 
  onSectionChange, 
  sections = [] 
}) => {
  const defaultSections = [
    { id: 'overview', label: 'Tổng quan', icon: '🏠' },
    { id: 'vehicles', label: 'Xe của tôi', icon: '🚗' },
    { id: 'services', label: 'Dịch vụ', icon: '🔧' },
    { id: 'financing', label: 'Quản lý trả góp', icon: '💳' }
  ];

  const navigationSections = sections.length > 0 ? sections : defaultSections;

  return (
    <div className="flex gap-3 mb-8 p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-x-auto scrollbar-hide">
      {navigationSections.map((section) => (
        <button
          key={section.id}
          className={`
            flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm cursor-pointer
            transition-all duration-200 ease-in-out whitespace-nowrap min-w-fit relative overflow-hidden
            ${activeSection === section.id 
              ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30 -translate-y-0.5' 
              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:-translate-y-px'
            }
          `}
          onClick={() => onSectionChange(section.id)}
          aria-selected={activeSection === section.id}
          role="tab"
        >
          {activeSection === section.id && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
          )}
          <span className={`flex items-center justify-center w-5 h-5 ${
            activeSection === section.id ? 'animate-bounce' : ''
          }`}>
            <span className="text-lg">{section.icon}</span>
          </span>
          <span className="font-semibold hidden sm:inline">
            {section.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default NavigationPills;