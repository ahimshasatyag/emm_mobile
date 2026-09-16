import { AssetItem, InventorySchedule, UserItem, ScheduleListResponse, ScheduleSupportDataResponse, ScheduleDetailResponse, ScheduleSavePayload } from '../types/inventoryschedule.types';
import api from '../../../services/api/api';

export const fetchSchedules = async (page: number = 1, search: string = ''): Promise<InventorySchedule[]> => {
    try {
        const response = await api.get<ScheduleListResponse>('/inventoryschedule', {
            params: { per_page: 50, search }
        });
        if (response.data && response.data.status) {
            const resData = response.data.data;
            if (Array.isArray(resData)) {
                return resData;
            } else if (resData && Array.isArray(resData.data)) {
                return resData.data;
            }
        }
        return [];
    } catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
    }
};

export const fetchScheduleSupportData = async (): Promise<{ assets: AssetItem[], users: UserItem[] }> => {
    try {
        const response = await api.get<ScheduleSupportDataResponse>('/inventoryschedule/support-data');
        if (response.data && response.data.status) {
            return {
                assets: response.data.data_asset || [],
                users: response.data.data_user || []
            };
        }
        return { assets: [], users: [] };
    } catch (error) {
        console.error('Error fetching schedule support data:', error);
        throw error;
    }
};

export const fetchScheduleDetail = async (id: string): Promise<{ schedule: InventorySchedule, pic: any[] }> => {
    try {
        const response = await api.get<ScheduleDetailResponse>(`/inventoryschedule/${id}`);
        if (response.data && response.data.status) {
            return {
                schedule: response.data.data,
                pic: response.data.data_pic || []
            };
        }
        throw new Error('Data not found');
    } catch (error) {
        console.error('Error fetching schedule detail:', error);
        throw error;
    }
};

export const saveSchedule = async (id: string | null | undefined, payload: ScheduleSavePayload): Promise<any> => {
    try {
        if (id) {
            const response = await api.put(`/inventoryschedule/${id}`, payload);
            return response.data;
        } else {
            const response = await api.post(`/inventoryschedule`, payload);
            return response.data;
        }
    } catch (error) {
        console.error('Error saving schedule:', error);
        throw error;
    }
};

