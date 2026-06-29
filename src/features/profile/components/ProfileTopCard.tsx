import React from 'react';
import { View, Text, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Mail, Briefcase } from 'lucide-react-native';
import { ProfileData } from '../../types/profile.types';
import { theme } from '../../../theme/theme';

interface ProfileTopCardProps {
    data: ProfileData;
}

export function ProfileTopCard({ data }: ProfileTopCardProps) {
    return (
        <Animated.View 
            entering={FadeInDown.delay(400).duration(600).springify()}
            className="mx-6 mt-6 bg-white rounded-3xl p-6 border border-gray-100 items-center relative"
            style={{ 
                elevation: 10,
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            }}
        >
            {/* Background Accent (Glassmorphism hint) */}
            <View 
                className="absolute top-0 left-0 right-0 h-24 rounded-t-3xl opacity-10"
                style={{ backgroundColor: theme.colors.primary }}
            />

            {/* Avatar */}
            <View 
                className="w-24 h-24 rounded-full bg-white p-1 mb-4 mt-2"
                style={{
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                }}
            >
                <Image 
                    source={{ uri: data.avatarUrl }} 
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                />
            </View>

            {/* Name */}
            <Text className="text-2xl font-black text-gray-900 text-center mb-2">
                {data.name}
            </Text>

            {/* Position Badge */}
            <View className="flex-row items-center bg-blue-50 px-4 py-1.5 rounded-full mb-4">
                <Briefcase size={14} color={theme.colors.primary} />
                <Text className="text-sm font-bold ml-2" style={{ color: theme.colors.primary }}>
                    {data.position}
                </Text>
            </View>

            {/* Email */}
            <View className="flex-row items-center bg-gray-50 px-4 py-2 rounded-xl w-full justify-center border border-gray-100">
                <Mail size={16} color="#6b7280" />
                <Text className="text-gray-500 font-medium ml-2 text-sm">
                    {data.email}
                </Text>
            </View>
        </Animated.View>
    );
}
