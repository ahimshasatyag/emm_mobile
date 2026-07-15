import { CustomerInvoice } from '../types/customerinvoice';
import { mockCustomerInvoices } from '../data/mockData';

export const customerinvoiceApi = {
    getList: async (): Promise<CustomerInvoice[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockCustomerInvoices), 800);
        });
    },

    getDetail: async (id: string): Promise<CustomerInvoice | undefined> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const invoice = mockCustomerInvoices.find(inv => inv.id_invoice === id);
                if (invoice) {
                    resolve(invoice);
                } else {
                    reject(new Error("Invoice not found"));
                }
            }, 800);
        });
    }
};
