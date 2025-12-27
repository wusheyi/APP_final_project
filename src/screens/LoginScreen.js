import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

export default function LoginScreen({ navigation }) {
    const { theme } = useTheme();
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!userId.trim()) {
            Alert.alert('請輸入 User ID');
            return;
        }

        setLoading(true);
        try {
            const result = await apiCall('login', { userId: userId.trim() });
            if (result.status === 'success') {
                // Navigate to Main Tab, passing user down to HomeStack -> HomeMain
                // We use reset to clear the Login screen from the stack so user can't go back to it
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main', params: { user: result.user } }],
                });
            } else {
                Alert.alert('登入失敗', result.message || 'ID 不存在');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('錯誤', '網路連線異常');
        } finally {
            setLoading(false);
        }
    };

    // Helper for generating styles
    const styles = getStyles(theme);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.title}>歡迎使用 (v2.0 Tab)</Text>
                <Text style={styles.subtitle}>請輸入您的 ID 以登入</Text>

                <TextInput
                    style={styles.input}
                    placeholder="User ID (e.g., T001, S123456)"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={userId}
                    onChangeText={setUserId}
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>登入</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        padding: theme.spacing.l,
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.l,
        ...theme.styles.shadow,
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.s,
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    input: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        fontSize: 16,
        marginBottom: theme.spacing.l,
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
});
