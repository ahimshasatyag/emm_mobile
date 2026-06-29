import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApprovalItemData } from '../types/approvalitems.types';

interface ApprovalItemsState {
    data: ApprovalItemData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ApprovalItemsState = {
    data: [],
    isLoading: false,
    error: null,
};

const approvalitemsSlice = createSlice({
    name: 'approvalitems',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData: (state, action: PayloadAction<ApprovalItemData[]>) => {
            state.data = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const { setLoading, setData, setError } = approvalitemsSlice.actions;
export default approvalitemsSlice.reducer;
