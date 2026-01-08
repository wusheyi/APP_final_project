import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

import { getAssignmentListScreenStyles } from '../styles/AssignmentListScreenStyles';
// 作業列表頁面。展示所有歷史與現有作業，支援日期篩選與繳交狀態概覽。
export default function AssignmentListScreen({ navigation }) {
    const { theme } = useTheme();
    const [assignments, setAssignments] = useState([]);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchAssignments = async () => {
        try {
            const result = await apiCall('getAssignments');
            if (result.status === 'success') {
                setAssignments(result.assignments);
                setFilteredAssignments(result.assignments);
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

    useEffect(() => {
        filterAssignments();
    }, [startDate, endDate, assignments]);

    const filterAssignments = () => {
        let filtered = assignments;
        if (startDate) {
            filtered = filtered.filter(a => a.startDate >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(a => a.endDate <= endDate);
        }
        setFilteredAssignments(filtered);
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchAssignments();
    };

    const styles = getAssignmentListScreenStyles(theme);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('StatusDashboard', { assignmentId: item.id })}
        >
            <View>
                <Text style={styles.cardTitle}>{item.description || item.id}</Text>
                <Text style={styles.cardDate}>
                    {item.endDate ? `截止: ${item.endDate}` : ''} ({item.id})
                </Text>
            </View>
            <Text style={styles.arrow}>➜</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="開始日期 (YYYY-MM-DD)"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={startDate}
                    onChangeText={setStartDate}
                />
                <TextInput
                    style={styles.input}
                    placeholder="結束日期 (YYYY-MM-DD)"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={endDate}
                    onChangeText={setEndDate}
                />
            </View>

            <FlatList
                data={filteredAssignments}
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
