import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card } from 'react-native-paper';
import { theme } from '../../../theme/theme';

export function LktListSkeleton() {
    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.4,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <View className="flex-1 bg-gray-50">
            {/* List Skeleton */}
            <View className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                    <Card key={item} style={{ backgroundColor: '#ffffff', marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: '#f3f4f6' }} elevation={0}>
                        <Card.Content>
                            <Animated.View style={{ opacity: fadeAnim }}>
                                {/* Header (lkt_code, cst_code, start_date vs status) */}
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-1 mr-3">
                                        <View className="h-4 w-3/4 bg-gray-200 rounded mb-1" />
                                        <View className="h-3 w-1/2 bg-gray-200 rounded mb-1" />
                                        <View className="h-3 w-2/3 bg-gray-200 rounded" />
                                    </View>
                                    <View className="h-5 w-16 bg-gray-200 rounded-md" />
                                </View>

                                <View className="h-px bg-gray-100 my-2" />

                                {/* Customer & Keterangan */}
                                <View className="flex-row justify-between items-end mb-2">
                                    <View className="flex-1">
                                        <View className="h-3 w-16 bg-gray-200 rounded mb-1" />
                                        <View className="h-4 w-24 bg-gray-200 rounded" />
                                    </View>
                                    <View className="flex-1 items-end">
                                        <View className="h-3 w-16 bg-gray-200 rounded mb-1" />
                                        <View className="h-4 w-24 bg-gray-200 rounded" />
                                    </View>
                                </View>

                                <View className="h-px bg-gray-100 my-2" />

                                {/* Grid Fields (4 rows of 2 columns) */}
                                <View className="flex-row flex-wrap">
                                    <View className="w-1/2 mb-3">
                                        <View className="h-3 w-16 bg-gray-200 rounded mb-1" />
                                        <View className="h-4 w-20 bg-gray-200 rounded" />
                                    </View>
                                    <View className="w-1/2 mb-3 pl-2">
                                        <View className="h-3 w-24 bg-gray-200 rounded mb-1" />
                                        <View className="h-4 w-20 bg-gray-200 rounded" />
                                    </View>
                                    
                                    <View className="w-1/2 mb-3">
                                        <View className="h-3 w-20 bg-gray-200 rounded mb-1" />
                                        <View className="h-4 w-24 bg-gray-200 rounded" />
                                    </View>
                                    <View className="w-1/2 mb-3 pl-2">
                                        <View className="h-3 w-24 bg-gray-200 rounded mb-1" />
                                        <View className="h-4 w-24 bg-gray-200 rounded" />
                                    </View>

                                    <View className="w-1/2 mb-3">
                                        <View className="h-3 w-24 bg-gray-200 rounded mb-1" />
                                        <View className="h-4 w-16 bg-gray-200 rounded" />
                                    </View>
                                    <View className="w-1/2 mb-3 pl-2">
                                        <View className="h-3 w-20 bg-gray-200 rounded mb-1" />
                                        <View className="h-4 w-16 bg-gray-200 rounded" />
                                    </View>

                                    <View className="w-1/2">
                                        <View className="h-3 w-12 bg-gray-200 rounded mb-1" />
                                        <View className="h-4 w-16 bg-gray-200 rounded" />
                                    </View>
                                    <View className="w-1/2 pl-2">
                                        <View className="h-3 w-12 bg-gray-200 rounded mb-1" />
                                        <View className="h-4 w-10 bg-gray-200 rounded" />
                                    </View>
                                </View>
                            </Animated.View>
                        </Card.Content>
                    </Card>
                ))}
            </View>
        </View>
    );
}
