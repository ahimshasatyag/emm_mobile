import api from '../../../services/api/api';
import { Survey, SurveySupportData } from '../types/survey.types';

export const surveyApi = {
    fetchSurveys: async (): Promise<Survey[]> => {
        const response = await api.get('/survey?per_page=500');
        if (response.data && response.data.data) {
            const items = response.data.data.data || response.data.data;
            if (Array.isArray(items)) {
                return items;
            }
        }
        return [];
    },

    getSupportData: async (id_so?: string): Promise<SurveySupportData> => {
        const url = id_so ? `/survey/support-data?id_so=${id_so}` : '/survey/support-data';
        const response = await api.get(url);
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error('Failed to fetch support data');
    },

    getSurveyById: async (id: string): Promise<any> => {
        const response = await api.get(`/survey/${id}`);
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error('Survey not found');
    },

    createSurvey: async (data: any): Promise<any> => {
        const response = await api.post('/survey', data);
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error(response.data?.message || 'Failed to create Survey');
    },

    updateSurvey: async (id: string, data: any): Promise<any> => {
        const response = await api.post(`/survey/${id}`, data);
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error(response.data?.message || 'Failed to update Survey');
    },

    cancelSurvey: async (id: string): Promise<any> => {
        const response = await api.post(`/survey/${id}/cancel`);
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error('Failed to cancel Survey');
    },

    confirmSurvey: async (id: string): Promise<any> => {
        const response = await api.post(`/survey/${id}/confirm`);
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error('Failed to confirm Survey');
    },

    updateAfs: async (id: string, data: any): Promise<any> => {
        const response = await api.post(`/survey/${id}/update-afs`, data);
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error('Failed to update AFS');
    },

    updateGudang: async (id: string, data: any): Promise<any> => {
        const response = await api.post(`/survey/${id}/update-gudang`, data);
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error('Failed to update Gudang');
    },

    updateProgress: async (id: string, data: any): Promise<any> => {
        const response = await api.post(`/survey/${id}/update-progress`, data);
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error('Failed to update Progress');
    },

    approveAfs: async (id: string, data: any): Promise<any> => {
        const response = await api.post(`/survey/${id}/approve-afs`, data);
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error('Failed to approve AFS');
    },

    approveGudang: async (id: string): Promise<any> => {
        const response = await api.post(`/survey/${id}/approve-gudang`);
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error('Failed to approve Gudang');
    },

    selesaiSurvey: async (id: string): Promise<any> => {
        const response = await api.post(`/survey/${id}/selesai`);
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error('Failed to finish Survey');
    }
};
