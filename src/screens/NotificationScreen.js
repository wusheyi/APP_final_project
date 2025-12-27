import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

export default function NotificationScreen({ navigation, route }) {
    // We try to access user from route params. 
    // In Drawer + Tab nesting, params might be deep. 
    // Ideally we'd use a UserContext. For now, we'll try to get it safely or require re-login if missing.
    // NOTE: In the refactored App.js, we must ensure 'user' flows down or is stored globally.
    // For this implementation, we assume `route.params.user` is passed when navigating or defined in initialParams.

    // Fallback: If no user in params, we might need to rely on the parent navigator's params or LocalStorage.
    // To simplify: We'll assume the Dashboard passes user here or we look at Global State.
    // Since we haven't implemented Global UserContext yet (only ThemeContext), 
    // we will check `route.params?.user`.

    const { user } = route.params || {};
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [items, setItems] = useState([]);

    const fetchNotifications = async () => {
        if (!user) return; // Should handle no-user case

        try {
            if (user.role === 'teacher') {
                // Fetch Questions
                const result = await apiCall('getQuestions');
                if (result.status === 'success') {
                    // Filter for "Open" status
                    const openQuestions = result.questions.filter(q => q.status === 'Open');
                    setItems(openQuestions);
                }
            } else {
                // Student: Fetch Assignments
                // We'll show assignments starting in the last 7 days as "New"
                const result = await apiCall('getAssignments');
                if (result.status === 'success') {
                    // Simple logic: Show all active assignments, highlight new ones
                    // For "Notification" purpose, let's just show assignments that are 'active' (not ended long ago)
                    // Or simply duplicate the list for now.
                    // Better: Show assignments where startDate is recent.
                    setItems(result.assignments);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
        } else {
            setLoading(false);
        }
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const renderItem = ({ item }) => {
        if (user.role === 'teacher') {
            // Render Question Item
            return (
                <TouchableOpacity
                    style={styles.card}
                    // Fix: Navigate to Dashboard -> HomeTab -> TeacherQnA (specifically QnA, not Dashboard generic)
                    // If TeacherDashboard is the goal:
                    // navigation.navigate('Dashboard', { screen: 'HomeTab', params: { screen: 'TeacherDashboard' } })
                    // But here we likely want 'TeacherQnA'
                    onPress={() => navigation.navigate('Dashboard', {
                        screen: 'HomeTab',
                        params: { screen: 'TeacherQnA' }
                    })}
                >
                    <View style={styles.headerRow}>
                        <Text style={styles.badge}>提問</Text>
                        <Text style={styles.time}>{new Date(item.timestamp).toLocaleDateString()}</Text>
                    </View>
                    <Text style={styles.title} numberOfLines={1}>{item.questionText}</Text>
                    <Text style={styles.subtitle}>{item.studentId} - {item.assignmentId}</Text>
                    <Text style={styles.actionText}>點擊前往回覆 ➜</Text>
                </TouchableOpacity>
            );
        } else {
            // Render Assignment Item
            return (
                <TouchableOpacity
                    style={styles.card}
                    // Fix: Navigate to Dashboard -> HomeTab -> StudentAssignmentList
                    onPress={() => navigation.navigate('Dashboard', {
                        screen: 'HomeTab',
                        params: { screen: 'StudentAssignmentList', params: { user } }
                    })}
                >
                    <View style={styles.headerRow}>
                        <Text style={[styles.badge, { backgroundColor: theme.colors.secondary }]}>作業</Text>
                        <Text style={styles.time}>{item.startDate}</Text>
                    </View>
                    <Text style={styles.title}>{item.id}</Text>
                    <Text style={styles.subtitle}>{item.description || '無描述'}</Text>
                    <Text style={styles.actionText}>前往查看 ➜</Text>
                </TouchableOpacity>
            );
        }
    };

    if (!user) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>請先登入</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>目前沒有新通知</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    list: {
        padding: theme.spacing.m,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.m,
        ...theme.styles.shadow,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    badge: {
        backgroundColor: theme.colors.error,
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    time: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    title: {
        ...theme.typography.h3,
        color: theme.colors.text,
        marginBottom: 4,
    },
    subtitle: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        marginBottom: 8,
    },
    actionText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    emptyText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
    }
});
