import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from '../api/sheetApi';
import { Text, Card, Badge, Icon, Divider, Button } from '@rneui/themed';
import { useTheme } from '../context/ThemeContext';
import { getStudentAssignmentListScreenStyles } from '../styles/StudentAssignmentListScreenStyles';

export default function StudentAssignmentListScreen({ route, navigation }) {
    const { theme } = useTheme();
    const styles = getStudentAssignmentListScreenStyles(theme);
    const [user, setUser] = useState(route.params?.user || null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        if (!user) {
            AsyncStorage.getItem('user').then(u => u && setUser(JSON.parse(u)));
        }
    }, []);

    const fetchAssignments = async () => {
        const userId = user?.id || (await AsyncStorage.getItem('user').then(u => JSON.parse(u)?.id));
        if (!userId) return;

        try {
            const [assignRes, pointsRes] = await Promise.all([
                apiCall('getAssignments', { studentId: userId }),
                apiCall('getStudentPoints', { studentId: userId })
            ]);

            if (assignRes.status === 'success') {
                setAssignments(assignRes.assignments);
            }
            if (pointsRes.status === 'success') {
                setPoints(pointsRes.points);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user || !loading) fetchAssignments();
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAssignments();
    };

    const StatusBadge = ({ status }) => {
        let statusColor = "grey";
        let icon = "help-circle";

        if (status === '已繳交') {
            statusColor = "success";
            icon = "checkmark-circle";
        } else if (status === '未繳交') {
            statusColor = "error";
            icon = "alert-circle";
        } else if (status === '訂正') {
            statusColor = "warning";
            icon = "build";
        }

        return (
            <Badge
                value={status}
                status={statusColor}
                badgeStyle={{ borderRadius: 5, paddingHorizontal: 5, height: 24 }}
                textStyle={{ fontSize: 12, fontWeight: 'bold' }}
            />
        );
    };

    const renderItem = ({ item }) => (
        <Card containerStyle={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text h4 style={styles.cardTitle}>{item.id}</Text>
                    {item.description ? <Text style={styles.cardDesc} numberOfLines={1}>{item.description}</Text> : null}
                </View>
                <StatusBadge status={item.status || '未繳交'} />
            </View>

            <Divider style={{ marginVertical: 10 }} />

            <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <Icon name="calendar-outline" type="ionicon" size={16} color="#718096" />
                    <Text style={styles.metaText}> {item.endDate ? `截止: ${item.endDate}` : '無期限'}</Text>
                </View>
                {item.grade ? (
                    <View style={styles.metaItem}>
                        <Icon name="ribbon-outline" type="ionicon" size={16} color="#6C63FF" />
                        <Text style={[styles.metaText, { color: '#6C63FF', fontWeight: 'bold' }]}> 得分: {item.grade}</Text>
                    </View>
                ) : null}
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            {/* Header Banner */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>Hello,</Text>
                    <Text h2 style={styles.studentName}>{user?.name || '同學'}</Text>
                </View>
                <View style={styles.pointsCard}>
                    <Icon name="star" type="ionicon" size={24} color="#FFF" />
                    <Text style={styles.pointsValue}>{points}</Text>
                    <Text style={styles.pointsLabel}>PTS</Text>
                </View>
            </View>

            <View style={styles.listContainer}>
                <Text h4 style={{ marginBottom: 10, color: theme.colors.text, marginLeft: 5 }}>我的作業</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={assignments}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Icon name="book-outline" type="ionicon" size={60} color="#CBD5E0" />
                                <Text style={styles.emptyText}>目前沒有作業</Text>
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
}
