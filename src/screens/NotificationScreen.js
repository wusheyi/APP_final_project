import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

import { getNotificationScreenStyles } from '../styles/NotificationScreenStyles';

// 通知頁面。教師可在此查看提問，學生可在此查看作業。
export default function NotificationScreen({ navigation, route }) {
    const { user } = route.params || {};
    const { theme } = useTheme();
    const styles = getNotificationScreenStyles(theme);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [items, setItems] = useState([]);

    const fetchNotifications = async () => {
        if (!user) return;

        try {
            if (user.role === 'teacher') {
                const result = await apiCall('getQuestions');
                if (result.status === 'success') {
                    const openQuestions = result.questions.filter(q => q.status === 'Open');
                    setItems(openQuestions);
                }
            } else {
                const result = await apiCall('getAssignments');
                if (result.status === 'success') {
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
            return (
                <TouchableOpacity
                    style={styles.card}
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
            return (
                <TouchableOpacity
                    style={styles.card}
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
