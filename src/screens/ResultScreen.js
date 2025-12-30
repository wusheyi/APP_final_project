import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getResultScreenStyles } from '../styles/ResultScreenStyles';

export default function ResultScreen({ route, navigation }) {
    const { theme } = useTheme();
    const styles = getResultScreenStyles(theme);
    const { success, message, details } = route.params || {};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: success ? theme.colors.success + '20' : theme.colors.error + '20' }]}>
                    <Text style={{ fontSize: 60 }}>{success ? '✅' : '❌'}</Text>
                </View>

                <Text style={styles.title}>{success ? '操作成功' : '操作失敗'}</Text>
                <Text style={styles.message}>{message}</Text>

                {details && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailsText}>{details}</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: success ? theme.colors.primary : theme.colors.textSecondary }]}
                    onPress={() => navigation.popToTop()}
                >
                    <Text style={styles.buttonText}>回首頁</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
