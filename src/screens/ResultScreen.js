import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultScreen({ route, navigation }) {
    const { theme } = useTheme();
    const styles = getStyles(theme);
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

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.l,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100, // Visual balance
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.l,
    },
    title: {
        ...theme.typography.h1,
        marginBottom: theme.spacing.m,
        textAlign: 'center',
        color: theme.colors.text,
    },
    message: {
        ...theme.typography.body,
        fontSize: 18,
        marginBottom: theme.spacing.l,
        textAlign: 'center',
        color: theme.colors.text,
    },
    detailsContainer: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        width: '100%',
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    detailsText: {
        ...theme.typography.caption,
        textAlign: 'center',
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    button: {
        width: '100%',
        paddingVertical: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        marginTop: theme.spacing.m,
    },
    buttonText: {
        ...theme.typography.button,
        color: '#fff',
    },
});
