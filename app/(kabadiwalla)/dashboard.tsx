import { PickupCard } from '@/components/cards/PickupCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AppColors as Colors } from '@/constants/appColors';
import { useAuthStore } from '@/stores/authStore';
import { usePickupStore } from '@/stores/pickupStore';
import { router } from 'expo-router';
import { Zap } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function KabadiwallaDashboardScreen() {
    const user = useAuthStore((s) => s.user);
    const { todayRoute, isLoading, fetchTodayRoute, setActivePickup } = usePickupStore();

    useEffect(() => {
        fetchTodayRoute();
    }, []);

    const getAIRoute = async () => {
        try {
            await fetchTodayRoute();
            Toast.show({ type: 'success', text1: 'Route Optimized!', text2: 'Your route has been reordered by AI for maximum efficiency.' });
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Optimization Failed', text2: 'Could not connect to route optimization service.' });
        }
    };

    const handlePickupPress = (pickup: any) => {
        setActivePickup(pickup);
        router.push('/(kabadiwalla)/pickup-detail');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchTodayRoute} colors={[Colors.primary]} />
                }
            >
                {/* Header */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 16, color: Colors.textMuted }}>
                        Namaste,
                    </Text>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: Colors.dark }}>
                        {user?.username || 'Kabadiwalla'} 👋
                    </Text>
                </View>

                {/* AI Route Card */}
                <View style={{ backgroundColor: '#E8F5E9', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#C8E6C9' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <Zap color={Colors.primary} size={24} />
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: Colors.primaryDark, marginLeft: 8 }}>
                            Today's Route
                        </Text>
                    </View>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.primaryDark, marginBottom: 16 }}>
                        AI Optimized — {todayRoute.length} stops today
                    </Text>
                    <PrimaryButton title="Get AI Route" onPress={getAIRoute} loading={isLoading} />
                </View>

                {/* Earnings Summary (Placeholder - could be connected to userService.getEarnings) */}
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
                    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: Colors.border }}>
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textMuted, marginBottom: 4 }}>Pending Payout</Text>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: Colors.dark }}>₹1,250</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: Colors.border }}>
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textMuted, marginBottom: 4 }}>Pickups Done</Text>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: Colors.dark }}>{todayRoute.filter(p => p.status === 'completed').length}</Text>
                    </View>
                </View>

                {/* Today's Pickups */}
                <SectionHeader title="Today's Pickups" />

                {todayRoute.length === 0 && !isLoading ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Poppins_400Regular', color: Colors.textMuted }}>No pickups scheduled for today.</Text>
                    </View>
                ) : (
                    todayRoute.map((pickup) => (
                        <TouchableOpacity
                            key={pickup._id}
                            activeOpacity={0.8}
                            onPress={() => handlePickupPress(pickup)}
                        >
                            <PickupCard
                                date="Today"
                                time={`${new Date(pickup.scheduledWindow.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                status={pickup.status as any}
                                address={pickup.citizenLocation.address}
                                wasteTypes={['Waste']} // This could be more dynamic if the model had waste types
                                style={{ marginBottom: 12 }}
                            />
                        </TouchableOpacity>
                    ))
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
