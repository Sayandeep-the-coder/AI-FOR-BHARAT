import { AppColors as Colors } from '@/constants/appColors';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingOverlayProps {
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => {
    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.text}>{message}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(244, 251, 244, 0.8)', // Background with opacity
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        backgroundColor: Colors.white,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        gap: 16,
    },
    text: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: Colors.primary,
    },
});

