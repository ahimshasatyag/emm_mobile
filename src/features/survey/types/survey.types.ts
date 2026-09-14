export interface SurveyDetailProduct {
    id_survey_dtl_product?: string;
    id_survey?: string;
    id_product: string;
    code_product?: string;
    nm_product?: string;
    product_berat: string | number;
}

export interface SurveyDetailJenis {
    id_survey_jenis: string;
}

export interface SurveyDetailTujuan {
    id_survey?: string;
    tujuan_survey: string;
}

export interface SurveyDetailBiaya {
    id_survey?: string;
    nominal_biaya: string | number;
    rincian_biaya: string;
}

export interface SurveyDetailPelaksana {
    id_survey_dtl_pelaksana?: string;
    id_survey?: string;
    id_karyawan: string;
    nm_karyawan?: string;
    divisi: string;
}

export interface Survey {
    id_survey: string;
    code_survey: string;
    id_karyawan: string;
    nm_karyawan?: string;
    nm_karyawan_divisi?: string;
    date_request: string;
    id_customers: string;
    nm_customers?: string;
    id_customers_contact: string;
    nm_customers_contact?: string;
    customers_contact_mobile?: string;
    customers_address?: string;
    pelaksana_afs: string | number | boolean;
    survey_status: string;
    date_pelaksana?: string;
    note_survey?: string;
    file_hasil_survey?: string;
    id_so?: string;
    
    // Virtual or Nested fields
    items?: SurveyDetailProduct[];
    jenis_survey?: SurveyDetailJenis[];
    tujuan_survey?: SurveyDetailTujuan[];
    biaya_survey?: SurveyDetailBiaya[];
    pelaksana_survey?: SurveyDetailPelaksana[];
}

export interface SurveySupportData {
    data_karyawan: any[];
    data_survey_jenis: any[];
    data_header_so: any | null;
    data_customers_contact: any[] | null;
    data_detail_so: any[] | null;
}
