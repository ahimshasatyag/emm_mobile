import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FileText, Calendar } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { SOWithoutContract } from '../types/salescontract.types';

interface Props {
    item: SOWithoutContract;
    index: number;
    onPress: () => void;
}

export function SOWithoutContractCard({ item, index, onPress }: Props) {
    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).springify()}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                className="bg-white p-4 rounded-2xl mb-3 flex-row items-center"
                style={{
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4
                }}
            >
                <View className="w-12 h-12 rounded-full items-center justify-center mr-4" style={{ backgroundColor: theme.colors.primaryContainer }}>
                    <FileText color={theme.colors.primary} size={24} />
                </View>

                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="font-bold text-gray-900 text-base flex-1 mr-2" numberOfLines={1}>
                            {item.nm_customers}
                        </Text>
                        <View className="px-2 py-1 rounded-md bg-orange-50">
                            <Text className="text-[10px] font-bold text-orange-700">
                                CREATE SC
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between mt-1">
                        <View className="flex-row items-center">
                            <Calendar color="#6b7280" size={14} className="mr-1" />
                            <Text className="text-sm text-gray-500">{item.date_so}</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-sm font-bold text-gray-500">{item.code_so}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
