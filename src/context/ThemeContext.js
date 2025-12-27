import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, commonStyles } from '../styles/theme';

const ThemeContext = createContext();

const FallbackTheme = {
    dark: false,
    colors: {
        primary: '#4F46E5',
        background: '#FFFFFF',
        card: '#FFFFFF',
        text: '#000000',
        textSecondary: '#666666',
        border: '#E5E7EB',
        tabBar: '#FFFFFF',
        tabBarActive: '#4F46E5',
        tabBarInactive: '#9CA3AF',
        error: '#EF4444',
    },
    styles: { shadow: {} },
    spacing: { s: 8, m: 16, l: 24 },
    borderRadius: { m: 8 },
    typography: { h1: { fontSize: 24 }, body: { fontSize: 16 } }
};

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState('system');

    // Robust initialization
    const [theme, setTheme] = useState(() => {
        try {
            if (lightTheme && commonStyles) {
                return { ...lightTheme, ...commonStyles };
            }
        } catch (e) {
            console.warn('Theme import error', e);
        }
        return FallbackTheme;
    });

    // Load saved settings
    useEffect(() => {
        loadSettings();
    }, []);

    // Update theme when mode or system scheme changes
    useEffect(() => {
        if (themeMode) {
            updateTheme(themeMode);
        }
    }, [themeMode, systemScheme]);

    const loadSettings = async () => {
        try {
            const savedMode = await AsyncStorage.getItem('themeMode');
            if (savedMode) setThemeMode(savedMode);
        } catch (e) {
            console.error('Failed to load theme settings');
        }
    };

    const updateTheme = (mode) => {
        try {
            let activeTheme;
            // Ensure imported themes exist, else use fallback
            const lTheme = lightTheme || FallbackTheme;
            const dTheme = darkTheme || FallbackTheme;

            if (mode === 'system') {
                activeTheme = systemScheme === 'dark' ? dTheme : lTheme;
            } else {
                activeTheme = mode === 'dark' ? dTheme : lTheme;
            }

            const common = commonStyles || {};
            setTheme({ ...activeTheme, ...common });
        } catch (e) {
            console.error('Update Theme Error', e);
            setTheme(FallbackTheme); // Last resort
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

    // Safety check for context value
    const contextValue = {
        theme: theme || FallbackTheme, // Never allow undefined
        themeMode,
        setThemeMode: setThemeModeAndSave
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        // Fallback if used outside provider, though app structure prevents this
        return { theme: FallbackTheme, themeMode: 'system', setThemeMode: () => { } };
    }
    return context;
};
