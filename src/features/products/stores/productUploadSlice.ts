import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductUploadItem, ProductUploadState } from '../types/productUpload';

const initialState: ProductUploadState = {
    previewData: [],
    isLoading: false,
    isSaving: false,
    error: null,
    successMessage: null,
};

const productUploadSlice = createSlice({
    name: 'productUpload',
    initialState,
    reducers: {
        setUploadLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
            if (action.payload) {
                state.error = null;
                state.successMessage = null;
            }
        },
        setSavingLoading: (state, action: PayloadAction<boolean>) => {
            state.isSaving = action.payload;
            if (action.payload) {
                state.error = null;
                state.successMessage = null;
            }
        },
        setPreviewData: (state, action: PayloadAction<ProductUploadItem[]>) => {
            state.previewData = action.payload;
            state.isLoading = false;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
            state.isSaving = false;
        },
        setSuccess: (state, action: PayloadAction<string>) => {
            state.successMessage = action.payload;
            state.isSaving = false;
        },
        clearPreview: (state) => {
            state.previewData = [];
            state.error = null;
            state.successMessage = null;
        }
    }
});

export const { 
    setUploadLoading, 
    setSavingLoading, 
    setPreviewData, 
    setError, 
    setSuccess, 
    clearPreview 
} = productUploadSlice.actions;

export default productUploadSlice.reducer;
