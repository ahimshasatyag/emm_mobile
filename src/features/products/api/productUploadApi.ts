import { api } from '../../../services/api/api';
import { ProductUploadItem } from '../types/productUpload';

export const productUploadApi = {
    // 1. Upload file and get preview data
    uploadPreview: async (fileUri: string, fileName: string, fileType: string) => {
        const formData = new FormData();
        
        // Append file using the required format for React Native FormData
        formData.append('file', {
            uri: fileUri,
            name: fileName,
            type: fileType,
        } as any);

        // Adjust the endpoint based on your actual Laravel/Backend route
        const response = await api.post('/product/cform/upload_view', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Backend format: { status: true, data: [...] }
        return response.data;
    },

    // 2. Save the validated data
    saveUploadData: async (data: ProductUploadItem[]) => {
        const formData = new FormData();
        
        // Replicating the PHP hidden inputs posting
        data.forEach(item => {
            formData.append('code_product[]', item.code_product || '');
            formData.append('nm_product[]', item.nm_product || '');
            formData.append('id_product_kategori[]', item.id_product_kategori || '');
            formData.append('id_product_sub_kategori[]', item.id_product_sub_kategori || '');
            formData.append('id_product_brand[]', item.id_product_brand || '');
            formData.append('product_deskripsi[]', item.product_deskripsi || '');
            formData.append('error_message[]', item.error_message || '');
            formData.append('f_no_error[]', item.f_ada ? '1' : '0');
        });

        // Adjust the endpoint based on your actual Laravel/Backend route
        const response = await api.post('/product/cform/simpan_multi', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }
};
