import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from '../api/sheetApi';
import { Text, Card, Button, Icon, Avatar, ListItem, Badge } from '@rneui/themed';

import { getTeacherDashboardScreenStyles } from '../styles/TeacherDashboardScreenStyles';
import { useTheme } from '../context/ThemeContext';

export default function TeacherDashboardScreen({ navigation }) {
    const { theme } = useTheme();
    const styles = getTeacherDashboardScreenStyles(theme);
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('老師');
    const today = new Date().toLocaleDateString('zh-TW');

    useEffect(() => {
        const init = async () => {
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) {
                const u = JSON.parse(userStr);
                setUserName(u.name || '老師');
            }
            fetchSummary();
        };
        init();
    }, []);

    const fetchSummary = async () => {
        try {
            const result = await apiCall('getDailySummary');
            if (result.status === 'success') {
                setSummary(result.summary);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        { title: '新增作業', icon: 'add-circle', color: '#6C63FF', route: 'CreateAssignment' },
        { title: '批改作業', icon: 'list', color: '#00C9A7', route: 'AssignmentList' },
        { title: '學生問答', icon: 'chatbubbles', color: '#F6AD55', route: 'TeacherQnA' },
        { title: '給予獎勵', icon: 'star', color: '#F59E0B', route: 'GivePoints' },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>早安,</Text>
                    <Text h3 style={styles.name}>{userName}</Text>
                </View>
                <Avatar
                    size={50}
                    rounded
                    icon={{ name: 'person', type: 'ionicon' }}
                    containerStyle={{ backgroundColor: '#6C63FF' }}
                />
            </View>

            {/* Daily Summary Card */}
            <Card containerStyle={styles.summaryCard}>
                <Card.Title style={{ textAlign: 'left', color: theme.colors.text }}>📅 今日概況 ({today})</Card.Title>
                <Card.Divider />
                {loading ? (
                    <ActivityIndicator color="#6C63FF" />
                ) : (
                    <View>
                        {summary.length > 0 ? (
                            summary.map((item, index) => (
                                <View key={index} style={styles.summaryRow}>
                                    <Badge status="error" badgeStyle={{ width: 10, height: 10, borderRadius: 5, marginRight: 10 }} />
                                    <Text style={styles.subjectText}>{item.subject}</Text>
                                    <Text style={styles.missingText}>缺交: {item.missing.join(', ')} 號</Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Icon name="checkmark-circle" type="ionicon" size={40} color="#00C9A7" />
                                <Text style={styles.noDataText}>今日作業全數繳交</Text>
                            </View>
                        )}
                    </View>
                )}
            </Card>

            <Text h4 style={styles.sectionTitle}>功能快選</Text>

            <View style={styles.grid}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.gridItem}
                        onPress={() => navigation.navigate(item.route)}
                    >
                        <Card containerStyle={styles.menuCard}>
                            <Icon name={item.icon} type="ionicon" size={32} color={item.color} />
                            <Text style={styles.menuTitle}>{item.title}</Text>
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}
