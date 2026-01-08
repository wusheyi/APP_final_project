import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

import { getTeacherQnAScreenStyles } from '../styles/TeacherQnAScreenStyles';

// 題師問題回覆頁。顯示教師收到的學生問題列表，並提供回覆功能。
export default function TeacherQnAScreen() {
    const { theme } = useTheme();
    const styles = getTeacherQnAScreenStyles(theme);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchQuestions = async () => {
        try {
            const result = await apiCall('getQuestions');
            if (result.status === 'success') {
                setQuestions(result.questions);
            } else {
                Alert.alert('錯誤', result.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchQuestions();
    };

    const openAnswerModal = (q) => {
        setSelectedQuestion(q);
        setAnswerText('');
        setModalVisible(true);
    };

    const handleSubmitAnswer = async () => {
        if (!answerText.trim()) {
            Alert.alert('請輸入回覆內容');
            return;
        }
        setSubmitting(true);
        try {
            const result = await apiCall('answerQuestion', {
                questionId: selectedQuestion.id,
                answerText
            });
            if (result.status === 'success') {
                Alert.alert('成功', '回覆已送出');
                setModalVisible(false);
                onRefresh();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            Alert.alert('失敗', error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.qId}>{item.id} ({item.studentId})</Text>
                <Text style={[styles.status, item.status === 'Answered' ? styles.statusClosed : styles.statusOpen]}>
                    {item.status}
                </Text>
            </View>
            <Text style={styles.assignment}>作業: {item.assignmentId}</Text>
            <Text style={styles.qText}>問: {item.questionText}</Text>

            {item.answerText ? (
                <View style={styles.answerBox}>
                    <Text style={styles.aText}>回: {item.answerText}</Text>
                </View>
            ) : (
                <TouchableOpacity style={styles.replyButton} onPress={() => openAnswerModal(item)}>
                    <Text style={styles.replyButtonText}>回覆</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.centered}><ActivityIndicator size="large" color={theme.colors.primary} /></View>
            ) : (
                <FlatList
                    data={questions}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={<Text style={styles.empty}>目前沒有問題</Text>}
                />
            )}

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>回覆問題</Text>
                        <Text style={styles.modalQ}>{selectedQuestion?.questionText}</Text>

                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder="輸入回覆..."
                            placeholderTextColor={theme.colors.textSecondary}
                            value={answerText}
                            onChangeText={setAnswerText}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.btnText}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitAnswer} disabled={submitting}>
                                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={[styles.btnText, { color: '#fff' }]}>送出</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
