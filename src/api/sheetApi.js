import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;


// Mock Data Store (Persistent)
let mockAssignments = [
    { id: 'HW01', description: 'React Basics', startDate: '2023-01-01', endDate: '2023-01-10' },
    { id: 'HW02', description: 'Navigation', startDate: '2023-01-11', endDate: '2023-01-20' },
    { id: 'TEST099', description: 'Test', startDate: '', endDate: '' },
    { id: 'HW03', description: 'Components', startDate: '2023-02-01', endDate: '2023-02-10' },
    // Add an assignment for "Today" dynamically for testing
    { id: 'MathToday', description: '每日數學', startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] }
];

let mockStudentStatus = {
    'HW01': [
        { studentId: 'S001', studentName: 'Alice', status: '已繳交', submittedAt: new Date().toISOString(), grade: 'A' },
        { studentId: 'S002', studentName: 'Bob', status: '未繳交', submittedAt: '', grade: '' }
    ],
    'MathToday': [
        { studentId: 'S001', studentName: 'Alice', status: '已繳交', submittedAt: new Date().toISOString(), grade: 'A' },
        { studentId: 'S002', studentName: 'Bob', status: '未繳交', submittedAt: '', grade: '' },
        { studentId: 'S003', studentName: 'Charlie', status: '未繳交', submittedAt: '', grade: '' }
    ]
};
let mockQuestions = [
    { id: 'Q1', studentId: 'S123456', assignmentId: 'HW01', questionText: '怎麼算?', status: 'Answered', answerText: '看課本P10', timestamp: '2023-01-05T10:00:00Z' }
];
let mockPoints = { 'S123456': 10 };
let mockContactNotes = [
    { id: 'N1', date: new Date().toISOString().split('T')[0], content: '明天帶水壺', teacherId: 'T001' }
];
let mockSignatures = [];

