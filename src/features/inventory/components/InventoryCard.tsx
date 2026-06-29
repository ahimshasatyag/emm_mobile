import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, Package, QrCode } from 'lucide-react-native';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { InventoryAsset } from '../types/inventory.types';

interface InventoryCardProps {
    item: InventoryAsset;
    index: number;
    onPress: () => void;
}

export function InventoryCard({ item, index, onPress }: InventoryCardProps) {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' };
            case 'normal': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Normal' };
            case 'not_assigned': return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Not Assigned' };
            case 'sold': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Sold' };
            case 'rusak': return { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Rusak' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
        }
    };

    const statusStyle = getStatusStyle(item.status);

    return (
        <Animated.View 
            entering={FadeInUp.delay(index * 100).springify()} 
            layout={LinearTransition.springify()}
            className="mb-4"
        >
            <TouchableOpacity 
                onPress={onPress}
                activeOpacity={0.7}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-row items-center"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                }}
            >
                <View className="w-12 h-12 rounded-xl bg-indigo-50 items-center justify-center mr-4">
                    <Package color={theme.colors.primary} size={24} />
                </View>

                <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-base font-bold text-gray-800 flex-1 mr-2" numberOfLines={1}>
                            {item.name}
                        </Text>
                        <View className={`px-2 py-0.5 rounded-md ${statusStyle.bg}`}>
                            <Text className={`text-xs font-bold ${statusStyle.text}`}>{statusStyle.label}</Text>
                        </View>
                    </View>
                    
                    {item.serial ? (
                        <View className="flex-row items-center mt-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                            <QrCode size={12} color="#6B7280" className="mr-1" />
                            <Text className="text-xs font-bold text-gray-600">{item.serial}</Text>
                        </View>
                    ) : null}
                </View>

                <View className="ml-3 items-center justify-center">
                    <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
                        <ChevronRight color={theme.colors.primary} size={20} />
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
