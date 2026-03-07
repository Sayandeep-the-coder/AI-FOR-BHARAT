import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Role, RoleToggle } from '@/components/ui/RoleToggle';
import { AppColors as Colors } from '@/constants/appColors';
import { authClient } from '@/services/betterAuth';
import { useAuthStore } from '@/stores/authStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState<Role>('Citizen');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (isLogin) {
                const { error } = await authClient.signIn.email({ email, password });
                if (error) throw new Error(error.message || 'Login failed');
            } else {
                const { error } = await authClient.signUp.email({ email, password, name, username: name, role: role.toLowerCase() } as any);
                if (error) throw new Error(error.message || 'Registration failed');
            }

            // Hydrate the store so `user` gets updated in context
            await useAuthStore.getState().hydrateFromStorage();

            if (!isLogin) {
                if (role === 'Citizen') router.replace('/(citizen)/home');
                else if (role === 'Kabadiwalla') router.replace('/(kabadiwalla)/dashboard');
                else router.replace('/(admin)/dashboard');
            }
        } catch (e: any) {
            Toast.show({ type: 'error', text1: 'Authentication Error', text2: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.white }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 32, color: Colors.dark, marginBottom: 8 }}>
                    {isLogin ? 'Welcome Back!' : 'Create Account'}
                </Text>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 16, color: Colors.textMuted, marginBottom: 32 }}>
                    {isLogin ? 'Sign in to continue to EcoWaste' : 'Join EcoWaste and keep Bharat clean'}
                </Text>

                {!isLogin && (
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.dark, marginBottom: 8 }}>
                            I am a...
                        </Text>
                        <RoleToggle selectedRole={role} onChange={setRole} />
                    </View>
                )}

                {!isLogin && (
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.dark, marginBottom: 8 }}>Full Name</Text>
                        <TextInput
                            style={{ backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 16, fontFamily: 'Poppins_400Regular', fontSize: 16 }}
                            placeholder="John Doe"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                )}

                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.dark, marginBottom: 8 }}>Email Address</Text>
                    <TextInput
                        style={{ backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 16, fontFamily: 'Poppins_400Regular', fontSize: 16 }}
                        placeholder="john@example.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={{ marginBottom: 32 }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.dark, marginBottom: 8 }}>Password</Text>
                    <TextInput
                        style={{ backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 16, fontFamily: 'Poppins_400Regular', fontSize: 16 }}
                        placeholder="••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <PrimaryButton
                    title={isLogin ? 'Sign In' : 'Sign Up'}
                    onPress={handleSubmit}
                    loading={isLoading}
                    style={{ marginBottom: 16 }}
                />

                <TouchableOpacity
                    style={{ paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: 12 }}
                    activeOpacity={0.7}
                >
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.dark }}>
                        Continue with Google
                    </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.textMuted }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </Text>
                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.primary }}>
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
