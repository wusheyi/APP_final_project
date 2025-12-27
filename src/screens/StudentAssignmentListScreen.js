import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

export default function StudentAssignmentListScreen({ route }) {
    const { user } = route.params || {};
    const { theme } = useTheme();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAssignments = async () => {
        try {
            const result = await apiCall('getAssignments', { studentId: user?.id });
            if (result.status === 'success') {
                setAssignments(result.assignments);
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAssignments();
    };

    const styles = getStyles(theme);

    const renderItem = ({ item }) => {
        const isSubmitted = item.status === '已繳交';
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.cardTitle}>{item.id}</Text>
                        {item.endDate && <Text style={styles.date}>截止: {item.endDate}</Text>}
                    </View>
                    <View style={[styles.badge, isSubmitted ? styles.badgeSuccess : styles.badgePending]}>
                        <Text style={styles.badgeText}>{item.status || '未繳交'}</Text>
                    </View>
                </View>

                {item.startDate && <Text style={styles.meta}>開始: {item.startDate}</Text>}

                {item.description ? (
                    <Text style={styles.description}>{item.description}</Text>
                ) : (
                    <Text style={styles.noDesc}>無說明</Text>
                )}
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
            <FlatList
                data={assignments}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>目前沒有作業</Text>
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
    listContent: {
        padding: theme.spacing.m,
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.l,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.m,
        ...theme.styles.shadow,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.s,
    },
    cardTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        fontSize: 18,
    },
    date: {
        ...theme.typography.caption,
        color: theme.colors.error,
        fontWeight: 'bold',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeSuccess: {
        backgroundColor: theme.colors.success + '20',
    },
    badgePending: {
        backgroundColor: theme.colors.textSecondary + '20',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    meta: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.s,
    },
    description: {
        ...theme.typography.body,
        color: theme.colors.text,
        marginTop: theme.spacing.s,
        paddingTop: theme.spacing.s,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    noDesc: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
        marginTop: theme.spacing.s,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: theme.spacing.xl,
        color: theme.colors.textSecondary,
        fontSize: 16,
    },
});
