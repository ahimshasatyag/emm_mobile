import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import { Bell, Menu, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

interface HeaderNavigatorProps {
    isLoading?: boolean;
    title?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    disableAnimation?: boolean;
}

export function HeaderNavigator({ isLoading = false, title = 'Eka Maju Mesinindo', showBackButton = false, onBackPress, disableAnimation = false }: HeaderNavigatorProps) {
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const insets = useSafeAreaInsets();

    const bellRotation = useSharedValue(0);

    useEffect(() => {
        if (!isLoading) {
            const jiggle = () => {
                bellRotation.value = withSequence(
                    withTiming(-10, { duration: 50 }),
                    withTiming(10, { duration: 50 }),
                    withTiming(-10, { duration: 50 }),
                    withTiming(10, { duration: 50 }),
                    withTiming(0, { duration: 50 })
                );
            };

            const interval = setInterval(jiggle, 5000);
            return () => clearInterval(interval);
        }
    }, [isLoading, bellRotation]);

    const animatedBellStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${bellRotation.value}deg` }]
        };
    });

    return (
        <Animated.View
            {...(disableAnimation ? {} : { entering: FadeInDown.duration(600).springify() })}
            className="bg-white"
            style={{
                paddingTop: insets.top > 0 ? insets.top + 10 : 20,
                borderBottomLeftRadius: 28,
                borderBottomRightRadius: 28,
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                paddingBottom: 16,
                zIndex: 10
            }}
        >
            <View className="flex-row justify-between items-center px-6 pt-4">
                <TouchableOpacity
                    className="p-2.5 bg-gray-50 rounded-xl border border-gray-100"
                    onPress={() => {
                        if (showBackButton) {
                            if (onBackPress) {
                                onBackPress();
                            } else {
                                navigation.goBack();
                            }
                        } else {
                            if (navigation.openDrawer) {
                                navigation.openDrawer();
                            } else {
                                navigation.goBack();
                            }
                        }
                    }}
                    activeOpacity={0.7}
                >
                    {showBackButton ? (
                        <ArrowLeft color={theme.colors.text} size={24} />
                    ) : (
                        <Menu color={theme.colors.text} size={24} />
                    )}
                </TouchableOpacity>

                <View className="flex-1 items-center justify-center">
                    <Text className="text-sm font-extrabold tracking-wide text-center" style={{ color: theme.colors.primary }}>
                        {title}
                    </Text>
                </View>

                {showBackButton ? (
                    <View className="w-12 h-12" />
                ) : (
                    <TouchableOpacity activeOpacity={0.7}>
                        <View className="w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center relative border border-gray-100">
                            <Animated.View style={!isLoading ? animatedBellStyle : {}}>
                                <Bell color={theme.colors.text} size={22} strokeWidth={2.5} />
                            </Animated.View>
                            {!isLoading && (
                                <Animated.View
                                    entering={FadeInDown.delay(600).springify()}
                                    className="absolute top-2.5 right-2.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );
}
