import { StyleSheet } from 'react-native';

export const getTeacherQnAScreenStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: theme.spacing.m },
    card: {
        backgroundColor: theme.colors.card,
        padding: 24, // Larger padding
        borderRadius: 16,
        marginBottom: 16,
        ...theme.styles.shadow
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    qId: { fontWeight: 'bold', color: theme.colors.textSecondary, fontSize: 16 },
    status: { fontWeight: 'bold', fontSize: 14 },
    statusOpen: { color: theme.colors.error },
    statusClosed: { color: theme.colors.success },
    assignment: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 12 },
    qText: { fontSize: 20, marginBottom: 16, color: theme.colors.text, fontWeight: '500' }, // Much larger question text
    answerBox: { backgroundColor: theme.dark ? '#333' : '#f0f0f0', padding: 16, borderRadius: 8, marginBottom: 12 },
    aText: { color: theme.colors.primary, fontSize: 18 }, // Larger answer text
    replyButton: { backgroundColor: theme.colors.secondary, padding: 12, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12 },
    replyButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    time: { fontSize: 12, color: theme.colors.textSecondary, textAlign: 'right' },
    empty: { textAlign: 'center', marginTop: 20, color: theme.colors.textSecondary, fontSize: 18 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: theme.colors.card, padding: 24, borderRadius: 20 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text },
    modalQ: { marginBottom: 24, fontStyle: 'italic', color: theme.colors.textSecondary, fontSize: 18 },
    input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 16, height: 150, textAlignVertical: 'top', marginBottom: 24, color: theme.colors.text, fontSize: 18 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
    cancelBtn: { padding: 16, marginRight: 16 },
    submitBtn: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 12, width: 100, alignItems: 'center' },
    btnText: { color: theme.colors.text, fontWeight: 'bold', fontSize: 16 },
});
