import { GhostButton } from '@/components/ui/GhostButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AppColors as Colors } from '@/constants/appColors';
import { useAuthStore } from '@/stores/authStore';
import { router } from 'expo-router';
import { ArrowRight, BookOpen, FileText } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STATS = [
    { label: 'Total Pickups', value: '4,208', color: Colors.primary },
    { label: 'Compliance %', value: '92%', color: Colors.success },
    { label: 'Active Collectors', value: '145', color: Colors.accent },
    { label: 'Flagged Accounts', value: '12', color: Colors.danger },
];

export default function AdminDashboardScreen() {
    const user = useAuthStore((s) => s.user);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: Colors.dark }}>
                    Overview
                </Text>
                <GhostButton title="Logout" color={Colors.textMuted} onPress={() => useAuthStore.getState().clearAuth()} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                {/* Weekly Stats */}
                <SectionHeader title="Weekly Stats" />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
                    {STATS.map(stat => (
                        <View key={stat.label} style={{ width: '47%', backgroundColor: Colors.background, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.border }}>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textMuted, marginBottom: 4 }}>{stat.label}</Text>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: stat.color }}>{stat.value}</Text>
                        </View>
                    ))}
                </View>

                {/* AI Briefing Card */}
                <SectionHeader title="AI Weekly Briefing" />
                <View style={{ backgroundColor: '#F0F4F8', padding: 20, borderRadius: 16, marginBottom: 32, borderWidth: 1, borderColor: '#D9E2EC' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <BookOpen color={Colors.dark} size={24} />
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: Colors.dark, marginLeft: 8 }}>
                            Week 42 Insights
                        </Text>
                    </View>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.text, marginBottom: 16, lineHeight: 22 }} numberOfLines={3}>
                        Efficiency improved by 14% this week. We detected a slight increase in segregation anomalies in Sector 4 among multi-family dwellings. Action is required.
                    </Text>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignSelf: 'flex-start' }}
                        onPress={() => router.push('/(admin)/briefing')}
                    >
                        <FileText color={Colors.white} size={16} />
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.white, marginLeft: 8, marginRight: 4 }}>Read Full Report</Text>
                        <ArrowRight color={Colors.white} size={16} />
                    </TouchableOpacity>
                </View>

                {/* Anomaly Alerts List */}
                <SectionHeader title="Pending Anomaly Flags" onSeeAll={() => router.push('/(admin)/flags')} />

                {['Karan Singh (Kabadiwalla)', 'Anjali Sharma (Citizen)'].map((name, i) => (
                    <TouchableOpacity
                        key={name}
                        activeOpacity={0.8}
                        onPress={() => router.push('/(admin)/flags')}
                        style={{ backgroundColor: Colors.white, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <View>
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: Colors.dark }}>{name}</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textMuted, marginTop: 4 }}>
                                {i === 0 ? 'Multiple disputed pickups' : 'Consistent wet waste in dry bin'}
                            </Text>
                        </View>
                        <StatusBadge status="Investigating" />
                    </TouchableOpacity>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}
