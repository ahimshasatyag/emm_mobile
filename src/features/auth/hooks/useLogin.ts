import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginApi } from '../api/login.api';
import { LoginRequest } from '../types/auth.types';
import { setUser, setToken } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();

    const login = async (data: LoginRequest) => {
        setLoading(true);
        setError(null);

        try {
            const response = await loginApi(data);

            // Set token to AsyncStorage
            if (response.token) {
                await AsyncStorage.setItem('userToken', response.token);
            }
            if (response.user) {
                await AsyncStorage.setItem('userData', JSON.stringify(response.user));
            }
            // Save user and token to redux state
            dispatch(setUser(response.user));
            dispatch(setToken(response.token ?? null));

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
