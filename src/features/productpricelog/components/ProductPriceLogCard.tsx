import React from 'react';
import { View, Text } from 'react-native';
import { ProductPriceLog } from '../types/productpricelog.types';
import { User, Tag, Hash } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
    log: ProductPriceLog;
    index: number;
}

export function ProductPriceLogCard({ log, index }: Props) {
    return (
        <Animated.View
            entering={FadeInDown.delay(index < 10 ? index * 100 : 0).springify()}
            className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
            style={{
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
            }}
        >
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 pr-3">
                    <Text className="text-gray-800 font-bold text-base mb-1" numberOfLines={2}>
                        {log.nm_product}
                    </Text>
                    <View className="flex-row items-center mb-1">
                        <Tag color={theme.colors.primary} size={14} className="mr-1.5" />
                        <Text className="text-gray-600 font-bold text-sm">
                            {log.code_product}
                        </Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                        <User color="#9CA3AF" size={12} className="mr-1" />
                        <Text className="text-gray-500 text-xs font-medium">
                            {log.nm_users} - {log.username}
                        </Text>
                    </View>
                </View>

                <View className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 flex-row items-center">
                    <Hash color={theme.colors.primary} size={12} className="mr-1" />
                    <Text className="text-sm font-bold text-indigo-700">
                        {log.jml} ubahan
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
}
