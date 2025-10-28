import React from 'react';
import EmptyState from './EmptyState'; // Sử dụng EmptyState component

/**
 * Table - Responsive table component
 * @param {array} columns - Array of column definitions: [{ key, label, render, className, tdClassName }]
 * @param {array} data - Array of data objects
 * @param {function} onRowClick - Click handler for rows (optional)
 */
const Table = ({ columns, data, onRowClick, className = '' }) => {
  return (
    
    <div className={`shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        {/* Màu nền và viền cho Dark Mode */}
        {/* SỬA: Đổi dark:divide-gray-500 -> dark:divide-gray-700 */}
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          
          {/* THEAD - Background tối, chữ sáng */}
          {/* SỬA: Dùng màu nền nhất quán hơn */}
          <thead className="bg-cyan-100 dark:bg-gray-700/50"> 
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  // Tăng kích thước chữ từ text-xs lên text-sm
                  className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* TBODY - Background tối, chữ sáng */}
          {/* SỬA: Đổi dark:bg-gray-900 -> dark:bg-gray-800 và dark:divide-gray-700 */}
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.length > 0 && data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex}
                // Hiệu ứng hover cho cả Light/Dark Mode
                // SỬA: Đổi dark:hover:bg-gray-700 -> dark:hover:bg-gray-700/50
                className={`transition duration-200 ${onRowClick ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700/50' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    
                    // Màu chữ: Dark mode đổi thành trắng/xám sáng
                    // SỬA: Đổi text-gray-900 dark:text-gray-100 -> text-gray-800 dark:text-gray-200
                    className={`px-6 py-4 whitespace-nowrap text-base text-gray-800 dark:text-gray-200 ${column.tdClassName || ''}`}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Empty State */}
      {/* SỬA: Dùng component EmptyState thay vì code inline */}
      {data.length === 0 && (
        <div className="bg-white dark:bg-gray-800">
          <EmptyState
            title="Không có dữ liệu"
            message="Chưa có dữ liệu để hiển thị"
            icon="📭"
          />
        </div>
      )}
    </div>
  );
};

export default Table;