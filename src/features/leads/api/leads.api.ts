import { LeadsItem, LeadsDetail } from '../types/leads.types';
import { DUMMY_LEADS_LIST, DUMMY_LEADS_DETAIL, FALLBACK_LEADS_DETAIL } from '../data/leads.data';

export const fetchLeads = async (): Promise<LeadsItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(DUMMY_LEADS_LIST);
        }, 1200); // Simulate network delay
    });
};

export const fetchLeadDetail = async (id: string): Promise<LeadsDetail> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const detail = DUMMY_LEADS_DETAIL[id] || FALLBACK_LEADS_DETAIL;
            resolve({
                ...detail,
                id: id,
                code_leads: detail.code_leads === 'LD-DEFAULT' ? `LD-${id.replace('L-', '')}` : detail.code_leads,
            });
        }, 1200); // Simulate network delay
    });
};
