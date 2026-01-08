import { StyleSheet } from 'react-native';

export const getScannerScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    // Camera Overlay
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 280, // Larger frame
        height: 280,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    instruction: {
        color: '#fff',
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    closeBtn: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 20,
    },
    closeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Main Content (Non-Camera)
    contentContainer: {
        flex: 1,
        padding: 24, // Matches Large UI
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 30, // Larger margin
        fontSize: 28, // Larger font
    },
    selectorContainer: {
        marginBottom: 30,
    },
    label: {
        fontSize: 18, // Larger
        color: theme.colors.textSecondary,
        marginBottom: 10,
    },
    selectorButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        padding: 16, // Larger
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    selectorText: {
        fontSize: 16,
        color: theme.colors.text,
        flex: 1,
    },
    selectorArrow: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    mainButton: {
        backgroundColor: theme.colors.primary,
        padding: 20, // Larger Button
        borderRadius: theme.borderRadius.l,
        alignItems: 'center',
        marginBottom: 30,
        ...theme.styles.shadow,
    },
    mainButtonText: {
        color: '#fff',
        fontSize: 20, // Larger Text
        fontWeight: 'bold',
    },
    divider: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginBottom: 20,
        fontSize: 16,
    },
    webInput: {
        backgroundColor: theme.colors.card,
        padding: 16,
        borderRadius: theme.borderRadius.m,
        color: theme.colors.text,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        minHeight: 80,
        textAlignVertical: 'top',
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary,
        padding: 16,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
    },
    secondaryText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: theme.colors.card,
        borderRadius: 20,
        padding: 24,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: theme.colors.text,
        textAlign: 'center',
    },
    modalItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalItemSelected: {
        backgroundColor: theme.colors.primary + '10', // 10% opacity primary
    },
    modalItemText: {
        fontSize: 18,
        color: theme.colors.text,
        marginBottom: 4,
    },
    modalItemTextSelected: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    checkMark: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalCloseBtn: {
        marginTop: 20,
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.m,
    },
    modalCloseText: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 18,
    },

    // Loading Overlay
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },

    // NEW: Continuous Scan Result Overlay
    resultOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        zIndex: 100, // Ensure on top
    },
    resultContent: {
        alignItems: 'center',
    },
    resultIcon: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    resultTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    resultDetails: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.9,
    },
    tapToDismiss: {
        marginTop: 30,
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
    }
});
