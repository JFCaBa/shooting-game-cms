import { useState } from 'react';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({ 
    data = [], 
    columns = [], 
    onEdit, 
    onDelete,
    pagination = null,
    onPageChange = () => {}
}) => {
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

    const renderPagination = () => {
        if (!pagination) return null;

        const { page, totalPages, total } = pagination;
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="mt-4 flex items-center justify-between px-4">
                <div className="text-sm text-gray-700">
                    Showing page {page} of {totalPages} ({total} total items)
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="px-3 py-1 rounded hover:bg-gray-100"
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="px-2">...</span>}
                        </>
                    )}

                    {pageNumbers.map(num => (
                        <button
                            key={num}
                            onClick={() => onPageChange(num)}
                            className={`px-3 py-1 rounded ${
                                page === num 
                                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            {num}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="px-2">...</span>}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="px-3 py-1 rounded hover:bg-gray-100"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div>
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
            {renderPagination()}
        </div>
    );
};

export default DataTable;