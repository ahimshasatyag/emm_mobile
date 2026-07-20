export interface AssetCategory {
    id: string;
    name: string;
}

export interface AssetType {
    id: string;
    name: string;
}

export interface AssetSerialNumber {
    id: string;
    asset_id: string;
    name_sn: string;
    serial_number: string;
    f_print: string | null; // Indicates if this is the primary SN
}

export interface AssetItem {
    id: string;
    name: string;
    inventory_type_id: string;
    type_name?: string;
    inventory_category_id: string;
    category_name?: string;
    procured_date: string;
    purchased_date: string;
    deskripsi: string;
    serial: string;
    status: 'active' | 'normal' | 'not_assigned' | 'sold' | 'rusak';
    f_print: string | null;
    serial_numbers?: AssetSerialNumber[];
}
