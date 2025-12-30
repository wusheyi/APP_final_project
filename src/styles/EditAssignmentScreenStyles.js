import { StyleSheet } from 'react-native';

export const getEditAssignmentScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    listContent: {
        padding: 20,
    },
    pageTitle: {
        color: theme.colors.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    itemTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemSubtitle: {
        color: theme.colors.textSecondary,
        marginTop: 5,
        fontSize: 12,
    },
    editContainer: {
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    card: {
        borderRadius: 10,
        padding: 20,
    },
    label: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    value: {
        color: theme.colors.text,
        fontSize: 16,
        marginBottom: 5,
        marginTop: 2,
    }
});
