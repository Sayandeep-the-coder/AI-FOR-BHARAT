import { AppColors as Colors } from '@/constants/appColors';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface GhostButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
    color?: string;
}

export const GhostButton: React.FC<GhostButtonProps> = ({
    title,
    loading = false,
    color = Colors.primary,
    style,
    disabled,
    ...props
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.6}
            disabled={disabled || loading}
            style={[
                {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    backgroundColor: 'transparent',
                },
                style,
            ]}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={color} size="small" />
            ) : (
                <Text
                    style={{
                        color: disabled ? Colors.textMuted : color,
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 14,
                    }}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

