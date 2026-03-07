import { AppColors as Colors } from '@/constants/appColors';
import { Flame } from 'lucide-react-native';
import React from 'react';
import { Text, View, ViewStyle } from 'react-native';

interface StreakBannerProps {
    streak: number;
    message?: string;
    style?: ViewStyle;
}

export const StreakBanner: React.FC<StreakBannerProps> = ({ streak, message, style }) => {
    return (
        <View
            style={[
                {
                    backgroundColor: '#FFF8E1',
                    padding: 16,
                    borderRadius: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    borderWidth: 1,
                    borderColor: '#FFE082',
                },
                style,
            ]}
        >
            <View style={{ backgroundColor: '#FFECB3', padding: 10, borderRadius: 12 }}>
                <Flame color={Colors.warning} size={24} fill={Colors.warning} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#F57F17' }}>
                    {streak}-day streak! ðŸ”¥
                </Text>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: '#F57F17', opacity: 0.8, marginTop: 2 }}>
                    {message || 'Keep segregating right to earn more points.'}
                </Text>
            </View>
        </View>
    );
};

