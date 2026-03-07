import { AppColors as Colors } from '@/constants/appColors';
import React from 'react';
import { Text, View } from 'react-native';

export type StatusType = 'Completed' | 'Pending' | 'Disputed' | 'Investigating' | 'Cleared' | 'Processing' | 'Released' | 'On Hold';

interface StatusBadgeProps {
    status: StatusType;
}

const getStatusStyles = (status: StatusType) => {
    switch (status) {
        case 'Completed':
        case 'Cleared':
        case 'Released':
            return { bg: '#E8F5E9', text: Colors.primary }; // Green
        case 'Pending':
        case 'Processing':
        case 'Investigating':
            return { bg: '#FFFDE7', text: Colors.warning }; // Amber/Yellow
        case 'Disputed':
        case 'On Hold':
            return { bg: '#FFEBEE', text: Colors.danger }; // Red
        default:
            return { bg: '#F5F5F5', text: Colors.textMuted };
    }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles = getStatusStyles(status);

    return (
        <View
            style={{
                backgroundColor: styles.bg,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 16,
                alignSelf: 'flex-start',
            }}
        >
            <Text
                style={{
                    color: styles.text,
                    fontFamily: 'Poppins_600SemiBold',
                    fontSize: 12,
                }}
            >
                {status}
            </Text>
        </View>
    );
};

