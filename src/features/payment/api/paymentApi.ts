import { Payment, PaymentFormData } from '../types/payment';
import { mockPayments } from '../data/mockData';

// Simulated API calls for the payment feature

export const fetchPayments = async (): Promise<Payment[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockPayments]);
        }, 800);
    });
};

export const fetchPaymentById = async (id: string): Promise<Payment | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockPayments.find(p => p.id_payment_schdl === id));
        }, 500);
    });
};

export const createPayment = async (data: PaymentFormData): Promise<Payment> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newPayment: Payment = {
                id_payment_schdl: Date.now().toString(),
                date_update: new Date().toISOString().slice(0, 19).replace('T', ' '),
                vcurrency: 'IDR',
                nm_customers: 'Mock Customer', // In real app, fetch from customer master
                code_payment_schdl: `PAY-${Date.now()}`,
                date_payment: data.date_payment,
                v_amount: data.v_amount,
                status_payment: 'DRAFT',
                code_so: 'SO-MOCK',
                ...data
            };
            resolve(newPayment);
        }, 1000);
    });
};

export const updatePayment = async (id: string, data: PaymentFormData): Promise<Payment> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const existing = mockPayments.find(p => p.id_payment_schdl === id);
            if (existing) {
                resolve({ ...existing, ...data, date_update: new Date().toISOString() });
            } else {
                reject(new Error("Payment not found"));
            }
        }, 1000);
    });
};
