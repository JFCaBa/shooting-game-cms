import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const DataTable = ({ data = [], columns = [], onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
      const bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => sortData(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {sortConfig.key === column.key && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {getSortedData().map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => {
                const value = column.key.split('.').reduce((obj, key) => obj?.[key], item);
                return (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.format ? column.format(value) : value}
                  </td>
                );
              })}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;