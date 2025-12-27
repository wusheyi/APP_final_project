import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

export default function StatusDashboardScreen({ route }) {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const { assignmentId } = route.params;
    const [statusData, setStatusData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const result = await apiCall('getAssignmentStatus', { assignmentId });
                if (result.status === 'success') {
                    setStatusData(result.data);
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [assignmentId]);

    const renderItem = ({ item }) => {
        const isSubmitted = item.status === '已繳交';
        return (
            <View style={styles.row}>
                <View style={styles.studentInfo}>
                    <Text style={styles.studentId}>{item.studentId}</Text>
                    <Text style={styles.studentName}>{item.studentName}</Text>
                </View>
                <View style={styles.statusContainer}>
                    <View style={[styles.badge, { backgroundColor: isSubmitted ? theme.colors.success + '20' : theme.colors.error + '20' }]}>
                        <Text style={[styles.badgeText, { color: isSubmitted ? theme.colors.success : theme.colors.error }]}>
                            {item.status}
                        </Text>
                    </View>
                    {isSubmitted && <Text style={styles.timeText}>{new Date(item.submittedAt).toLocaleTimeString()}</Text>}
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{assignmentId} 繳交狀況</Text>
                <View style={styles.stats}>
                    <Text style={styles.statsText}>
                        已繳交: {statusData.filter(d => d.status === '已繳交').length} / {statusData.length}
                    </Text>
                </View>
            </View>

            <FlatList
                data={statusData}
                renderItem={renderItem}
                keyExtractor={item => item.studentId}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>無資料</Text>
                }
            />
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
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
        padding: theme.spacing.m,
        backgroundColor: theme.colors.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h2,
        fontSize: 20,
        color: theme.colors.text,
    },
    statsText: {
        ...theme.typography.body,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    listContent: {
        padding: theme.spacing.m,
    },
    row: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.s,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...theme.styles.shadow,
    },
    studentInfo: {
        flexDirection: 'column',
    },
    studentId: {
        ...theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    studentName: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    badge: {
        paddingHorizontal: theme.spacing.s,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.s,
        marginBottom: 2,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    timeText: {
        ...theme.typography.caption,
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: theme.spacing.l,
        color: theme.colors.textSecondary,
    }
});
