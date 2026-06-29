import { ProductUnit, ProductUnitFormData, ProductUnitResponse, ProductUnitListResponse } from '../types/productunit.types';
import { dummyProductUnits } from '../data/productUnitDummy.data';

class ProductUnitApi {
    private units: ProductUnit[] = [...dummyProductUnits];

    // Simulate API call delay
    private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    async getUnits(): Promise<ProductUnitListResponse> {
        await this.delay(800); // Simulate network delay
        return {
            success: true,
            data: [...this.units]
        };
    }

    async getUnitById(id: string): Promise<ProductUnitResponse> {
        await this.delay(500);
        const unit = this.units.find(u => u.id_product_satuan === id);
        if (unit) {
            return { success: true, data: { ...unit } };
        }
        return { success: false, message: 'Satuan tidak ditemukan' };
    }

    async createUnit(data: ProductUnitFormData): Promise<ProductUnitResponse> {
        await this.delay(800);
        
        // Generate a new ID simple simulation
        const newId = `UNIT${String(this.units.length + 1).padStart(3, '0')}`;
        
        const newUnit: ProductUnit = {
            id_product_satuan: newId,
            nm_product_satuan: data.nm_product_satuan,
            date_create: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        
        this.units.push(newUnit);
        
        return {
            success: true,
            data: { ...newUnit },
            message: 'Satuan berhasil ditambahkan'
        };
    }

    async updateUnit(id: string, data: ProductUnitFormData): Promise<ProductUnitResponse> {
        await this.delay(800);
        
        const index = this.units.findIndex(u => u.id_product_satuan === id);
        if (index !== -1) {
            this.units[index] = {
                ...this.units[index],
                nm_product_satuan: data.nm_product_satuan,
                date_update: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
            
            return {
                success: true,
                data: { ...this.units[index] },
                message: 'Satuan berhasil diperbarui'
            };
        }
        
        return { success: false, message: 'Satuan tidak ditemukan' };
    }

    async deleteUnit(id: string): Promise<ProductUnitResponse> {
        await this.delay(800);
        
        const index = this.units.findIndex(u => u.id_product_satuan === id);
        if (index !== -1) {
            this.units.splice(index, 1);
            return {
                success: true,
                message: 'Satuan berhasil dihapus'
            };
        }
        
        return { success: false, message: 'Satuan tidak ditemukan' };
    }
}

export const productUnitApi = new ProductUnitApi();
