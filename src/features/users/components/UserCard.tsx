import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Shield, AtSign } from 'lucide-react-native';
import { UserData } from '../../types/users.types';
import { theme } from '../../../theme/theme';

interface UserCardProps {
    user: UserData;
    index: number;
    onPress: (user: UserData) => void;
}

export function UserCard({ user, index, onPress }: UserCardProps) {
    return (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500).springify()}>
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
                    source={{ uri: user.avatarUrl }} 
                    className="w-12 h-12 rounded-full mr-4 bg-gray-100"
                />

                {/* Info */}
                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                            {user.name}
                        </Text>
                        <View className={`px-2 py-0.5 rounded-full ${user.status === 'Active' ? 'bg-green-100' : 'bg-gray-200'}`}>
                            <Text className={`text-[10px] font-bold uppercase tracking-wider ${user.status === 'Active' ? 'text-green-700' : 'text-gray-500'}`}>
                                {user.status}
                            </Text>
                        </View>
                    </View>
                    
                    <View className="flex-row items-center mt-0.5">
                        <AtSign size={12} color={theme.colors.primary} />
                        <Text className="text-xs text-gray-500 ml-1">{user.username}</Text>
                        
                        <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                        
                        <Shield size={12} color="#f59e0b" />
                        <Text className="text-xs text-gray-500 ml-1">{user.level}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
