import { StyleSheet } from 'react-native';

export const getAnalysisScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.l,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.l,
        position: 'relative',
    },
    headerTitle: {
        ...theme.typography.h1,
        color: theme.colors.text,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.l,
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.l,
        borderRadius: theme.borderRadius.l,
        ...theme.styles.shadow,
    },
    halfCard: {
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        ...theme.typography.h2,
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.s,
    },
    bigValue: {
        ...theme.typography.h1,
        fontSize: 32,
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: theme.colors.border,
        borderRadius: 3,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    statLabel: {
        ...theme.typography.body,
        color: theme.colors.text,
    },
    statValue: {
        ...theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    listItem: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        marginBottom: 10,
        ...theme.styles.shadow,
        borderBottomWidth: 0,
    },
    itemTitle: {
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    itemSubtitle: {
        color: theme.colors.textSecondary,
        marginTop: 5,
    }
});
