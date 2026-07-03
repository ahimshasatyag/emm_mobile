import { Survey } from '../types/survey.types';

export const mockSurveys: Survey[] = [
    {
        id_survey: '1',
        code_survey: 'SRV-2026-001',
        date_request: '03-07-2026',
        nm_customers: 'PT. Maju Mundur',
        survey_status: 'Waiting Approval',
        
        nm_karyawan: 'Budi Santoso',
        customers_address: 'Jl. Sudirman No 123, Jakarta',
        date_estimasi: '10-07-2026',
        vcurrency: 'IDR',
        nkurs: '1',
        flag_ppn: '1',
        delivery_term: 'FRANCO JKT',
        
        date_so: '03-07-2026',
        nm_type_pembayaran: 'Kredit',
        ndp_persen: '30',
        ndp_amount: '3000000',
        ntenor: '3',
        ntenor_amount: '2333333',
        nm_cara_pembayaran: 'Transfer BCA',
        nm_waktu_bayar: '30 Hari',
        
        keterangan: 'Tolong disurvey secepatnya',
        
        items: [
            {
                product_code: 'PRD-001',
                product_name: 'Mesin X',
                status_barang: 'READY',
                harga: '10000000',
                qty: '1',
                satuan: 'PCS',
                delivery_term: 'FRANCO JKT'
            }
        ]
    }
];
