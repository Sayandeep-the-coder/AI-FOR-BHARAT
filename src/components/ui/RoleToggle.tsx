import { AppColors as Colors } from '@/constants/appColors';
import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';

export type Role = 'Citizen' | 'Kabadiwalla' | 'Admin';

interface RoleToggleProps {
    selectedRole: Role;
    onChange: (role: Role) => void;
    style?: ViewStyle;
}

export const RoleToggle: React.FC<RoleToggleProps> = ({ selectedRole, onChange, style }) => {
    const roles: Role[] = ['Citizen', 'Kabadiwalla', 'Admin'];

    return (
        <View
            style={[
                {
                    flexDirection: 'row',
                    backgroundColor: Colors.border,
                    borderRadius: 12,
                    padding: 4,
                    alignItems: 'center',
                },
                style,
            ]}
        >
            {roles.map((role) => {
                const isSelected = selectedRole === role;
                return (
                    <TouchableOpacity
                        key={role}
                        activeOpacity={0.7}
                        onPress={() => onChange(role)}
                        style={{
                            flex: 1,
                            paddingVertical: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isSelected ? Colors.white : 'transparent',
                            borderRadius: 10,
                            shadowColor: isSelected ? '#000' : 'transparent',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isSelected ? 0.1 : 0,
                            shadowRadius: 4,
                            elevation: isSelected ? 2 : 0,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: isSelected ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
                                fontSize: 13,
                                color: isSelected ? Colors.primary : Colors.textMuted,
                            }}
                        >
                            {role === 'Admin' ? 'Municipality' : role}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

