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

export function EmployeePosisiListSkeleton() {
    return (
        <View className="px-6 pt-2 pb-24">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <SkeletonItem key={item} index={index} />
            ))}
        </View>
    );
}

function SkeletonItem({ index }: { index: number }) {
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
        opacity.value = withDelay(
            index * 100,
            withRepeat(
                withSequence(
                    withTiming(0.7, { duration: 800 }),
                    withTiming(0.3, { duration: 800 })
                ),
                -1,
                true
            )
        );
    }, [index]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={animatedStyle}>
            <View 
                className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 15,
                    elevation: 2,
                }}
            >
                <View className="flex-row items-center">
                    {/* Icon Skeleton */}
                    <View className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
                    
                    <View className="flex-1">
                        {/* Title Skeleton */}
                        <View className="h-5 bg-gray-200 rounded-md w-3/4 mb-2" />
                        {/* Subtitle Skeleton */}
                        <View className="h-4 bg-gray-200 rounded-md w-1/2" />
                    </View>

                    {/* Arrow Skeleton */}
                    <View className="w-8 h-8 rounded-full bg-gray-50 ml-2 border border-gray-100" />
                </View>
            </View>
        </Animated.View>
    );
}
