import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';
import { useAuth } from '../context/AuthContext';
import { Text, Card, Icon, Button, ListItem, Avatar } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';

import { getAnalysisScreenStyles } from '../styles/AnalysisScreenStyles';

export default function AnalysisScreen({ navigation }) {
    const { theme } = useTheme();
    const styles = getAnalysisScreenStyles(theme);
    const { user } = useAuth();

    // Safety check for logout transition
    if (!user) return null;

    const isTeacher = user.role === 'teacher';

    const [loading, setLoading] = useState(false);

    // Student Data
    const [studentStats, setStudentStats] = useState(null);

    // Teacher Data
    const [classStats, setClassStats] = useState(null);
    const [studentList, setStudentList] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null); // For Teacher viewing specific student

    useFocusEffect(
        useCallback(() => {
            if (isTeacher) {
                fetchClassStats();
            } else {
                fetchStudentStats(user.id);
            }
        }, [isTeacher, user.id])
    );

    const fetchStudentStats = async (studentId) => {
        setLoading(true);
        try {
            const res = await apiCall('getStudentStats', { studentId });
            if (res.status === 'success') {
                setStudentStats(res.stats);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchClassStats = async () => {
        setLoading(true);
        try {
            const res = await apiCall('getClassStats');
            if (res.status === 'success') {
                setClassStats(res.classStats);
                setStudentList(res.students);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        fetchStudentStats(student.id); // Fetch detailed stats for selected student
    };

    const handleBackToOverview = () => {
        setSelectedStudent(null);
        setStudentStats(null);
        fetchClassStats(); // Refresh overview
    };

    // Sub-components
    const renderStatsView = (stats, title) => {
        if (!stats) return <ActivityIndicator size="large" color={theme.colors.primary} />;

        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <View style={styles.headerContainer}>
                    {isTeacher && selectedStudent && (
                        <Button
                            icon={<Icon name="arrow-back" color={theme.colors.primary} />}
                            type="clear"
                            onPress={handleBackToOverview}
                            containerStyle={{ position: 'absolute', left: 0, zIndex: 10 }}
                        />
                    )}
                    <Text style={styles.headerTitle}>{title}</Text>
                </View>

                <View style={styles.row}>
                    <View style={[styles.card, styles.halfCard]}>
                        <Text style={styles.label}>作業繳交率</Text>
                        <Text style={styles.bigValue}>{stats.submissionRate}%</Text>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${stats.submissionRate}%`, backgroundColor: theme.colors.primary }]} />
                        </View>
                    </View>

                    <View style={[styles.card, styles.halfCard]}>
                        <Text style={styles.label}>平均成績</Text>
                        <Text style={styles.bigValue}>{stats.avgScore}</Text>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${stats.avgScore}%`, backgroundColor: '#F59E0B' }]} />
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>詳細數據</Text>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>總作業數:</Text>
                        <Text style={styles.statValue}>{stats.totalAssignments}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>已繳交:</Text>
                        <Text style={styles.statValue}>{stats.submittedCount}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>缺交:</Text>
                        <Text style={styles.statValue}>{stats.totalAssignments - stats.submittedCount}</Text>
                    </View>
                </View>
            </ScrollView>
        );
    };

    const renderClassOverview = () => {
        if (!classStats) return <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />;

        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.headerTitle}>🏫 班級整體分析</Text>
                    <View style={styles.row}>
                        <View style={[styles.card, styles.halfCard, { backgroundColor: '#6C63FF' }]}>
                            <Text style={[styles.label, { color: 'white' }]}>平均繳交率</Text>
                            <Text style={[styles.bigValue, { color: 'white' }]}>{classStats.submissionRate}%</Text>
                        </View>
                        <View style={[styles.card, styles.halfCard, { backgroundColor: '#00C9A7' }]}>
                            <Text style={[styles.label, { color: 'white' }]}>平均成績</Text>
                            <Text style={[styles.bigValue, { color: 'white' }]}>{classStats.avgScore}</Text>
                        </View>
                    </View>

                    <Text style={[styles.label, { marginTop: 10, marginLeft: 5 }]}>學生列表</Text>
                </View>

                <FlatList
                    data={studentList}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelectStudent(item)}>
                            <ListItem containerStyle={styles.listItem} bottomDivider>
                                <Avatar
                                    rounded
                                    title={item.name[0]}
                                    containerStyle={{ backgroundColor: theme.colors.primary }}
                                />
                                <ListItem.Content>
                                    <ListItem.Title style={styles.itemTitle}>{item.name}</ListItem.Title>
                                    <ListItem.Subtitle style={styles.itemSubtitle}>
                                        繳交率: {item.submissionRate}% | 平均: {item.avgScore}
                                    </ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron color={theme.colors.grey3} />
                            </ListItem>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    };

    // Main Render
    if (loading && !studentStats && !classStats) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
    }

    if (isTeacher) {
        if (selectedStudent) {
            return renderStatsView(studentStats, `${selectedStudent.name} 的分析`);
        }
        return renderClassOverview();
    }

    return renderStatsView(studentStats, '📊 我的學習分析');
}
