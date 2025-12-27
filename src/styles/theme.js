export const lightTheme = {
    dark: false,
    colors: {
        primary: '#4F46E5', // Indigo 600
        secondary: '#10B981', // Emerald 500
        background: '#F9FAFB', // Gray 50
        card: '#FFFFFF',
        text: '#111827', // Gray 900
        textSecondary: '#6B7280', // Gray 500
        border: '#E5E7EB', // Gray 200
        error: '#EF4444', // Red 500
        success: '#10B981', // Emerald 500
        tabBar: '#FFFFFF',
        tabBarActive: '#4F46E5',
        tabBarInactive: '#9CA3AF',
    },
    styles: {
        shadow: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }
    }
};

export const darkTheme = {
    dark: true,
    colors: {
        primary: '#6366F1', // Indigo 500 (lighter for dark mode)
        secondary: '#34D399', // Emerald 400
        background: '#1F2937', // Gray 800
        card: '#374151', // Gray 700
        text: '#F9FAFB', // Gray 50
        textSecondary: '#9CA3AF', // Gray 400
        border: '#4B5563', // Gray 600
        error: '#F87171', // Red 400
        success: '#34D399', // Emerald 400
        tabBar: '#111827', // Gray 900
        tabBarActive: '#6366F1',
        tabBarInactive: '#6B7280',
    },
    styles: {
        shadow: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3, // Stronger shadow for dark mode
            shadowRadius: 4,
            elevation: 3,
        }
    }
};

// Common spacing/typography
export const commonStyles = {
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    borderRadius: {
        s: 4,
        m: 8,
        l: 12,
        xl: 16,
        full: 9999,
    },
    typography: {
        h1: { fontSize: 32, fontWeight: '700' },
        h2: { fontSize: 24, fontWeight: '600' },
        body: { fontSize: 16 },
        caption: { fontSize: 14 },
        button: { fontSize: 16, fontWeight: '600' },
    },
};
