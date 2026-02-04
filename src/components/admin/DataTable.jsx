// DataTable - Reusable table with search and pagination
import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import './DataTable.css';

export default function DataTable({
    columns,
    data,
    loading = false,
    searchable = true,
    searchPlaceholder = 'Search...',
    pageSize = 10,
    actions,
    emptyMessage = 'No data found'
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data by search
    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(row =>
            columns.some(col => {
                const value = row[col.key];
                return value && String(value).toLowerCase().includes(query);
            })
        );
    }, [data, searchQuery, columns]);

    // Paginate
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage, pageSize]);

    // Reset to page 1 when search changes
    const handleSearch = (value) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="data-table-loading">
                <Loader2 className="spinner" size={32} />
                <span>Loading data...</span>
            </div>
        );
    }

    return (
        <div className="data-table-wrapper">
            {/* Search Bar */}
            {searchable && (
                <div className="data-table-toolbar">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    {actions && <div className="toolbar-actions">{actions}</div>}
                </div>
            )}

            {/* Table */}
            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} style={{ width: col.width }}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="empty-row">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, idx) => (
                                <tr key={row.id || idx}>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="data-table-pagination">
                    <span className="pagination-info">
                        Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
                    </span>
                    <div className="pagination-controls">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span>{currentPage} / {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
