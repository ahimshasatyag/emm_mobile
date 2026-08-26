import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginApi } from '../api/login.api';
import { LoginRequest } from '../types/auth.types';
import { setUser } from '../store/authSlice';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();

    const login = async (data: LoginRequest) => {
        setLoading(true);
        setError(null);

        try {
            const response = await loginApi(data);
            
            // Set token here if needed (e.g. AsyncStorage / SecureStore)
            // Save user to redux state
            dispatch(setUser(response.user));
            
            return true; 
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Login gagal, silakan periksa kembali username dan password Anda.';
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};
