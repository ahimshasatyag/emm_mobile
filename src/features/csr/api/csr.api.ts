import { Csr, CsrPayload } from '../types/csr.types';
import { mockCsrs } from '../data/dummy';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const csrApi = {
    getAll: async (): Promise<Csr[]> => {
        await delay(500);
        return [...mockCsrs];
    },

    getById: async (id: string): Promise<Csr | null> => {
        await delay(300);
        const item = mockCsrs.find(c => c.id === id);
        return item ? { ...item } : null;
    },

    create: async (payload: CsrPayload): Promise<Csr> => {
        await delay(600);
        const newId = Date.now().toString();
        
        // Simulating the backend code generation
        const dateObj = new Date(payload.date_request);
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const count = String(mockCsrs.length + 1).padStart(5, '0');
        const csr_code = `CSR-EMM/${y}/${m}/${count}`;

        const newCsr: Csr = {
            id: newId,
            csr_code,
            csr_date: payload.date_request,
            id_customers: payload.customers,
            nm_customers: 'Customer ' + payload.customers, // dummy
            id_karyawan: payload.id_karyawan,
            nm_karyawan: 'Karyawan ' + payload.id_karyawan, // dummy
            id_product: payload.id_product,
            code_product: 'PRD-' + payload.id_product, // dummy
            nm_product: 'Product ' + payload.id_product, // dummy
            sn_number: payload.sn_number,
            sts_pasang: payload.sts_pasang,
            do_code: payload.do_code,
            mesin_lama: payload.mesin_lama,
            lokasi: payload.lokasi,
            lap_kerusakan: payload.lap_kerusakan,
            status: 'DRAFT',
            csr_by: 'Current User', // dummy user
            image: payload.link_foto
        };
        mockCsrs.unshift(newCsr);
        return newCsr;
    },

    update: async (id: string, payload: Partial<CsrPayload>): Promise<Csr> => {
        await delay(600);
        const idx = mockCsrs.findIndex(c => c.id === id);
        if (idx === -1) throw new Error('CSR not found');

        const updated = { ...mockCsrs[idx] };
        if (payload.date_request) updated.csr_date = payload.date_request;
        if (payload.customers) {
            updated.id_customers = payload.customers;
            updated.nm_customers = 'Customer ' + payload.customers;
        }
        if (payload.id_karyawan) {
            updated.id_karyawan = payload.id_karyawan;
            updated.nm_karyawan = 'Karyawan ' + payload.id_karyawan;
        }
        if (payload.id_product) {
            updated.id_product = payload.id_product;
            updated.nm_product = 'Product ' + payload.id_product;
            updated.code_product = 'PRD-' + payload.id_product;
        }
        if (payload.sn_number) updated.sn_number = payload.sn_number;
        if (payload.sts_pasang) updated.sts_pasang = payload.sts_pasang;
        if (payload.do_code) updated.do_code = payload.do_code;
        if (payload.mesin_lama) updated.mesin_lama = payload.mesin_lama;
        if (payload.lokasi) updated.lokasi = payload.lokasi;
        if (payload.lap_kerusakan) updated.lap_kerusakan = payload.lap_kerusakan;
        if (payload.link_foto !== undefined) updated.image = payload.link_foto;

        mockCsrs[idx] = updated;
        return updated;
    },

    confirm: async (id: string): Promise<Csr> => {
        await delay(500);
        const idx = mockCsrs.findIndex(c => c.id === id);
        if (idx === -1) throw new Error('CSR not found');
        mockCsrs[idx] = {
            ...mockCsrs[idx],
            status: 'OUTSTANDING'
        };
        return mockCsrs[idx];
    },

    cancel: async (id: string, memo: string): Promise<Csr> => {
        await delay(500);
        const idx = mockCsrs.findIndex(c => c.id === id);
        if (idx === -1) throw new Error('CSR not found');
        mockCsrs[idx] = {
            ...mockCsrs[idx],
            status: 'CANCEL'
        };
        return mockCsrs[idx];
    }
};
