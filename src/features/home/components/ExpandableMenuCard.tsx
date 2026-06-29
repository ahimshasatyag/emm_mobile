import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
    useAnimatedStyle, 
    useSharedValue, 
    withTiming, 
    withSpring, 
    interpolate,
    Extrapolate,
    FadeInDown
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { theme } from '../../../theme/theme';

interface SubMenuItem {
    id: string;
    title: string;
    icon: React.ReactNode;
    badge?: number;
}

interface ExpandableMenuCardProps {
    title: string;
    description: string;
    mainIcon: React.ReactNode;
    subMenus: SubMenuItem[];
    onPressSubMenu: (id: string) => void;
    index?: number;
}

export function ExpandableMenuCard({ title, description, mainIcon, subMenus, onPressSubMenu, index = 0 }: ExpandableMenuCardProps) {
    const [expanded, setExpanded] = useState(false);
    const heightValue = useSharedValue(0);
    const rotateValue = useSharedValue(0);

    const toggleExpand = () => {
        const isCurrentlyExpanded = expanded;
        setExpanded(!isCurrentlyExpanded);
        
        // 4 kolom per baris. Tinggi tiap baris sekitar 105px + padding 24px
        const rows = Math.ceil(subMenus.length / 4);
        const targetHeight = isCurrentlyExpanded ? 0 : (rows * 105) + 24; 
        
        heightValue.value = withSpring(targetHeight, { 
            damping: 16,
            stiffness: 100,
            mass: 0.6
        });
        rotateValue.value = withSpring(isCurrentlyExpanded ? 0 : 1, {
            damping: 12,
            stiffness: 100
        });
    };

    const animatedHeightStyle = useAnimatedStyle(() => {
        const rows = Math.ceil(subMenus.length / 4);
        const maxHeight = (rows * 105) + 24;
        return {
            height: heightValue.value,
            opacity: interpolate(heightValue.value, [0, maxHeight * 0.8, maxHeight], [0, 0.5, 1], Extrapolate.CLAMP),
        };
    });

    const animatedRotateStyle = useAnimatedStyle(() => {
        const rotation = interpolate(rotateValue.value, [0, 1], [0, 180]);
        return {
            transform: [{ rotate: `${rotation}deg` }]
        };
    });

    return (
        <Animated.View 
            entering={FadeInDown.delay(100 + (index * 100)).duration(500).springify()}
            className="bg-white mx-6 mb-5 shadow-sm border border-gray-100 overflow-hidden" 
            style={{ borderRadius: 24, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10 }}
        >
            <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={toggleExpand}
                className="p-5 flex-row items-center"
            >
                <View className="w-14 h-14 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: theme.colors.primary + '15' }}>
                    {mainIcon}
                </View>
                <View className="flex-1">
                    <Text className="text-[17px] font-extrabold text-gray-900 mb-0.5">{title}</Text>
                    <Text className="text-[13px] text-gray-500 font-medium">{description}</Text>
                </View>
                <Animated.View style={animatedRotateStyle} className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 ml-2">
                    <ChevronDown color={theme.colors.outline} size={22} strokeWidth={2.5} />
                </Animated.View>
            </TouchableOpacity>

            <Animated.View style={[styles.subMenuList, animatedHeightStyle]}>
                <View className="flex-row flex-wrap px-4 pb-4 pt-2 justify-start">
                    {subMenus.map((menu, idx) => (
                        <TouchableOpacity 
                            key={menu.id}
                            activeOpacity={0.6}
                            onPress={() => onPressSubMenu(menu.id)}
                            className="w-1/4 items-center mb-4"
                        >
                            <View className="w-[52px] h-[52px] bg-white shadow-sm border border-gray-100 items-center justify-center mb-2.5 relative" style={{ borderRadius: 18, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4 }}>
                                {menu.icon}
                                {menu.badge !== undefined && menu.badge > 0 && (
                                    <View className="absolute -top-1.5 -right-1.5 bg-red-500 min-w-[20px] h-[20px] rounded-full items-center justify-center border-2 border-white px-1">
                                        <Text className="text-white text-[10px] font-bold">{menu.badge}</Text>
                                    </View>
                                )}
                            </View>
                            <Text className="text-center text-[11px] text-gray-600 font-semibold px-1" numberOfLines={2}>
                                {menu.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    subMenuList: {
        overflow: 'hidden',
        backgroundColor: '#fafafa',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6'
    }
});
