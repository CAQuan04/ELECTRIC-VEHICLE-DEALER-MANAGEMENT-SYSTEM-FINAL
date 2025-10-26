import React from 'react';

/**
 * Table - Responsive table component
 * @param {array} columns - Array of column definitions: [{ key, label, render, className, tdClassName }]
 * @param {array} data - Array of data objects
 * @param {function} onRowClick - Click handler for rows (optional)
 */
const Table = ({ columns, data, onRowClick, className = '' }) => {
  return (
    // Wrapper: Giữ bo góc lớn và thêm shadow
    <div className={`shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        {/* Màu nền và viền cho Dark Mode */}
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-500">
          
          {/* THEAD - Background tối, chữ sáng */}
          <thead className="bg-gray-100 dark:bg-gray-700">
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
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex}
                // Hiệu ứng hover cho cả Light/Dark Mode
                className={`transition duration-200 ${onRowClick ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    
                    // Màu chữ: Dark mode đổi thành trắng/xám sáng
                    className={`px-6 py-4 whitespace-nowrap text-base text-gray-900 dark:text-gray-100 ${column.tdClassName || ''}`}
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
      {data.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-gray-900">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Không có dữ liệu</h3>
          <p className="text-gray-500 dark:text-gray-400">Chưa có dữ liệu để hiển thị</p>
        </div>
      )}
    </div>
  );
};

export default Table;