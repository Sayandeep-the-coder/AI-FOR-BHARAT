/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './src/components/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1B5E20',
                    light: '#4CAF50',
                    dark: '#0A3310',
                },
                accent: {
                    DEFAULT: '#66BB6A',
                },
                background: {
                    DEFAULT: '#F4FBF4',
                },
                dark: {
                    DEFAULT: '#0D1B2A',
                },
                danger: {
                    DEFAULT: '#E53935',
                },
                success: {
                    DEFAULT: '#22c55e',
                },
                warning: {
                    DEFAULT: '#eab308',
                },
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
            },
            fontFamily: {
                poppins: ['Poppins_400Regular'],
                'poppins-semibold': ['Poppins_600SemiBold'],
                'poppins-bold': ['Poppins_700Bold'],
            },
        },
    },
    plugins: [],
};
