import { StyleSheet } from 'react-native';

export const getResultScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.l,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100, // Visual balance
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.l,
    },
    title: {
        ...theme.typography.h1,
        marginBottom: theme.spacing.m,
        textAlign: 'center',
        color: theme.colors.text,
    },
    message: {
        ...theme.typography.body,
        fontSize: 18,
        marginBottom: theme.spacing.l,
        textAlign: 'center',
        color: theme.colors.text,
    },
    detailsContainer: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        width: '100%',
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    detailsText: {
        ...theme.typography.caption,
        textAlign: 'center',
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    button: {
        width: '100%',
        paddingVertical: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        marginTop: theme.spacing.m,
    },
    buttonText: {
        ...theme.typography.button,
        color: '#fff',
    },
});
