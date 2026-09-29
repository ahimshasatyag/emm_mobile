import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// On Web, expo-secure-store is not supported, so fallback to AsyncStorage or localStorage if needed.
// However, according to expo-secure-store documentation, it throws errors on Web.
// Let's create a wrapper that handles this gracefully.

export const setSecureItemAsync = async (key: string, value: string) => {
    if (Platform.OS === 'web') {
        await AsyncStorage.setItem(key, value);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

export const getSecureItemAsync = async (key: string) => {
    if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(key);
    } else {
        return await SecureStore.getItemAsync(key);
    }
};

export const removeSecureItemAsync = async (key: string) => {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};
