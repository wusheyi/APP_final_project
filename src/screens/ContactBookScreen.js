import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getContactBookScreenStyles } from '../styles/ContactBookScreenStyles';

export default function ContactBookScreen({ route, navigation }) {
    const { theme } = useTheme();
    const styles = getContactBookScreenStyles(theme);

    // We can pass user role via params, or store it in context. 
    // For now assuming we check "user" param or AsyncStorage
    const [user, setUser] = useState(route.params?.user || null);

    const isTeacher = user?.role === 'teacher';

    const [noteContent, setNoteContent] = useState('');
    const [todayNote, setTodayNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(false);

    useEffect(() => {
        // Fallback load user if not in params
        const init = async () => {
            if (!user) {
                const u = await AsyncStorage.getItem('user');
                if (u) setUser(JSON.parse(u));
            }
            fetchNote();
        };
        init();
    }, []);

    const fetchNote = async () => {
        setLoading(true);
        try {
            // Fetch for "Student" view (needs studentId to check signature)
            // Or "Teacher" just views latest
            const u = user || JSON.parse(await AsyncStorage.getItem('user'));
            const studentId = u?.role === 'student' ? u.id : null;

            const result = await apiCall('getLatestContactNote', { studentId });
            if (result.status === 'success') {
                setTodayNote(result); // { note, isSigned, signedAt }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostNote = async () => {
        if (!noteContent.trim()) {
            Alert.alert('請輸入內容');
            return;
        }
        try {
            setLoading(true);
            const res = await apiCall('createContactNote', {
                content: noteContent,
                teacherId: user.id
            });
            if (res.status === 'success') {
                Alert.alert('發布成功');
                setNoteContent('');
                fetchNote();
            }
        } catch (e) {
            Alert.alert('錯誤', e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSign = async () => {
        if (!todayNote?.note?.id) return;
        setSigning(true);
        try {
            const res = await apiCall('signContactNote', {
                noteId: todayNote.note.id,
                studentId: user.id
            });
            if (res.status === 'success') {
                Alert.alert('已完成簽名');
                fetchNote();
            } else {
                Alert.alert('訊息', res.message);
            }
        } catch (e) {
            Alert.alert('錯誤', e.message);
        } finally {
            setSigning(false);
        }
    };

    if (loading && !todayNote) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>📅 電子聯絡簿</Text>

            {/* Teacher Section: Create Note */}
            {isTeacher && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>發布今日事項</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        placeholder="輸入今日聯絡事項..."
                        value={noteContent}
                        onChangeText={setNoteContent}
                    />
                    <TouchableOpacity style={styles.button} onPress={handlePostNote}>
                        <Text style={styles.buttonText}>發布</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* View Note Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>今日事項 ({todayNote?.note?.date || '無'})</Text>

                {todayNote?.note ? (
                    <View>
                        <Text style={styles.noteContent}>{todayNote.note.content}</Text>

                        {!isTeacher && (
                            <View style={styles.signSection}>
                                {todayNote.isSigned ? (
                                    <View style={styles.signedBadge}>
                                        <Text style={styles.signedText}>✅ 家長已簽名</Text>
                                        <Text style={styles.signTime}>{new Date(todayNote.signedAt).toLocaleString()}</Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={[styles.signButton, signing && styles.disabledBtn]}
                                        onPress={handleSign}
                                        disabled={signing}
                                    >
                                        {signing ? <ActivityIndicator color="#fff" /> : <Text style={styles.signBtnText}>家長簽名</Text>}
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                ) : (
                    <Text style={styles.emptyText}>老師尚未發布今日事項</Text>
                )}
            </View>
        </ScrollView>
    );
}
