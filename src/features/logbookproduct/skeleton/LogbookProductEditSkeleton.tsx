import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export function LogbookProductEditSkeleton() {
    const theme = useTheme();
    const colors = theme.colors as any;
    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.4,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View style={{ opacity: fadeAnim }}>
            <Card
                className="rounded-xl shadow-sm border border-gray-200 mb-4"
                style={{ backgroundColor: colors.surface }}
            >
                <Card.Content className="p-4">
                    <View className="space-y-4">
                        <View>
                            <View className="h-4 w-1/4 bg-gray-200 rounded mb-2" />
                            <View className="h-12 w-full bg-gray-100 rounded-lg" />
                        </View>
                        <View>
                            <View className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
                            <View className="h-12 w-full bg-gray-100 rounded-lg" />
                        </View>
                        <View>
                            <View className="h-4 w-1/4 bg-gray-200 rounded mb-2" />
                            <View className="h-12 w-full bg-gray-100 rounded-lg" />
                        </View>

                        <View className="h-px bg-gray-200 my-2" />

                        <View>
                            <View className="h-4 w-1/4 bg-gray-200 rounded mb-2" />
                            <View className="h-24 w-full bg-gray-100 rounded-lg" />
                        </View>
                        <View>
                            <View className="h-4 w-1/4 bg-gray-200 rounded mb-2" />
                            <View className="h-24 w-full bg-gray-100 rounded-lg" />
                        </View>
                        <View>
                            <View className="h-4 w-1/4 bg-gray-200 rounded mb-2" />
                            <View className="h-24 w-full bg-gray-100 rounded-lg" />
                        </View>
                    </View>
                    
                    <View className="flex-row space-x-2 mt-6">
                        <View className="flex-1 h-12 bg-gray-200 rounded-xl" />
                        <View className="flex-1 h-12 bg-gray-200 rounded-xl" />
                    </View>
                </Card.Content>
            </Card>
        </Animated.View>
    );
}
