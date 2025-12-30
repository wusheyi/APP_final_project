import { StyleSheet } from 'react-native';

export const getScannerScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: theme.spacing.l,
    },
    title: {
        ...theme.typography.h1,
        textAlign: 'center',
        marginBottom: theme.spacing.m,
        color: theme.colors.text,
    },
    selectorContainer: {
        marginBottom: theme.spacing.xl,
    },
    label: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.s,
        fontWeight: 'bold',
    },
    selectorButton: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectorText: {
        color: theme.colors.text,
        fontSize: 16,
    },
    selectorArrow: {
        color: theme.colors.primary,
        fontSize: 12,
    },
    mainButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.l,
        borderRadius: theme.borderRadius.l,
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        ...theme.styles.shadow,
    },
    mainButtonText: {
        ...theme.typography.h2,
        color: '#fff',
        fontSize: 20,
    },
    divider: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.m,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: theme.spacing.l,
    },
    modalContent: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        maxHeight: '80%',
    },
    modalTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
        textAlign: 'center',
    },
    modalItem: {
        padding: theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalItemSelected: {
        backgroundColor: theme.colors.primary + '10', // Light primary tint
    },
    modalItemText: {
        fontSize: 16,
        color: theme.colors.text,
    },
    modalItemTextSelected: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    checkMark: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    modalCloseBtn: {
        marginTop: theme.spacing.m,
        padding: theme.spacing.m,
        alignItems: 'center',
    },
    modalCloseText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
    },
    // Overlay UI
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#0f0', // Bright green for visibility
        backgroundColor: 'transparent',
        borderRadius: theme.borderRadius.l,
    },
    instruction: {
        color: '#fff',
        marginTop: theme.spacing.xl,
        fontSize: 18,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: theme.spacing.s,
        borderRadius: theme.borderRadius.s,
        overflow: 'hidden',
    },
    closeBtn: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    closeText: {
        color: '#000',
        fontWeight: 'bold',
    },
    // Loading
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loadingText: {
        color: '#fff',
        marginTop: theme.spacing.m,
        fontSize: 16,
    },
    // Manual Input
    webInput: {
        width: '100%',
        height: 100,
        borderColor: theme.colors.border,
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: theme.colors.card,
        color: theme.colors.text,
        textAlignVertical: 'top',
        fontFamily: 'monospace',
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
    },
    secondaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
