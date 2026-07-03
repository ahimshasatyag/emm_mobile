import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, withRepeat, withTiming, useAnimatedStyle } from 'react-native-reanimated';

function SkeletonPlaceholder({ className, style }: { className?: string, style?: any }) {
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(withTiming(0.5, { duration: 800 }), -1, true),
    }));
    return <Animated.View className={`bg-gray-200 rounded-lg ${className}`} style={[animatedStyle, style]} />;
}

export function SOListSkeleton() {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1">
            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <View key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
                        <View className="flex-row justify-between items-center mb-2">
                            <SkeletonPlaceholder className="w-1/3 h-4" />
                            <SkeletonPlaceholder className="w-1/4 h-5 rounded-full" />
                        </View>
                        <SkeletonPlaceholder className="w-2/3 h-5 mb-2" />
                        <SkeletonPlaceholder className="w-1/2 h-4 mb-2" />
                    </View>
                ))}
            </ScrollView>
        </Animated.View>
    );
}
