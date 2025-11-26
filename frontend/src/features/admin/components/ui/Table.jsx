import React from 'react';
import EmptyState from './EmptyState';

/**
 * Table - Modern responsive table component with enhanced dark mode
 * @param {array} columns - Array of column definitions: [{ key, label, render, className, tdClassName }]
 * @param {array} data - Array of data objects
 * @param {function} onRowClick - Click handler for rows (optional)
 */
const Table = ({ columns, data, onRowClick, className = '' }) => {
  return (
    <div className={`
      relative overflow-hidden
      bg-white/80 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-gray-900/90
      backdrop-blur-xl rounded-3xl 
      border border-gray-200 dark:border-gray-700/50
      shadow-xl dark:shadow-emerald-500/5
      ${className}
    `}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* Table Header */}
          <thead className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-gray-600/80 dark:to-gray-700/80 backdrop-blur-sm">
            <tr className="border-b-2 border-gray-200 dark:border-gray-600">
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`
                    px-8 py-5 text-left 
                    text-sm font-black uppercase tracking-wider
                    text-gray-800 dark:text-gray-200
                    ${column.className || ''}
                  `}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
            {data.length > 0 && data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex}
                className={`
                  group transition-all duration-300
                  ${onRowClick ? 'cursor-pointer hover:bg-cyan-50 dark:hover:bg-emerald-500/10 hover:scale-[1.01]' : ''}
                  hover:shadow-lg
                `}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className={`
                      px-8 py-5 whitespace-nowrap 
                      text-base font-medium
                      text-gray-800 dark:text-gray-200
                      group-hover:text-cyan-700 dark:group-hover:text-emerald-300
                      transition-colors duration-300
                      ${column.tdClassName || ''}
                    `}
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
        <div className="p-8">
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