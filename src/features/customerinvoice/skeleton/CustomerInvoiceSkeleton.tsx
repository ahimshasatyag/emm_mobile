import React, { useEffect } from 'react';
import { View } from 'react-native';
import { FileText } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

export const CustomerInvoiceSkeleton = () => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 800 }),
                withTiming(0.3, { duration: 800 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View className="px-4 pt-4 pb-20">
            {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
                    {/* Header */}
                    <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-row items-center flex-1">
                            <Animated.View style={animatedStyle} className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                                <FileText size={20} color="#D1D5DB" />
                            </Animated.View>
                            <View className="flex-1">
                                <Animated.View style={animatedStyle} className="h-3 w-24 bg-gray-200 rounded-md mb-1.5" />
                                <Animated.View style={animatedStyle} className="h-4 w-3/4 bg-gray-200 rounded-md" />
                            </View>
                        </View>
                        <Animated.View style={animatedStyle} className="h-6 w-16 bg-gray-200 rounded-full" />
                    </View>

                    {/* Middle Box */}
                    <View className="flex-row mb-3 bg-gray-50 rounded-xl p-3">
                        <View className="flex-1">
                            <View className="flex-row items-center mb-1.5">
                                <Animated.View style={animatedStyle} className="h-3 w-20 bg-gray-200 rounded-md ml-2" />
                            </View>
                            <View className="flex-row items-center">
                                <Animated.View style={animatedStyle} className="h-3 w-16 bg-gray-200 rounded-md ml-2" />
                            </View>
                        </View>
                        <View className="flex-1">
                            <View className="flex-row items-center mb-1.5">
                                <Animated.View style={animatedStyle} className="h-3 w-24 bg-gray-200 rounded-md ml-2" />
                            </View>
                            <View className="flex-row items-center">
                                <Animated.View style={animatedStyle} className="h-3 w-12 bg-gray-200 rounded-md ml-2" />
                            </View>
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="flex-row justify-between items-end border-t border-gray-100 pt-3">
                        <View>
                            <Animated.View style={animatedStyle} className="h-3 w-10 bg-gray-200 rounded-md mb-1.5" />
                            <Animated.View style={animatedStyle} className="h-4 w-28 bg-gray-200 rounded-md" />
                        </View>
                        <View className="items-end">
                            <Animated.View style={animatedStyle} className="h-3 w-12 bg-gray-200 rounded-md mb-1.5" />
                            <Animated.View style={animatedStyle} className="h-4 w-28 bg-gray-200 rounded-md" />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};
