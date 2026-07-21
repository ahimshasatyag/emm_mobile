import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const WhatsappChatListSkeleton = () => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 px-4 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <View key={i} className="flex-row items-center p-3 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <View className="w-12 h-12 rounded-full bg-gray-200 animate-pulse mr-3" />
                    <View className="flex-1">
                        <View className="h-4 bg-gray-200 rounded w-2/3 mb-2 animate-pulse" />
                        <View className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
};

export const WhatsappChatRoomSkeleton = () => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 p-4">
            {[1, 2, 3].map((i) => (
                <View key={i} className={`mb-4 max-w-[80%] ${i % 2 === 0 ? 'self-end' : 'self-start'}`}>
                    <View className="h-10 bg-gray-200 rounded-2xl w-48 animate-pulse" />
                </View>
            ))}
        </Animated.View>
    );
};

export const WhatsappChatLogSkeleton = () => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 px-4 pt-4">
            <View className="bg-white rounded-xl overflow-hidden border border-gray-200">
                {[1, 2, 3, 4, 5].map((i) => (
                    <View key={i} className="p-4 border-b border-gray-100 flex-row">
                        <View className="flex-1">
                            <View className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
                            <View className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                        </View>
                        <View className="w-20 h-6 bg-gray-200 rounded-full animate-pulse ml-2" />
                    </View>
                ))}
            </View>
        </Animated.View>
    );
};
