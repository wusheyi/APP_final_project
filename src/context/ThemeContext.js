import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider as RNEThemeProvider, createTheme, useTheme as useRNETheme } from '@rneui/themed';
import { commonStyles, lightTheme, darkTheme } from '../styles/theme';

const ThemeContext = createContext();

// 1. Define RNE Theme
// 1. Define Colors
const lightColors = {
    primary: '#6C63FF',      // Vibrant Purple-Blue
    secondary: '#00C9A7',    // Teal Green
    background: '#FFFFFF',   // Neutral White
    white: '#FFFFFF',
    grey0: '#F9FAFB',
    grey1: '#E2E8F0',        // Border
    grey2: '#CBD5E0',
    grey3: '#718096',        // Text Secondary
    grey4: '#2D3748',        // Text Primary
    grey5: '#111827',
    error: '#FC8181',
    success: '#68D391',
    warning: '#F6AD55',
    // Compatibility
    card: '#FFFFFF',
    text: '#2D3748',
    textSecondary: '#718096',
    border: '#E2E8F0',
    tabBar: '#FFFFFF',
    tabBarActive: '#6C63FF',
    tabBarInactive: '#CBD5E0',
};

const darkColors = {
    primary: '#8B85FF',
    secondary: '#4FD1C5',
    background: '#1A202C',
    white: '#2D3748',        // Card Background in Dark
    grey0: '#1A202C',
    grey1: '#4A5568',
    grey2: '#718096',
    grey3: '#A0AEC0',
    grey4: '#F7FAFC',
    grey5: '#FFFFFF',
    error: '#FC8181',
    success: '#68D391',
    warning: '#F6AD55',
    // Compatibility
    card: '#2D3748',
    text: '#F7FAFC',
    textSecondary: '#A0AEC0',
    border: '#4A5568',
    tabBar: '#2D3748',
    tabBarActive: '#8B85FF',
    tabBarInactive: '#718096',
};

const themeComponents = {
    Button: {
        radius: 12,
        titleStyle: { fontWeight: 'bold', fontSize: 16 },
        buttonStyle: { paddingVertical: 12 },
    },
    Input: {
        inputContainerStyle: {
            borderBottomWidth: 0,
            backgroundColor: 'rgba(0,0,0,0.05)', // Subtle background
            borderRadius: 12,
            paddingHorizontal: 10,
            height: 50,
        },
        containerStyle: { paddingHorizontal: 0 },
        errorStyle: { margin: 0 },
    },
    Card: {
        containerStyle: {
            borderRadius: 20,
            padding: 16,
            borderWidth: 0,
            shadowColor: '#000', // Neutral shadow
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
            marginBottom: 16,
        },
        titleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'left',
            marginBottom: 10,
        },
    }
};

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState('system');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedMode = await AsyncStorage.getItem('themeMode');
            if (savedMode) setThemeMode(savedMode);
        } catch (e) {
            console.error('Failed to load theme constants');
        }
    };

    const setThemeModeAndSave = async (mode) => {
        setThemeMode(mode);
        try {
            await AsyncStorage.setItem('themeMode', mode);
        } catch (e) {
            console.error('Failed to save theme setting');
        }
    };

    // Determine if dark mode is active for RNE
    const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

    // Generate Dynamic Theme
    const theme = React.useMemo(() => createTheme({
        lightColors,
        darkColors,
        components: themeComponents,
        mode: isDark ? 'dark' : 'light',
    }), [isDark]);

    const contextValue = {
        themeMode,
        setThemeMode: setThemeModeAndSave,
        isDark // Expose isDark specifically for the hook
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            <RNEThemeProvider theme={theme}>
                {children}
            </RNEThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    const { theme } = useRNETheme();
    const { isDark } = context;

    // Force color sync locally to avoid hook lag
    const currentColors = isDark ? darkColors : lightColors;

    // Choose legacy theme (for shadow styles) based on mode
    const legacyTheme = isDark ? darkTheme : lightTheme;

    return {
        ...context,
        theme: {
            ...theme,
            colors: {
                ...theme.colors,
                ...currentColors, // Ensure we use the correct palette
            },
            ...commonStyles, // typography, spacing, borderRadius
            styles: legacyTheme.styles, // shadow
        }
    };
};
