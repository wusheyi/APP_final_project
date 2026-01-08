import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

import { getGivePointsScreenStyles } from '../styles/GivePointsScreenStyles';
// 賦予點數頁面。教師可在此給予學生點數。
export default function GivePointsScreen({ navigation }) {
    const { theme } = useTheme();
    const styles = getGivePointsScreenStyles(theme);

    const [studentId, setStudentId] = useState('');
    const [points, setPoints] = useState('1');
    const [reason, setReason] = useState('表現良好');
    const [loading, setLoading] = useState(false);

    const [mode, setMode] = useState('select'); // 'select' or 'input'
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoadingStudents(true);
        try {
            const result = await apiCall('getStudents');
            if (result.status === 'success') {
                setStudents(result.students);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleGivePoints = async () => {
        if (!studentId.trim() || !points.trim()) {
            Alert.alert('錯誤', '請填寫完整資訊');
            return;
        }

        setLoading(true);
        try {
            const result = await apiCall('adjustPoints', {
                studentId: studentId.trim(),
                change: points,
                reason: reason,
                teacherId: 'Teacher'
            });

            if (result.status === 'success') {
                Alert.alert('成功', '點數已發送', [
                    {
                        text: 'OK', onPress: () => {
                            // Reset but keep mode
                            setStudentId('');
                            setPoints('1');
                        }
                    }
                ]);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            Alert.alert('失敗', error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderStudentItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
                setStudentId(item.id);
                setModalVisible(false);
            }}
        >
            <Text style={styles.modalItemText}>{item.id} - {item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>給予獎勵</Text>

                {/* Mode Toggle */}
                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, mode === 'select' && styles.toggleBtnActive]}
                        onPress={() => setMode('select')}
                    >
                        <Text style={[styles.toggleText, mode === 'select' && styles.toggleTextActive]}>選單選擇</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleBtn, mode === 'input' && styles.toggleBtnActive]}
                        onPress={() => setMode('input')}
                    >
                        <Text style={[styles.toggleText, mode === 'input' && styles.toggleTextActive]}>手動輸入</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>學生:</Text>

                {mode === 'select' ? (
                    <TouchableOpacity
                        style={styles.selector}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.selectorText}>
                            {studentId ?
                                (students.find(s => s.id === studentId) ? `${studentId} - ${students.find(s => s.id === studentId).name}` : studentId)
                                : '請點擊選擇學生...'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TextInput
                        style={styles.input}
                        value={studentId}
                        onChangeText={setStudentId}
                        placeholder="輸入學生 ID (e.g. S001)"
                        autoCapitalize="none"
                    />
                )}

                <Text style={styles.label}>點數 (可為負數):</Text>
                <View style={styles.pointsRow}>
                    <TouchableOpacity onPress={() => setPoints(String(Number(points) - 1))} style={styles.adjustBtn}>
                        <Text style={styles.adjustText}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.input, styles.pointsInput]}
                        value={points}
                        onChangeText={setPoints}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={() => setPoints(String(Number(points) + 1))} style={styles.adjustBtn}>
                        <Text style={styles.adjustText}>+</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>原因:</Text>
                <TextInput
                    style={styles.input}
                    value={reason}
                    onChangeText={setReason}
                    placeholder="例如: 作業全對"
                />

                <TouchableOpacity style={styles.button} onPress={handleGivePoints} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>送出獎勵</Text>}
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>選擇學生</Text>
                        {loadingStudents ? (
                            <ActivityIndicator color={theme.colors.primary} />
                        ) : (
                            <FlatList
                                data={students}
                                renderItem={renderStudentItem}
                                keyExtractor={item => item.id}
                                style={{ maxHeight: 300 }}
                            />
                        )}
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeBtnText}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
