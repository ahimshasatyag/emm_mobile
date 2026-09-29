import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  buttonText?: string;
}

export function ErrorState({
  title,
  message,
  onRetry,
  fullScreen = false,
  buttonText,
}: ErrorStateProps) {
  const { t } = useTranslation();

  const displayTitle = title ?? t('error.default_title');
  const displayMessage = message ?? t('error.default_message');
  const displayButtonText = buttonText ?? t('error.try_again');

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
        {displayTitle}
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 14,
          color: theme.colors.text,
          textAlign: 'center',
        }}
      >
        {displayMessage}
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
            {displayButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
