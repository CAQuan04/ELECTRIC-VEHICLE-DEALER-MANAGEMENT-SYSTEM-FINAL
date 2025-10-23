import React from 'react';

/**
 * Table - Responsive table component
 * @param {array} columns - Array of column definitions: [{ key, label, render }]
 * @param {array} data - Array of data objects
 * @param {function} onRowClick - Click handler for rows (optional)
 */
const Table = ({ columns, data, onRowClick, className = '' }) => {
  return (
    <div className={`theme-card rounded-2xl border overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ background: 'var(--bg-table-header)' }}>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`px-6 py-4 text-left text-sm font-bold theme-text-primary ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ borderColor: 'var(--border-default)' }} className="divide-y">
            {data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex}
                className={`transition-all duration-200 ${onRowClick ? 'cursor-pointer' : ''}`}
                style={{ 
                  '--hover-bg': 'var(--hover-bg)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-6 py-4 theme-text-primary ${column.tdClassName || ''}`}>
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
          <h3 className="text-xl font-semibold mb-2 theme-text-primary">Không có dữ liệu</h3>
          <p className="theme-text-muted">Chưa có dữ liệu để hiển thị</p>
        </div>
      )}
    </div>
  );
};

export default Table;
