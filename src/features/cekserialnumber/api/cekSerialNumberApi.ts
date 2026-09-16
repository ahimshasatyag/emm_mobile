import { CekSerialNumberResponse } from '../types/cekserialnumber.types';
import api from '../../../services/api/api';

class CekSerialNumberApi {
    async searchSerialNumber(barcode: string): Promise<CekSerialNumberResponse> {
        if (!barcode || barcode.trim() === '') {
            return {
                status: false,
                data: [],
                history: []
            };
        }

        try {
            const response = await api.post('/cekserialnumber/detail', { barcode });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat menghubungi server');
        }
    }
}

export const cekSerialNumberApi = new CekSerialNumberApi();
