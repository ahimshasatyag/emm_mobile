import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Plus } from 'lucide-react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { theme } from '../../theme/theme';

interface ButtonAddProps {
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}

export function ButtonAdd({ onPress, style }: ButtonAddProps) {
    return (
        <Animated.View
            entering={ZoomIn.delay(300).springify()}
            style={[
                {
                    position: 'absolute',
                    bottom: 70,
                    right: 40,
                    zIndex: 999,
                },
                style
            ]}
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{
                    backgroundColor: theme.colors.primary,
                    elevation: 6,
                    shadowColor: theme.colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                }}
            >
                <Plus color="white" size={28} />
            </TouchableOpacity>
        </Animated.View>
    );
}
