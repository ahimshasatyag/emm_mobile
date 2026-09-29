import React from 'react';
import { View, Text } from 'react-native';
import { FileQuestion } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  fullScreen?: boolean;
}

export function EmptyState({
  title,
  message,
  icon,
  fullScreen = false,
}: EmptyStateProps) {
  const { t } = useTranslation();
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
      {icon ? icon : <FileQuestion color={theme.colors.outline} size={56} />}
      <Text
        style={{
          marginTop: 16,
          fontSize: 18,
          fontWeight: 'bold',
          color: theme.colors.onBackground,
          textAlign: 'center',
        }}
      >
        {title || t('empty_state.title')}
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 14,
          color: theme.colors.outline,
          textAlign: 'center',
        }}
      >
        {message || t('empty_state.message')}
      </Text>
    </View>
  );
}
