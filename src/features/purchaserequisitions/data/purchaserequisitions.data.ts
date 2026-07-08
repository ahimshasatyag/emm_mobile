import { PurchaseRequisition, PurchaseRequisitionDetail } from '../types/purchaserequisitions';

export const DUMMY_PR_DETAILS: Record<string, PurchaseRequisitionDetail[]> = {
    'PR-202310-001': [
        {
            id_pr_dtl: 'PRD-001',
            id_pr: 'PR-202310-001',
            id_product: 'PRD001',
            code_product: 'P001',
            nm_product: 'Laptop Dell XPS 13',
            qty: 2,
            note: 'Untuk staff baru',
            qty_po: 0,
            nm_product_satuan: 'Unit'
        },
        {
            id_pr_dtl: 'PRD-002',
            id_pr: 'PR-202310-001',
            id_product: 'PRD002',
            code_product: 'P002',
            nm_product: 'Mouse Wireless Logitech',
            qty: 5,
            note: 'Cadangan',
            qty_po: 0,
            nm_product_satuan: 'Pcs'
        }
    ],
    'PR-202310-002': [
        {
            id_pr_dtl: 'PRD-003',
            id_pr: 'PR-202310-002',
            id_product: 'PRD003',
            code_product: 'P003',
            nm_product: 'Kertas HVS A4',
            qty: 10,
            note: 'Untuk printer admin',
            qty_po: 0,
            nm_product_satuan: 'Rim'
        }
    ]
};

export const DUMMY_PR_LIST: PurchaseRequisition[] = [
    {
        id_pr: 'PR-202310-001',
        code_pr: 'PR-202310-001',
        username: 'admin',
        date_request: '2023-10-01',
        date_deadline: '2023-10-05',
        status_pr: 'PR',
    },
    {
        id_pr: 'PR-202310-002',
        code_pr: 'PR-202310-002',
        username: 'john_doe',
        date_request: '2023-10-02',
        date_deadline: '2023-10-10',
        status_pr: '',
    },
    {
        id_pr: 'PR-202310-003',
        code_pr: 'PR-202310-003',
        username: 'jane_smith',
        date_request: '2023-10-03',
        date_deadline: '2023-10-08',
        status_pr: 'PR',
    }
];
