import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

export default function TeacherQnAScreen() {
    const { theme } = useTheme();
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

    const styles = getStyles(theme);

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

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: theme.spacing.m },
    card: { backgroundColor: theme.colors.card, padding: theme.spacing.l, borderRadius: 8, marginBottom: 12, ...theme.styles.shadow },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    qId: { fontWeight: 'bold', color: theme.colors.textSecondary },
    status: { fontWeight: 'bold', fontSize: 12 },
    statusOpen: { color: theme.colors.error },
    statusClosed: { color: theme.colors.success },
    assignment: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 8 },
    qText: { fontSize: 16, marginBottom: 12, color: theme.colors.text },
    answerBox: { backgroundColor: theme.dark ? '#333' : '#f0f0f0', padding: 8, borderRadius: 4, marginBottom: 8 },
    aText: { color: theme.colors.primary },
    replyButton: { backgroundColor: theme.colors.secondary, padding: 8, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 8 },
    replyButtonText: { color: '#fff', fontSize: 12 },
    time: { fontSize: 10, color: theme.colors.textSecondary, textAlign: 'right' },
    empty: { textAlign: 'center', marginTop: 20, color: theme.colors.textSecondary },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: theme.colors.card, padding: 20, borderRadius: 12 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: theme.colors.text },
    modalQ: { marginBottom: 20, fontStyle: 'italic', color: theme.colors.textSecondary },
    input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, padding: 10, height: 100, textAlignVertical: 'top', marginBottom: 20, color: theme.colors.text },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
    cancelBtn: { padding: 10, marginRight: 10 },
    submitBtn: { backgroundColor: theme.colors.primary, padding: 10, borderRadius: 8, width: 80, alignItems: 'center' },
    btnText: { color: theme.colors.text, fontWeight: 'bold' }
});
