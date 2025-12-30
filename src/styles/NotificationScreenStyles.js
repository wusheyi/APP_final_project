import { StyleSheet } from 'react-native';

export const getNotificationScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    list: {
        padding: 24, // Larger padding
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: 24, // Larger padding
        borderRadius: theme.borderRadius.l,
        marginBottom: 16,
        ...theme.styles.shadow,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    badge: {
        backgroundColor: theme.colors.error,
        color: '#fff',
        fontSize: 14, // Larger font
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        overflow: 'hidden',
    },
    time: {
        color: theme.colors.textSecondary,
        fontSize: 14, // Larger font
    },
    title: {
        ...theme.typography.h3,
        color: theme.colors.text,
        marginBottom: 8,
        fontSize: 20, // Larger title
    },
    subtitle: {
        color: theme.colors.textSecondary,
        fontSize: 16, // Larger subtitle
        marginBottom: 12,
    },
    actionText: {
        color: theme.colors.primary,
        fontSize: 16, // Larger action text
        fontWeight: 'bold',
        textAlign: 'right',
    },
    emptyText: {
        color: theme.colors.textSecondary,
        fontSize: 20, // Larger empty text
    }
});
