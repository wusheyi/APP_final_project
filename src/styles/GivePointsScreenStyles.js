import { StyleSheet } from 'react-native';

export const getGivePointsScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.l,
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: 30, // Larger padding
        borderRadius: theme.borderRadius.l,
        ...theme.styles.shadow,
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 28, // Larger title
    },
    label: {
        ...theme.typography.body,
        fontWeight: 'bold',
        marginBottom: 10,
        color: theme.colors.text,
        fontSize: 18, // Larger label
    },
    input: {
        backgroundColor: theme.colors.background,
        padding: 16, // Larger padding
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 30,
        color: theme.colors.text,
        fontSize: 18, // Larger input text
    },
    selector: {
        backgroundColor: theme.colors.background,
        padding: 16, // Larger padding
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 30,
        justifyContent: 'center',
    },
    selectorText: {
        color: theme.colors.text,
        fontSize: 18, // Larger text
    },
    pointsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    pointsInput: {
        flex: 1,
        marginBottom: 0,
        textAlign: 'center',
        marginHorizontal: theme.spacing.s,
        fontSize: 24, // Larger points input
    },
    adjustBtn: {
        backgroundColor: theme.colors.primary,
        width: 50, // Larger button
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    adjustText: {
        color: '#fff',
        fontSize: 30, // Larger symbol
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#F59E0B',
        padding: 16, // Larger padding
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        marginTop: theme.spacing.m,
    },
    buttonText: {
        ...theme.typography.button,
        color: '#fff',
        fontSize: 18, // Larger button text
    },
    // Toggle
    toggleRow: {
        flexDirection: 'row',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.m,
        marginBottom: 30,
        padding: 6,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 12, // Larger padding
        alignItems: 'center',
        borderRadius: theme.borderRadius.s,
    },
    toggleBtnActive: {
        backgroundColor: theme.colors.primary,
    },
    toggleText: {
        color: theme.colors.textSecondary,
        fontWeight: 'bold',
        fontSize: 16, // Larger toggle text
    },
    toggleTextActive: {
        color: '#fff',
    },
    // Modal
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: theme.spacing.xl,
    },
    modalContent: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.l,
    },
    modalTitle: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.m,
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: 22, // Larger modal title
    },
    modalItem: {
        padding: 16, // Larger padding
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    modalItemText: {
        fontSize: 18, // Larger text
        color: theme.colors.text,
    },
    closeBtn: {
        marginTop: theme.spacing.m,
        alignItems: 'center',
        padding: theme.spacing.s,
    },
    closeBtnText: {
        color: theme.colors.error,
        fontWeight: 'bold',
        fontSize: 18, // Larger text
    },
});
