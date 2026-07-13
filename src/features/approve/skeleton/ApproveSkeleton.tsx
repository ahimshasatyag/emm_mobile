import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    withDelay
} from 'react-native-reanimated';

export const ApproveSkeleton = ({ hideHeader = false, type = 'quotations' }: { hideHeader?: boolean, type?: 'quotations' | 'accounting' | 'history' }) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 1000 }),
                withTiming(0.3, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const renderSkeletonRow = (key: number, delayMs: number = 0) => {
        const itemOpacity = useSharedValue(0.3);

        useEffect(() => {
            itemOpacity.value = withDelay(
                delayMs,
                withRepeat(
                    withSequence(
                        withTiming(0.7, { duration: 1000 }),
                        withTiming(0.3, { duration: 1000 })
                    ),
                    -1,
                    true
                )
            );
        }, [delayMs]);

        const rowAnimatedStyle = useAnimatedStyle(() => ({
            opacity: itemOpacity.value,
        }));

        const renderQuotationsRow = () => (
            <>
                <View className="flex-row justify-between mb-3">
                    <View className="h-5 w-32 bg-gray-200 rounded-md" />
                    <View className="h-5 w-24 bg-gray-200 rounded-md" />
                </View>
                <View className="h-4 w-3/4 bg-gray-200 rounded-md mb-2" />
                <View className="h-4 w-1/2 bg-gray-200 rounded-md mb-4" />
                
                <View className="flex-row justify-end space-x-2">
                    <View className="h-9 w-20 bg-gray-200 rounded-lg" />
                    <View className="h-9 w-20 bg-gray-200 rounded-lg ml-2" />
                </View>
            </>
        );

        const renderAccountingRow = () => (
            <>
                <View className="flex-row justify-between items-start mb-2">
                    <View>
                        <View className="h-3 w-20 bg-gray-200 rounded-md mb-2" />
                        <View className="h-4 w-32 bg-gray-200 rounded-md" />
                    </View>
                    <View className="h-6 w-24 bg-gray-200 rounded-md" />
                </View>
                
                <View className="mb-3">
                    <View className="h-4 w-40 bg-gray-200 rounded-md mb-2" />
                    <View className="h-8 w-full bg-gray-200 rounded-md" />
                </View>

                <View className="flex-row justify-end pt-3 border-t border-gray-100">
                    <View className="h-9 w-20 bg-gray-200 rounded-lg" />
                    <View className="h-9 w-20 bg-gray-200 rounded-lg ml-2" />
                </View>
            </>
        );

        const renderHistoryRow = () => (
            <View className="flex-row items-center">
                <View className="flex-1">
                    <View className="flex-row justify-between mb-2">
                        <View className="h-3 w-20 bg-gray-200 rounded-md" />
                        <View className="h-3 w-16 bg-gray-200 rounded-md" />
                    </View>
                    <View className="h-4 w-32 bg-gray-200 rounded-md mb-2" />
                    <View className="h-3 w-24 bg-gray-200 rounded-md mb-2" />
                    <View className="h-3 w-40 bg-gray-200 rounded-md" />
                </View>
                <View className="ml-3">
                    <View className="h-8 w-20 bg-gray-200 rounded-full" />
                </View>
            </View>
        );

        return (
            <Animated.View
                key={key}
                className="bg-white rounded-xl mb-4 border border-gray-100 p-4"
                style={[{
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10
                }, rowAnimatedStyle]}
            >
                {type === 'quotations' && renderQuotationsRow()}
                {type === 'accounting' && renderAccountingRow()}
                {type === 'history' && renderHistoryRow()}
            </Animated.View>
        );
    };

    return (
        <View className={hideHeader ? "flex-1" : "flex-1 bg-white p-4"}>
            {!hideHeader && (
                <Animated.View style={animatedStyle} className="mb-4">
                    <View className="h-10 w-full bg-gray-200 rounded-xl" />
                </Animated.View>
            )}
            {[1, 2, 3, 4, 5].map((item, index) => renderSkeletonRow(item, index * 100))}
        </View>
    );
};
