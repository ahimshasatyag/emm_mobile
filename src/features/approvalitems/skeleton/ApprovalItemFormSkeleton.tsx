import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

export function ApprovalItemFormSkeleton() {
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800 }),
                withTiming(0.5, { duration: 800 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={animatedStyle}>
            <View className="bg-white p-5 rounded-3xl border border-gray-100 mb-6" style={{ elevation: 2 }}>
                {/* Nama Approval */}
                <View className="w-1/3 h-4 bg-gray-200 rounded mb-2" />
                <View className="w-full h-12 bg-gray-200 rounded-xl mb-4" />

                {/* Deskripsi */}
                <View className="w-1/4 h-4 bg-gray-200 rounded mb-2" />
                <View className="w-full h-20 bg-gray-200 rounded-xl mb-4" />

                {/* Tipe Approval */}
                <View className="w-1/3 h-4 bg-gray-200 rounded mb-2" />
                <View className="flex-row gap-3 mb-4">
                    <View className="flex-1 h-12 bg-gray-200 rounded-xl" />
                    <View className="flex-1 h-12 bg-gray-200 rounded-xl" />
                </View>

                {/* Nama Modul */}
                <View className="w-1/3 h-4 bg-gray-200 rounded mb-2" />
                <View className="w-full h-12 bg-gray-200 rounded-xl mb-4" />

                <View className="h-[1px] bg-gray-100 w-full mb-4" />

                {/* Nama Tabel */}
                <View className="w-1/4 h-4 bg-gray-200 rounded mb-2" />
                <View className="w-full h-12 bg-gray-200 rounded-xl mb-4" />

                {/* Nama Kolom Status */}
                <View className="w-1/3 h-4 bg-gray-200 rounded mb-2" />
                <View className="w-full h-12 bg-gray-200 rounded-xl mb-4" />

                {/* Status Approve / Reject */}
                <View className="flex-row gap-3 mb-4">
                    <View className="flex-1">
                        <View className="w-1/2 h-4 bg-gray-200 rounded mb-2" />
                        <View className="w-full h-12 bg-gray-200 rounded-xl" />
                    </View>
                    <View className="flex-1">
                        <View className="w-1/2 h-4 bg-gray-200 rounded mb-2" />
                        <View className="w-full h-12 bg-gray-200 rounded-xl" />
                    </View>
                </View>

                <View className="h-[1px] bg-gray-100 w-full mb-4" />

                {/* Rule PHP */}
                <View className="w-1/4 h-4 bg-gray-200 rounded mb-2" />
                <View className="w-full h-24 bg-gray-200 rounded-xl mb-4" />

                {/* Level Approver Dropdown */}
                <View className="w-1/3 h-4 bg-gray-200 rounded mb-2" />
                <View className="w-full h-12 bg-gray-200 rounded-xl mb-2" />
            </View>

            {/* Save Button Skeleton */}
            <View className="w-full h-14 bg-gray-200 rounded-2xl" />
        </Animated.View>
    );
}
