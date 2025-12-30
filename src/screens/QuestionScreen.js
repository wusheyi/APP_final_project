import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

import { getQuestionScreenStyles } from '../styles/QuestionScreenStyles';

export default function QuestionScreen({ navigation }) {
    const { theme } = useTheme();
    const styles = getQuestionScreenStyles(theme);
    // Ideally we get studentId from Context/Global State.
    // We will hardcode or ask user to confirm ID for now since we don't have Context handy here.
    // Or we can grab it from hidden params if we passed user object deeply.
    // To keep it simple, let's assume 'S123456' or ask for it.
    // Better UX: passed `user` prop all the way or store in AsyncStorage.
    // For this prototype, I'll add an input for StudentID auto-filled if available in a real app logic.

    const [assignmentId, setAssignmentId] = useState('');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [studentId, setStudentId] = useState(null);
    const [history, setHistory] = useState([]);

    React.useEffect(() => {
        loadUserAndHistory();
    }, []);

    const loadUserAndHistory = async () => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setStudentId(user.id);
                fetchHistory(user.id);
            }
        } catch (e) {
            console.error('Failed to load user', e);
        }
    };

    const fetchHistory = async (id) => {
        try {
            const res = await apiCall('getQuestions');
            if (res.status === 'success') {
                // Filter for this student
                const myQuestions = res.questions.filter(q => q.studentId === id);
                setHistory(myQuestions);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSend = async () => {
        if (!assignmentId.trim() || !question.trim()) {
            Alert.alert('錯誤', '請填寫作業ID與問題內容');
            return;
        }

        if (!studentId) {
            Alert.alert('錯誤', '無法取得學生ID，請重新登入');
            return;
        }

        setLoading(true);
        try {
            const result = await apiCall('postQuestion', {
                studentId: studentId,
                assignmentId,
                questionText: question
            });

            if (result.status === 'success') {
                Alert.alert('成功', '問題已發送', [
                    {
                        text: 'OK', onPress: () => {
                            setQuestion('');
                            fetchHistory(studentId); // Refresh
                        }
                    }
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

    const renderItem = ({ item }) => (
        <View style={styles.historyItem}>
            <View style={styles.historyHeader}>
                <Text style={styles.historyTime}>{new Date(item.timestamp).toLocaleDateString()}</Text>
                <Text style={[styles.statusBadge, { color: item.status === 'Answered' ? 'green' : 'orange' }]}>
                    {item.status === 'Answered' ? '已回覆' : '待回覆'}
                </Text>
            </View>
            <Text style={styles.qText}>Q: {item.questionText}</Text>
            {item.answerText ? (
                <Text style={styles.aText}>A: {item.answerText}</Text>
            ) : null}
        </View>
    );

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

            <View style={styles.divider} />
            <Text style={styles.historyTitle}>我的提問紀錄</Text>
            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}
