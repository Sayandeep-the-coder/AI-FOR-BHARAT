import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { AppColors as Colors } from '@/constants/appColors';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const WASTE_TYPES = ['Dry', 'Wet', 'E-Waste', 'Hazardous'];

export default function RequestPickupScreen() {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');

    const toggleType = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleSchedule = () => {
        if (selectedTypes.length === 0) {
            Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please select at least one waste type.' });
            return;
        }
        if (!address) {
            Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please provide an address.' });
            return;
        }

        Toast.show({ type: 'success', text1: 'Success', text2: 'Pickup requested successfully!' });
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                    <ArrowLeft color={Colors.dark} size={24} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: Colors.dark, marginLeft: 8 }}>
                    Request a Pickup
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                {/* Date & Time Mock */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: Colors.dark, marginBottom: 8 }}>When should we come?</Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border }}>
                            <Calendar color={Colors.primary} size={20} style={{ marginRight: 8 }} />
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.text }}>Today</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border }}>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.text }}>2 PM - 4 PM</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Address */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: Colors.dark, marginBottom: 8 }}>Pickup Location</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <MapPin color={Colors.primary} size={20} />
                        <TouchableOpacity>
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.primary }}>Use Current Location</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={{ backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 16, fontFamily: 'Poppins_400Regular', fontSize: 14, height: 100 }}
                        placeholder="Enter full address here..."
                        multiline
                        textAlignVertical="top"
                        value={address}
                        onChangeText={setAddress}
                    />
                </View>

                {/* Waste Types */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: Colors.dark, marginBottom: 8 }}>Types of Waste</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                        {WASTE_TYPES.map(type => {
                            const isSelected = selectedTypes.includes(type);
                            return (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => toggleType(type)}
                                    style={{
                                        backgroundColor: isSelected ? Colors.primary : Colors.white,
                                        borderWidth: 1,
                                        borderColor: isSelected ? Colors.primary : Colors.border,
                                        borderRadius: 20,
                                        paddingVertical: 8,
                                        paddingHorizontal: 16,
                                    }}
                                >
                                    <Text style={{ fontFamily: isSelected ? 'Poppins_600SemiBold' : 'Poppins_400Regular', fontSize: 14, color: isSelected ? Colors.white : Colors.textMuted }}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Notes */}
                <View style={{ marginBottom: 32 }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: Colors.dark, marginBottom: 8 }}>Additional Notes (Optional)</Text>
                    <TextInput
                        style={{ backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 16, fontFamily: 'Poppins_400Regular', fontSize: 14 }}
                        placeholder="Any instructions for the kabadiwalla?"
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>

                <PrimaryButton title="Schedule Pickup" onPress={handleSchedule} />
            </ScrollView>
        </SafeAreaView>
    );
}

