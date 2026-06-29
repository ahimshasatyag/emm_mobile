export type InventoryStatus = 'active' | 'normal' | 'not_assigned' | 'sold' | 'rusak';

export interface InventoryType {
    id: string;
    name: string;
}

export interface InventoryCategory {
    id: string;
    name: string;
}

export interface InventorySerialNumber {
    id: string;
    asset_id: string;
    name_sn: string;
    serial_number: string;
}

export interface InventoryAsset {
    id: string;
    name: string;
    inventory_type_id: string;
    inventory_category_id: string;
    procured_date: string; // ISO String or YYYY-MM-DD
    purchased_date: string; // ISO String or YYYY-MM-DD
    deskripsi: string;
    serial: string;
    status: InventoryStatus;
    f_print: string;
    category_name?: string;
    type_name?: string;
}

export interface InventoryFormData extends Omit<InventoryAsset, 'id' | 'category_name' | 'type_name'> {
    serialNumbers: Omit<InventorySerialNumber, 'id' | 'asset_id'>[];
}
