import { ListPaymentFilter, ListPaymentResponse } from '../types/listpayment.types';
import { DUMMY_LIST_PAYMENT_ITEMS, DUMMY_LIST_PAYMENT_SUMMARY } from '../data/listpayment.data';

export const getListPayment = async (filters: ListPaymentFilter): Promise<ListPaymentResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        status: true,
        data: DUMMY_LIST_PAYMENT_ITEMS,
        data_lap: DUMMY_LIST_PAYMENT_SUMMARY
    };
};
