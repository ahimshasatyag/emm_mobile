import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';
import { Home, LayoutDashboard, User } from 'lucide-react-native';

import { HomeScreen } from '../../features/home/screens/HomeScreen';
import { ProfileScreen } from '../../features/profile/screens/ProfileScreen';
import { theme } from '../../theme/theme';

const Tab = createBottomTabNavigator();

const TabBarItem = ({ isFocused, onPress, icon: Icon, label }: any) => {
    const width = useSharedValue(isFocused ? 135 : 50);
    const opacity = useSharedValue(isFocused ? 1 : 0);

    useEffect(() => {
        width.value = withSpring(isFocused ? 135 : 50, { damping: 15 });
        opacity.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
    }, [isFocused]);

    const animatedStyle = useAnimatedStyle(() => {
        const bg = interpolateColor(
            opacity.value,
            [0, 1],
            ['rgba(255, 255, 255, 0)', `${theme.colors.primary}15`]
        );
        const border = interpolateColor(
            opacity.value,
            [0, 1],
            ['rgba(255, 255, 255, 0)', `${theme.colors.primary}30`]
        );

        return {
            width: width.value,
            backgroundColor: bg,
            borderColor: border,
            borderWidth: 1,
        };
    });

    const textStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        marginLeft: isFocused ? 8 : 0,
    }));

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <Animated.View style={[styles.tabItem, animatedStyle]}>
                <Icon color={isFocused ? theme.colors.primary : '#a1a1aa'} size={22} strokeWidth={isFocused ? 2.5 : 2} />
                {isFocused && (
                    <Animated.Text style={[styles.tabLabel, textStyle]} numberOfLines={1}>
                        {label}
                    </Animated.Text>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    return (
        <View style={styles.tabBarContainer}>
            <View style={styles.tabBar}>
                {state.routes.map((route: any, index: number) => {
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    let Icon = LayoutDashboard;
                    let label = 'Dashboard';

                    if (route.name === 'Profile') { Icon = User; label = 'Profile'; }

                    return (
                        <TabBarItem
                            key={route.key}
                            isFocused={isFocused}
                            onPress={onPress}
                            icon={Icon}
                            label={label}
                        />
                    );
                })}
            </View>
        </View>
    );
};

export function BottomBarNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Dashboard" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 32 : 24,
        left: 20,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        height: 72,
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // White glass effect
        borderRadius: 36,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        paddingHorizontal: 24, // increased padding since there are only 2 items
        alignItems: 'center',
        justifyContent: 'space-around', // space evenly for 2 items
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        borderRadius: 26,
    },
    tabLabel: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '600',
        overflow: 'hidden',
    }
});
