import { DivisionSopSummary, SopItem } from '../types/sop.types';

export const dummyDivisions: DivisionSopSummary[] = [
    { divisi: 'ITD', total: 5 },
    { divisi: 'AFS', total: 3 },
    { divisi: 'GKU', total: 8 },
    { divisi: 'SLS', total: 12 },
    { divisi: 'SAM', total: 4 },
    { divisi: 'DCR', total: 2 },
    { divisi: 'MAN', total: 7 },
    { divisi: 'FAC', total: 1 },
    { divisi: 'SPR', total: 6 },
];

export const dummySops: SopItem[] = [
    {
        id_sop: '1',
        divisi: 'ITD',
        code_sop: 'SOP/ITD/001',
        nm_sop: 'SOP Maintenance Server',
        file_pdf: 'maintenance_server.pdf',
        status: 'FINALIZE',
        date_create: '2023-01-10T10:00:00Z',
        history: [
            {
                id: 'h1',
                file_pdf: 'maintenance_server_v1.pdf',
                date_update: '2023-01-10T10:00:00Z',
            }
        ]
    },
    {
        id_sop: '2',
        divisi: 'ITD',
        code_sop: 'SOP/ITD/002',
        nm_sop: 'SOP Backup Database',
        file_pdf: null,
        status: 'DRAFT',
        date_create: '2023-02-15T09:30:00Z',
        history: []
    },
    {
        id_sop: '3',
        divisi: 'ITD',
        code_sop: 'SOP/ITD/003',
        nm_sop: 'SOP Network Troubleshooting',
        file_pdf: 'network_troubleshoot.pdf',
        status: 'IN PROGRESS',
        date_create: '2023-03-20T14:15:00Z',
        history: []
    },
    {
        id_sop: '4',
        divisi: 'AFS',
        code_sop: 'SOP/AFS/001',
        nm_sop: 'SOP Rekonsiliasi Bank',
        file_pdf: 'rekonsiliasi.pdf',
        status: 'FINALIZE',
        date_create: '2023-04-05T11:00:00Z',
        history: []
    },
];
