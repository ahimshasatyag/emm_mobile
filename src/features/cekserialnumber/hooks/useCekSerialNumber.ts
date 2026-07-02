import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../stores';
import { setBarcode, clearSearch, searchSerialNumber } from '../stores/cekserialnumberSlice';
import { Alert } from 'react-native';

export function useCekSerialNumber() {
    const dispatch = useDispatch<AppDispatch>();
    const state = useSelector((state: RootState) => state.cekserialnumber);

    const handleSearch = () => {
        if (!state.barcode || state.barcode.trim() === '') {
            Alert.alert("Perhatian", "Silakan masukkan Serial Number terlebih dahulu.");
            return;
        }
        dispatch(searchSerialNumber(state.barcode.trim()));
    };

    const updateBarcode = (barcode: string) => {
        dispatch(setBarcode(barcode));
    };

    const resetSearch = () => {
        dispatch(clearSearch());
    };

    return {
        ...state,
        handleSearch,
        updateBarcode,
        resetSearch
    };
}
