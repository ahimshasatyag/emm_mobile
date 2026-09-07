import { Csr, CsrPayload } from '../types/csr.types';
import api from '../../../services/api/api';

export const csrApi = {
    getAll: async (): Promise<Csr[]> => {
        const response = await api.get('/csr');
        return response.data.data;
    },

    getById: async (id: string): Promise<Csr | null> => {
        const response = await api.get(`/csr/${id}`);
        return response.data.data;
    },

    create: async (payload: any): Promise<any> => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(payload)) {
            if (value !== undefined && value !== null) {
                if ((key === 'link_foto' || key === 'image') && typeof value === 'string') {
                    if (value.startsWith('file://') || value.startsWith('content://')) {
                        const filename = value.split('/').pop() || 'image.jpg';
                        const match = /\.(\w+)$/.exec(filename.toLowerCase());
                        let type = match ? `image/${match[1]}` : `image/jpeg`;
                        if (type === 'image/jpg') type = 'image/jpeg';

                        formData.append('link_foto', {
                            uri: value,
                            name: filename,
                            type,
                        } as any);
                        continue;
                    } else if (value.startsWith('data:') || value.startsWith('blob:')) {
                        try {
                            const res = await fetch(value);
                            const blob = await res.blob();
                            formData.append('link_foto', blob, 'image.jpeg');
                        } catch (e) {
                            console.error('Failed to fetch blob for image:', e);
                        }
                        continue;
                    } else if (value.startsWith('http://') || value.startsWith('https://')) {
                        continue;
                    }
                }
                formData.append(key, value as string);
            }
        }

        const response = await api.post('/csr', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    update: async (id: string, payload: any): Promise<any> => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(payload)) {
            if (value !== undefined && value !== null) {
                if ((key === 'link_foto' || key === 'image') && typeof value === 'string') {
                    if (value.startsWith('file://') || value.startsWith('content://')) {
                        const filename = value.split('/').pop() || 'image.jpg';
                        const match = /\.(\w+)$/.exec(filename.toLowerCase());
                        let type = match ? `image/${match[1]}` : `image/jpeg`;
                        if (type === 'image/jpg') type = 'image/jpeg';

                        formData.append('link_foto', {
                            uri: value,
                            name: filename,
                            type,
                        } as any);
                        continue;
                    } else if (value.startsWith('data:') || value.startsWith('blob:')) {
                        try {
                            const res = await fetch(value);
                            const blob = await res.blob();
                            formData.append('link_foto', blob, 'image.jpeg');
                        } catch (e) {
                            console.error('Failed to fetch blob for image:', e);
                        }
                        continue;
                    } else if (value.startsWith('http://') || value.startsWith('https://')) {
                        continue;
                    }
                }
                formData.append(key, value as string);
            }
        }

        const response = await api.post(`/csr/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    confirm: async (id: string, payload?: any): Promise<any> => {
        const response = await api.post(`/csr/${id}/confirm`, payload);
        return response.data;
    },

    cancel: async (id: string, payload: any): Promise<any> => {
        const response = await api.post(`/csr/${id}/cancel`, payload);
        return response.data;
    },

    getFormOptions: async (): Promise<any> => {
        const response = await api.get('/csr/form-options');
        return response.data.data;
    },

    getBarcodeData: async (barcode: string): Promise<any> => {
        const response = await api.get(`/csr/barcode-data?barcode=${barcode}`);
        return response.data;
    },
};

export const getBarcodeData = csrApi.getBarcodeData;
