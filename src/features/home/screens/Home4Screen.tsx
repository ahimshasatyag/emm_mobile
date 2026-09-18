import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View, RefreshControl } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HomeHeader } from '../components/HomeHeader';
import { DashboardSkeleton } from '../skeleton/DashboardSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';

export function Home4Screen() {
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        try {
            // Mock refresh delay
            await new Promise(resolve => setTimeout(resolve, 800));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await handleRefresh();
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
        }, [handleRefresh])
    );

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
                    {(isLoading || isInitializing) ? (
                        <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                            <DashboardSkeleton />
                        </Animated.View>
                    ) : (
                        <Animated.View key="content" entering={FadeIn.duration(600)}>
                            <EmptyState
                                title="Dashboard"
                                message="Belum ada data untuk ditampilkan di dashboard ini."
                                fullScreen={false}
                            />
                        </Animated.View>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}
