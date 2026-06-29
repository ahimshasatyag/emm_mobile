import { ApprovalSchemeData, ApprovalSchemeFormData, ApprovalRuleOption } from '../types/approvalscheme.types';
import { mockApprovalSchemes, mockApprovalRules } from '../data/approvalscheme.dummy';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchApprovalSchemesApi = async (): Promise<ApprovalSchemeData[]> => {
    await delay(800);
    return [...mockApprovalSchemes];
};

export const fetchApprovalSchemeByIdApi = async (id: string): Promise<ApprovalSchemeData> => {
    await delay(500);
    const item = mockApprovalSchemes.find(i => i.id === id);
    if (!item) throw new Error('Skema approval tidak ditemukan');
    return { ...item };
};

export const fetchApprovalRulesApi = async (): Promise<ApprovalRuleOption[]> => {
    await delay(400);
    return [...mockApprovalRules];
};

export const createApprovalSchemeApi = async (data: ApprovalSchemeFormData): Promise<ApprovalSchemeData> => {
    await delay(1000);
    const newId = Math.floor(Math.random() * 9000) + 1000;
    const newItem: ApprovalSchemeData = {
        id: newId.toString(),
        ...data,
        date_create: new Date().toISOString().split('T').join(' ').substring(0, 19),
    };
    mockApprovalSchemes.unshift(newItem);
    return newItem;
};

export const updateApprovalSchemeApi = async (id: string, data: ApprovalSchemeFormData): Promise<ApprovalSchemeData> => {
    await delay(1000);
    const index = mockApprovalSchemes.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Skema approval tidak ditemukan');
    
    const updatedItem: ApprovalSchemeData = {
        ...mockApprovalSchemes[index],
        ...data,
        date_update: new Date().toISOString().split('T').join(' ').substring(0, 19),
    };
    mockApprovalSchemes[index] = updatedItem;
    return updatedItem;
};

export const deleteApprovalSchemeApi = async (id: string): Promise<void> => {
    await delay(1000);
    const index = mockApprovalSchemes.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Skema approval tidak ditemukan');
    mockApprovalSchemes.splice(index, 1);
};
