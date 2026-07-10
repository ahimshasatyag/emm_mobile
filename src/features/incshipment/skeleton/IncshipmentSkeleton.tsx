import React from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';

export function IncshipmentSkeleton() {
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
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
        <View className="px-4 py-2">
            {[1, 2, 3, 4, 5].map((item) => (
                <Animated.View
                    key={item}
                    style={animatedStyle}
                    className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm"
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-3">
                        <View className="h-4 w-32 bg-gray-200 rounded-md" />
                        <View className="h-6 w-24 bg-gray-200 rounded-full" />
                    </View>

                    {/* Content */}
                    <View className="space-y-3">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-full bg-gray-200 mr-3" />
                            <View className="h-4 w-48 bg-gray-200 rounded-md" />
                        </View>
                        
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-full bg-gray-200 mr-3" />
                            <View className="h-4 w-40 bg-gray-200 rounded-md" />
                        </View>
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}
