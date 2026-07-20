import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const ListPaymentSkeleton = () => {
    const fadeAnim = React.useRef(new Animated.Value(0.3)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <View>
            {[1, 2, 3, 4, 5].map((item, index) => (
                <Animated.View 
                    key={item} 
                    style={{ opacity: fadeAnim }}
                    className={`flex-row border-b border-gray-200 border-x py-3 px-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                    <View className="w-12 px-2 items-center"><View className="h-4 w-6 bg-gray-200 rounded" /></View>
                    <View className="w-24 px-2 items-center"><View className="h-4 w-16 bg-gray-200 rounded" /></View>
                    <View className="w-24 px-2 items-center"><View className="h-4 w-16 bg-gray-200 rounded" /></View>
                    <View className="w-32 px-2"><View className="h-4 w-24 bg-gray-200 rounded" /></View>
                    <View className="w-40 px-2"><View className="h-4 w-32 bg-gray-200 rounded" /></View>
                    <View className="w-32 px-2"><View className="h-4 w-24 bg-gray-200 rounded" /></View>
                    <View className="w-24 px-2 items-center"><View className="h-4 w-10 bg-gray-200 rounded" /></View>
                    <View className="w-24 px-2 items-end"><View className="h-4 w-20 bg-gray-200 rounded" /></View>
                    <View className="w-16 px-2 items-center"><View className="h-4 w-8 bg-gray-200 rounded" /></View>
                    <View className="w-28 px-2 items-end"><View className="h-4 w-24 bg-gray-200 rounded" /></View>
                    <View className="w-32 px-2 items-center"><View className="h-4 w-24 bg-gray-200 rounded" /></View>
                    <View className="w-48 px-2"><View className="h-4 w-40 bg-gray-200 rounded" /></View>
                    <View className="w-32 px-2"><View className="h-4 w-24 bg-gray-200 rounded" /></View>
                    <View className="w-32 px-2"><View className="h-4 w-24 bg-gray-200 rounded" /></View>
                    <View className="w-32 px-2"><View className="h-4 w-24 bg-gray-200 rounded" /></View>
                </Animated.View>
            ))}
        </View>
    );
};

export const ListPaymentSummaryTableRowSkeleton = ({ section }: { section: 'bln' | 'ytd' }) => {
    const fadeAnim = React.useRef(new Animated.Value(0.3)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 0.3, duration: 800, useNativeDriver: true })
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View style={{ opacity: fadeAnim }}>
            {[1, 2, 3, 4].map((item, index) => (
                <View key={`${section}-${item}`} className={`flex-row border-b border-gray-200 bg-white`}>
                    <View style={{ flex: 2 }} className="flex-row p-2 border-r border-gray-200 items-center">
                        <View className="h-4 w-24 bg-gray-200 rounded flex-1 mr-2" />
                        {index < 3 && <View className="h-4 w-8 bg-gray-200 rounded border-l border-gray-200 pl-2" />}
                    </View>
                    <View style={{ flex: 0.5 }} className="p-2 border-r border-gray-200 items-end justify-center">
                        <View className="h-4 w-8 bg-gray-200 rounded" />
                    </View>
                    <View style={{ flex: 1.5 }} className="p-2 border-r border-gray-200 items-end justify-center">
                        <View className="h-4 w-20 bg-gray-200 rounded" />
                    </View>
                </View>
            ))}
        </Animated.View>
    );
};
