import { StyleSheet } from 'react-native';

export const getContactBookScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: 24, // Larger padding
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h1,
        color: theme.colors.text,
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 32, // Larger header
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: 24, // Larger padding
        borderRadius: theme.borderRadius.l,
        marginBottom: 24,
        ...theme.styles.shadow,
    },
    cardTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: 20,
        fontSize: 22, // Larger title
    },
    textArea: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.m,
        padding: 16,
        height: 150, // Taller input
        textAlignVertical: 'top',
        marginBottom: 20,
        color: theme.colors.text,
        fontSize: 18, // Larger input text
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: 16, // Larger button padding
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18, // Larger button text
    },
    noteContent: {
        ...theme.typography.body,
        color: theme.colors.text,
        fontSize: 20, // Much larger content text
        lineHeight: 30,
        marginBottom: 24,
    },
    emptyText: {
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
        fontSize: 18,
    },
    signSection: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 24,
        alignItems: 'center',
    },
    signButton: {
        backgroundColor: '#10B981', // Emerald
        paddingVertical: 16, // Larger button
        paddingHorizontal: 40,
        borderRadius: 30,
        ...theme.styles.shadow,
    },
    signBtnText: {
        color: '#fff',
        fontSize: 20, // Larger text
        fontWeight: 'bold',
    },
    signedBadge: {
        alignItems: 'center',
    },
    signedText: {
        color: '#10B981',
        fontSize: 22, // Larger signed text
        fontWeight: 'bold',
    },
    signTime: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        marginTop: 6,
    },
    disabledBtn: {
        opacity: 0.7
    }
});
