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
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => sortData(column.key)}
                className={`px-4 py-2 text-left cursor-pointer ${column.className || ''}`}
              >
                {column.label}
              </th>
            ))}
            <th className="px-4 py-2 text-left w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {getSortedData().map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              {columns.map((column) => {
                const value = column.key.split('.').reduce((obj, key) => obj?.[key], item);
                return (
                  <td key={column.key} className={`px-4 py-2 ${column.className || ''}`}>
                    {column.format ? column.format(value) : value}
                  </td>
                );
              })}
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Trash2 size={18} />
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