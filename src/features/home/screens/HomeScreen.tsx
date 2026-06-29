import React, { useEffect , useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View, RefreshControl } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, FadeIn, FadeOut } from 'react-native-reanimated';

import { useHomeData } from '../hooks/useHomeData';
import { fetchHomeDataApi } from '../api/home.api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData, setLoading, setError } from '../store/homeSlice';
import { theme } from '../../../theme/theme';

import { HomeHeader } from '../components/HomeHeader';
import { DashboardRequestStats } from '../components/DashboardRequestStats';
import { DashboardAvailability } from '../components/DashboardAvailability';
import { DashboardWorkload } from '../components/DashboardWorkload';
import { DashboardLktTable } from '../components/DashboardLktTable';
import { DashboardKpi } from '../components/DashboardKpi';
import { DashboardProductStats } from '../components/DashboardProductStats';
import { DashboardSkeleton } from '../skeleton/DashboardSkeleton';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

export function HomeScreen() {
    const { data, isLoading, error } = useHomeData();

    const [isInitializing, setIsInitializing] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        handleRefresh(),
                        new Promise(resolve => setTimeout(resolve, 800))
                    ]);
                } catch (error) {
                    // console.error("Failed to load:", error);
                } finally {
                    if (isActive) {
                        setIsInitializing(false);
                    }
                }
            };

            initialize();

            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [])
    );
    const dispatch = useAppDispatch();
    
    // Animation Values for the entire screen
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(30);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) });
        translateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    const handleRefresh = async () => {
        dispatch(setLoading(true));
        try {
            const result = await fetchHomeDataApi();
            dispatch(setData(result));
        } catch (e: any) {
            dispatch(setError(e.message));
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HomeHeader isLoading={isLoading} />
            
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                }
            >
                <Animated.View style={animatedStyle}>
                    {error ? (
                        <ErrorState 
                            title="Gagal Memuat" 
                            message={error} 
                            onRetry={handleRefresh} 
                            fullScreen={false} 
                        />
                    ) : (isLoading || isInitializing) ? (
                        <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                            <DashboardSkeleton />
                        </Animated.View>
                    ) : !data ? (
                        <EmptyState 
                            title="Data Kosong" 
                            message="Tidak ada data untuk ditampilkan di dashboard." 
                            fullScreen={false} 
                        />
                    ) : (
                        <Animated.View key="content" entering={FadeIn.duration(600)}>
                            <DashboardRequestStats />
                            <DashboardAvailability />
                            <DashboardWorkload />
                            <DashboardLktTable />
                            <DashboardKpi />
                            <DashboardProductStats />
                        </Animated.View>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}
