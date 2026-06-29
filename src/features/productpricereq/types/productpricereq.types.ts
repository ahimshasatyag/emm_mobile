export interface ProductPriceReqProduct {
    id_product: string;
    code_product: string;
    nm_product: string;
}

export interface ProductPriceReq {
    id: string;
    id_product: string;
    code_product: string;
    nm_product: string;
    nm_users: string;
    status: string; // DRAFT, CONFIRM, CANCEL, SUCCESS
    product_price_req?: number;
    product_price_acc?: number;
}

export interface ProductPriceReqPayload {
    id_product: string;
    product_price_acc?: number;
}
