import { PickupCard } from '@/components/cards/PickupCard';
import { AppColors as Colors } from '@/constants/appColors';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HISTORY_DATA = [
    { id: '1', date: 'Oct 24, 2023', time: '10:00 AM', kabadiwallaName: 'Ramesh Singh', status: 'Completed', wasteTypes: ['Dry', 'Wet'], score: 15 },
    { id: '2', date: 'Nov 02, 2023', time: '1:30 PM', kabadiwallaName: 'Sunil Kumar', status: 'Pending', wasteTypes: ['E-Waste'], score: undefined },
    { id: '3', date: 'Nov 12, 2023', time: '4:00 PM', kabadiwallaName: 'Amit Sharma', status: 'Disputed', wasteTypes: ['Hazardous'], score: 0 },
    { id: '4', date: 'Dec 05, 2023', time: '11:00 AM', kabadiwallaName: 'Rohit Verma', status: 'Completed', wasteTypes: ['Dry', 'E-Waste'], score: 25 },
] as const;

export default function CitizenHistoryScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: Colors.dark }}>
                    Pickup History
                </Text>
            </View>

            <FlatList
                data={HISTORY_DATA as any}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 24 }}
                renderItem={({ item }) => (
                    <PickupCard
                        date={item.date}
                        time={item.time}
                        kabadiwallaName={item.kabadiwallaName}
                        status={item.status as any}
                        wasteTypes={item.wasteTypes as unknown as string[]}
                        score={item.score}
                    />
                )}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: Colors.dark, marginBottom: 8 }}>Koi pickup nahi mila</Text>
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.textMuted }}>No pickups found yet.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
