import { AppColors as Colors } from '@/constants/appColors';
import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface ScoreRingProps {
    score: number; // 0-100
    size?: number;
    strokeWidth?: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
    score,
    size = 120,
    strokeWidth = 10,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const validScore = Math.max(0, Math.min(100, score));
    const strokeDashoffset = circumference - (validScore / 100) * circumference;

    let color = Colors.primary;
    if (score < 40) color = Colors.danger;
    else if (score < 70) color = Colors.warning;

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg height={size} width={size} style={{ position: 'absolute' }}>
                <Circle
                    stroke={Colors.border}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    stroke={color}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: size / 4, color: Colors.dark }}>
                    {validScore}
                </Text>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: size / 10, color: Colors.textMuted }}>
                    Score
                </Text>
            </View>
        </View>
    );
};

