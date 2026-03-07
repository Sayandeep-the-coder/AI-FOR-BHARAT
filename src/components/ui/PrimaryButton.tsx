import { AppColors as Colors } from '@/constants/appColors';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface PrimaryButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    loading = false,
    style,
    disabled,
    ...props
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={disabled || loading}
            style={[
                {
                    backgroundColor: disabled ? Colors.textMuted : Colors.primary,
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                },
                style,
            ]}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={Colors.white} size="small" />
            ) : (
                <Text
                    style={{
                        color: Colors.white,
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                    }}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

