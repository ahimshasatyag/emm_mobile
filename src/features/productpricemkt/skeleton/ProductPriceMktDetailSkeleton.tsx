import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut, withRepeat, withSequence, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export function ProductPriceMktDetailSkeleton() {
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
            {/* Combined Info Skeleton */}
            <View className="bg-white rounded-2xl border mb-6 shadow-sm" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
                borderColor: '#F3F4F6',
            }}>
                {[1, 2, 3, 4, 5, 6, 7].map((i, idx) => (
                    <View key={i} className={`px-4 py-4 flex-row items-center ${idx < 6 ? 'border-b border-gray-100' : ''}`}>
                        <Animated.View style={animatedStyle} className="flex-[0.5] h-4 bg-gray-200 rounded-md" />
                        <View className="mr-2 w-2" />
                        <Animated.View style={animatedStyle} className="flex-1 h-4 bg-gray-200 rounded-md" />
                    </View>
                ))}
            </View>

            {/* Options Table Skeleton */}
            <View className="bg-white rounded-2xl border mb-6 shadow-sm" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
                borderColor: '#F3F4F6',
            }}>
                {/* Header */}
                <View className="flex-row bg-gray-100 rounded-t-2xl px-3 py-4 border-b border-gray-200">
                    <Animated.View style={animatedStyle} className="w-6 h-3 bg-gray-300 rounded-md mr-2" />
                    <Animated.View style={animatedStyle} className="flex-[1.5] h-3 bg-gray-300 rounded-md mr-2" />
                    <Animated.View style={animatedStyle} className="flex-1 h-3 bg-gray-300 rounded-md mr-2" />
                    <Animated.View style={animatedStyle} className="flex-1 h-3 bg-gray-300 rounded-md mr-2" />
                    <Animated.View style={animatedStyle} className="flex-[1.2] h-3 bg-gray-300 rounded-md" />
                </View>
                {/* Body */}
                {[1, 2].map((i, idx) => (
                    <View key={i} className={`flex-row px-3 py-4 items-center ${idx < 1 ? 'border-b border-gray-100' : ''}`}>
                        <Animated.View style={animatedStyle} className="w-6 h-3 bg-gray-200 rounded-md mr-2" />
                        <Animated.View style={animatedStyle} className="flex-[1.5] h-3 bg-gray-200 rounded-md mr-2" />
                        <Animated.View style={animatedStyle} className="flex-1 h-3 bg-gray-200 rounded-md mr-2" />
                        <Animated.View style={animatedStyle} className="flex-1 h-3 bg-gray-200 rounded-md mr-2" />
                        <Animated.View style={animatedStyle} className="flex-[1.2] h-3 bg-gray-200 rounded-md" />
                    </View>
                ))}
            </View>
        </Animated.View>
    );
}
