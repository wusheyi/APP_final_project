import { StyleSheet } from 'react-native';

export const getStatusDashboardScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: theme.spacing.l, // Increased padding
        backgroundColor: theme.colors.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h2,
        fontSize: 24, // Increased font size
        color: theme.colors.text,
    },
    statsText: {
        ...theme.typography.body,
        fontWeight: '600',
        color: theme.colors.primary,
        fontSize: 16, // Increased font size
        marginTop: 5,
    },
    messageBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.l, // Larger button
        paddingVertical: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
    },
    messageBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16, // Larger text
    },
    listContent: {
        padding: theme.spacing.m,
    },
    row: {
        backgroundColor: theme.colors.card,
        padding: 24, // Much larger padding (was theme.spacing.m ~16)
        borderRadius: theme.borderRadius.l,
        marginBottom: theme.spacing.m, // Increased margin
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...theme.styles.shadow,
    },
    studentInfo: {
        flexDirection: 'column',
        width: '30%', // Slightly wider
    },
    studentId: {
        ...theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.text,
        fontSize: 22, // Significantly larger
        marginBottom: 4,
    },
    studentName: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontSize: 16, // Larger caption
    },
    gradeContainer: {
        flex: 1,
        alignItems: 'center',
    },
    gradeText: {
        ...theme.typography.body,
        color: theme.colors.text,
        textDecorationLine: 'underline',
        fontSize: 20, // Larger grade
    },
    gradeInput: {
        borderBottomWidth: 1,
        borderColor: theme.colors.primary,
        minWidth: 60,
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: 20, // Larger input
    },
    statusContainer: {
        alignItems: 'flex-end',
        width: '35%',
    },
    badge: {
        paddingHorizontal: theme.spacing.m,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.m,
        marginBottom: 6,
    },
    badgeText: {
        fontSize: 16, // Larger badge text
        fontWeight: 'bold',
    },
    timeText: {
        ...theme.typography.caption,
        fontSize: 14, // Larger timestamp
        color: theme.colors.textSecondary,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: theme.spacing.l,
        color: theme.colors.textSecondary,
        fontSize: 18,
    }
});
