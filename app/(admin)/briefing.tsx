import { AppColors as Colors } from '@/constants/appColors';
import { AlertTriangle, MapPin, TrendingUp, Wallet } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminBriefingScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: Colors.dark }}>
                    AI Weekly Briefing
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.textMuted, marginBottom: 24 }}>
                    Generated for Week 42 (Oct 18 - Oct 25, 2023)
                </Text>

                {/* Section 1: Pickups */}
                <View style={{ marginBottom: 32 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ backgroundColor: Colors.primaryLight, padding: 8, borderRadius: 8, marginRight: 12 }}>
                            <TrendingUp color={Colors.white} size={20} />
                        </View>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: Colors.dark }}>
                            Pickup Efficiency
                        </Text>
                    </View>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 15, color: Colors.text, lineHeight: 24 }}>
                        System-wide pickup efficiency improved by 14% this week. Route optimization algorithms successfully reduced average kabadiwalla transit time by 22 mins per day. Total carbon emissions saved: 420 kg CO2.
                    </Text>
                </View>

                {/* Section 2: Anomalies */}
                <View style={{ marginBottom: 32 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ backgroundColor: Colors.danger, padding: 8, borderRadius: 8, marginRight: 12 }}>
                            <AlertTriangle color={Colors.white} size={20} />
                        </View>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: Colors.dark }}>
                            Compliance Anomalies
                        </Text>
                    </View>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 15, color: Colors.text, lineHeight: 24 }}>
                        Detected a 5% increase in segregation anomalies in Sector 4 among multi-family dwellings. Primary issue is mixing of wet food waste with dry recyclables. Recommended action: Targeted push notifications educating users on bin color codes.
                    </Text>
                </View>

                {/* Section 3: Payouts */}
                <View style={{ marginBottom: 32 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ backgroundColor: Colors.warning, padding: 8, borderRadius: 8, marginRight: 12 }}>
                            <Wallet color={Colors.white} size={20} />
                        </View>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: Colors.dark }}>
                            Wallet Velocity
                        </Text>
                    </View>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 15, color: Colors.text, lineHeight: 24 }}>
                        Total payouts to citizens reached â‚¹42,500 this week. Payout processing times remain under 2 hours for 98% of completed and verified transactions. No suspicious withdrawal patterns detected.
                    </Text>
                </View>

                {/* Section 4: Zoning */}
                <View style={{ marginBottom: 32 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ backgroundColor: Colors.accent, padding: 8, borderRadius: 8, marginRight: 12 }}>
                            <MapPin color={Colors.white} size={20} />
                        </View>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: Colors.dark }}>
                            Coverage Optimization
                        </Text>
                    </View>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 15, color: Colors.text, lineHeight: 24 }}>
                        Sector 12 currently has a shortage of active kabadiwallas (1 collector per 500 households compared to 1 per 200 city-wide average). Recommend launching a sign-up incentive program in this specific area to meet demand.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

