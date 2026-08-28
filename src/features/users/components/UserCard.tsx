import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Shield, AtSign } from 'lucide-react-native';
import { UserData } from '../types/users.types';
import { theme } from '../../../theme/theme';

interface UserCardProps {
    user: UserData;
    index: number;
    onPress: (user: UserData) => void;
}

export function UserCard({ user, index, onPress }: UserCardProps) {
    const isActive = user.is_active === 'Aktif' || user.is_active === 1 || user.is_active === '1';
    const statusText = isActive ? 'Aktif' : 'Tidak Aktif';
    const avatar = user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nm_users)}&background=random`;

    return (
        <Animated.View entering={FadeInDown.delay(index < 10 ? index * 100 : 0).duration(500).springify()}>
            <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => onPress(user)}
                className="bg-white rounded-2xl p-4 mb-4 flex-row items-center border border-gray-100"
                style={{
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 5,
                }}
            >
                {/* Avatar */}
                <Image 
                    source={{ uri: avatar }} 
                    className="w-12 h-12 rounded-full mr-4 bg-gray-100"
                />

                {/* Info */}
                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                            {user.nm_users}
                        </Text>
                        <View className={`px-2 py-0.5 rounded-full ${isActive ? 'bg-green-100' : 'bg-gray-200'}`}>
                            <Text className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
                                {statusText}
                            </Text>
                        </View>
                    </View>
                    
                    <View className="flex-row items-center mt-0.5">
                        <AtSign size={12} color={theme.colors.primary} />
                        <Text className="text-xs text-gray-500 ml-1">{user.username}</Text>
                        
                        <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                        
                        <Shield size={12} color="#f59e0b" />
                        <Text className="text-xs text-gray-500 ml-1">{user.nm_users_level || '-'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
