import { GhostButton } from '@/components/ui/GhostButton';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { StreakBanner } from '@/components/ui/StreakBanner';
import { AppColors as Colors } from '@/constants/appColors';
import { useAuthStore } from '@/stores/authStore';
import { MapPin, User as UserIcon } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CitizenProfileScreen() {
    const { user, clearAuth } = useAuthStore();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: Colors.dark }}>
                    My Profile
                </Text>
                <GhostButton title="Logout" color={Colors.danger} onPress={clearAuth} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                {/* User Info */}
                <View style={{ alignItems: 'center', marginBottom: 32 }}>
                    <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                        <UserIcon color={Colors.primary} size={48} />
                    </View>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 22, color: Colors.dark }}>
                        {user?.username || 'Citizen'}
                    </Text>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.textMuted }}>
                        {user?.email || 'citizen@ecowaste.com'}
                    </Text>
                </View>

                {/* Stats */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 32, gap: 32 }}>
                    <View style={{ alignItems: 'center' }}>
                        <ScoreRing score={85} size={110} strokeWidth={10} />
                    </View>
                    <View style={{ gap: 16 }}>
                        <View>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textMuted }}>Total Earned</Text>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: Colors.success }}>₹450</Text>
                        </View>
                        <View>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textMuted }}>Penalty Points</Text>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: Colors.danger }}>0</Text>
                        </View>
                    </View>
                </View>

                {/* Streak */}
                <StreakBanner streak={12} style={{ marginBottom: 32 }} />

                {/* Address */}
                <View style={{ marginBottom: 32, backgroundColor: Colors.background, padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <MapPin color={Colors.primary} size={24} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.dark }}>Saved Address</Text>
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textMuted }}>123 Green Avenue, Block B, New Delhi</Text>
                    </View>
                </View>

                <GhostButton title="Edit Profile Details" />
            </ScrollView>
        </SafeAreaView>
    );
}
