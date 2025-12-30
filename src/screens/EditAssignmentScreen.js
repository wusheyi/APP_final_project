import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Input, ListItem, Icon } from '@rneui/themed';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

import { getEditAssignmentScreenStyles } from '../styles/EditAssignmentScreenStyles';

export default function EditAssignmentScreen({ navigation }) {
    const { theme } = useTheme();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Selection state
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [newDescription, setNewDescription] = useState('');

    const styles = getEditAssignmentScreenStyles(theme);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const res = await apiCall('getAssignments');
            if (res.status === 'success') {
                // Sort by date descending
                const sorted = res.assignments.sort((a, b) =>
                    new Date(b.startDate) - new Date(a.startDate)
                );
                setAssignments(sorted);
            } else {
                Alert.alert('Error', res.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleSelect = (item) => {
        setSelectedAssignment(item);
        setNewDescription(item.description || '');
    };

    const handleUpdate = async () => {
        if (!selectedAssignment) return;
        if (!newDescription.trim()) {
            Alert.alert('錯誤', '請輸入新的作業說明');
            return;
        }

        setSubmitting(true);
        try {
            const res = await apiCall('updateAssignmentMetadata', {
                assignmentId: selectedAssignment.id,
                description: newDescription.trim()
            });

            if (res.status === 'success') {
                Alert.alert('成功', '作業說明已更新');
                setSelectedAssignment(null);
                fetchAssignments(); // Refresh list
            } else {
                Alert.alert('失敗', res.message);
            }
        } catch (error) {
            Alert.alert('錯誤', '更新失敗，請檢查網路');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            '刪除作業',
            `確定要刪除 ${selectedAssignment.id} 嗎？\n所有的繳交紀錄與資料表將會被永久移除，無法復原。`,
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '確定刪除',
                    style: 'destructive',
                    onPress: async () => {
                        setSubmitting(true);
                        try {
                            const res = await apiCall('deleteAssignment', { assignmentId: selectedAssignment.id });
                            if (res.status === 'success') {
                                Alert.alert('已刪除', '作業資料已移除');
                                setSelectedAssignment(null);
                                fetchAssignments();
                            } else {
                                Alert.alert('刪除失敗', res.message);
                            }
                        } catch (error) {
                            Alert.alert('錯誤', '連線失敗');
                        } finally {
                            setSubmitting(false);
                        }
                    }
                }
            ]
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
            {selectedAssignment ? (
                <View style={styles.editContainer}>
                    <View style={styles.headerRow}>
                        <Icon
                            name="arrow-back"
                            type="ionicon"
                            color={theme.colors.text}
                            onPress={() => setSelectedAssignment(null)}
                            containerStyle={{ marginRight: 10 }}
                        />
                        <Text h4 style={{ color: theme.colors.text }}>修改作業說明</Text>
                    </View>

                    <Card containerStyle={styles.card}>
                        <Card.Title>編輯內容</Card.Title>
                        <Card.Divider />

                        <Text style={styles.label}>作業 ID (不可修改)</Text>
                        <Text style={styles.value}>{selectedAssignment.id}</Text>

                        <Text style={[styles.label, { marginTop: 15 }]}>截止日期</Text>
                        <Text style={styles.value}>{selectedAssignment.endDate}</Text>

                        <Input
                            label="作業說明"
                            value={newDescription}
                            onChangeText={setNewDescription}
                            containerStyle={{ marginTop: 20, paddingHorizontal: 0 }}
                            placeholder="例如：數學習作 P.10-12"
                        />

                        <Button
                            title="儲存修改"
                            loading={submitting}
                            onPress={handleUpdate}
                            buttonStyle={{ backgroundColor: theme.colors.primary, borderRadius: 8 }}
                            containerStyle={{ marginTop: 20 }}
                        />

                        <Button
                            title="刪除作業"
                            icon={{ name: 'trash', type: 'ionicon', color: 'white' }}
                            onPress={handleDelete}
                            buttonStyle={{ backgroundColor: theme.colors.error, borderRadius: 8 }}
                            containerStyle={{ marginTop: 15 }}
                        />
                    </Card>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContent}>
                    <Text h4 style={styles.pageTitle}>選擇要修改的作業</Text>
                    {assignments.map((item, index) => (
                        <ListItem
                            key={index}
                            bottomDivider
                            onPress={() => handleSelect(item)}
                            containerStyle={{ backgroundColor: theme.colors.card }}
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.itemTitle}>
                                    {item.description || '(無說明)'}
                                </ListItem.Title>
                                <ListItem.Subtitle style={styles.itemSubtitle}>
                                    {item.id} | 截止: {item.endDate}
                                </ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron color={theme.colors.textSecondary} />
                        </ListItem>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}
