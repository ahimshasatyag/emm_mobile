import { useState, useEffect } from 'react';
import { getSupportData } from '../api/quotationApi';

export const useQuotationProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [kursUsd, setKursUsd] = useState<number>(16400);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getSupportData();
            if (result) {
                setProducts(result.data_product || []);
                if (result.kurs_usd) {
                    setKursUsd(result.kurs_usd);
                }
            }
        } catch (err: any) {
            console.error("Failed to fetch quotation products:", err);
            setError(err.message || "Failed to fetch products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, kursUsd, isLoading, error, refetch: fetchProducts };
};
