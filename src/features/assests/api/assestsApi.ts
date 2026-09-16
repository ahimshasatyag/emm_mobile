import { AssetItem, AssetCategory, AssetType, AssetListResponse, AssetSupportDataResponse, AssetDetailResponse, AssetSavePayload } from '../types/assests.types';
import api from '../../../services/api/api';

export const fetchAssets = async (page: number = 1, search: string = ''): Promise<AssetItem[]> => {
    try {
        const response = await api.get<AssetListResponse>(`/assets`, {
            params: { per_page: 50, search }
        });
        if (response.data && response.data.status) {
            // Depending on Laravel's pagination, data could be in response.data.data.data or response.data.data
            const resData = response.data.data;
            if (Array.isArray(resData)) {
                return resData;
            } else if (resData && Array.isArray(resData.data)) {
                return resData.data;
            }
        }
        return [];
    } catch (error) {
        console.error('Error fetching assets:', error);
        throw error;
    }
};

export const fetchAssetSupportData = async (): Promise<{ categories: AssetCategory[], types: AssetType[] }> => {
    try {
        const response = await api.get<AssetSupportDataResponse>('/assets/support-data');
        if (response.data && response.data.status) {
            return {
                categories: response.data.data_assets_category || [],
                types: response.data.data_assets_type || []
            };
        }
        return { categories: [], types: [] };
    } catch (error) {
        console.error('Error fetching asset support data:', error);
        throw error;
    }
};

export const fetchAssetDetail = async (id: string): Promise<AssetItem> => {
    try {
        const response = await api.get<AssetDetailResponse>(`/assets/${id}`);
        if (response.data && response.data.status) {
            return {
                ...response.data.data,
                serial_numbers: response.data.data_sn || []
            };
        }
        throw new Error('Data not found');
    } catch (error) {
        console.error('Error fetching asset detail:', error);
        throw error;
    }
};

export const saveAsset = async (id: string | null | undefined, payload: AssetSavePayload): Promise<any> => {
    try {
        if (id) {
            const response = await api.put(`/assets/${id}`, payload);
            return response.data;
        } else {
            const response = await api.post(`/assets`, payload);
            return response.data;
        }
    } catch (error) {
        console.error('Error saving asset:', error);
        throw error;
    }
};
