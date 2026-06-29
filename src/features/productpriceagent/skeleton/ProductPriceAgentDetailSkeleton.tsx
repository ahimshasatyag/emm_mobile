import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut, withRepeat, withSequence, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export function ProductPriceAgentDetailSkeleton() {
    const opacity = useSharedValue(0.5);

    React.useEffect(() => {
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
        opacity: opacity.value
    }));

    return (
        <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(300)}>
            {/* Header Info Skeleton */}
            <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-4 shadow-sm" style={{ elevation: 2 }}>
                {[1, 2, 3, 4].map((i, idx) => (
                    <View key={i} className={`px-4 py-4 flex-row items-center ${idx < 3 ? 'border-b border-gray-100' : ''}`}>
                        <Animated.View style={animatedStyle} className="flex-[0.5] h-4 bg-gray-200 rounded-md" />
                        <View className="mr-2 w-2" />
                        <Animated.View style={animatedStyle} className="flex-1 h-4 bg-gray-200 rounded-md" />
                    </View>
                ))}
            </View>

            {/* Price Info Skeleton */}
            <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-6 shadow-sm" style={{ elevation: 2 }}>
                {[1, 2, 3].map((i, idx) => (
                    <View key={i} className={`px-4 py-4 flex-row items-center ${idx < 2 ? 'border-b border-gray-100' : ''}`}>
                        <Animated.View style={animatedStyle} className="flex-[0.5] h-4 bg-gray-200 rounded-md" />
                        <View className="mr-2 w-2" />
                        <Animated.View style={animatedStyle} className="flex-1 h-4 bg-gray-200 rounded-md" />
                    </View>
                ))}
            </View>
            
            {/* Action Buttons Skeleton */}
            <View className="flex-row">
                <Animated.View style={animatedStyle} className="flex-1 h-12 bg-gray-200 rounded-xl mr-2" />
                <Animated.View style={animatedStyle} className="flex-1 h-12 bg-gray-200 rounded-xl ml-2" />
            </View>
        </Animated.View>
    );
}
