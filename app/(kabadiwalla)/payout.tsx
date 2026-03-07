import { GhostButton } from '@/components/ui/GhostButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AppColors as Colors } from '@/constants/appColors';
import { ArrowUpRight, Landmark } from 'lucide-react-native';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const TRANSACTIONS = [
    { id: '1', date: 'Oct 25, 2023', amount: 850, type: 'Payout', status: 'Processing' },
    { id: '2', date: 'Oct 18, 2023', amount: 1200, type: 'Payout', status: 'Released' },
    { id: '3', date: 'Oct 10, 2023', amount: 950, type: 'Payout', status: 'Released' },
    { id: '4', date: 'Oct 02, 2023', amount: 500, type: 'Payout', status: 'On Hold' },
];

export default function KabadiwallaPayoutScreen() {
    const handleWithdraw = () => {
        Toast.show({ type: 'success', text1: 'Withdrawal Requested', text2: 'Your payout of â‚¹1,250 is being processed.' });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: Colors.dark }}>
                    Payouts & Earnings
                </Text>
            </View>

            <FlatList
                data={TRANSACTIONS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                ListHeaderComponent={() => (
                    <View style={{ marginBottom: 32 }}>
                        <View style={{ backgroundColor: Colors.dark, padding: 24, borderRadius: 20, marginBottom: 24, shadowColor: Colors.dark, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Pending Payout</Text>
                                <Landmark color={Colors.white} size={24} />
                            </View>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 48, color: Colors.white, marginBottom: 24 }}>
                                â‚¹1,250
                            </Text>
                            <GhostButton
                                title="Withdraw to Bank Account"
                                color={Colors.dark}
                                style={{ backgroundColor: Colors.white, borderRadius: 12 }}
                                onPress={handleWithdraw}
                            />
                        </View>

                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: Colors.dark, marginBottom: 16 }}>
                            Transaction History
                        </Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
                                <ArrowUpRight color={Colors.primary} size={24} />
                            </View>
                            <View>
                                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: Colors.dark }}>{item.type}</Text>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textMuted }}>{item.date}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-end', gap: 6 }}>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: Colors.dark }}>â‚¹{item.amount}</Text>
                            <StatusBadge status={item.status as any} />
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

