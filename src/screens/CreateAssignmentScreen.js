import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Modal, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';
import { useAuth } from '../context/AuthContext'; // Updated import
import { Text, Icon, Button } from '@rneui/themed';

import { getCreateAssignmentScreenStyles } from '../styles/CreateAssignmentScreenStyles';

export default function CreateAssignmentScreen({ navigation }) {
    const { theme } = useTheme();
    const styles = getCreateAssignmentScreenStyles(theme);
    const { user } = useAuth(); // Get current user (teacher)

    const [assignmentId, setAssignmentId] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    // ... (rest of the component logic)

    // Date Picker State
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateMode, setDateMode] = useState('start'); // 'start' or 'end'
    const [tempDate, setTempDate] = useState(new Date());

    const openDatePicker = (mode) => {
        setDateMode(mode);
        const currentStr = mode === 'start' ? startDate : endDate;
        setTempDate(new Date(currentStr));
        setShowDatePicker(true);
    };

    const confirmDate = () => {
        const dateStr = tempDate.toISOString().split('T')[0];
        if (dateMode === 'start') setStartDate(dateStr);
        else setEndDate(dateStr);
        setShowDatePicker(false);
    };

    const handleCreate = async () => {
        if (!user || !user.id) {
            Alert.alert('錯誤', '無法確認教師身分');
            return;
        }

        // Auto-generate Assignment ID based on Start Date + Time (HHMMSS) to avoid duplicates
        // Format: HW20251230-143005
        const dateStr = startDate.replace(/-/g, '');
        const timeStr = new Date().toTimeString().slice(0, 8).replace(/:/g, ''); // Includes seconds
        const autoAssignmentId = `HW${dateStr}-${timeStr}`;

        setLoading(true);
        try {
            const result = await apiCall('createAssignment', {
                newAssignmentId: autoAssignmentId,
                startDate,
                endDate,
                description,
                teacherId: user.id
            });

            if (result.status === 'success') {
                Alert.alert('成功', `作業建立成功！\nID: ${autoAssignmentId}`, [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                throw new Error(result.message || '建立失敗');
            }
        } catch (error) {
            Alert.alert('建立失敗', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Custom Simple Date Selector Logic
    // Using a simpler numeric input or scroller might be tedious to build from scratch.
    // Let's make a simplified Year/Month/Day selector Modal.

    const DatePickerModal = () => {
        const adjustDate = (field, value) => {
            const newDate = new Date(tempDate);
            if (field === 'year') newDate.setFullYear(newDate.getFullYear() + value);
            if (field === 'month') newDate.setMonth(newDate.getMonth() + value);
            if (field === 'day') newDate.setDate(newDate.getDate() + value);
            setTempDate(newDate);
        };

        const formatDateDisplay = (date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        return (
            <Modal transparent visible={showDatePicker} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.pickerContainer}>
                        <Text style={styles.pickerTitle}>
                            選擇{dateMode === 'start' ? '開始' : '截止'}日期
                        </Text>

                        <View style={styles.dateControlRow}>
                            <TouchableOpacity onPress={() => adjustDate('year', -1)}><Icon name="chevron-left" /></TouchableOpacity>
                            <Text style={styles.dateText}>{tempDate.getFullYear()}年</Text>
                            <TouchableOpacity onPress={() => adjustDate('year', 1)}><Icon name="chevron-right" /></TouchableOpacity>
                        </View>

                        <View style={styles.dateControlRow}>
                            <TouchableOpacity onPress={() => adjustDate('month', -1)}><Icon name="chevron-left" /></TouchableOpacity>
                            <Text style={styles.dateText}>{tempDate.getMonth() + 1}月</Text>
                            <TouchableOpacity onPress={() => adjustDate('month', 1)}><Icon name="chevron-right" /></TouchableOpacity>
                        </View>

                        <View style={styles.dateControlRow}>
                            <TouchableOpacity onPress={() => adjustDate('day', -1)}><Icon name="chevron-left" /></TouchableOpacity>
                            <Text style={styles.dateText}>{tempDate.getDate()}日</Text>
                            <TouchableOpacity onPress={() => adjustDate('day', 1)}><Icon name="chevron-right" /></TouchableOpacity>
                        </View>

                        <Text style={styles.previewDate}>預覽: {formatDateDisplay(tempDate)}</Text>

                        <View style={styles.modalButtons}>
                            <Button title="取消" type="outline" onPress={() => setShowDatePicker(false)} containerStyle={{ width: '40%' }} />
                            <Button title="確認" onPress={confirmDate} containerStyle={{ width: '40%' }} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>開始日期:</Text>
            <TouchableOpacity onPress={() => openDatePicker('start')} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>{startDate}</Text>
                <Icon name="calendar-today" color={theme.colors.primary} />
            </TouchableOpacity>

            <Text style={styles.label}>截止日期:</Text>
            <TouchableOpacity onPress={() => openDatePicker('end')} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>{endDate}</Text>
                <Icon name="event" color={theme.colors.primary} />
            </TouchableOpacity>

            <Text style={styles.label}>作業說明:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="請輸入作業說明..."
                multiline
                numberOfLines={4}
            />

            <Button
                title="確認新增"
                loading={loading}
                onPress={handleCreate}
                buttonStyle={styles.button}
                containerStyle={{ marginTop: 20 }}
            />

            {DatePickerModal()}
        </ScrollView>
    );
}
