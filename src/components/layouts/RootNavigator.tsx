import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export function RootNavigator() {
    const user = useAppSelector((state) => state.auth.user);

    return user ? <MainNavigator /> : <AuthNavigator />;
}
