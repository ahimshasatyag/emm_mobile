import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductPriceReq, ProductPriceReqProduct, ProductPriceReqPayload } from '../types/productpricereq.types';
import { productPriceReqApi } from '../api/api';

interface ProductPriceReqState {
    requests: ProductPriceReq[];
    products: ProductPriceReqProduct[];
    selectedRequest: ProductPriceReq | null;
    isLoading: boolean;
    isDetailLoading: boolean;
    isActionLoading: boolean;
    error: string | null;
}

const initialState: ProductPriceReqState = {
    requests: [],
    products: [],
    selectedRequest: null,
    isLoading: false,
    isDetailLoading: false,
    isActionLoading: false,
    error: null,
};

export const fetchRequests = createAsyncThunk(
    'productPriceReq/fetchRequests',
    async (_, { rejectWithValue }) => {
        try {
            return await productPriceReqApi.getRequests();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchProducts = createAsyncThunk(
    'productPriceReq/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            return await productPriceReqApi.getProducts();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchRequestById = createAsyncThunk(
    'productPriceReq/fetchRequestById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await productPriceReqApi.getRequestById(id);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createRequest = createAsyncThunk(
    'productPriceReq/createRequest',
    async (payload: ProductPriceReqPayload, { rejectWithValue }) => {
        try {
            return await productPriceReqApi.createRequest(payload);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateRequest = createAsyncThunk(
    'productPriceReq/updateRequest',
    async ({ id, payload }: { id: string, payload: ProductPriceReqPayload }, { rejectWithValue }) => {
        try {
            return await productPriceReqApi.updateRequest(id, payload);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const changeStatus = createAsyncThunk(
    'productPriceReq/changeStatus',
    async ({ id, status }: { id: string, status: string }, { rejectWithValue }) => {
        try {
            return await productPriceReqApi.changeStatus(id, status);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const productPriceReqSlice = createSlice({
    name: 'productPriceReq',
    initialState,
    reducers: {
        clearSelectedRequest: (state) => {
            state.selectedRequest = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Requests
        builder.addCase(fetchRequests.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchRequests.fulfilled, (state, action: PayloadAction<ProductPriceReq[]>) => {
            state.isLoading = false;
            state.requests = action.payload;
        });
        builder.addCase(fetchRequests.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Fetch Products
        builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductPriceReqProduct[]>) => {
            state.products = action.payload;
        });

        // Fetch Request By ID
        builder.addCase(fetchRequestById.pending, (state) => {
            state.isDetailLoading = true;
            state.error = null;
        });
        builder.addCase(fetchRequestById.fulfilled, (state, action: PayloadAction<ProductPriceReq | null>) => {
            state.isDetailLoading = false;
            state.selectedRequest = action.payload;
        });
        builder.addCase(fetchRequestById.rejected, (state, action) => {
            state.isDetailLoading = false;
            state.error = action.payload as string;
        });

        // Create Request
        builder.addCase(createRequest.pending, (state) => {
            state.isActionLoading = true;
            state.error = null;
        });
        builder.addCase(createRequest.fulfilled, (state, action: PayloadAction<ProductPriceReq>) => {
            state.isActionLoading = false;
            state.requests.unshift(action.payload);
        });
        builder.addCase(createRequest.rejected, (state, action) => {
            state.isActionLoading = false;
            state.error = action.payload as string;
        });

        // Update Request
        builder.addCase(updateRequest.pending, (state) => {
            state.isActionLoading = true;
            state.error = null;
        });
        builder.addCase(updateRequest.fulfilled, (state, action: PayloadAction<ProductPriceReq>) => {
            state.isActionLoading = false;
            const index = state.requests.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.requests[index] = action.payload;
            }
            if (state.selectedRequest?.id === action.payload.id) {
                state.selectedRequest = action.payload;
            }
        });
        builder.addCase(updateRequest.rejected, (state, action) => {
            state.isActionLoading = false;
            state.error = action.payload as string;
        });

        // Change Status
        builder.addCase(changeStatus.pending, (state) => {
            state.isActionLoading = true;
            state.error = null;
        });
        builder.addCase(changeStatus.fulfilled, (state, action: PayloadAction<ProductPriceReq>) => {
            state.isActionLoading = false;
            const index = state.requests.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.requests[index] = action.payload;
            }
            if (state.selectedRequest?.id === action.payload.id) {
                state.selectedRequest = action.payload;
            }
        });
        builder.addCase(changeStatus.rejected, (state, action) => {
            state.isActionLoading = false;
            state.error = action.payload as string;
        });
    }
});

export const { clearSelectedRequest, clearError } = productPriceReqSlice.actions;
export default productPriceReqSlice.reducer;
