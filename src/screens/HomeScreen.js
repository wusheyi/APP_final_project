import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';
import { Text, Card, Icon, Avatar, Badge, Button } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';

import { getHomeScreenStyles } from '../styles/HomeScreenStyles';

// 首頁。教師可在此查看今日作業概況，學生可在此查看我的獎勵點數。
export default function HomeScreen({ navigation, route }) {
    const { user } = route.params; 
    const isTeacher = user.role === 'teacher';
    const { theme } = useTheme();

    const [summary, setSummary] = useState([]); // For teachers
    const [points, setPoints] = useState(0);    // For students
    const [loading, setLoading] = useState(false);

    const teacherMenu = [
        { title: '新增作業', route: 'CreateAssignment', icon: 'add-circle', color: '#6C63FF' },
        { title: '批改作業', route: 'AssignmentList', icon: 'list', color: '#00C9A7' },
        { title: '掃描作業', route: 'Scanner', icon: 'qr-code', color: '#A0AEC0' },
        { title: '學生問答', route: 'TeacherQnA', icon: 'chatbubbles', color: '#F6AD55' },
        { title: '給予獎勵', route: 'GivePoints', icon: 'star', color: '#F59E0B' },
        { title: '電子聯絡簿', route: 'ContactBook', icon: 'book', color: '#4299E1' },
    ];

    const studentMenu = [
        { title: '我的作業', route: 'StudentAssignmentList', icon: 'library', color: '#6C63FF' },
        { title: '提出問題', route: 'Question', icon: 'help-circle', color: '#00C9A7' },
        { title: '電子聯絡簿', route: 'ContactBook', icon: 'book', color: '#4299E1' },
        { title: '學習歷程', route: 'AnalysisDrawer', icon: 'analytics', color: '#9F7AEA' },
    ];

    const menuItems = isTeacher ? teacherMenu : studentMenu;

    const fetchData = async () => {
        setLoading(true);
        try {
            if (isTeacher) {
                const res = await apiCall('getDailySummary');
                if (res.status === 'success') setSummary(res.summary);
            } else {
                const res = await apiCall('getStudentPoints', { studentId: user.id });
                if (res.status === 'success') setPoints(res.points);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const styles = getHomeScreenStyles(theme);

    const renderTeacherWidget = () => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('AnalysisDrawer', { user })}
        >
            <Card containerStyle={styles.widgetCard}>
                <View style={styles.widgetHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.widgetTitle}>📊 學習分析 & 今日概況</Text>
                    </View>
                    <Badge value="詳細數據" status="primary" badgeStyle={{ backgroundColor: theme.colors.primary }} />
                </View>
                <Card.Divider />

                <View style={{ minHeight: 100 }}>
                    {summary.length > 0 ? (
                        summary.map((item, index) => (
                            <View key={index} style={styles.summaryRow}>
                                <Icon name="alert-circle" type="ionicon" size={16} color={theme.colors.error} style={{ marginRight: 5 }} />
                                <Text style={styles.subjectText} numberOfLines={1}>{item.subject}</Text>
                                <Text style={styles.missingText}>缺交: {item.missing.join(', ')}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Icon name="checkmark-circle-outline" type="ionicon" size={40} color={theme.colors.success} />
                            <Text style={styles.emptyText}>今日作業全數繳交完成！</Text>
                            <Text style={{ color: theme.colors.textSecondary, marginTop: 5 }}>點擊查看完整班級分析</Text>
                        </View>
                    )}
                </View>

                {summary.length > 0 && (
                    <Button
                        title="查看完整分析報告"
                        type="clear"
                        icon={{ name: 'arrow-forward', color: theme.colors.primary, size: 15 }}
                        iconRight
                        titleStyle={{ color: theme.colors.primary, fontSize: 14 }}
                        onPress={() => navigation.navigate('AnalysisDrawer', { user })}
                    />
                )}
            </Card>
        </TouchableOpacity>
    );

    const renderStudentWidget = () => (
        <Card containerStyle={[styles.widgetCard, { backgroundColor: '#6C63FF' }]}>
            <View style={styles.studentWidgetContent}>
                <View>
                    <Text style={styles.studentLabel}>我的獎勵點數</Text>
                    <Text h1 style={styles.studentPoints}>{points}</Text>
                </View>
                <Icon name="trophy" type="ionicon" size={50} color="rgba(255,255,255,0.8)" />
            </View>
        </Card>
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>Welcome back,</Text>
                    <Text h3 style={styles.username}>{user.name}</Text>
                </View>
                <Avatar
                    rounded
                    title={user.name[0]}
                    containerStyle={{ backgroundColor: isTeacher ? '#6C63FF' : '#00C9A7' }}
                    size="medium"
                />
            </View>

            {/* Widget Area */}
            {isTeacher ? renderTeacherWidget() : renderStudentWidget()}

            {/* Grid Menu */}
            <Text h4 style={styles.sectionTitle}>功能選單</Text>
            <View style={styles.grid}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.gridItem}
                        onPress={() => navigation.navigate(item.route, { user })}
                        activeOpacity={0.8}
                    >
                        <Card containerStyle={styles.menuCard}>
                            <View style={[
                                styles.iconCircle,
                                {
                                    backgroundColor: item.color + '15',
                                    borderColor: item.color,
                                    borderWidth: 2
                                }
                            ]}>
                                <Icon name={item.icon} type="ionicon" size={28} color={item.color} />
                            </View>
                            <Text style={styles.menuTitle}>{item.title}</Text>
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}


