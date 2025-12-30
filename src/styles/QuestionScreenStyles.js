import { StyleSheet } from 'react-native';

export const getQuestionScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.l,
    },
    label: {
        ...theme.typography.h2,
        fontSize: 16,
        marginBottom: theme.spacing.s,
        color: theme.colors.text,
    },
    input: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.l,
        fontSize: 16,
        color: theme.colors.text,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
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
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.l,
    },
    historyTitle: {
        ...theme.typography.h2,
        fontSize: 18,
        marginBottom: theme.spacing.m,
        color: theme.colors.text,
    },
    list: {
        paddingBottom: 20,
    },
    historyItem: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    historyTime: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    statusBadge: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    qText: {
        ...theme.typography.body,
        color: theme.colors.text,
        marginBottom: 5,
    },
    aText: {
        ...theme.typography.body,
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginTop: 5,
    },
});
