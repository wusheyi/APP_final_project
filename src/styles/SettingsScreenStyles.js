import { StyleSheet } from 'react-native';

export const getSettingsScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m,
    },
    section: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.l,
        marginBottom: theme.spacing.l,
        ...theme.styles.shadow,
    },
    sectionTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
        fontSize: 20,
    },
    label: {
        ...theme.typography.body,
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
    },
    inputGroup: {
        marginTop: theme.spacing.m,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.s,
        padding: theme.spacing.s,
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
    },
    buttonText: {
        ...theme.typography.button,
        color: '#fff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
});
