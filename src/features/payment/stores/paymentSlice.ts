import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Payment } from '../types/payment';
import * as api from '../api/paymentApi';

interface PaymentState {
    payments: Payment[];
    isLoading: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    payments: [],
    isLoading: false,
    error: null,
};

export const fetchPayments = createAsyncThunk('payment/fetchPayments', async () => {
    return await api.fetchPayments();
});

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setPayments(state, action: PayloadAction<Payment[]>) {
            state.payments = action.payload;
        },
        addPayment(state, action: PayloadAction<Payment>) {
            state.payments.unshift(action.payload);
        },
        updatePaymentInState(state, action: PayloadAction<Payment>) {
            const index = state.payments.findIndex(p => p.id_payment_schdl === action.payload.id_payment_schdl);
            if (index !== -1) {
                state.payments[index] = action.payload;
            }
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPayments.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchPayments.fulfilled, (state, action) => {
            state.isLoading = false;
            state.payments = action.payload;
        });
        builder.addCase(fetchPayments.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Failed to fetch payments';
        });
    }
});

export const { setPayments, addPayment, updatePaymentInState, setLoading, setError } = paymentSlice.actions;
export default paymentSlice.reducer;
