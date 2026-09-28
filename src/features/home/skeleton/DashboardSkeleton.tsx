import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export const DashboardSkeleton = () => {
    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.4,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View style={{ opacity: fadeAnim }} className="px-6 py-6">
            {/* Header Text Skeleton */}
            <View className="w-40 h-6 bg-gray-200 rounded-full mb-4" />
            
            {/* Horizontal Stats Skeleton */}
            <View className="flex-row mb-8">
                <View className="w-44 h-28 bg-gray-200 rounded-3xl mr-4" />
                <View className="w-44 h-28 bg-gray-200 rounded-3xl mr-4" />
                <View className="w-44 h-28 bg-gray-200 rounded-3xl" />
            </View>
            
            {/* Availability Card Skeleton */}
            <View className="w-32 h-6 bg-gray-200 rounded-full mb-4" />
            <View className="h-48 bg-gray-200 rounded-3xl mb-8" />
            
            {/* Workload Card Skeleton */}
            <View className="w-40 h-6 bg-gray-200 rounded-full mb-4" />
            <View className="h-64 bg-gray-200 rounded-3xl mb-8" />

            {/* LKT Table Skeleton */}
            <View className="w-48 h-6 bg-gray-200 rounded-full mb-4" />
            <View className="h-56 bg-gray-200 rounded-3xl" />
        </Animated.View>
    );
};
