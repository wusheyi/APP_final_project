const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Mock data for development
const MOCK_DELAY = 1000;

// Mock Store for Q&A
let mockQuestions = [
    { id: 'Q1', studentId: 'S123456', assignmentId: 'HW01', questionText: '截止日期是幾號?', status: 'Open', answerText: '', timestamp: new Date().toISOString() },
    { id: 'Q2', studentId: 'S123456', assignmentId: 'HW02', questionText: '這題怎麼做?', status: 'Answered', answerText: '請參考課本 P.10', timestamp: new Date().toISOString() }
];

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
                    resolve({ status: 'success', message: `作業 ${data.newAssignmentId} 建立成功 (Mock)` });
                    break;
                case 'getAssignments':
                    // Updated to return status if studentId is present
                    const isStudent = !!data.studentId;
                    resolve({
                        status: 'success', assignments: [
                            { id: 'HW01', description: 'React Basics', startDate: '2023-01-01', endDate: '2023-01-10', status: isStudent ? '已繳交' : 'Unknown' },
                            { id: 'HW02', description: 'Navigation', startDate: '2023-01-11', endDate: '2023-01-20', status: isStudent ? '未繳交' : 'Unknown' },
                            { id: 'TEST099', description: 'Test', startDate: '', endDate: '', status: isStudent ? '未繳交' : 'Unknown' }
                        ]
                    });
                    break;
                case 'getAssignmentStatus':
                    resolve({
                        status: 'success',
                        data: [
                            { studentId: 'S001', studentName: 'Alice', status: '已繳交', submittedAt: new Date().toISOString() },
                            { studentId: 'S002', studentName: 'Bob', status: '未繳交', submittedAt: '' },
                            { studentId: 'S003', studentName: 'Charlie', status: '已繳交', submittedAt: new Date().toISOString() },
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
                    break;
                default:
                    resolve({ status: 'error', message: 'Unknown action' });
            }
        }, MOCK_DELAY);
    });
};

export const apiCall = async (action, payload = {}) => {
    if (!API_URL || API_URL.includes('YOUR_DEPLOYMENT_ID')) {
        console.warn('API_URL not configured, using Mock API.');
        return mockApiCall(action, payload);
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
        return result;
    } catch (error) {
        console.error('API Call Error:', error);
        return { status: 'error', message: '網路連線錯誤' };
    }
};
