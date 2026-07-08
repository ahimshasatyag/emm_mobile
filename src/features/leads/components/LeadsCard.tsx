import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Briefcase, Building2 } from 'lucide-react-native';
import { LeadsItem } from '../types/leads.types';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Props {
    item: LeadsItem;
    index: number;
    onPress: () => void;
}

export function LeadsCard({ item, index, onPress }: Props) {
    // Generate status color logic similar to previous, but returning specific tailwind classes for text and bg
    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'SUCCESS': return { bg: 'bg-green-100', text: 'text-green-700' };
            case 'CANCEL': return { bg: 'bg-red-100', text: 'text-red-700' };
            case 'FAIL': return { bg: 'bg-orange-100', text: 'text-orange-700' };
            case 'OPEN':
            default: return { bg: 'bg-blue-100', text: 'text-blue-700' };
        }
    };

    const statusStyle = getStatusColor(item.status);

    return (
        <Animated.View entering={FadeInUp.delay(index * 100)}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                className="bg-white p-4 rounded-2xl mb-3 flex-row items-center"
                style={{
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                }}
            >
                <View className="w-12 h-12 rounded-full items-center justify-center mr-4" style={{ backgroundColor: theme.colors.primaryContainer }}>
                    <Briefcase color={theme.colors.primary} size={24} />
                </View>

                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="font-bold text-gray-900 text-base flex-1 mr-2" numberOfLines={1}>
                            {item.code_leads}
                        </Text>
                        <View className="flex-row items-center">
                            <View className={`px-2 py-1 rounded-md ${statusStyle.bg}`}>
                                <Text className={`text-xs font-bold ${statusStyle.text}`}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row items-center flex-wrap">
                        <View className="flex-row items-center mr-3 mb-1">
                            <Building2 color="#6b7280" size={14} className="mr-1" />
                            <Text className="text-sm text-gray-500">{item.nm_customers}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
