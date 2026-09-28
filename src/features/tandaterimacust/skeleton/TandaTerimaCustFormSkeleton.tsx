import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export const TandaTerimaCustFormSkeleton = () => {
    const opacityAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.4,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacityAnim]);

    return (
        <Animated.View style={{ opacity: opacityAnim }}>
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">

                {/* Field Customer */}
                <View className="mb-4">
                    <View className="h-4 w-24 bg-gray-200 rounded mb-1.5" />
                    <View className="h-[50px] w-full bg-gray-100 rounded-lg" />
                </View>

                {/* Field Tanggal */}
                <View className="mb-4">
                    <View className="h-4 w-20 bg-gray-200 rounded mb-1.5" />
                    <View className="h-[50px] w-full bg-gray-100 rounded-lg" />
                </View>

                {/* Field Keterangan */}
                <View className="mb-4">
                    <View className="h-4 w-28 bg-gray-200 rounded mb-1.5" />
                    <View className="h-[50px] w-full bg-gray-100 rounded-lg" />
                </View>

                {/* File Section */}
                <View className="mt-2 border-t border-gray-100 pt-2 -mx-4 px-4">
                    <View className="flex-row justify-between items-center mb-4 mt-2">
                        <View className="h-6 w-32 bg-gray-200 rounded" />
                        <View className="h-8 w-28 bg-gray-200 rounded" />
                    </View>
                    {[1, 2].map(i => (
                        <View key={i} className="h-16 w-full bg-gray-100 rounded-lg mb-3" />
                    ))}
                </View>
            </View>
        </Animated.View>
    );
};
