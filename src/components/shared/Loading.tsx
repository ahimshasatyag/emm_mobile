import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message, fullScreen = false }: LoadingProps) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: fullScreen ? 1 : 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: fullScreen ? theme.colors.background : 'transparent',
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message !== null ? (
        <Text style={{ marginTop: 12, color: theme.colors.text, fontSize: 14 }}>
          {message || t('loading.data')}
        </Text>
      ) : null}
    </View>
  );
}
