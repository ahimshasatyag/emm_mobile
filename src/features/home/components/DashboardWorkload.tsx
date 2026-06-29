import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { workloadPP, workloadPL } from '../data/mockDashboard';
import { theme } from '../../../theme/theme';

const AnimatedProgressBar = ({ percentage, color, delay }: { percentage: number, color: string, delay: number }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(delay, withTiming(percentage, {
            duration: 1200,
            easing: Easing.out(Easing.exp)
        }));
    }, [percentage, delay]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value}%`,
        };
    });

    return (
        <View className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <Animated.View 
                className="h-full rounded-full" 
                style={[animatedStyle, { backgroundColor: color }]} 
            />
        </View>
    );
};

export function DashboardWorkload() {
    const renderWorkload = (title: string, data: any[], color: string, sectionIndex: number) => (
        <Animated.View 
            entering={FadeInUp.delay(300 + (sectionIndex * 200)).duration(600).springify()}
            className="bg-white border border-gray-100 p-6 mb-6 w-full shadow-sm"
            style={{ borderRadius: 24, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 }}
            key={title}
        >
            <View className="flex-row items-center mb-6">
                <View className="w-2 h-6 rounded-full mr-3" style={{ backgroundColor: color }} />
                <Text className="text-[15px] font-extrabold text-gray-800">{title}</Text>
            </View>
            
            <View className="flex-col">
                {data.map((tech, index) => (
                    <Animated.View 
                        key={index} 
                        entering={FadeInRight.delay(400 + (sectionIndex * 200) + (index * 100)).duration(500).springify()}
                        className="mb-5"
                    >
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-[13px] font-bold text-gray-700">{tech.name}</Text>
                            <Text className="text-[13px] font-extrabold" style={{ color }}>{tech.percentage}%</Text>
                        </View>
                        <AnimatedProgressBar percentage={tech.percentage} color={color} delay={500 + (sectionIndex * 200) + (index * 100)} />
                    </Animated.View>
                ))}
            </View>
        </Animated.View>
    );

    return (
        <View className="px-6 mt-2">
            {renderWorkload('Workload Teknisi Print Pack', workloadPP, theme.colors.primary, 0)}
            {renderWorkload('Workload Teknisi Plastic', workloadPL, '#14b8a6', 1)}
        </View>
    );
}
