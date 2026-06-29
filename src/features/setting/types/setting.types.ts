export interface SettingData {
    setting_id: string;
    setting_label: string;
    setting_key: string;
    setting_value: string;
    setting_note: string;
    setting_flag: string; // '1' untuk Aktif, '0' untuk Tidak Aktif
}

export interface SettingFormData {
    setting_label: string;
    setting_key: string;
    setting_value: string;
    setting_note: string;
    setting_flag: string;
}
