import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from '../components/LoginForm';
import { theme } from '../../../theme/theme';

export function LoginScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="items-center mb-10 mt-4">
                        <Text style={{ color: theme.colors.primary, fontSize: 36, fontWeight: '900', letterSpacing: 1 }}>
                            EMMA
                        </Text>
                        <Text className="text-gray-500 text-sm mt-1">EMM Application</Text>
                    </View>

                    <View 
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full" 
                        style={{ elevation: 2 }}
                    >
                        <Text className="text-xl font-extrabold text-gray-800 mb-6 text-center">Login</Text>
                        <LoginForm />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View className="absolute bottom-6 left-0 right-0 items-center bg-transparent pointer-events-none">
                <Text className="text-gray-400 text-[10px]">
                    © 1982-{new Date().getFullYear()}, PT. Eka Maju Mesinindo
                </Text>
            </View>
        </SafeAreaView>
    );
}
