import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { AutoLogoutWrapper } from '../../features/auth/components/AutoLogoutWrapper';
import { removeSecureItemAsync } from '../../services/storage/secureStorage';
import { Loading } from '../shared/Loading';

export function RootNavigator() {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                // Aplikasi ditutup total lalu dibuka (fresh start), maka kita hapus token
                // sehingga user dipaksa login kembali.
                await removeSecureItemAsync('userToken');
                await removeSecureItemAsync('userData');
            } catch (e) {
                console.error('Gagal membersihkan sesi sebelumnya', e);
            } finally {
                setIsChecking(false);
            }
        };

        bootstrapAsync();
    }, [dispatch]);

    if (isChecking) {
        return <Loading fullScreen message="Memeriksa sesi Anda..." />;
    }

    return user ? (
        <AutoLogoutWrapper>
            <MainNavigator />
        </AutoLogoutWrapper>
    ) : (
        <AuthNavigator />
    );
}
