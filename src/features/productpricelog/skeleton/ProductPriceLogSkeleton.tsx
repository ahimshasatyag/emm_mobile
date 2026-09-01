import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';

export function ProductPriceLogSkeleton() {
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(
            withSequence(
                withTiming(0.5, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        ),
    }));

    return (
        <View className="flex-1 pb-4">
            {[1, 2, 3, 4, 5].map((item) => (
                <Animated.View 
                    key={item} 
                    style={[animatedStyle, {
                        shadowColor: theme.colors.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.05,
                        shadowRadius: 10,
                        elevation: 2,
                    }]}
                    className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
                >
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                            <View className="h-5 w-32 bg-gray-200 rounded mb-2" />
                            <View className="h-4 w-24 bg-gray-100 rounded" />
                        </View>
                        <View className="h-8 w-24 bg-indigo-50 rounded-lg border border-indigo-50" />
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}
