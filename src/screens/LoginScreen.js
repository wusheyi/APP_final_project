import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from '../api/sheetApi';
import { Button, Input, Icon, Text } from '@rneui/themed';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getLoginScreenStyles } from '../styles/LoginScreenStyles';

// 登入頁面。教師和學生可在此登入系統。
export default function LoginScreen({ navigation }) {
    const { login } = useAuth();
    const { theme } = useTheme();
    const styles = getLoginScreenStyles(theme);
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
                await login(result.user);
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.contentContainer}>
                <View style={styles.headerContainer}>
                    <Icon
                        name="school"
                        type="ionicon"
                        size={80}
                        color={theme.colors.primary}
                        containerStyle={styles.iconContainer}
                    />
                    <Text h2 style={styles.title}>智慧作業管理</Text>
                    <Text style={styles.subtitle}>Smart Homework Manager</Text>
                </View>

                <View style={styles.formContainer}>
                    <Input
                        placeholder="請輸入 User ID (例如: T001)"
                        placeholderTextColor={theme.colors.textSecondary}
                        inputStyle={{ color: theme.colors.text }}
                        leftIcon={<Icon name="person-outline" type="ionicon" size={20} color={theme.colors.primary} />}
                        value={userId}
                        onChangeText={setUserId}
                        autoCapitalize="none"
                        containerStyle={styles.inputContainer}
                        inputContainerStyle={styles.inputField}
                    />

                    <Button
                        title="進入系統"
                        loading={loading}
                        onPress={handleLogin}
                        radius="lg"
                        raised
                        containerStyle={styles.buttonContainer}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                        icon={<Icon name="arrow-forward" type="ionicon" size={20} color="white" style={{ marginLeft: 10 }} />}
                        iconRight
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}


