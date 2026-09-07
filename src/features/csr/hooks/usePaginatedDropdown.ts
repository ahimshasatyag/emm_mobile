import { useState, useMemo, useCallback } from 'react';

export function usePaginatedDropdown(data: any[], selectedValue: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 20;

    const filteredData = useMemo(() => {
        if (!searchQuery) return data || [];
        return (data || []).filter((item) => 
            item.label?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    const paginatedData = useMemo(() => {
        const sliced = filteredData.slice(0, page * PAGE_SIZE);
        if (selectedValue && !searchQuery) {
            const hasSelected = sliced.some(item => String(item.value) === String(selectedValue));
            if (!hasSelected) {
                const selectedItem = (data || []).find(item => String(item.value) === String(selectedValue));
                if (selectedItem) {
                    // Ensure the selected item is at the top or included so the dropdown can display its label
                    return [selectedItem, ...sliced];
                }
            }
        }
        return sliced;
    }, [filteredData, page, selectedValue, searchQuery, data]);

    const loadMore = useCallback(() => {
        if (paginatedData.length < filteredData.length) {
            setPage((prev) => prev + 1);
        }
    }, [paginatedData.length, filteredData.length]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setPage(1);
    }, []);

    return {
        searchQuery,
        setSearchQuery: handleSearch,
        paginatedData,
        loadMore,
        loading: false,
    };
}
