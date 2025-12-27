import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation, route }) {
    const { user } = route.params;
    const isTeacher = user.role === 'teacher';
    const { theme } = useTheme();
    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>你好, {user.name}</Text>
                <Text style={styles.roleText}>{isTeacher ? '老師模式' : '學生模式'}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.grid}>

                {/* Teacher Features */}
                {isTeacher && (
                    <>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('Scanner')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.icon}>📷</Text>
                            <Text style={styles.cardTitle}>掃描作業</Text>
                            <Text style={styles.cardDesc}>掃描 QR Code</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('TeacherDashboard')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.icon}>📊</Text>
                            <Text style={styles.cardTitle}>管理面板</Text>
                            <Text style={styles.cardDesc}>新增、查詢與 Q&A</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* Student Features */}
                {!isTeacher && (
                    <>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('StudentAssignmentList', { user })}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.icon}>📝</Text>
                            <Text style={styles.cardTitle}>我的作業</Text>
                            <Text style={styles.cardDesc}>查看繳交狀態</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('Question', { user })}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.icon}>❓</Text>
                            <Text style={styles.cardTitle}>提出問題</Text>
                            <Text style={styles.cardDesc}>對作業有疑問?</Text>
                        </TouchableOpacity>
                    </>
                )}

            </ScrollView>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m,
    },
    header: {
        marginBottom: theme.spacing.l,
    },
    welcomeText: {
        ...theme.typography.h1,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    roleText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
    },
    grid: {
        paddingBottom: theme.spacing.xl,
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.l,
        borderRadius: theme.borderRadius.l,
        marginBottom: theme.spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        ...theme.styles.shadow,
    },
    logoutCard: {
        borderWidth: 1,
        borderColor: theme.colors.error,
    },
    icon: {
        fontSize: 32,
        marginRight: theme.spacing.m,
    },
    cardTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        fontSize: 18,
        marginBottom: 4,
    },
    cardDesc: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
});
