import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface InfoRowProps {
    label: string;
    value: string;
}

export function InfoCard({ title, data, index }: { title: string, data: InfoRowProps[], index: number }) {
    return (
        <Animated.View 
            entering={FadeInUp.delay(index * 100).duration(400)}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4"
        >
            <Text className="text-sm font-extrabold text-gray-800 mb-4">{title}</Text>
            
            <View className="space-y-3">
                {data.map((item, idx) => (
                    <View key={idx} className="flex-row items-start">
                        <View className="w-[35%] pr-2">
                            <Text className="text-xs text-gray-500 font-medium">{item.label}</Text>
                        </View>
                        <View className="w-4">
                            <Text className="text-xs text-gray-400">:</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs text-gray-800 font-semibold">{item.value || '-'}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </Animated.View>
    );
}
