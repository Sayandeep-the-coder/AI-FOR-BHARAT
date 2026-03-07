import { GhostButton } from '@/components/ui/GhostButton';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AppColors as Colors } from '@/constants/appColors';
import { usePickupStore } from '@/stores/pickupStore';
import { router } from 'expo-router';
import { ArrowLeft, Clock, MapPin, Navigation } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function PickupDetailScreen() {
    const { activePickup, isLoading, confirmPickupAction } = usePickupStore();
    const [isConfirming, setIsConfirming] = useState(false);

    if (!activePickup) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Poppins_400Regular', color: Colors.textMuted }}>No active pickup selected.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: Colors.primary, fontFamily: 'Poppins_600SemiBold' }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleComplete = async () => {
        setIsConfirming(true);
        try {
            await confirmPickupAction(activePickup._id, {
                qualityRating: 'good', // This should IDEALLY come from a modal/selector
                arrivalLat: activePickup.citizenLocation.lat,
                arrivalLng: activePickup.citizenLocation.lng,
                dwellTimeMinutes: 5,
            });
            Toast.show({ type: 'success', text1: 'Pickup Completed', text2: 'The citizen has been notified and points awarded.' });
            setTimeout(() => router.back(), 2000);
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Confirmation Failed', text2: 'Could not update pickup status.' });
        } finally {
            setIsConfirming(false);
        }
    };

    const handleReport = () => {
        Toast.show({ type: 'info', text1: 'Issue Reported', text2: 'Admin has been notified of the issue at this location.' });
    };

    const status = activePickup.status;
    const isCompleted = status === 'completed' || status === 'confirmed';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                    <ArrowLeft color={Colors.dark} size={24} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: Colors.dark, marginLeft: 8 }}>
                    Pickup Details
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: Colors.dark, marginBottom: 4 }}>
                            {activePickup.citizenId ? 'Citizen Pickup' : 'Waste Pickup'}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Clock color={Colors.textMuted} size={14} />
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.textMuted }}>
                                {new Date(activePickup.scheduledWindow.start).toLocaleDateString()} at {new Date(activePickup.scheduledWindow.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    </View>
                    <StatusBadge status={status as any} />
                </View>

                {/* GPS Map View Placeholder */}
                <View style={{ backgroundColor: '#E3F2FD', height: 200, borderRadius: 16, marginBottom: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#BBDEFB' }}>
                    <MapPin color={Colors.primary} size={48} />
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: Colors.primaryDark, marginTop: 12 }}>
                        {activePickup.citizenLocation.address || 'Location Details'}
                    </Text>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.primary, marginTop: 4 }}>
                        Lat: {activePickup.citizenLocation.lat.toFixed(4)}, Lng: {activePickup.citizenLocation.lng.toFixed(4)}
                    </Text>
                </View>

                <View style={{ marginBottom: 32 }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: Colors.dark, marginBottom: 12 }}>
                        Waste Types
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {['Dry', 'E-Waste'].map(type => (
                            <View key={type} style={{ backgroundColor: Colors.background, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.border }}>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.primaryDark }}>{type}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.dark, paddingVertical: 16, borderRadius: 12, marginBottom: 16 }}
                    activeOpacity={0.8}
                >
                    <Navigation color={Colors.white} size={20} />
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: Colors.white }}>Navigate to Location</Text>
                </TouchableOpacity>

                <PrimaryButton
                    title={isCompleted ? "Pickup Completed" : "Mark as Completed"}
                    onPress={handleComplete}
                    disabled={isCompleted || isConfirming}
                    loading={isConfirming}
                    style={{ marginBottom: 16, backgroundColor: isCompleted ? Colors.success : Colors.primary }}
                />

                {!isCompleted && (
                    <GhostButton
                        title="Report Issue"
                        color={Colors.danger}
                        onPress={handleReport}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

