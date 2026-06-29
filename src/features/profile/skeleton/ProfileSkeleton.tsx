import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';

export function ProfileSkeleton() {
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
        <Animated.View style={animatedStyle} className="flex-1">
            {/* Skeleton Profile Top Card */}
            <View 
                className="mx-6 mt-6 bg-white rounded-3xl p-6 border border-gray-100 items-center relative"
                style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 }}
            >
                <View className="w-24 h-24 rounded-full bg-gray-200 mb-4 mt-2" />
                <View className="w-48 h-8 bg-gray-200 rounded-lg mb-4" />
                <View className="w-32 h-6 bg-gray-200 rounded-full mb-4" />
                <View className="w-full h-10 bg-gray-200 rounded-xl" />
            </View>

            {/* Skeleton Info Card */}
            <View 
                className="mx-6 mt-6 bg-white rounded-3xl p-5 border border-gray-100"
                style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 }}
            >
                <View className="w-40 h-6 bg-gray-200 rounded-lg mb-6" />
                
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <View key={i} className={`flex-row items-center py-4 ${i !== 6 ? 'border-b border-gray-100' : ''}`}>
                        <View className="w-10 h-10 rounded-full bg-gray-200 mr-4" />
                        <View className="flex-1">
                            <View className="w-24 h-3 bg-gray-200 rounded mb-2" />
                            <View className="w-full h-4 bg-gray-200 rounded" />
                        </View>
                    </View>
                ))}
            </View>

            {/* Skeleton Actions */}
            <View className="mx-6 mt-6 mb-8">
                <View className="w-40 h-6 bg-gray-200 rounded-lg mb-4" />
                {[1, 2, 3].map((i) => (
                    <View key={i} className="flex-row items-center bg-white p-4 rounded-2xl mb-3 border border-gray-100">
                        <View className="w-10 h-10 rounded-full bg-gray-200 mr-4" />
                        <View className="w-32 h-5 bg-gray-200 rounded" />
                    </View>
                ))}
            </View>
        </Animated.View>
    );
}
