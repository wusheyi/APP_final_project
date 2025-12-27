import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

export default function CreateAssignmentScreen({ navigation }) {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const [assignmentId, setAssignmentId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!assignmentId.trim()) {
            Alert.alert('錯誤', '請輸入作業 ID');
            return;
        }

        setLoading(true);
        try {
            const result = await apiCall('createAssignment', {
                newAssignmentId: assignmentId,
                startDate,
                endDate,
                description
            });

            if (result.status === 'success') {
                navigation.navigate('Result', {
                    success: true,
                    message: '作業建立成功',
                    details: `作業ID: ${assignmentId}\n說明: ${description || '無'}`
                });
            } else {
                throw new Error(result.message || '建立失敗');
            }
        } catch (error) {
            Alert.alert('建立失敗', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>作業 ID (例如 HW03):</Text>
            <TextInput
                style={styles.input}
                value={assignmentId}
                onChangeText={setAssignmentId}
                placeholder="HWxx"
                autoCapitalize="characters"
            />

            <Text style={styles.label}>開始日期 (YYYY-MM-DD):</Text>
            <TextInput
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="2023-01-01"
            />

            <Text style={styles.label}>截止日期 (YYYY-MM-DD):</Text>
            <TextInput
                style={styles.input}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="2023-01-10"
            />

            <Text style={styles.label}>作業說明:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="請輸入作業說明..."
                multiline
                numberOfLines={4}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleCreate}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>確認新增</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.l,
    },
    label: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.s,
        fontSize: 16,
        color: theme.colors.text,
    },
    input: {
        backgroundColor: theme.colors.card,
        color: theme.colors.text,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        fontSize: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.l,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        marginBottom: 50, // space at bottom
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        ...theme.typography.button,
        color: '#fff',
    },
});
