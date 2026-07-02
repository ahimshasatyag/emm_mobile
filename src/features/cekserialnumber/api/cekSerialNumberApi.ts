import { CekSerialNumberResponse } from '../types/cekserialnumber.types';
import { dummyCekSerialNumberData, dummyHistoryServices } from '../data/dummyCekSerialNumber';

class CekSerialNumberApi {
    async searchSerialNumber(barcode: string): Promise<CekSerialNumberResponse> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // In a real app, this would be an axios/fetch call to: 
        // /cform/detail_serial with payload { barcode }
        
        if (!barcode || barcode.trim() === '') {
            return {
                status: false,
                data: [],
                history: []
            };
        }

        // Return dummy data on any non-empty search
        return {
            status: true,
            data: [dummyCekSerialNumberData],
            history: dummyHistoryServices
        };
    }
}

export const cekSerialNumberApi = new CekSerialNumberApi();
