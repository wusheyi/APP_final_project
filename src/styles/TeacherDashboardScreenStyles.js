import { StyleSheet } from 'react-native';

export const getTeacherDashboardScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: 24, // Larger padding
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30, // More space
    },
    greeting: {
        fontSize: 18, // Larger
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    name: {
        color: theme.colors.text,
        fontSize: 28, // Larger header
        fontWeight: 'bold',
    },
    summaryCard: {
        borderRadius: 20,
        marginBottom: 30,
        elevation: 4,
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.1,
        backgroundColor: theme.colors.card,
        borderWidth: 0,
        padding: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 16, // Larger row padding
        backgroundColor: theme.colors.background,
        borderRadius: 16,
    },
    subjectText: {
        fontWeight: 'bold',
        marginRight: 10,
        width: 100, // Wider
        color: theme.colors.text,
        fontSize: 18, // Larger text
    },
    missingText: {
        color: theme.colors.error,
        flex: 1,
        fontSize: 16, // Larger text
    },
    emptyState: {
        alignItems: 'center',
        padding: 20,
    },
    noDataText: {
        marginTop: 10,
        color: theme.colors.secondary,
        fontWeight: 'bold',
        fontSize: 18, // Larger text
    },
    sectionTitle: {
        marginBottom: 20,
        color: theme.colors.text,
        fontSize: 24, // Larger title
        fontWeight: 'bold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: -8, // Adjusted for larger spacing
    },
    gridItem: {
        width: '50%',
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    menuCard: {
        borderRadius: 20, // Larger radius
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24, // Larger padding
        height: 140, // Taller card
        elevation: 3,
        marginBottom: 0,
        margin: 0,
        backgroundColor: theme.colors.card,
        borderWidth: 0,
    },
    menuTitle: {
        marginTop: 12,
        fontWeight: 'bold',
        color: theme.colors.text,
        fontSize: 18, // Larger title
    }
});
