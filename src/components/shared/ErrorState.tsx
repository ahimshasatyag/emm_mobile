import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { theme } from '../../theme/theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorState({
  title = 'Terjadi Kesalahan',
  message = 'Sistem tidak dapat memuat data saat ini.',
  onRetry,
  fullScreen = false,
}: ErrorStateProps) {
  return (
    <View
      style={{
        flex: fullScreen ? 1 : 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: fullScreen ? theme.colors.background : 'transparent',
      }}
    >
      <AlertCircle color={theme.colors.notification} size={48} />
      <Text
        style={{
          marginTop: 16,
          fontSize: 18,
          fontWeight: 'bold',
          color: theme.colors.onBackground,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 14,
          color: theme.colors.text,
          textAlign: 'center',
        }}
      >
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            marginTop: 24,
            paddingVertical: 12,
            paddingHorizontal: 24,
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>
            Coba Lagi
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
