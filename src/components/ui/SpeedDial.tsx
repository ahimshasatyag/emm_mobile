import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withTiming,
    interpolate,
    Extrapolate,
    ZoomIn
} from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';
import { theme } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

export interface SpeedDialAction {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
}

interface SpeedDialProps {
    actions: SpeedDialAction[];
}

export function SpeedDial({ actions }: SpeedDialProps) {
    const [isOpen, setIsOpen] = useState(false);
    const animation = useSharedValue(0);

    const toggleDial = () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        animation.value = nextState 
            ? withSpring(1, { damping: 15, stiffness: 150 })
            : withTiming(0, { duration: 200 });
    };

    const mainButtonStyle = useAnimatedStyle(() => {
        const rotation = interpolate(animation.value, [0, 1], [0, 45], Extrapolate.CLAMP);
        return {
            transform: [{ rotate: `${rotation}deg` }]
        };
    });

    const overlayStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
            zIndex: isOpen ? 998 : -1
        };
    });

    return (
        <>
            {/* Overlay */}
            <Animated.View 
                style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255,255,255,0.8)', opacity: 0 }, overlayStyle]} 
                pointerEvents={isOpen ? 'auto' : 'none'}
            >
                <TouchableWithoutFeedback onPress={toggleDial}>
                    <View style={StyleSheet.absoluteFillObject} />
                </TouchableWithoutFeedback>
            </Animated.View>

            {/* Container for actions and main button */}
            <Animated.View 
                className="absolute items-end z-[999] bottom-[70px] right-10"
                pointerEvents="box-none"
            >
                {/* Actions */}
                <View className="items-end mb-4" pointerEvents={isOpen ? 'box-none' : 'none'}>
                    {actions.map((action, index) => {
                        // Calculate delay based on index (bottom to top)
                        const position = actions.length - index;
                        
                        const actionStyle = useAnimatedStyle(() => {
                            const translateY = interpolate(
                                animation.value,
                                [0, 1],
                                [position * 20, 0], // Move up slightly when appearing
                                Extrapolate.CLAMP
                            );
                            const opacity = interpolate(
                                animation.value,
                                [0, 1],
                                [0, 1],
                                Extrapolate.CLAMP
                            );
                            const scale = interpolate(
                                animation.value,
                                [0, 1],
                                [0.5, 1],
                                Extrapolate.CLAMP
                            );
                            
                            return {
                                opacity,
                                transform: [
                                    { translateY },
                                    { scale }
                                ]
                            };
                        });

                        return (
                            <Animated.View 
                                key={index} 
                                className="flex-row items-center mb-4"
                                style={[{ opacity: 0 }, actionStyle]}
                            >
                                <TouchableOpacity 
                                    activeOpacity={0.8}
                                    className="bg-white px-3 py-1.5 rounded-md mr-4 shadow-sm"
                                    style={{
                                        elevation: 3,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 2,
                                    }}
                                    onPress={() => {
                                        toggleDial();
                                        action.onPress();
                                    }}
                                >
                                    <Text className="text-gray-700 text-sm font-medium">{action.label}</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    className="w-12 h-12 rounded-full items-center justify-center shadow-md"
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        elevation: 4,
                                        shadowColor: theme.colors.primary,
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 4,
                                    }}
                                    onPress={() => {
                                        toggleDial();
                                        action.onPress();
                                    }}
                                >
                                    {action.icon}
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>

                {/* Main FAB */}
                <Animated.View entering={ZoomIn.delay(300).springify()}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={toggleDial}
                    className="rounded-full shadow-lg"
                    style={{
                        elevation: 6,
                        shadowColor: theme.colors.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                    }}
                >
                    <Animated.View 
                        className="w-14 h-14 rounded-full items-center justify-center"
                        style={[{ backgroundColor: theme.colors.primary }, mainButtonStyle]}
                    >
                        <Plus color="white" size={28} />
                    </Animated.View>
                </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </>
    );
}
