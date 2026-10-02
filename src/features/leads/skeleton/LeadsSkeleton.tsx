import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function LeadsSkeleton() {
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
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            {[1, 2, 3, 4, 5].map((item) => (
                <Animated.View 
                    key={item} 
                    style={[animatedStyle, {
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                    }]}
                    className="bg-white p-4 rounded-2xl mb-3 flex-row items-center"
                >
                    <View className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
                    <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                            <View className="h-4 bg-gray-200 rounded w-1/2 mr-2" />
                            <View className="h-5 bg-gray-200 rounded-md w-14" />
                        </View>
                        <View className="flex-row items-center mt-1">
                            <View className="w-3.5 h-3.5 rounded bg-gray-200 mr-1" />
                            <View className="h-3.5 bg-gray-200 rounded w-2/3" />
                        </View>
                    </View>
                </Animated.View>
            ))}
        </ScrollView>
    );
}
