import { AppColors as Colors } from '@/constants/appColors';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
    title: string;
    onSeeAll?: () => void;
    seeAllLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    onSeeAll,
    seeAllLabel = 'See All',
}) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
            }}
        >
            <Text
                style={{
                    fontFamily: 'Poppins_600SemiBold',
                    fontSize: 18,
                    color: Colors.dark,
                }}
            >
                {title}
            </Text>
            {onSeeAll && (
                <TouchableOpacity activeOpacity={0.6} onPress={onSeeAll}>
                    <Text
                        style={{
                            fontFamily: 'Poppins_600SemiBold',
                            fontSize: 14,
                            color: Colors.primary,
                        }}
                    >
                        {seeAllLabel}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

