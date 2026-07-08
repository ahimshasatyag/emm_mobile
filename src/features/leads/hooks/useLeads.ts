import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchLeadsList, fetchLeadsDetail, clearDetail } from '../stores/leadsSlice';
import { useCallback, useState, useMemo } from 'react';

export const useLeads = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const { items, currentDetail, isLoadingList, isLoadingDetail, error } = useSelector(
        (state: RootState) => state.leads
    );

    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const lowerQuery = searchQuery.toLowerCase();
        return items.filter(item => 
            item.nm_customers?.toLowerCase()?.includes(lowerQuery) || 
            item.code_leads?.toLowerCase()?.includes(lowerQuery) ||
            item.status?.toLowerCase()?.includes(lowerQuery)
        );
    }, [items, searchQuery]);

    const loadList = useCallback(() => {
        dispatch(fetchLeadsList());
    }, [dispatch]);

    const loadDetail = useCallback((id: string) => {
        dispatch(fetchLeadsDetail(id));
    }, [dispatch]);

    const resetDetail = useCallback(() => {
        dispatch(clearDetail());
    }, [dispatch]);

    return {
        items: filteredItems,
        currentDetail,
        isLoadingList,
        isLoadingDetail,
        error,
        searchQuery,
        setSearchQuery,
        loadList,
        loadDetail,
        resetDetail
    };
};
