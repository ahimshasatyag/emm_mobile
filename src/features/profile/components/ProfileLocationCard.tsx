import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';
import { UserLocation } from '../types/profile.types';
import { theme } from '../../../theme/theme';

interface ProfileLocationCardProps {
    locations?: UserLocation[];
}

export function ProfileLocationCard({ locations = [] }: ProfileLocationCardProps) {
    return (
        <Animated.View
            entering={FadeInDown.delay(700).duration(600).springify()}
            className="mx-6 mt-6 bg-white rounded-3xl p-5 border border-gray-100"
            style={{
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
            }}
        >
            <View className="flex-row items-center mb-4 ml-1">
                <MapPin size={22} color={theme.colors.primary} className="mr-2" />
                <Text className="text-lg font-black text-gray-800">Lokasi saat ini</Text>
            </View>

            {locations.length > 0 ? (
                <>
                    <View className="rounded-2xl overflow-hidden h-48 bg-gray-100">
                        {Platform.OS === 'web' ? (
                            <View style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center' }]}>
                                <MapPin size={32} color="#9ca3af" style={{ marginBottom: 8 }} />
                                <Text style={{ color: '#6b7280', fontWeight: '500' }}>Peta tidak tersedia di versi Web</Text>
                            </View>
                        ) : (
                            <MapView
                                style={StyleSheet.absoluteFillObject}
                                initialRegion={{
                                    latitude: locations[0].latitude,
                                    longitude: locations[0].longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }}
                                showsUserLocation={true}
                                showsMyLocationButton={false}
                            >
                                {locations.map((loc) => (
                                    <Marker
                                        key={loc.id}
                                        coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                                        title={loc.deviceName || 'Device'}
                                        description={`Terekam: ${loc.createdAt || '-'}`}
                                    >
                                        <View className="bg-primary/20 p-2 rounded-full">
                                            <View className="bg-primary w-4 h-4 rounded-full border-2 border-white" />
                                        </View>
                                    </Marker>
                                ))}
                            </MapView>
                        )}
                    </View>
                </>
            ) : (
                <View className="mt-2 mb-2">
                    <Text className="text-sm text-gray-500 text-center font-medium">Belum ada data lokasi</Text>
                </View>
            )}
        </Animated.View>
    );
}
