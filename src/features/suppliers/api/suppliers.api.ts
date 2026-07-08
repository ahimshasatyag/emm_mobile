import { Supplier } from '../types/suppliers.types';
import { DUMMY_SUPPLIERS } from '../data/suppliers.data';

export const fetchSuppliers = async (): Promise<Supplier[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...DUMMY_SUPPLIERS]), 1000);
    });
};

export const getSupplierById = async (id: string): Promise<Supplier | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const supplier = DUMMY_SUPPLIERS.find(s => s.id_suppliers === id);
            resolve(supplier || null);
        }, 500);
    });
};
