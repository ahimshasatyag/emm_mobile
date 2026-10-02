import React from 'react';
import { View } from 'react-native';
import Animated, { withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export function ProductsnListSkeleton() {
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
        <View className="px-6 pb-20 pt-6">
            {[...Array(6)].map((_, i) => (
                <Animated.View 
                    key={i} 
                    style={[
                        pulseStyle,
                        { elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }
                    ]}
                    className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center"
                >
                    <View className="w-12 h-12 rounded-xl bg-gray-200 mr-4" />
                    <View className="flex-1">
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="h-6 bg-gray-200 rounded w-1/2" />
                            <View className="h-6 bg-gray-200 rounded-md w-1/4" />
                        </View>
                        <View className="flex-row items-center mt-1 bg-gray-100 p-2 rounded-lg border border-gray-100">
                            <View className="w-4 h-4 bg-gray-200 rounded mr-2" />
                            <View className="h-4 bg-gray-200 rounded w-1/2" />
                        </View>
                    </View>
                    <View className="w-8 h-8 rounded-full bg-gray-100 ml-3" />
                </Animated.View>
            ))}
        </View>
    );
}
