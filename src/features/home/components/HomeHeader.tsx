import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Bell, Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { theme } from '../../../theme/theme';

interface HomeHeaderProps {
    isLoading: boolean;
}

export function HomeHeader({ isLoading }: HomeHeaderProps) {
    const user = useAppSelector((state) => state.auth.user);
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const insets = useSafeAreaInsets();

    const bellRotation = useSharedValue(0);

    useEffect(() => {
        if (!isLoading) {
            // Jiggle effect every few seconds
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

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };



    return (
        <Animated.View 
            entering={FadeInDown.duration(600).springify()} 
            className="bg-white" 
            style={{ 
                paddingTop: insets.top > 0 ? insets.top + 10 : 20,
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
                elevation: 8, 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 4 }, 
                shadowOpacity: 0.08, 
                shadowRadius: 8, 
                paddingBottom: 4,
                zIndex: 10
            }}
        >
            {/* Bagian Atas: Menu, Jam & Tanggal, Notifikasi */}
            <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
                <TouchableOpacity 
                    className="p-2.5 bg-gray-50 rounded-xl border border-gray-100" 
                    onPress={() => navigation.openDrawer()}
                    activeOpacity={0.7}
                >
                    <Menu color={theme.colors.text} size={24} />
                </TouchableOpacity>

                <View className="flex-1 items-center justify-center">
                    <Text className="text-sm font-extrabold tracking-wide" style={{ color: theme.colors.primary }}>
                        Eka Maju Mesinindo
                    </Text>
                </View>

                <TouchableOpacity 
                    activeOpacity={0.7}
                >
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
            </View>

            {/* Bagian Bawah: Foto & Sapaan */}
            <View className="flex-row items-center px-6 pb-6 pt-3 mt-1">
                {isLoading ? (
                    <View className="w-14 h-14 rounded-full bg-gray-200 animate-pulse mr-4" />
                ) : (
                    <Animated.Image
                        entering={FadeInDown.delay(200).duration(500).springify()}
                        source={{ uri: user?.link_foto || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User') + '&background=random' }}
                        className="w-14 h-14 rounded-full mr-4 border-2"
                        style={{ borderColor: theme.colors.primary }}
                    />
                )}
                <View className="flex-1 justify-center">
                    {isLoading ? (
                        <>
                            <View className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2" />
                            <View className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                        </>
                    ) : (
                        <Animated.View entering={FadeInDown.delay(300).duration(500).springify()}>
                            <Text className="text-gray-500 text-xs font-bold tracking-wider uppercase mb-1">{getGreeting()} 👋</Text>
                            <Text className="text-gray-900 text-2xl font-black tracking-tight" numberOfLines={1}>{user?.name || 'Pengguna'}</Text>
                        </Animated.View>
                    )}
                </View>
            </View>
        </Animated.View>
    );
}
