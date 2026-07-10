import React from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';

export function PoFormSkeleton() {
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
        <View className="flex-1 bg-gray-50">
            {/* Header skeleton */}
            <View className="bg-white px-4 py-4 border-b border-gray-100 flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-gray-200 mr-3" />
                <View className="h-5 w-40 bg-gray-200 rounded-md" />
            </View>

            <Animated.ScrollView 
                style={animatedStyle}
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
            >
                {/* Form fields skeleton */}
                {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} className="mb-4">
                        <View className="h-4 w-24 bg-gray-200 rounded-md mb-2" />
                        <View className="h-12 w-full bg-gray-200 rounded-xl border border-gray-100" />
                    </View>
                ))}

                {/* Table skeleton */}
                <View className="mt-4 mb-8">
                    <View className="h-5 w-32 bg-gray-200 rounded-md mb-3" />
                    <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-4">
                        <View className="flex-row justify-between pb-3 border-b border-gray-100">
                            <View className="h-4 w-1/3 bg-gray-200 rounded-md" />
                            <View className="h-4 w-1/4 bg-gray-200 rounded-md" />
                        </View>
                        {[1, 2].map((row) => (
                            <View key={`row-${row}`} className="flex-row justify-between py-2">
                                <View className="h-4 w-1/2 bg-gray-200 rounded-md" />
                                <View className="h-4 w-1/4 bg-gray-200 rounded-md" />
                            </View>
                        ))}
                    </View>
                </View>
            </Animated.ScrollView>

            {/* Footer buttons skeleton */}
            <View className="bg-white px-4 py-4 border-t border-gray-100 flex-row justify-between space-x-3">
                <View className="flex-1 h-12 bg-gray-200 rounded-xl" />
                <View className="flex-1 h-12 bg-gray-200 rounded-xl" />
            </View>
        </View>
    );
}
