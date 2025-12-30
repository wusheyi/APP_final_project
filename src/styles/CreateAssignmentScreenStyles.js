import { StyleSheet } from 'react-native';

export const getCreateAssignmentScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.l,
    },
    label: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.s,
        fontSize: 16,
        color: theme.colors.text,
    },
    input: {
        backgroundColor: theme.colors.card,
        color: theme.colors.text,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        fontSize: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.l,
    },
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.l,
    },
    dateButtonText: {
        fontSize: 16,
        color: theme.colors.text,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.m,
        paddingVertical: 12,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerContainer: {
        backgroundColor: theme.colors.card, // Updated to use theme card color
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        ...theme.styles.shadow, // Add shadow for better depth
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: theme.colors.text, // Explicit theme color
    },
    dateControlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text, // Explicit theme color
    },
    previewDate: {
        fontSize: 16,
        color: theme.colors.textSecondary, // Use secondary text color
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    }
});
