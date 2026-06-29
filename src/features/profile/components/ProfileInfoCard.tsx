import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { IdCard, Users, Building, Phone, MapPin, Calendar } from 'lucide-react-native';
import { ProfileData } from '../../types/profile.types';
import { theme } from '../../../theme/theme';

interface ProfileInfoCardProps {
    data: ProfileData;
}

export function ProfileInfoCard({ data }: ProfileInfoCardProps) {
    const InfoRow = ({ icon: Icon, label, value, isLast = false }: any) => (
        <View className={`flex-row items-center py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-4">
                <Icon size={20} color={theme.colors.primary} />
            </View>
            <View className="flex-1">
                <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">{label}</Text>
                <Text className="text-gray-900 font-semibold text-base">{value}</Text>
            </View>
        </View>
    );

    return (
        <Animated.View 
            entering={FadeInDown.delay(500).duration(600).springify()}
            className="mx-6 mt-6 bg-white rounded-3xl p-5 border border-gray-100"
            style={{ 
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
            }}
        >
            <Text className="text-lg font-black text-gray-800 mb-2 ml-1">Informasi Karyawan</Text>
            
            <InfoRow icon={IdCard} label="ID Karyawan" value={data.employeeId} />
            <InfoRow icon={Building} label="Divisi" value={data.division} />
            <InfoRow icon={Users} label="Departemen" value={data.department} />
            <InfoRow icon={Phone} label="Nomor Telepon" value={data.phone} />
            <InfoRow icon={MapPin} label="Lokasi Kantor" value={data.officeLocation} />
            <InfoRow icon={Calendar} label="Tanggal Bergabung" value={data.joinDate} isLast={true} />
        </Animated.View>
    );
}
