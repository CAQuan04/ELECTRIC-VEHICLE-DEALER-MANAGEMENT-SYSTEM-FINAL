import React from 'react';

/**
 * Table - Responsive table component
 * @param {array} columns - Array of column definitions: [{ key, label, render }]
 * @param {array} data - Array of data objects
 * @param {function} onRowClick - Click handler for rows (optional)
 */
const Table = ({ columns, data, onRowClick, className = '' }) => {
  return (
    <div className={`dark:bg-white/5 bg-white backdrop-blur-sm rounded-2xl dark:border-white/10 border-gray-200 border overflow-hidden shadow-lg transition-all duration-300 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="dark:bg-white/10 bg-gradient-to-r from-cyan-50 to-blue-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`px-6 py-4 text-left text-sm font-bold dark:text-gray-200 text-gray-800 ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="dark:divide-white/10 divide-gray-200 divide-y">
            {data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex}
                className={`dark:hover:bg-emerald-500/10 hover:bg-cyan-50 dark:hover:shadow-emerald-500/10 hover:shadow-cyan-500/10 transition-all duration-200 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-6 py-4 dark:text-gray-100 text-gray-900 ${column.tdClassName || ''}`}>
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
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900">Không có dữ liệu</h3>
          <p className="dark:text-gray-400 text-gray-600">Chưa có dữ liệu để hiển thị</p>
        </div>
      )}
    </div>
  );
};

export default Table;