const mockApiCall = async (action, data) => {
    console.log(`[Mock API] Action: ${action}`, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            switch (action) {
                case 'login':
                    if (data.userId === 'T001') {
                        resolve({ status: 'success', user: { id: 'T001', name: 'Mock Teacher', role: 'teacher' } });
                    } else if (data.userId === 'S123456') {
                        resolve({ status: 'success', user: { id: 'S123456', name: 'Mock Student Check', role: 'student', classId: 'ClassA' } });
                    } else {
                        resolve({ status: 'error', message: 'User not found' });
                    }
                    break;
                case 'submitAssignment':
                    resolve({ status: 'success', message: '繳交成功 (Mock)', data: { ...data, timestamp: new Date() } });
                    break;
                case 'createAssignment':
                    mockAssignments.push({
                        id: data.newAssignmentId || 'NEW_HW',
                        description: data.description || 'New Assignment',
                        startDate: data.startDate,
                        endDate: data.endDate
                    });
                    resolve({ status: 'success', message: `作業 ${data.newAssignmentId} 建立成功 (Mock)` });
                    break;
                case 'getAssignments':
                    // Updated to return status if studentId is present
                    const isStudent = !!data.studentId;
                    const resultAssignments = mockAssignments.map(a => ({
                        ...a,
                        status: isStudent ? '未繳交' : 'Unknown' // Simplified for mock
                    }));
                    resolve({
                        status: 'success', assignments: resultAssignments
                    });
                    break;
                case 'getAssignmentStatus':
                    const statusList = mockStudentStatus[data.assignmentId] || [
                        { studentId: 'S001', studentName: 'Alice', status: '已繳交', submittedAt: new Date().toISOString(), grade: 'A' },
                        { studentId: 'S002', studentName: 'Bob', status: '未繳交', submittedAt: '', grade: '' },
                        { studentId: 'S003', studentName: 'Charlie', status: '已繳交', submittedAt: new Date().toISOString(), grade: 'B+' },
                        { studentId: 'S004', studentName: 'David', status: '訂正', submittedAt: new Date().toISOString(), grade: 'C' },
                    ];
                    resolve({
                        status: 'success',
                        data: statusList
                    });
                    break;
                case 'updateGrade':
                    // Mock update grade logic could go here updating mockStudentStatus
                    resolve({ status: 'success', message: '成績已更新 (Mock)' });
                    break;
                case 'getDailySummary':
                    // Dynamic Daily Summary Logic
                    const todayStr = new Date().toISOString().split('T')[0];
                    const targets = mockAssignments.filter(a => a.endDate === todayStr);

                    const summary = targets.map(t => {
                        const statuses = mockStudentStatus[t.id] || [];
                        const missing = statuses
                            .filter(s => s.status !== '已繳交')
                            .map(s => s.studentId.replace('S00', '')); // Simulating number extraction

                        // Fallback if no status tracked
                        if (missing.length === 0 && !mockStudentStatus[t.id]) return { subject: t.id, missing: ['mock_all'] };

                        return { subject: t.id, missing };
                    });

                    // Add the static mock data as fallback/example if dynamic list is empty (or merge them)
                    // For clarity, let's just use the dynamic one + the static one for demo
                    resolve({
                        status: 'success',
                        summary: [
                            ...summary,
                            // { subject: '國語甲本(MockStatic)', missing: ['01', '05'] } 
                        ]
                    });
                    break;
                case 'postQuestion':
                    mockQuestions.unshift({
                        id: 'Q' + Date.now(),
                        studentId: data.studentId,
                        assignmentId: data.assignmentId,
                        questionText: data.questionText,
                        status: 'Open',
                        answerText: '',
                        timestamp: new Date().toISOString()
                    });
                    resolve({ status: 'success', message: '問題已送出 (Mock)' });
                    break;
                case 'getQuestions':
                    resolve({ status: 'success', questions: mockQuestions });
                    break;
                case 'answerQuestion':
                    const qIndex = mockQuestions.findIndex(q => q.id === data.questionId);
                    if (qIndex !== -1) {
                        mockQuestions[qIndex].status = 'Answered';
                        mockQuestions[qIndex].answerText = data.answerText;
                    }
                    resolve({ status: 'success', message: '回覆成功 (Mock)' });
                    resolve({ status: 'success', message: '回覆成功 (Mock)' });
                    break;

                // --- Phase 2 Mock Handlers ---
                case 'getStudentPoints':
                    resolve({
                        status: 'success',
                        points: mockPoints[data.studentId] || 0,
                        history: [{ id: 'P1', change: 5, reason: 'Mock Reward', timestamp: new Date().toISOString() }]
                    });
                    break;
                case 'adjustPoints':
                    mockPoints[data.studentId] = (mockPoints[data.studentId] || 0) + parseInt(data.change);
                    resolve({ status: 'success', message: 'Points updated' });
                    break;
                case 'createContactNote':
                    mockContactNotes.push({ id: 'N' + Date.now(), date: new Date().toISOString().split('T')[0], content: data.content, teacherId: data.teacherId });
                    resolve({ status: 'success', message: 'Note created' });
                    break;
                case 'getLatestContactNote':
                    const latestNote = mockContactNotes[mockContactNotes.length - 1] || null;
                    const isSigned = mockSignatures.some(s => s.noteId === latestNote?.id && s.studentId === data.studentId);
                    resolve({ status: 'success', note: latestNote, isSigned, signedAt: isSigned ? new Date().toISOString() : null });
                    break;
                case 'signContactNote':
                    mockSignatures.push({ noteId: data.noteId, studentId: data.studentId, timestamp: new Date() });
                    resolve({ status: 'success', message: 'Signed' });
                    break;
                case 'getStudentStats':
                    resolve({
                        status: 'success',
                        stats: { totalAssignments: 10, submittedCount: 9, submissionRate: 90, avgScore: 88 }
                    });
                    break;
                case 'getStudents':
                    resolve({
                        status: 'success',
                        students: [
                            { id: 'S001', name: 'Alice' },
                            { id: 'S002', name: 'Bob' },
                            { id: 'S003', name: 'Charlie' },
                            { id: 'S123456', name: 'Demo Student' }
                        ]
                    });
                    break;
                default:
                    resolve({ status: 'error', message: 'Unknown action' });
            }
        }, MOCK_DELAY);
    });
};


export const apiCall = async (action, payload = {}) => {
    console.log(`[ACTION] API Request: ${action}`, payload);

    const isWeb = Platform.OS === 'web';
    const isGoogleScript = API_URL && API_URL.includes('script.google.com');

    if (!API_URL || API_URL.includes('YOUR_DEPLOYMENT_ID') || (isWeb && isGoogleScript)) {
        console.warn(`[WARN] Using Mock API for ${action} (No Config or CORS avoidance).`);
        const mockResponse = await mockApiCall(action, payload);
        console.log(`[ACTION] API Response (${action}):`, mockResponse);
        return mockResponse;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, ...payload }),
        });

        const result = await response.json();
        console.log(`[ACTION] API Response (${action}):`, result);
        return result;
    } catch (error) {
        console.error(`[ERROR] API Call Error (${action}):`, error);
        return { status: 'error', message: '網路連線錯誤' };
    }
};

