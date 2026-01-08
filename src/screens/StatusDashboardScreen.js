import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';
import { BottomSheet, ListItem } from '@rneui/themed';

import { getStatusDashboardScreenStyles } from '../styles/StatusDashboardScreenStyles';

// 作業狀態管理頁面。教師可在此查看學生作業狀態並修改評分。
export default function StatusDashboardScreen({ route }) {
    const { theme } = useTheme();
    const styles = getStatusDashboardScreenStyles(theme);
    const { assignmentId } = route.params;
    const [statusData, setStatusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [tempGrade, setTempGrade] = useState('');

    // BottomSheet state
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [selectedStudentForStatus, setSelectedStudentForStatus] = useState(null);

    useEffect(() => {
        fetchStatus();
    }, [assignmentId]);

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

    const handleGradePress = (studentId, currentGrade) => {
        setEditingId(studentId);
        setTempGrade(currentGrade || '');
    };

    const submitGrade = async (studentId) => {
        // Optimistic update
        const newData = statusData.map(item =>
            item.studentId === studentId ? { ...item, grade: tempGrade } : item
        );
        setStatusData(newData);
        setEditingId(null);

        // API Call
        await apiCall('updateGrade', { assignmentId, studentId, grade: tempGrade });
    };

    const handleStatusPress = (item) => {
        setSelectedStudentForStatus(item);
        setIsSheetVisible(true);
    };

    const changeStatus = async (newStatus) => {
        setIsSheetVisible(false); // Close sheet
        if (!selectedStudentForStatus) return;

        const studentId = selectedStudentForStatus.studentId;

        // Optimistic Update
        const newData = statusData.map(item =>
            item.studentId === studentId ? { ...item, status: newStatus, submittedAt: newStatus === '已繳交' ? new Date().toISOString() : item.submittedAt } : item
        );
        setStatusData(newData);

        try {
            await apiCall('updateStatus', {
                assignmentId,
                studentId,
                status: newStatus
            });
        } catch (error) {
            console.error('Failed to update status');
            fetchStatus(); // Revert on error
        }
    };

    // Bottom Sheet Options
    const statusOptions = [
        { title: '已繳交', containerStyle: { backgroundColor: theme.colors.success }, titleStyle: { color: 'white' }, onPress: () => changeStatus('已繳交') },
        { title: '修改', containerStyle: { backgroundColor: '#FFA500' }, titleStyle: { color: 'white' }, onPress: () => changeStatus('修改') },
        { title: '未繳交', containerStyle: { backgroundColor: theme.colors.error }, titleStyle: { color: 'white' }, onPress: () => changeStatus('未繳交') },
        { title: '取消', containerStyle: { backgroundColor: 'white' }, titleStyle: { color: 'black' }, onPress: () => setIsSheetVisible(false) },
    ];

    const generateParentMessages = () => {
        const missingStudents = statusData.filter(s => s.status !== '已繳交');
        if (missingStudents.length === 0) {
            Alert.alert('提示', '所有學生皆已繳交作業！');
            return;
        }

        const messages = missingStudents.map(s =>
            `${s.studentName}同學家長你好，你的小孩近期有作業(${assignmentId})缺交。`
        ).join('\n\n');

        Alert.alert('催繳訊息生成', messages);
    };

    const renderItem = ({ item }) => {
        const isSubmitted = item.status === '已繳交';
        const isCorrection = item.status === '訂正';

        let badgeColor = theme.colors.error;
        let badgeBg = theme.colors.error + '20';

        if (isSubmitted) {
            badgeColor = theme.colors.success;
            badgeBg = theme.colors.success + '20';
        } else if (isCorrection) {
            badgeColor = '#FFA500'; // Orange
            badgeBg = '#FFA50020';
        }

        return (
            <View style={styles.row}>
                <View style={styles.studentInfo}>
                    <Text style={styles.studentId}>{item.studentId}</Text>
                    <Text style={styles.studentName}>{item.studentName}</Text>
                </View>

                {/* Grading Section */}
                <View style={styles.gradeContainer}>
                    {editingId === item.studentId ? (
                        <TextInput
                            style={styles.gradeInput}
                            value={tempGrade}
                            onChangeText={setTempGrade}
                            onBlur={() => submitGrade(item.studentId)}
                            autoFocus
                            placeholder="評分"
                        />
                    ) : (
                        <TouchableOpacity onPress={() => handleGradePress(item.studentId, item.grade)}>
                            <Text style={styles.gradeText}>
                                {item.grade ? `成績: ${item.grade}` : '未評分'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.statusContainer}>
                    <TouchableOpacity onPress={() => handleStatusPress(item)}>
                        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                            <Text style={[styles.badgeText, { color: badgeColor }]}>
                                {item.status}
                            </Text>
                        </View>
                    </TouchableOpacity>
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
                <View>
                    <Text style={styles.headerTitle}>{assignmentId} 繳交狀況</Text>
                    <Text style={styles.statsText}>
                        已繳交: {statusData.filter(d => d.status === '已繳交').length} / {statusData.length}
                    </Text>
                </View>

                <TouchableOpacity style={styles.messageBtn} onPress={generateParentMessages}>
                    <Text style={styles.messageBtnText}>📢 生成催繳訊息</Text>
                </TouchableOpacity>
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

            <BottomSheet isVisible={isSheetVisible} onBackdropPress={() => setIsSheetVisible(false)}>
                {statusOptions.map((l, i) => (
                    <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
                        <ListItem.Content style={{ alignItems: 'center' }}>
                            <ListItem.Title style={[{ fontWeight: 'bold' }, l.titleStyle]}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>
        </View>
    );
}
