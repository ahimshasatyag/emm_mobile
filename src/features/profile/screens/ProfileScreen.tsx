import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, FadeIn, FadeOut } from 'react-native-reanimated';
import { useProfileData } from '../hooks/useProfileData';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData, setLoading, setError } from '../store/profileSlice';
import { fetchProfileDataApi } from '../api/profile.api';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ProfileTopCard } from '../components/ProfileTopCard';
import { ProfileInfoCard } from '../components/ProfileInfoCard';
import { ProfileSkeleton } from '../skeleton/ProfileSkeleton';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';
import { theme } from '../../../theme/theme';

export function ProfileScreen() {
    const { data, isLoading, error } = useProfileData();

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

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(30);

    React.useEffect(() => {
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
            const result = await fetchProfileDataApi();
            dispatch(setData(result));
        } catch (e: any) {
            dispatch(setError(e.message));
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HeaderNavigator isLoading={isLoading} />
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                }
            >
                <Animated.View style={animatedStyle} className="flex-1">
                    {error ? (
                        <ErrorState 
                            title="Gagal Memuat Profil" 
                            message={error} 
                            onRetry={handleRefresh} 
                            fullScreen={false} 
                        />
                    ) : (isLoading || isInitializing) ? (
                        <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                            <ProfileSkeleton />
                        </Animated.View>
                    ) : !data ? (
                        <EmptyState 
                            title="Profil Kosong" 
                            message="Tidak ada data profil untuk ditampilkan saat ini." 
                            fullScreen={false} 
                        />
                    ) : (
                        <View className="pb-10">
                            <ProfileTopCard data={data} />
                            <ProfileInfoCard data={data} />
                        </View>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}
