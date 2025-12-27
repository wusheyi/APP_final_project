import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

export default function QuestionScreen({ navigation }) {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    // Ideally we get studentId from Context/Global State.
    // We will hardcode or ask user to confirm ID for now since we don't have Context handy here.
    // Or we can grab it from hidden params if we passed user object deeply.
    // To keep it simple, let's assume 'S123456' or ask for it.
    // Better UX: passed `user` prop all the way or store in AsyncStorage.
    // For this prototype, I'll add an input for StudentID auto-filled if available in a real app logic.

    const [assignmentId, setAssignmentId] = useState('');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!assignmentId.trim() || !question.trim()) {
            Alert.alert('錯誤', '請填寫作業ID與問題內容');
            return;
        }

        setLoading(true);
        try {
            // Using a hardcoded student ID fallback if not available
            const result = await apiCall('postQuestion', {
                studentId: 'CURRENT_USER', // In real app, use Context
                assignmentId,
                questionText: question
            });

            if (result.status === 'success') {
                Alert.alert('成功', '問題已發送，老師將會收到通知。', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            Alert.alert('發送失敗', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>相關作業 ID (例如 HW01):</Text>
            <TextInput
                style={styles.input}
                value={assignmentId}
                onChangeText={setAssignmentId}
                placeholder="HWxx"
            />

            <Text style={styles.label}>問題內容:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={question}
                onChangeText={setQuestion}
                placeholder="請描述您的問題..."
                multiline
                numberOfLines={5}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleSend}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>送出問題</Text>
                )}
            </TouchableOpacity>
        </View>
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
        fontSize: 16,
        marginBottom: theme.spacing.s,
        color: theme.colors.text,
    },
    input: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.l,
        fontSize: 16,
        color: theme.colors.text,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
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
