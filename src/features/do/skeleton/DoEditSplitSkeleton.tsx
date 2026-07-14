import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

export const DoEditSplitSkeleton = () => {
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800 }),
                withTiming(0.5, { duration: 800 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={animatedStyle} className="p-4">
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
                {/* Info Pelanggan */}
                <View className="h-4 w-32 bg-gray-200 rounded-md mb-4" />
                
                <View className="mb-3">
                    <View className="h-3 w-16 bg-gray-200 rounded-md mb-2" />
                    <View className="h-4 w-48 bg-gray-200 rounded-md" />
                </View>
                <View className="mb-3">
                    <View className="h-3 w-16 bg-gray-200 rounded-md mb-2" />
                    <View className="h-4 w-full bg-gray-200 rounded-md" />
                </View>
                
                {/* Divider */}
                <View className="h-[1px] bg-gray-200 my-4 mx-[-16px]" />
                
                {/* Info Biaya Tambahan */}
                <View className="h-4 w-40 bg-gray-200 rounded-md mb-4" />
                
                <View className="mb-4">
                    <View className="h-3 w-24 bg-gray-200 rounded-md mb-2" />
                    <View className="flex-row items-center mb-2">
                        <View className="w-4 h-4 rounded-full bg-gray-200 mr-2" />
                        <View className="h-4 w-12 bg-gray-200 rounded-md" />
                    </View>
                    <View className="flex-row items-center mb-2">
                        <View className="w-4 h-4 rounded-full bg-gray-200 mr-2" />
                        <View className="h-4 w-32 bg-gray-200 rounded-md" />
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-4 h-4 rounded-full bg-gray-200 mr-2" />
                        <View className="h-4 w-48 bg-gray-200 rounded-md" />
                    </View>
                </View>

                <View>
                    <View className="h-3 w-24 bg-gray-200 rounded-md mb-2" />
                    <View className="flex-row items-center mb-2">
                        <View className="w-4 h-4 rounded-full bg-gray-200 mr-2" />
                        <View className="h-4 w-12 bg-gray-200 rounded-md" />
                    </View>
                    <View className="flex-row items-center mb-2">
                        <View className="w-4 h-4 rounded-full bg-gray-200 mr-2" />
                        <View className="h-4 w-40 bg-gray-200 rounded-md" />
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-4 h-4 rounded-full bg-gray-200 mr-2" />
                        <View className="h-4 w-48 bg-gray-200 rounded-md" />
                    </View>
                </View>

                {/* Divider */}
                <View className="h-[1px] bg-gray-200 my-4 mx-[-16px]" />
                
                {/* Jadwal dan Dokumen */}
                <View className="h-4 w-32 bg-gray-200 rounded-md mb-4" />

                <View className="mb-3 flex-row justify-between">
                    <View className="flex-1 mr-2">
                        <View className="h-3 w-24 bg-gray-200 rounded-md mb-2" />
                        <View className="h-4 w-28 bg-gray-200 rounded-md" />
                    </View>
                    <View className="flex-1">
                        <View className="h-3 w-24 bg-gray-200 rounded-md mb-2" />
                        <View className="h-4 w-28 bg-gray-200 rounded-md" />
                    </View>
                </View>

                <View className="mb-3">
                    <View className="h-3 w-28 bg-gray-200 rounded-md mb-2" />
                    <View className="h-4 w-32 bg-gray-200 rounded-md" />
                </View>

                <View className="mb-3">
                    <View className="h-3 w-28 bg-gray-200 rounded-md mb-2" />
                    <View className="h-4 w-full bg-gray-200 rounded-md" />
                </View>

                <View className="mb-3">
                    <View className="h-3 w-32 bg-gray-200 rounded-md mb-2" />
                    <View className="h-4 w-32 bg-gray-200 rounded-md" />
                </View>

                <View>
                    <View className="h-3 w-28 bg-gray-200 rounded-md mb-2" />
                    <View className="h-4 w-full bg-gray-200 rounded-md" />
                </View>

                {/* Divider */}
                <View className="h-[1px] bg-gray-200 my-4 mx-[-16px]" />
                
                {/* Daftar Barang */}
                <View className="h-4 w-32 bg-gray-200 rounded-md mb-4" />
                
                <View className="mx-[-16px]">
                    <View className="flex-row bg-gray-100 border-b border-gray-200 overflow-hidden">
                        <View className="w-16 p-3 border-r border-gray-200 justify-center items-center">
                            <View className="h-3 w-8 bg-gray-300 rounded-md" />
                        </View>
                        <View className="w-32 p-3 border-r border-gray-200 justify-center">
                            <View className="h-3 w-20 bg-gray-300 rounded-md" />
                        </View>
                        <View className="w-48 p-3 border-r border-gray-200 justify-center">
                            <View className="h-3 w-24 bg-gray-300 rounded-md" />
                        </View>
                        <View className="w-20 p-3 border-r border-gray-200 justify-center items-center">
                            <View className="h-3 w-8 bg-gray-300 rounded-md" />
                        </View>
                        <View className="w-24 p-3 border-r border-gray-200 justify-center items-center">
                            <View className="h-3 w-12 bg-gray-300 rounded-md" />
                        </View>
                    </View>
                    
                    {[1, 2, 3].map((item, index) => (
                        <View key={item} className={`flex-row border-b border-gray-100 overflow-hidden ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <View className="w-16 p-3 border-r border-gray-100 justify-center items-center">
                                <View className="h-4 w-4 bg-gray-200 rounded-sm" />
                            </View>
                            <View className="w-32 p-3 border-r border-gray-100 justify-center">
                                <View className="h-4 w-20 bg-gray-200 rounded-md" />
                            </View>
                            <View className="w-48 p-3 border-r border-gray-100 justify-center">
                                <View className="h-4 w-32 bg-gray-200 rounded-md" />
                            </View>
                            <View className="w-20 p-3 border-r border-gray-100 justify-center items-center">
                                <View className="h-4 w-8 bg-gray-200 rounded-md" />
                            </View>
                            <View className="w-24 p-3 border-r border-gray-100 justify-center items-center">
                                <View className="h-4 w-12 bg-gray-200 rounded-md" />
                            </View>
                        </View>
                    ))}
                </View>

            </View>
        </Animated.View>
    );
};
