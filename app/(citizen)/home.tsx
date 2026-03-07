import { PickupCard } from '@/components/cards/PickupCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StreakBanner } from '@/components/ui/StreakBanner';
import { AppColors as Colors } from '@/constants/appColors';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/stores/authStore';
import { usePickupStore } from '@/stores/pickupStore';
import { router } from 'expo-router';
import { Award, History } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CitizenHomeScreen() {
    const user = useAuthStore((s) => s.user);
    const { myPickups, isLoading, fetchMyPickups } = usePickupStore();
    const [qualityScore, setQualityScore] = useState<number | null>(null);

    const loadData = async () => {
        try {
            await fetchMyPickups('citizen');
            const scoreData = await userService.getQualityScore();
            setQualityScore(scoreData.score);
        } catch (err) {
            console.error('Failed to load citizen home data:', err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const upcomingPickup = myPickups.find(p => p.status === 'requested' || p.status === 'accepted');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={loadData} colors={[Colors.primary]} />
                }
            >
                {/* Header */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 16, color: Colors.textMuted }}>
                        Namaste,
                    </Text>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: Colors.dark }}>
                        {user?.username || 'Citizen'} 👋
                    </Text>
                </View>

                {/* Streak Banner */}
                <StreakBanner streak={12} style={{ marginBottom: 32 }} />

                {/* Quick Actions */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
                    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.border }}>
                        <Award color={Colors.primary} size={32} style={{ marginBottom: 8 }} />
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.dark }}>Score</Text>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: Colors.primary }}>{qualityScore ?? '--'}</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.border }}>
                        <History color={Colors.accent} size={32} style={{ marginBottom: 8 }} />
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.dark }}>History</Text>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: Colors.accent }}>{myPickups.filter(p => p.status === 'completed').length}</Text>
                    </View>
                </View>

                {/* Request Pickup CTA */}
                <PrimaryButton
                    title="Request a Pickup"
                    onPress={() => router.push('/(citizen)/request')}
                    style={{ marginBottom: 32 }}
                />

                {/* Upcoming Pickups */}
                <SectionHeader title="Upcoming Pickup" onSeeAll={() => router.push('/(citizen)/history')} />

                {upcomingPickup ? (
                    <PickupCard
                        date={new Date(upcomingPickup.scheduledWindow.start).toLocaleDateString()}
                        time={`${new Date(upcomingPickup.scheduledWindow.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        status={upcomingPickup.status as any}
                        address={upcomingPickup.citizenLocation.address}
                        wasteTypes={['Waste']}
                    />
                ) : (
                    <View style={{ padding: 20, alignItems: 'center', backgroundColor: Colors.background, borderRadius: 16 }}>
                        <Text style={{ fontFamily: 'Poppins_400Regular', color: Colors.textMuted }}>No upcoming pickups scheduled.</Text>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
