import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setUser as setUserAction } from '../store/authSlice';
import * as Location from 'expo-location';
import { theme } from '../../../theme/theme';

export function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useLogin();
    const dispatch = useAppDispatch();

    const handleSubmit = async () => {
        if (!username || !password) return;
        const success = await login({ username, password });
        
        if (success) {
            const proceedWithLogin = async () => {
                try {
                    if (Platform.OS !== 'web') {
                        let { status } = await Location.requestForegroundPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert("Info", "Login berhasil, namun hak akses lokasi tidak diberikan.");
                        }
                    }
                } catch (e) {
                    console.log("Location permission error:", e);
                } finally {
                    dispatch(setUserAction({
                        name: 'Administrator (Dummy)',
                        email: 'admin@emma.com',
                        link_foto: 'https://ui-avatars.com/api/?name=Admin+EMMA'
                    }));
                }
            };

            if (Platform.OS === 'web') {
                // Alert.alert with custom buttons might not work correctly on some web setups
                const confirm = window.confirm("Aplikasi membutuhkan izin untuk mengakses lokasi Anda demi keperluan keamanan dan pencatatan operasional. Lanjutkan?");
                if (confirm) {
                    await proceedWithLogin();
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
                disabled={loading || !username || !password}
                style={{ backgroundColor: theme.colors.primary }}
                className={`h-12 rounded-lg items-center justify-center flex-row ${
                    loading || !username || !password ? 'opacity-60' : 'opacity-100'
                }`}
                activeOpacity={0.8}
            >
                {loading ? (
                    <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                ) : null}
                <Text className="text-white font-bold text-base">
                    {loading ? 'Logging in...' : 'Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
