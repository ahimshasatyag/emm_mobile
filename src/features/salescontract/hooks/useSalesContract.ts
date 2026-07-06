import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { 
    fetchSalesContracts, 
    getSalesContractById, 
    fetchSOWithoutContractList, 
    getSOWithoutContractById, 
    createSalesContract, 
    updateSalesContract, 
    clearCurrentContract,
    clearCurrentSOWithoutContract
} from '../stores/salescontractSlice';
import { SalesContract } from '../types/salescontract.types';

export function useSalesContract() {
    const dispatch = useAppDispatch();
    const { 
        items, 
        soWithoutContracts, 
        currentContract, 
        currentSOWithoutContract, 
        isLoading, 
        error 
    } = useAppSelector(state => state.salescontract);

    const loadContracts = useCallback(() => {
        dispatch(fetchSalesContracts());
    }, [dispatch]);

    const getContractById = useCallback((id: string) => {
        dispatch(getSalesContractById(id));
    }, [dispatch]);

    const loadSOWithoutContract = useCallback(() => {
        dispatch(fetchSOWithoutContractList());
    }, [dispatch]);

    const getSOWithoutContract = useCallback((id: string) => {
        dispatch(getSOWithoutContractById(id));
    }, [dispatch]);

    const createContract = useCallback(async (data: SalesContract) => {
        return dispatch(createSalesContract(data)).unwrap();
    }, [dispatch]);

    const updateContract = useCallback(async (id: string, data: Partial<SalesContract>) => {
        return dispatch(updateSalesContract({ id, data })).unwrap();
    }, [dispatch]);

    const clearContract = useCallback(() => {
        dispatch(clearCurrentContract());
    }, [dispatch]);

    const clearSOWithoutContract = useCallback(() => {
        dispatch(clearCurrentSOWithoutContract());
    }, [dispatch]);

    return {
        items,
        soWithoutContracts,
        currentContract,
        currentSOWithoutContract,
        isLoading,
        error,
        loadContracts,
        getContractById,
        loadSOWithoutContract,
        getSOWithoutContract,
        createContract,
        updateContract,
        clearContract,
        clearSOWithoutContract
    };
}
