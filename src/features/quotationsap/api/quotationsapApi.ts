import { QuotationAP } from '../types/quotationsap.types';
import { DUMMY_QUOTATIONS_AP } from '../data/quotationsap.data';

class QuotationsAPApi {
    async getQuotations(): Promise<QuotationAP[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([...DUMMY_QUOTATIONS_AP]), 1000);
        });
    }

    async getQuotationById(id: string): Promise<QuotationAP> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const quotation = DUMMY_QUOTATIONS_AP.find(q => q.id_po === id);
                if (quotation) {
                    resolve({ ...quotation });
                } else {
                    reject(new Error('Quotation AP not found'));
                }
            }, 800);
        });
    }

    async saveQuotation(data: QuotationAP): Promise<QuotationAP> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(data), 1500);
        });
    }
}

export const quotationsapApi = new QuotationsAPApi();
