import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function TeacherDashboardScreen({ navigation }) {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('CreateAssignment')}
                >
                    <Text style={styles.icon}>➕</Text>
                    <Text style={styles.cardTitle}>新增作業</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('AssignmentList')}
                >
                    <Text style={styles.icon}>📋</Text>
                    <Text style={styles.cardTitle}>選擇作業</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('TeacherQnA')}
                >
                    <Text style={styles.icon}>💬</Text>
                    <Text style={styles.cardTitle}>學生問答</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.l,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: theme.colors.card,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.l,
        ...theme.styles.shadow,
        alignItems: 'center',
        marginBottom: theme.spacing.l,
    },
    icon: {
        fontSize: 40,
        marginBottom: theme.spacing.m,
    },
    cardTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        fontSize: 16,
    },
});
