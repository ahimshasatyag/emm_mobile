import { Customer, CustomerFormData, Province, Regency, CustomerDetailResponse } from '../types/customers.types';

// Dummy data for initial development
const DUMMY_PROVINCES: Province[] = [
    { id: '1', nama: 'DKI Jakarta' },
    { id: '2', nama: 'Jawa Barat' },
    { id: '3', nama: 'Jawa Tengah' },
    { id: '4', nama: 'Jawa Timur' },
];

const DUMMY_REGENCIES: Regency[] = [
    { id: '11', nama_kabupaten: 'Jakarta Selatan', kode_provinsi: '1' },
    { id: '12', nama_kabupaten: 'Jakarta Pusat', kode_provinsi: '1' },
    { id: '21', nama_kabupaten: 'Bandung', kode_provinsi: '2' },
    { id: '22', nama_kabupaten: 'Bogor', kode_provinsi: '2' },
    { id: '31', nama_kabupaten: 'Semarang', kode_provinsi: '3' },
    { id: '41', nama_kabupaten: 'Surabaya', kode_provinsi: '4' },
];

let DUMMY_CUSTOMERS: Customer[] = [
    {
        id_customers: '1',
        code_customers: '00001',
        nm_customers: 'PT Maju Bersama',
        customers_address: 'Jl. Sudirman No. 1, Jakarta',
        customers_phone: '0211234567',
        customers_mobile: '081234567890',
        customers_email: 'info@majubersama.com',
        customers_fax: '0211234568',
        f_company: true,
        nama_lengkap: 'Budi Santoso',
        nik: '3171234567890001',
        nib: '9120101920392',
        npwp: '01.234.567.8-012.000',
        alamat: 'Jl. Kebon Jeruk, Jakarta',
        customers_address_invoice: 'Jl. Sudirman No. 1, Jakarta',
        provinsi: 'DKI Jakarta',
        kabupaten: 'Jakarta Selatan',
        is_blacklist: false,
        is_external_sales: false,
        jumlah_so: 5,
    },
    {
        id_customers: '2',
        code_customers: '00002',
        nm_customers: 'Toko Makmur',
        customers_address: 'Jl. Ahmad Yani No. 10, Bandung',
        customers_phone: '0229876543',
        customers_mobile: '085678901234',
        customers_email: 'toko.makmur@gmail.com',
        customers_fax: '',
        f_company: false,
        nama_lengkap: 'Ahmad Makmur',
        nik: '3271234567890001',
        nib: null,
        npwp: null,
        alamat: 'Jl. Cicadas No. 5, Bandung',
        customers_address_invoice: 'Jl. Ahmad Yani No. 10, Bandung',
        provinsi: 'Jawa Barat',
        kabupaten: 'Bandung',
        is_blacklist: false,
        is_external_sales: true,
        jumlah_so: 2,
    }
];

export const customersApi = {
    fetchCustomers: async (): Promise<{ success: boolean; data: Customer[] }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: DUMMY_CUSTOMERS });
            }, 800); // Simulate network delay
        });
    },

    fetchCustomerById: async (id: string): Promise<CustomerDetailResponse> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const customer = DUMMY_CUSTOMERS.find(c => c.id_customers === id);
                if (customer) {
                    resolve({
                        success: true,
                        data: {
                            header: customer,
                            items: [
                                {
                                    id_contact: '1',
                                    id_customers: id,
                                    nm_customers_contact: 'Siti',
                                    customers_contact_posisi: 'Admin',
                                    customers_contact_phone: '08111222333',
                                    customers_contact_email: 'siti@example.com'
                                }
                            ]
                        }
                    });
                } else {
                    reject(new Error('Customer not found'));
                }
            }, 600);
        });
    },

    createCustomer: async (data: CustomerFormData): Promise<{ success: boolean; message?: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newId = (DUMMY_CUSTOMERS.length + 1).toString();
                const newCode = newId.padStart(5, '0');
                
                const prov = DUMMY_PROVINCES.find(p => p.id === data.provinsi);
                const kab = DUMMY_REGENCIES.find(r => r.id === data.kabupaten);

                DUMMY_CUSTOMERS.push({
                    id_customers: newId,
                    code_customers: newCode,
                    nm_customers: data.nm_customers,
                    customers_address: data.customers_address,
                    customers_phone: data.customers_phone,
                    customers_mobile: data.customers_mobile,
                    customers_email: data.customers_email,
                    customers_fax: data.customers_fax,
                    f_company: data.f_company,
                    nama_lengkap: data.nama_lengkap,
                    nik: data.nik,
                    nib: data.nib,
                    npwp: data.npwp,
                    alamat: data.alamat,
                    customers_address_invoice: data.customers_address_invoice,
                    provinsi: prov ? prov.nama : data.provinsi,
                    kabupaten: kab ? kab.nama_kabupaten : data.kabupaten,
                    is_blacklist: data.is_blacklist,
                    is_external_sales: data.is_external_sales,
                    jumlah_so: 0,
                });
                resolve({ success: true, message: 'Customer created successfully' });
            }, 800);
        });
    },

    updateCustomer: async (id: string, data: CustomerFormData): Promise<{ success: boolean; message?: string }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = DUMMY_CUSTOMERS.findIndex(c => c.id_customers === id);
                if (index !== -1) {
                    const prov = DUMMY_PROVINCES.find(p => p.id === data.provinsi);
                    const kab = DUMMY_REGENCIES.find(r => r.id === data.kabupaten);

                    DUMMY_CUSTOMERS[index] = {
                        ...DUMMY_CUSTOMERS[index],
                        ...data,
                        provinsi: prov ? prov.nama : data.provinsi,
                        kabupaten: kab ? kab.nama_kabupaten : data.kabupaten,
                    };
                    resolve({ success: true, message: 'Customer updated successfully' });
                } else {
                    reject(new Error('Customer not found'));
                }
            }, 800);
        });
    },

    deleteCustomer: async (id: string): Promise<{ success: boolean; message?: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                DUMMY_CUSTOMERS = DUMMY_CUSTOMERS.filter(c => c.id_customers !== id);
                resolve({ success: true, message: 'Customer deleted successfully' });
            }, 600);
        });
    },

    fetchProvinces: async (): Promise<{ success: boolean; data: Province[] }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: DUMMY_PROVINCES });
            }, 300);
        });
    },

    fetchKabupaten: async (kode_provinsi: string): Promise<{ success: boolean; data: Regency[] }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ 
                    success: true, 
                    data: DUMMY_REGENCIES.filter(r => r.kode_provinsi === kode_provinsi) 
                });
            }, 300);
        });
    }
};
