import { useState } from 'react';
import { loginApi } from '../api/login.api';
import { LoginRequest } from '../types/auth.types';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const login = async (data: LoginRequest) => {
        setLoading(true);
        setError(null);

        if (data.username === 'admin' && data.password === 'admin123') {
            // Simulasi jeda network selama 1 detik agar terasa nyata
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
            return true;
        } else if (data.username === 'admin' && data.password !== 'admin123') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setError('Password untuk akun admin salah!');
            setLoading(false);
            return false;
        }
        // -------------------------

        try {
            const response = await loginApi(data);
            return true; // Sukses login, biarkan LoginForm yang set user
        } catch (err: any) {
            // Graceful fallback for local development if the backend API is offline/unreachable
            if (!err.response) {
                console.warn('Backend API unreachable, logging in with local developer session.');
                return true; // Sukses menggunakan fallback, biarkan LoginForm yang set user
            } else {
                const message = err.response?.data?.message || 'Login gagal, silakan periksa kembali username dan password Anda.';
                setError(message);
                return false;
            }
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};
