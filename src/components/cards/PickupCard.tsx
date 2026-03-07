import { AppColors as Colors } from '@/constants/appColors';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { StatusBadge, StatusType } from '../ui/StatusBadge';

export interface PickupCardProps {
    date: string;
    time: string;
    kabadiwallaName?: string;
    citizenName?: string;
    status: StatusType;
    address?: string;
    wasteTypes?: string[];
    score?: number;
    style?: ViewStyle;
}

export const PickupCard: React.FC<PickupCardProps> = ({
    date,
    time,
    kabadiwallaName,
    citizenName,
    status,
    address,
    wasteTypes,
    score,
    style,
}) => {
    return (
        <View
            style={[
                {
                    backgroundColor: Colors.white,
                    borderRadius: 16,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 3,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: Colors.border,
                },
                style,
            ]}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: Colors.dark, marginBottom: 4 }}>
                        {kabadiwallaName ? `Pickup by ${kabadiwallaName}` : citizenName ? `Pickup for ${citizenName}` : 'Waste Pickup'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Calendar size={14} color={Colors.textMuted} />
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textMuted }}>{date}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Clock size={14} color={Colors.textMuted} />
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textMuted }}>{time}</Text>
                        </View>
                    </View>
                </View>
                <StatusBadge status={status} />
            </View>

            {address && (
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                    <MapPin size={16} color={Colors.primary} style={{ marginTop: 2 }} />
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.text, flex: 1 }}>{address}</Text>
                </View>
            )}

            {wasteTypes && wasteTypes.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                    {wasteTypes.map((type, idx) => (
                        <View key={idx} style={{ backgroundColor: Colors.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.primaryDark }}>{type}</Text>
                        </View>
                    ))}
                </View>
            )}

            {score !== undefined && (
                <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.textMuted }}>Score Earned</Text>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.primary }}>+{score} pts</Text>
                </View>
            )}
        </View>
    );
};

