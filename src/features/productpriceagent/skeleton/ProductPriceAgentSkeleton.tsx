import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut, withRepeat, withSequence, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export function ProductPriceAgentListSkeleton() {
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
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm" style={{ elevation: 2 }}>
                <View className="flex-row items-start mb-4">
                    <Animated.View style={animatedStyle} className="w-12 h-12 rounded-xl bg-gray-200 mr-3" />
                    <View className="flex-1 justify-center">
                        <Animated.View style={animatedStyle} className="w-2/3 h-4 bg-gray-200 rounded-md mb-2" />
                        <Animated.View style={animatedStyle} className="w-full h-3 bg-gray-200 rounded-md mb-2" />
                        <Animated.View style={animatedStyle} className="w-1/2 h-3 bg-gray-200 rounded-md" />
                    </View>
                </View>

                <View className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <View className="flex-row mb-2">
                        <Animated.View style={animatedStyle} className="flex-1 h-14 bg-white rounded-lg mr-2" />
                        <Animated.View style={animatedStyle} className="flex-1 h-14 bg-white rounded-lg" />
                    </View>
                    <View className="flex-row">
                        <Animated.View style={animatedStyle} className="flex-1 h-14 bg-white rounded-lg mr-2" />
                        <Animated.View style={animatedStyle} className="flex-1 h-14 bg-white rounded-lg" />
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}
