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
    asset_id?: string;
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
    status: 'active' | 'normal' | 'not_assigned' | 'sold' | 'rusak' | string;
    f_print: string | null;
    serial_numbers?: AssetSerialNumber[];
}

export interface AssetListResponse {
    status: boolean;
    data: {
        data: AssetItem[];
        current_page?: number;
        last_page?: number;
    } | AssetItem[]; // Sometimes backend returns direct array, sometimes paginated obj
}

export interface AssetSupportDataResponse {
    status: boolean;
    data_asset: any[];
    data_assets_type: AssetType[];
    data_assets_category: AssetCategory[];
}

export interface AssetDetailResponse {
    status: boolean;
    data: AssetItem;
    data_sn: AssetSerialNumber[];
}

export interface AssetSavePayload extends Omit<AssetItem, 'id' | 'serial_numbers' | 'type_name' | 'category_name'> {
    sn: {
        name_sn: string;
        serial_number: string;
    }[];
}
