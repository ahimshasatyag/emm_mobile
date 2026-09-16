export interface AssetItem {
    id: string;
    name: string;
}

export interface UserItem {
    username: string;
    nm_users: string;
}

export interface SchedulePic {
    inventory_schedule_id: string;
    username: string;
}

export interface InventorySchedule {
    id: string;
    asset_id: string;
    asset_name?: string;
    name: string;
    deskripsi: string;
    periode: 'Monthly' | 'Yearly' | string;
    due_date: string; // YYYY-MM-DD
    reminder: string; // comma separated values e.g. "3,7,14"
    date_create?: string;
    date_update?: string;
    pic?: UserItem[]; // Resolved PICs
}

export interface ScheduleListResponse {
    status: boolean;
    data: {
        data: InventorySchedule[];
        current_page?: number;
        last_page?: number;
    } | InventorySchedule[];
}

export interface ScheduleSupportDataResponse {
    status: boolean;
    data_asset: AssetItem[];
    data_user: UserItem[];
}

export interface ScheduleDetailResponse {
    status: boolean;
    data: InventorySchedule;
    data_pic: SchedulePic[];
}

export interface ScheduleSavePayload {
    asset_id: string;
    name: string;
    deskripsi: string;
    periode: string;
    due_date: string;
    reminder: string[];
    username: string[];
}
