import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';

export function IncshipmentEditSkeleton() {
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
        <Animated.View style={animatedStyle}>
            {/* Action buttons skeleton */}
            <View className="flex-row flex-wrap mb-4 space-x-2">
                <View className="h-9 w-32 bg-gray-200 rounded-lg mr-2 mb-2" />
                <View className="h-9 w-24 bg-gray-200 rounded-lg mr-2 mb-2" />
            </View>

            {/* Main Card combining Header Info and Details Table */}
            <View 
                className="bg-white rounded-3xl border border-gray-100 mb-6 overflow-hidden"
                style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 15 }}
            >
                {/* Header Info */}
                <View className="p-6 border-b border-gray-100">
                    <View className="flex-row justify-between mb-4 pb-4 border-b border-gray-100">
                        <View className="flex-1">
                            <View className="h-3 w-16 bg-gray-200 rounded-md mb-2" />
                            <View className="h-4 w-32 bg-gray-200 rounded-md" />
                        </View>
                        <View className="flex-1 items-end">
                            <View className="h-3 w-12 bg-gray-200 rounded-md mb-2" />
                            <View className="h-6 w-20 bg-gray-200 rounded-md" />
                        </View>
                    </View>
                    
                    {[1, 2, 3].map((row) => (
                        <View key={row} className="flex-row mb-3">
                            <View className="flex-1">
                                <View className="h-3 w-20 bg-gray-200 rounded-md mb-2" />
                                <View className="h-4 w-28 bg-gray-200 rounded-md" />
                            </View>
                            <View className="flex-1">
                                <View className="h-3 w-20 bg-gray-200 rounded-md mb-2" />
                                <View className="h-4 w-28 bg-gray-200 rounded-md" />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Details Table */}
                <View className="p-6">
                    <View className="h-4 w-32 bg-gray-200 rounded-md mb-4" />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="bg-white rounded-xl border border-gray-200 overflow-hidden min-w-[800px]">
                            <View className="flex-row bg-gray-50 p-3 border-b border-gray-200">
                                {[1, 2, 3, 4, 5, 6].map((h) => (
                                    <View key={h} className="h-3 w-20 bg-gray-200 rounded-md mr-12" />
                                ))}
                            </View>
                            {[1, 2, 3].map((row) => (
                                <View key={row} className="flex-col border-b border-gray-100">
                                    <View className="flex-row p-3 items-center">
                                        {[1, 2, 3, 4, 5, 6].map((c) => (
                                            <View key={c} className="h-4 w-20 bg-gray-200 rounded-md mr-12" />
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Animated.View>
    );
}
