import { InventoryAsset, InventoryCategory, InventoryFormData, InventorySerialNumber, InventoryType } from '../types/inventory.types';
import { DUMMY_INVENTORY_ASSETS, DUMMY_INVENTORY_CATEGORIES, DUMMY_INVENTORY_SERIALS, DUMMY_INVENTORY_TYPES } from '../data/inventoryDummy.data';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let assets = [...DUMMY_INVENTORY_ASSETS];
let serials = [...DUMMY_INVENTORY_SERIALS];

export const inventoryApi = {
    getTypes: async (): Promise<InventoryType[]> => {
        await delay(300);
        return [...DUMMY_INVENTORY_TYPES];
    },

    getCategories: async (): Promise<InventoryCategory[]> => {
        await delay(300);
        return [...DUMMY_INVENTORY_CATEGORIES];
    },

    getAssets: async (): Promise<InventoryAsset[]> => {
        await delay(600);
        return assets.map(asset => ({
            ...asset,
            type_name: DUMMY_INVENTORY_TYPES.find(t => t.id === asset.inventory_type_id)?.name,
            category_name: DUMMY_INVENTORY_CATEGORIES.find(c => c.id === asset.inventory_category_id)?.name,
        }));
    },

    getAssetSerials: async (assetId: string): Promise<InventorySerialNumber[]> => {
        await delay(300);
        return serials.filter(s => s.asset_id === assetId);
    },

    createAsset: async (data: InventoryFormData): Promise<InventoryAsset> => {
        await delay(800);
        const newAssetId = `INV${String(assets.length + 1).padStart(3, '0')}`;
        
        const newAsset: InventoryAsset = {
            id: newAssetId,
            name: data.name,
            inventory_type_id: data.inventory_type_id,
            inventory_category_id: data.inventory_category_id,
            procured_date: data.procured_date,
            purchased_date: data.purchased_date,
            deskripsi: data.deskripsi,
            serial: data.serial,
            status: data.status,
            f_print: data.f_print,
        };
        
        assets = [newAsset, ...assets];

        if (data.serialNumbers && data.serialNumbers.length > 0) {
            const newSerials = data.serialNumbers.map((sn, index) => ({
                id: `SN-${Date.now()}-${index}`,
                asset_id: newAssetId,
                name_sn: sn.name_sn,
                serial_number: sn.serial_number,
            }));
            serials = [...serials, ...newSerials];
        }

        return newAsset;
    },

    updateAsset: async (id: string, data: InventoryFormData): Promise<InventoryAsset> => {
        await delay(800);
        
        const index = assets.findIndex(a => a.id === id);
        if (index === -1) throw new Error('Asset not found');

        const updatedAsset: InventoryAsset = {
            ...assets[index],
            name: data.name,
            inventory_type_id: data.inventory_type_id,
            inventory_category_id: data.inventory_category_id,
            procured_date: data.procured_date,
            purchased_date: data.purchased_date,
            deskripsi: data.deskripsi,
            serial: data.serial,
            status: data.status,
            f_print: data.f_print,
        };

        assets[index] = updatedAsset;

        // Replace serials completely
        serials = serials.filter(s => s.asset_id !== id);
        if (data.serialNumbers && data.serialNumbers.length > 0) {
            const newSerials = data.serialNumbers.map((sn, index) => ({
                id: `SN-${Date.now()}-${index}`,
                asset_id: id,
                name_sn: sn.name_sn,
                serial_number: sn.serial_number,
            }));
            serials = [...serials, ...newSerials];
        }

        return updatedAsset;
    },

    deleteAsset: async (id: string): Promise<void> => {
        await delay(600);
        assets = assets.filter(a => a.id !== id);
        serials = serials.filter(s => s.asset_id !== id);
    }
};
