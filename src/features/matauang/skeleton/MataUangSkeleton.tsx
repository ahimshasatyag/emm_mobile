import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export const MataUangSkeleton = () => {
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                <Animated.View 
                    key={item} 
                    style={{ opacity: fadeAnim }}
                    className={`flex-row border-b border-gray-200 border-x py-4 px-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                    <View className="w-24 px-2 items-center"><View className="h-4 w-12 bg-gray-200 rounded" /></View>
                    <View className="w-40 px-2 items-end"><View className="h-4 w-24 bg-gray-200 rounded" /></View>
                    <View className="w-40 px-2 items-end"><View className="h-4 w-24 bg-gray-200 rounded" /></View>
                    <View className="w-48 px-2 items-center"><View className="h-4 w-32 bg-gray-200 rounded" /></View>
                </Animated.View>
            ))}
        </View>
    );
};
