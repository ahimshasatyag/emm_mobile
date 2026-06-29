import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { UserCircle, ChevronRight, Phone, Building2, Briefcase } from 'lucide-react-native';
import { CustomerContact } from '../types/customerContacts.types';
import { theme } from '../../../theme/theme';

interface CustomerContactCardProps {
    item: CustomerContact;
    index: number;
    onPress: (item: CustomerContact) => void;
}

export function CustomerContactCard({ item, index, onPress }: CustomerContactCardProps) {
    return (
        <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity
                onPress={() => onPress(item)}
                activeOpacity={0.7}
                className="bg-white p-4 rounded-2xl mb-4 flex-row items-center border border-gray-100 shadow-sm"
            >
                <View className="w-14 h-14 rounded-full bg-indigo-50 items-center justify-center mr-4">
                    <UserCircle color={theme.colors.primary} size={28} />
                </View>

                <View className="flex-1 mr-2">
                    <Text className="text-[16px] font-bold text-gray-800 mb-1" numberOfLines={1}>
                        {item.nm_customers_contact}
                    </Text>

                    <View className="flex-row items-center mb-1">
                        <Building2 color="#9ca3af" size={14} className="mr-1" />
                        <Text className="text-xs font-bold text-indigo-600 flex-1" numberOfLines={1}>
                            {item.nm_customers || '-'}
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-1">
                        <Briefcase color="#9ca3af" size={14} className="mr-1" />
                        <Text className="text-xs text-gray-500 flex-1" numberOfLines={1}>
                            {item.customers_contact_posisi || '-'}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Phone color="#9ca3af" size={14} className="mr-1" />
                        <Text className="text-[11px] font-medium text-gray-500">
                            {item.customers_contact_mobile || item.customers_contact_phone || '-'}
                        </Text>
                    </View>
                </View>

                <ChevronRight color={theme.colors.primary} size={20} />
            </TouchableOpacity>
        </Animated.View>
    );
}
