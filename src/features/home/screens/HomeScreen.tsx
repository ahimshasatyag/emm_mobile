import React from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { HomeScreen as Home1Screen } from './Home1Screen';
import { Home2Screen } from './Home2Screen';
import { Home3Screen } from './Home3Screen';
import { Home4Screen } from './Home4Screen';

export function HomeScreen() {
    // Ambil data user dari Redux store
    const user = useAppSelector((state) => state.auth.user);

    // Default ke Home1Screen.tsx jika tidak ada info
    const dashboardType = user?.dashboard_file;

    switch (dashboardType) {
        case 'Home1Screen.tsx':
            return <Home1Screen />;
        case 'Home2Screen.tsx':
            return <Home2Screen />;
        case 'Home3Screen.tsx':
            return <Home3Screen />;
        case 'Home4Screen.tsx':
            return <Home4Screen />;
        default:
            return <Home1Screen />;
    }
}