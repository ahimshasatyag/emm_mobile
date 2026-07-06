import { SalesRetur } from '../types/salesretur.types';

export const dummySalesRetur: SalesRetur[] = [
    {
        id: "1",
        code_sr: "SR-202310-0001",
        date: "2023-10-15",
        id_customers: "CUST-001",
        nm_customers: "PT. Maju Mundur",
        id_do: "DO-202310-001",
        code_do: "DO-202310-001",
        keterangan: "Retur karena barang rusak pengiriman",
        status: "DRAFT",
        items: [
            {
                id_product: "PRD-001",
                code_product: "BRG001",
                nm_product: "Mesin Bor Listrik",
                id_product_sn: "SN001",
                nbarcode: "8991234567890",
                selected: true
            },
            {
                id_product: "PRD-002",
                code_product: "BRG002",
                nm_product: "Gerinda Tangan",
                id_product_sn: "SN002",
                nbarcode: "8991234567891",
                selected: true
            }
        ]
    },
    {
        id: "2",
        code_sr: "SR-202310-0002",
        date: "2023-10-20",
        id_customers: "CUST-002",
        nm_customers: "Toko Sinar Jaya",
        id_do: "DO-202310-005",
        code_do: "DO-202310-005",
        keterangan: "Salah kirim barang",
        status: "CONFIRMED",
        items: [
            {
                id_product: "PRD-003",
                code_product: "BRG003",
                nm_product: "Pompa Air",
                id_product_sn: "SN003",
                nbarcode: "8991234567892",
                selected: true
            }
        ]
    }
];

export const dummyCustomers = [
    { id_customers: "CUST-001", nm_customers: "PT. Maju Mundur" },
    { id_customers: "CUST-002", nm_customers: "Toko Sinar Jaya" },
    { id_customers: "CUST-003", nm_customers: "CV. Abadi Makmur" },
];

export const dummyDO = [
    { id_do: "DO-202310-001", code_do: "DO-202310-001", id_customers: "CUST-001" },
    { id_do: "DO-202310-002", code_do: "DO-202310-002", id_customers: "CUST-001" },
    { id_do: "DO-202310-005", code_do: "DO-202310-005", id_customers: "CUST-002" },
];

export const dummyDODetail = {
    "DO-202310-001": [
        { id_product: "PRD-001", code_product: "BRG001", nm_product: "Mesin Bor Listrik", id_product_sn: "SN001", nbarcode: "8991234567890" },
        { id_product: "PRD-002", code_product: "BRG002", nm_product: "Gerinda Tangan", id_product_sn: "SN002", nbarcode: "8991234567891" },
        { id_product: "PRD-004", code_product: "BRG004", nm_product: "Palu Besi", id_product_sn: "SN004", nbarcode: "8991234567893" },
    ],
    "DO-202310-005": [
        { id_product: "PRD-003", code_product: "BRG003", nm_product: "Pompa Air", id_product_sn: "SN003", nbarcode: "8991234567892" },
        { id_product: "PRD-005", code_product: "BRG005", nm_product: "Kabel Listrik 50m", id_product_sn: "SN005", nbarcode: "8991234567894" },
    ]
};
