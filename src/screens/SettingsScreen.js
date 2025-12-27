import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

export default function SettingsScreen({ route }) {
    // We expect 'user' to be passed via initialParams or context, 
    // but in Tab navigation, params might need careful handling. 
    // For now, let's assume we store user in a global context or pass it down. 
    // To simplify this refactor, we'll accept user from route params if available, 
    // or we might need a UserContext. For this step, we'll rely on route params 
    // passed from App.js structure.

    // NOTE: In a real app, UserContext is better. Here we will try to read from route.params.user
    // If not found, we might need to re-login.
    const { user } = route.params || {};

    const { theme, themeMode, setThemeMode } = useTheme();

    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);

    const handleUpdateName = async () => {
        if (!name.trim()) return Alert.alert('請輸入名稱');

        setLoading(true);
        try {
            const result = await apiCall('updateProfile', { userId: user?.id, name });
            if (result.status === 'success') {
                Alert.alert('成功', '名稱已更新');
            } else {
                Alert.alert('錯誤', result.message);
            }
        } catch (error) {
            Alert.alert('錯誤', error.message);
        } finally {
            setLoading(false);
        }
    };

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>個人資料</Text>

                <Text style={styles.label}>ID: {user?.id}</Text>
                <Text style={styles.label}>身分: {user?.role === 'teacher' ? '老師' : '學生'}</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>顯示名稱</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor={theme.colors.textSecondary}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleUpdateName} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>更新名稱</Text>}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>外觀設定</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>淺色模式</Text>
                    <Switch
                        value={themeMode === 'light'}
                        onValueChange={() => setThemeMode('light')}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>深色模式</Text>
                    <Switch
                        value={themeMode === 'dark'}
                        onValueChange={() => setThemeMode('dark')}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>跟隨系統</Text>
                    <Switch
                        value={themeMode === 'system'}
                        onValueChange={() => setThemeMode('system')}
                    />
                </View>
            </View>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m,
    },
    section: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.l,
        marginBottom: theme.spacing.l,
        ...theme.styles.shadow,
    },
    sectionTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
        fontSize: 20,
    },
    label: {
        ...theme.typography.body,
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
    },
    inputGroup: {
        marginTop: theme.spacing.m,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.s,
        padding: theme.spacing.s,
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
    },
    buttonText: {
        ...theme.typography.button,
        color: '#fff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
});
