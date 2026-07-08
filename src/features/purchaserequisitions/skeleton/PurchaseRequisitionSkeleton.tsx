import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../../theme/theme';

export function PurchaseRequisitionSkeleton() {
    return (
        <Animated.View 
            entering={FadeIn} 
            exiting={FadeOut}
            className="flex-1"
        >
            {[1, 2, 3, 4, 5].map((item) => (
                <View 
                    key={item}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 mx-4"
                >
                    <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-gray-200" />
                            <View className="ml-3">
                                <View className="w-32 h-4 bg-gray-200 rounded-md mb-2" />
                                <View className="w-24 h-3 bg-gray-200 rounded-md" />
                            </View>
                        </View>
                        <View className="w-16 h-6 bg-gray-200 rounded-full" />
                    </View>
                    <View className="border-t border-gray-100 pt-3 flex-row justify-between">
                        <View className="w-20 h-3 bg-gray-200 rounded-md" />
                        <View className="w-20 h-3 bg-gray-200 rounded-md" />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
}
