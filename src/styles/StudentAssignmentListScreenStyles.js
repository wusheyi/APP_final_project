import { StyleSheet } from 'react-native';

export const getStudentAssignmentListScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        backgroundColor: theme.colors.card,
        padding: 30, // Larger padding
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 40, // More rounded
        borderBottomRightRadius: 40,
        elevation: 5,
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.1,
        zIndex: 1,
        marginBottom: 20,
    },
    welcome: {
        fontSize: 20, // Larger
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    studentName: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 28, // Larger
    },
    pointsCard: {
        backgroundColor: '#F59E0B',
        borderRadius: 24, // Larger radius
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    pointsValue: {
        color: '#FFF',
        fontSize: 32, // Larger points
        fontWeight: 'bold',
    },
    pointsLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14, // Larger label
        fontWeight: 'bold',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    cardContainer: {
        borderRadius: 20, // Larger radius
        padding: 24, // Larger padding
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 16, // More space between cards
        backgroundColor: theme.colors.card,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 22, // Larger title
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
        flex: 1,
    },
    cardDesc: {
        fontSize: 16, // Larger desc
        color: theme.colors.textSecondary,
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 14, // Larger meta text
        color: theme.colors.textSecondary,
        marginLeft: 6,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginTop: 16,
        color: theme.colors.textSecondary,
        fontSize: 20, // Larger text
    },
});
