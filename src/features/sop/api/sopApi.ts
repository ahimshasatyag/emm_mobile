import api from '../../../services/api/api';
import { DivisionSopSummary, SopItem, SopHistory } from '../types/sop.types';

const LEGACY_DIVISI_MAP: Record<string, string> = {
    '1': 'MKT',
    '2': 'HRD',
    '3': 'ITD',
    '5': 'FAC',
    '6': 'SLS',
    '8': 'MAN',
};

const SOP_DIVISIONS = [
    { id_karyawan_divisi: 'ITD', nm_karyawan_divisi: 'IT' },
    { id_karyawan_divisi: 'AFS', nm_karyawan_divisi: 'AFS' },
    { id_karyawan_divisi: 'GKU', nm_karyawan_divisi: 'GKU' },
    { id_karyawan_divisi: 'SLS', nm_karyawan_divisi: 'Sales' },
    { id_karyawan_divisi: 'SAM', nm_karyawan_divisi: 'Sales Admin' },
    { id_karyawan_divisi: 'DCR', nm_karyawan_divisi: 'DCR' },
    { id_karyawan_divisi: 'MAN', nm_karyawan_divisi: 'MAN' },
    { id_karyawan_divisi: 'FAC', nm_karyawan_divisi: 'FAC' },
    { id_karyawan_divisi: 'SPR', nm_karyawan_divisi: 'SPR' }
];

export const getLegacyDivisiCode = (divisiId: string): string => {
    // If it's already one of the string codes, just return it
    if (SOP_DIVISIONS.some(d => d.id_karyawan_divisi === divisiId)) {
        return divisiId;
    }
    return LEGACY_DIVISI_MAP[divisiId] || divisiId;
};

export const sopApi = {
    fetchDivisions: async (): Promise<DivisionSopSummary[]> => {
        // Use the hardcoded divisions that match the actual SOP data instead of m_karyawan_divisi
        const divisions: DivisionSopSummary[] = SOP_DIVISIONS;
        
        // Fetch totals for each division concurrently
        const enhancedDivisions = await Promise.all(divisions.map(async (div) => {
            try {
                const sopResponse = await api.get(`/sop/list-sop/${encodeURIComponent(div.id_karyawan_divisi.toString())}`);
                const sops = sopResponse.data?.data || [];
                return {
                    ...div,
                    total: sops.length
                };
            } catch (error) {
                return {
                    ...div,
                    total: 0
                };
            }
        }));
        
        return enhancedDivisions;
    },

    fetchSopsByDivisi: async (divisi: string): Promise<SopItem[]> => {
        const legacyCode = getLegacyDivisiCode(divisi);
        const response = await api.get(`/sop/list-sop/${encodeURIComponent(legacyCode)}`);
        return response.data?.data || [];
    },

    fetchSopById: async (id: string): Promise<{ header: SopItem, history: SopHistory[] } | undefined> => {
        const response = await api.get(`/sop/${id}`);
        if (response.data?.status) {
            return {
                header: response.data.data,
                history: response.data.data_history || []
            };
        }
        return undefined;
    },

    addSop: async (payload: FormData): Promise<any> => {
        const response = await api.post('/sop', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },

    updateSop: async (payload: FormData): Promise<any> => {
        const response = await api.post('/sop/update', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },

    confirmSop: async (id: string): Promise<boolean> => {
        const response = await api.post('/sop/confirm', { id_sop: id });
        return response.data?.status || false;
    }
};  
 
