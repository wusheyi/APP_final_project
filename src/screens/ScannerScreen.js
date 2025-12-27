import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform, TextInput, Modal, FlatList } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../api/sheetApi';

export default function ScannerScreen({ navigation }) {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    // Safety: Don't auto-start camera on emulator/simulator to prevent crashes
    const [isCameraActive, setCameraActive] = useState(false);

    // Manual Input State
    const [manualJson, setManualJson] = useState('{"studentId": "S123456"}');

    // Assignment Selection State
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
                    // Filter active assignments and sort by deadline (closest first)
                    const sorted = result.assignments.sort((a, b) => {
                        if (!a.endDate) return 1;
                        if (!b.endDate) return -1;
                        // Assuming endDate is YYYY-MM-DD
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

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setCameraActive(false); // Stop camera processing
        processSubmission(data);
    };

    const processSubmission = async (dataString) => {
        setLoading(true);
        try {
            let parsedData;
            try {
                parsedData = JSON.parse(dataString);
            } catch (e) {
                throw new Error('QR Code 格式錯誤，請確認是否為本系統專用 QR Code。');
            }

            // New logic: Check if we need to merge with selected assignment
            let finalStudentId = parsedData.studentId;
            let finalAssignmentId = parsedData.assignmentId;

            // If QR is reusable (only has studentId) or we want to override/fallback
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
                navigation.navigate('Result', {
                    success: true,
                    message: result.message,
                    details: `學生: ${finalStudentId}\n作業: ${finalAssignmentId}`
                });
            } else {
                throw new Error(result.message || '未知錯誤');
            }

        } catch (error) {
            navigation.navigate('Result', {
                success: false,
                message: '提交失敗',
                details: error.message
            });
        } finally {
            setLoading(false);
            setScanned(false);
        }
    };

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
                                <Text style={[
                                    styles.modalItemText,
                                    selectedAssignment?.id === item.id && styles.modalItemTextSelected
                                ]}>
                                    {item.id} {item.endDate ? `(截止: ${item.endDate})` : ''}
                                </Text>
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
            {/* Camera View - Only active when user requested */}
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

            {/* Main UI (Visible when camera is off) */}
            {!isCameraActive && (
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>掃描作業 QR Code</Text>

                    {/* Assignment Selector */}
                    <View style={styles.selectorContainer}>
                        <Text style={styles.label}>目前作業:</Text>
                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => setShowAssignmentModal(true)}
                        >
                            <Text style={styles.selectorText}>
                                {selectedAssignment ? `${selectedAssignment.id} ${selectedAssignment.endDate ? `(${selectedAssignment.endDate})` : ''}` : '請選擇作業...'}
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

                    <Text style={styles.divider}>或手動輸入 JSON (測試用)</Text>

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

            {/* Render Modal */}
            {renderAssignmentModal()}

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>正在處理...</Text>
                </View>
            )}
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: theme.spacing.l,
    },
    title: {
        ...theme.typography.h1,
        textAlign: 'center',
        marginBottom: theme.spacing.m,
        color: theme.colors.text,
    },
    selectorContainer: {
        marginBottom: theme.spacing.xl,
    },
    label: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.s,
        fontWeight: 'bold',
    },
    selectorButton: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectorText: {
        color: theme.colors.text,
        fontSize: 16,
    },
    selectorArrow: {
        color: theme.colors.primary,
        fontSize: 12,
    },
    mainButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.l,
        borderRadius: theme.borderRadius.l,
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        ...theme.styles.shadow,
    },
    mainButtonText: {
        ...theme.typography.h2,
        color: '#fff',
        fontSize: 20,
    },
    divider: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.m,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: theme.spacing.l,
    },
    modalContent: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        maxHeight: '80%',
    },
    modalTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
        textAlign: 'center',
    },
    modalItem: {
        padding: theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalItemSelected: {
        backgroundColor: theme.colors.primary + '10', // Light primary tint
    },
    modalItemText: {
        fontSize: 16,
        color: theme.colors.text,
    },
    modalItemTextSelected: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    checkMark: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    modalCloseBtn: {
        marginTop: theme.spacing.m,
        padding: theme.spacing.m,
        alignItems: 'center',
    },
    modalCloseText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
    },
    // Overlay UI
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#0f0', // Bright green for visibility
        backgroundColor: 'transparent',
        borderRadius: theme.borderRadius.l,
    },
    instruction: {
        color: '#fff',
        marginTop: theme.spacing.xl,
        fontSize: 18,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: theme.spacing.s,
        borderRadius: theme.borderRadius.s,
        overflow: 'hidden',
    },
    closeBtn: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    closeText: {
        color: '#000',
        fontWeight: 'bold',
    },
    // Loading
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loadingText: {
        color: '#fff',
        marginTop: theme.spacing.m,
        fontSize: 16,
    },
    // Manual Input
    webInput: {
        width: '100%',
        height: 100,
        borderColor: theme.colors.border,
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: theme.colors.card,
        color: theme.colors.text,
        textAlignVertical: 'top',
        fontFamily: 'monospace',
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
    },
    secondaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
