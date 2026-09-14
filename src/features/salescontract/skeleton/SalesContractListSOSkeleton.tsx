import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function SalesContractListSOSkeleton() {
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
        <View className="flex-1 p-4 bg-gray-50">
            {[1, 2, 3, 4, 5].map((item) => (
                <Animated.View 
                    key={item} 
                    style={[animatedStyle, { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }]}
                    className="bg-white p-4 rounded-2xl mb-3 flex-row items-center"
                >
                    {/* Circle Icon */}
                    <View className="w-12 h-12 bg-gray-200 rounded-full mr-4" />
                    
                    <View className="flex-1">
                        {/* Top row: Customer Name and Badge */}
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="h-5 bg-gray-200 rounded-md w-1/2" />
                            <View className="h-5 bg-gray-200 rounded-md w-16" />
                        </View>
                        
                        {/* Bottom row: Date and Code */}
                        <View className="flex-row items-center justify-between mt-1">
                            <View className="h-4 bg-gray-200 rounded-full w-24" />
                            <View className="h-4 bg-gray-200 rounded-full w-20" />
                        </View>
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}
