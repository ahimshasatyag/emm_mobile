import React from 'react';
import { View } from 'react-native';
import Animated, { withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export function EmployeeFormSkeleton() {
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
        <View>
            <Animated.View 
                style={[
                    pulseStyle, 
                    { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }
                ]} 
                className="bg-white p-5 rounded-3xl border border-gray-100 mb-6"
            >
                {[...Array(6)].map((_, i) => (
                    <View key={i} className="mb-4">
                        <View className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                        <View className="h-12 bg-gray-100 rounded-xl w-full" />
                    </View>
                ))}
            </Animated.View>
            
            <Animated.View style={pulseStyle}>
                <View className="w-full h-14 bg-gray-200 rounded-2xl" />
            </Animated.View>
        </View>
    );
}
