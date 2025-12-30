import { StyleSheet } from 'react-native';

export const getHomeScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor will be handled by theme in parent or component
    },
    content: {
        padding: 24, // Larger padding
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30, // Larger margin
        marginTop: 10,
    },
    welcome: {
        fontSize: 18, // Larger
        color: theme.colors.textSecondary,
        letterSpacing: 0.5,
    },
    username: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 28, // Larger
    },
    // Widgets
    widgetCard: {
        borderRadius: 24, // Larger radius
        marginBottom: 30,
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        padding: 0, // customized padding
    },
    widgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
        paddingTop: 10,
    },
    widgetTitle: {
        fontSize: 24, // Larger
        fontWeight: 'bold',
        color: theme.colors.text,
        marginLeft: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    subjectText: {
        fontWeight: 'bold',
        marginRight: 10,
        color: theme.colors.text,
        width: 100,
        fontSize: 18, // Larger
    },
    missingText: {
        color: '#FC8181',
        flex: 1,
        fontSize: 16, // Larger
    },
    emptyState: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    emptyText: {
        marginLeft: 10,
        color: '#68D391',
        fontWeight: 'bold',
        fontSize: 18, // Larger
    },
    // Student Widget
    studentWidgetContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    studentLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16, // Larger
        fontWeight: 'bold',
    },
    studentPoints: {
        color: '#FFFFFF',
        fontSize: 48, // Much Larger
        fontWeight: 'bold',
    },
    // Grid
    sectionTitle: {
        color: theme.colors.text,
        marginBottom: 20,
        fontSize: 24, // Larger
        fontWeight: 'bold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: -8,
    },
    gridItem: {
        width: '48%', // Approx half
        marginBottom: 20,
        borderRadius: 20,
        paddingHorizontal: 8,
    },
    menuCard: {
        borderRadius: 24, // Larger
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 160, // Taller
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        margin: 0, // Reset default Card margin
    },
    iconCircle: {
        width: 70, // Larger
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    menuTitle: {
        fontSize: 18, // Larger
        fontWeight: 'bold',
        color: theme.colors.text,
    },
});
