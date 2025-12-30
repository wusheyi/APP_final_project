import { StyleSheet } from 'react-native';

export const getAssignmentListScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterContainer: {
        padding: theme.spacing.l, // Increased padding
        backgroundColor: theme.colors.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    input: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        padding: 16, // Larger padding
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        fontSize: 16, // Larger font
    },
    listContent: {
        padding: theme.spacing.m,
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: 24, // Much larger padding
        borderRadius: theme.borderRadius.l,
        marginBottom: theme.spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...theme.styles.shadow,
    },
    cardTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        fontSize: 22, // Larger title
        marginBottom: 8,
    },
    cardDate: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginTop: 4,
        fontSize: 16, // Larger date
    },
    arrow: {
        fontSize: 28, // Larger arrow
        color: theme.colors.textSecondary,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: theme.spacing.xl,
        color: theme.colors.textSecondary,
        fontSize: 18, // Larger text
    },
});
