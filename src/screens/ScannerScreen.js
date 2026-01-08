import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform, TextInput, Modal, FlatList } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

import { getScannerScreenStyles } from '../styles/ScannerScreenStyles';

// QRcode掃描頁面。教師可在此掃描 QRcode。
export default function ScannerScreen({ navigation }) {
    const { theme } = useTheme();
    const styles = getScannerScreenStyles(theme);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isCameraActive, setCameraActive] = useState(false);

    const [manualJson, setManualJson] = useState('{"studentId": "S123456"}');

    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        const fetchAssignments = async () => {
            try {
                const result = await apiCall('getAssignments');
                if (result.status === 'success') {
                    const sorted = result.assignments.sort((a, b) => {
                        if (!a.endDate) return 1;
                        if (!b.endDate) return -1;
                        return a.endDate.localeCompare(b.endDate);
                    });
                    setAssignments(sorted);
                    if (sorted.length > 0) {
                        setSelectedAssignment(sorted[0]);
                    }
                }
            } catch (e) {
                console.error("Failed to load assignments", e);
            }
        };

        getBarCodeScannerPermissions();
        fetchAssignments();
    }, []);

    const [scanResult, setScanResult] = useState(null);

    const handleBarCodeScanned = async ({ type, data }) => {
        if (scanned) return;
        setScanned(true);
        processSubmission(data);
    };

    const processSubmission = async (dataString) => {
        setLoading(true);
        setScanResult(null);
        try {
            let parsedData;
            try {
                parsedData = JSON.parse(dataString);
            } catch (e) {
                throw new Error('QR Code 格式錯誤，請確認是否為本系統專用 QR Code。');
            }

            let finalStudentId = parsedData.studentId;
            let finalAssignmentId = parsedData.assignmentId;

            if (!finalAssignmentId) {
                if (!selectedAssignment) {
                    throw new Error('QR Code 未指定作業，且尚未選擇目前作業。請先選擇作業。');
                }
                finalAssignmentId = selectedAssignment.id;
            }

            if (!finalStudentId || !finalAssignmentId) {
                throw new Error('資訊不完整 (缺少 studentId 或 assignmentId)。');
            }

            const result = await apiCall('submitAssignment', {
                studentId: finalStudentId,
                assignmentId: finalAssignmentId
            });

            if (result.status === 'success') {
                setScanResult({
                    success: true,
                    message: `${finalStudentId} 繳交成功！`,
                    details: `作業: ${finalAssignmentId}`
                });
            } else {
                throw new Error(result.message || '未知錯誤');
            }

        } catch (error) {
            setScanResult({
                success: false,
                message: '提交失敗',
                details: error.message
            });
        } finally {
            setLoading(false);
            setTimeout(() => {
                if (setScanResult) {
                }
            }, 500);
        }
    };

    useEffect(() => {
        let timer;
        if (scanResult && scanResult.success) {
            timer = setTimeout(() => {
                setScanResult(null);
                setScanned(false);
            }, 1500);
        }
        return () => clearTimeout(timer);
    }, [scanResult]);


    const renderAssignmentModal = () => (
        <Modal
            visible={showAssignmentModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowAssignmentModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>選擇作業 (依截止日排序)</Text>
                    <FlatList
                        data={assignments}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    selectedAssignment?.id === item.id && styles.modalItemSelected
                                ]}
                                onPress={() => {
                                    setSelectedAssignment(item);
                                    setShowAssignmentModal(false);
                                }}
                            >
                                <View>
                                    <Text style={[
                                        styles.modalItemText,
                                        selectedAssignment?.id === item.id && styles.modalItemTextSelected
                                    ]}>
                                        {item.description || item.id}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: 'gray' }}>
                                        {item.endDate ? `截止: ${item.endDate}` : ''} ({item.id})
                                    </Text>
                                </View>
                                {selectedAssignment?.id === item.id && <Text style={styles.checkMark}>✓</Text>}
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowAssignmentModal(false)}>
                        <Text style={styles.modalCloseText}>取消</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            {isCameraActive && hasPermission && (
                <View style={StyleSheet.absoluteFillObject}>
                    <CameraView
                        style={StyleSheet.absoluteFillObject}
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr", "pdf417"],
                        }}
                    />
                    <View style={styles.overlay}>
                        <View style={styles.scanFrame} />
                        <Text style={styles.instruction}>請將 QR Code 對準框框</Text>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setCameraActive(false)}
                        >
                            <Text style={styles.closeText}>關閉相機</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {!isCameraActive && (
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>掃描作業 QR Code</Text>

                    <View style={styles.selectorContainer}>
                        <Text style={styles.label}>目前作業:</Text>
                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => setShowAssignmentModal(true)}
                        >
                            <Text style={styles.selectorText}>
                                {selectedAssignment
                                    ? `${selectedAssignment.description || selectedAssignment.id} ${selectedAssignment.endDate ? `(${selectedAssignment.endDate})` : ''}`
                                    : '請選擇作業...'}
                            </Text>
                            <Text style={styles.selectorArrow}>▼</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.mainButton}
                        onPress={() => setCameraActive(true)}
                    >
                        <Text style={styles.mainButtonText}>📷 開啟相機掃描</Text>
                    </TouchableOpacity>

                    <Text style={styles.divider}>或手動輸入</Text>

                    <TextInput
                        style={styles.webInput}
                        multiline
                        value={manualJson}
                        onChangeText={setManualJson}
                        placeholder='{"studentId": "..."}'
                    />

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => processSubmission(manualJson)}
                    >
                        <Text style={styles.secondaryText}>手動送出</Text>
                    </TouchableOpacity>
                </View>
            )}

            {renderAssignmentModal()}

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>正在處理...</Text>
                </View>
            )}

            {scanResult && (
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                        styles.resultOverlay,
                        { backgroundColor: scanResult.success ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)' }
                    ]}
                    onPress={() => {
                        setScanResult(null);
                        setScanned(false);
                    }}
                >
                    <View style={styles.resultContent}>
                        <Text style={styles.resultIcon}>{scanResult.success ? '✓' : '✕'}</Text>
                        <Text style={styles.resultTitle}>{scanResult.message}</Text>
                        <Text style={styles.resultDetails}>{scanResult.details}</Text>
                        {!scanResult.success && <Text style={styles.tapToDismiss}>(點擊關閉)</Text>}
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}
