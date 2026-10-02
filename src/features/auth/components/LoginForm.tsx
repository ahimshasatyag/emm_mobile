import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { theme } from '../../../theme/theme';

export function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useLogin();
    const dispatch = useAppDispatch();

    const [isLocating, setIsLocating] = useState(false);

    const proceedWithLogin = async () => {
        setIsLocating(true);
        let latitude: number | undefined;
        let longitude: number | undefined;
        let device_name: string | undefined;

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                // Gunakan akurasi Balanced agar lebih cepat merespons di Emulator/Web
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                latitude = location.coords.latitude;
                longitude = location.coords.longitude;
            } else {
                Alert.alert("Izin Ditolak", "Login dilanjutkan tanpa merekam lokasi Anda.");
            }

            // Dapatkan nama merk dan model device (contoh: Apple iPhone 14 atau Samsung SM-G998B)
            if (Platform.OS === 'web') {
                device_name = 'Web Browser';
            } else {
                const brand = Device.brand ? `${Device.brand} ` : '';
                const model = Device.modelName || 'Unknown Device';
                device_name = `${brand}${model}`.trim();
            }
        } catch (e) {
            // console.log("Location fetch error:", e);
        } finally {
            setIsLocating(false);
        }

        // console.log("Payload Login:", { username, latitude, longitude, device_name });

        // Jalankan login API beserta data lokasi (opsional)
        await login({ username, password, latitude, longitude, device_name });
    };

    const handleSubmit = () => {
        if (!username || !password) return;

        if (Platform.OS === 'web') {
            const confirm = window.confirm("Aplikasi membutuhkan izin untuk mengakses lokasi Anda demi keperluan keamanan dan pencatatan operasional. Lanjutkan?");
            if (confirm) {
                proceedWithLogin();
            }
        } else {
            Alert.alert(
                "Pengecekan Status & Hak Akses",
                "Aplikasi membutuhkan izin untuk mengakses lokasi Anda demi keperluan keamanan dan pencatatan operasional.",
                [
                    { text: "Batal", style: "cancel" },
                    { text: "OK", onPress: proceedWithLogin }
                ]
            );
        }
    };

    return (
        <View className="w-full">
            {error && (
                <View className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
                    <Text className="text-red-700 text-[13px]">{error}</Text>
                </View>
            )}

            <View className="mb-4">
                <Text className="text-gray-700 text-xs font-bold mb-1">Username</Text>
                <TextInput
                    className="h-12 border border-gray-300 rounded-lg px-4 text-black bg-white"
                    style={{ focusable: true }} // Dummy style for NativeWind pseudo-classes if configured
                    placeholder="Masukkan username Anda"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    editable={!loading}
                />
            </View>

            <View className="mb-6">
                <Text className="text-gray-700 text-xs font-bold mb-1">Password</Text>
                <TextInput
                    className="h-12 border border-gray-300 rounded-lg px-4 text-black bg-white"
                    placeholder="Masukkan password Anda"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                />
            </View>

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading || isLocating || !username || !password}
                style={{ backgroundColor: theme.colors.primary }}
                className={`h-12 rounded-lg items-center justify-center flex-row ${loading || isLocating || !username || !password ? 'opacity-60' : 'opacity-100'
                    }`}
                activeOpacity={0.8}
            >
                {(loading || isLocating) ? (
                    <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                ) : null}
                <Text className="text-white font-bold text-base">
                    {isLocating ? 'Mencari Lokasi...' : loading ? 'Logging in...' : 'Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
