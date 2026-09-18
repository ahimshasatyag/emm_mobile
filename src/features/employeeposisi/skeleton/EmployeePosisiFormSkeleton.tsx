import React from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
    withDelay
} from 'react-native-reanimated';

export function EmployeePosisiFormSkeleton() {
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
        opacity.value = withDelay(
            0,
            withRepeat(
                withSequence(
                    withTiming(0.7, { duration: 800 }),
                    withTiming(0.3, { duration: 800 })
                ),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={animatedStyle}>
            {/* Form Container */}
            <View
                className="bg-white rounded-3xl p-5 border border-gray-100 mb-4"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                }}
            >
                <View>
                    {/* Label Skeleton */}
                    <View className="h-4 bg-gray-200 rounded-md w-1/4 mb-3" />
                    {/* Input Skeleton */}
                    <View className="h-[52px] bg-gray-100 rounded-xl" />
                </View>
            </View>
        </Animated.View>
    );
}
