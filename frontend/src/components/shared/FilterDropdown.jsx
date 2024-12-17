import { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';

const FilterDropdown = ({ column, onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(value);
    setIsOpen(false);
  };

  const renderFilterInput = () => {
    switch (column.filterType) {
      case 'number':
        return (
          <div className="space-y-2">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-2 py-1 border rounded"
              placeholder="Filter value..."
            />
          </div>
        );
      case 'date':
        return (
          <div className="space-y-2">
            <input
              type="date"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-2 py-1 border rounded"
            />
          </div>
        );
      case 'select':
        return (
          <div className="space-y-2">
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-2 py-1 border rounded"
            >
              <option value="">All</option>
              {column.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-2 py-1 border rounded"
              placeholder="Filter value..."
            />
          </div>
        );
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <Filter size={16} className={value ? 'text-blue-500' : 'text-gray-500'} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <form onSubmit={handleSubmit} className="p-2 space-y-2">
            {renderFilterInput()}
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => {
                  setValue('');
                  onFilter('');
                  setIsOpen(false);
                }}
                className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;