import React from 'react';
import { View } from 'react-native';
import Animated, { withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export function EmployeeListSkeleton() {
    const pulseStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(
            withSequence(
                withTiming(0.4, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        ),
    }));

    return (
        <View className="px-6 pb-20">
            {[...Array(5)].map((_, i) => (
                <Animated.View 
                    key={i} 
                    style={[
                        pulseStyle,
                        { elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }
                    ]}
                    className="bg-white p-4 rounded-2xl mb-4 flex-row items-center border border-gray-100"
                >
                    <View className="w-14 h-14 rounded-full bg-gray-100 mr-4" />
                    <View className="flex-1 mr-2">
                        <View className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                        <View className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                        <View className="flex-row items-center justify-between">
                            <View className="h-3 bg-gray-100 rounded w-1/3" />
                            <View className="h-4 bg-gray-100 rounded w-12" />
                        </View>
                    </View>
                    <View className="w-5 h-5 rounded-full bg-gray-100" />
                </Animated.View>
            ))}
        </View>
    );
}
