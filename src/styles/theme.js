export const lightTheme = {
    dark: false,
    colors: {
        primary: '#6C63FF', // Vibrant Purple-Blue (Modern EdTech)
        secondary: '#00C9A7', // Teal Green
        background: '#F8F9FE', // Bright Blue-ish White
        card: '#FFFFFF',
        text: '#2D3748', // Dark Slate
        textSecondary: '#718096', // Slate 500
        border: '#E2E8F0', // Slate 200
        error: '#FC8181', // Soft Red
        success: '#68D391', // Soft Green
        warning: '#F6AD55', // Orange
        tabBar: '#FFFFFF',
        tabBarActive: '#6C63FF',
        tabBarInactive: '#CBD5E0',
    },
    styles: {
        shadow: {
            shadowColor: '#6C63FF', // Colored shadow
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 5,
        }
    }
};

export const darkTheme = {
    dark: true,
    colors: {
        primary: '#8B85FF', // Lighter Purple
        secondary: '#4FD1C5', // Teal 400
        background: '#1A202C', // Gray 900
        card: '#2D3748', // Gray 800
        text: '#F7FAFC', // Gray 50
        textSecondary: '#A0AEC0', // Gray 400
        border: '#4A5568', // Gray 700
        error: '#FC8181',
        success: '#68D391',
        warning: '#F6AD55',
        tabBar: '#2D3748',
        tabBarActive: '#8B85FF',
        tabBarInactive: '#718096',
    },
    styles: {
        shadow: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
        }
    }
};

// Common spacing/typography
export const commonStyles = {
    spacing: {
        xs: 4,
        s: 10,  // Increased slightly
        m: 16,
        l: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        s: 8,   // Softer corners
        m: 16,
        l: 24,
        xl: 32,
        full: 9999,
    },
    typography: {
        h1: { fontSize: 28, fontWeight: '800', letterSpacing: 0.5 },
        h2: { fontSize: 22, fontWeight: '700', letterSpacing: 0.25 },
        h3: { fontSize: 18, fontWeight: '600' },
        body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
        caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
        button: { fontSize: 16, fontWeight: '700', letterSpacing: 1 },
    },
};
