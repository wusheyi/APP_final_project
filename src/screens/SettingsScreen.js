import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

import { useAuth } from '../context/AuthContext';

import { getSettingsScreenStyles } from '../styles/SettingsScreenStyles';

export default function SettingsScreen({ route }) {
    const { user, updateUser } = useAuth();
    const { theme, themeMode, setThemeMode } = useTheme();
    const styles = getSettingsScreenStyles(theme);

    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);

    const handleUpdateName = async () => {
        if (!name.trim()) return Alert.alert('請輸入名稱');

        setLoading(true);
        try {
            const result = await apiCall('updateProfile', { userId: user?.id, name });
            if (result.status === 'success') {
                updateUser({ name });
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
