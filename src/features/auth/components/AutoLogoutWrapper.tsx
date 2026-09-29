import React, { ReactNode, useEffect, useRef } from 'react';
import { View, PanResponder, AppState, AppStateStatus } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { removeSecureItemAsync } from '../../../services/storage/secureStorage';

interface AutoLogoutWrapperProps {
    children: ReactNode;
}

export const AutoLogoutWrapper: React.FC<AutoLogoutWrapperProps> = ({ children }) => {
    const dispatch = useDispatch();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const backgroundTimeRef = useRef<number | null>(null);

    const LOGOUT_TIME_MS = 15 * 60 * 1000; // 15 minutes

    const handleLogout = async () => {
        await removeSecureItemAsync('userToken');
        await removeSecureItemAsync('userData');
        dispatch(logout());
    };

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            handleLogout();
        }, LOGOUT_TIME_MS);
    };

    useEffect(() => {
        resetTimer();
        
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                // User switches app or screen goes off
                if (!backgroundTimeRef.current) {
                    backgroundTimeRef.current = Date.now();
                }
            } else if (nextAppState === 'active') {
                // User comes back
                if (backgroundTimeRef.current) {
                    const timeAway = Date.now() - backgroundTimeRef.current;
                    if (timeAway >= LOGOUT_TIME_MS) {
                        handleLogout();
                    } else {
                        resetTimer(); // Resume normal inactivity timer
                    }
                }
                backgroundTimeRef.current = null;
            }
        });

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            subscription.remove();
        };
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponderCapture: () => {
                resetTimer();
                return false;
            },
            onMoveShouldSetPanResponderCapture: () => {
                resetTimer();
                return false;
            },
            onPanResponderTerminationRequest: () => true,
        })
    ).current;

    return (
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
            {children}
        </View>
    );
};
