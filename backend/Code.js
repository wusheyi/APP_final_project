function doPost(e) {
  const output = { status: 'error', message: 'Unknown error' };

  try {
    const body = e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const action = body.action;

    if (!action) throw new Error('Missing action parameter');

    switch (action) {
      case 'login':
        return handleLogin(body);
      case 'submitAssignment':
        return handleSubmitAssignment(body);
      case 'createAssignment':
        return handleCreateAssignment(body);
      case 'getAssignments':
        return handleGetAssignments(body); // Supports studentId for status check
      case 'getAssignmentStatus':
        return handleGetAssignmentStatus(body);
      case 'postQuestion':
        return handlePostQuestion(body);
      case 'getQuestions': // NEW
        return handleGetQuestions(body);
      case 'answerQuestion': // NEW
        return handleAnswerQuestion(body);
      case 'updateProfile': // NEW
        return handleUpdateProfile(body);
      default:
        throw new Error('Invalid action: ' + action);
    }

  } catch (error) {
    output.message = error.toString();
    return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
  }
}

// ... (Login - unchanged) ...
function handleLogin(body) {
  const { userId } = body;
  if (!userId) throw new Error('Missing userId');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let usersSheet = ss.getSheetByName('Users');

  if (!usersSheet) {
    usersSheet = ss.insertSheet('Users');
    usersSheet.appendRow(['UserID', 'Name', 'Role', 'ClassID']);
    usersSheet.appendRow(['T001', 'Teacher Demo', 'teacher', '']);
    usersSheet.appendRow(['S123456', 'Student Demo', 'student', 'ClassA']);
  }

  const data = usersSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(userId)) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        user: {
          id: data[i][0],
          name: data[i][1],
          role: data[i][2],
          classId: data[i][3]
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  throw new Error('User not found');
}

function handleUpdateProfile(body) {
  const { userId, name } = body;
  if (!userId || !name) throw new Error('Missing info');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName('Users');
  if (!usersSheet) throw new Error('Users sheet not found');

  const data = usersSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(userId)) {
      usersSheet.getRange(i + 1, 2).setValue(name); // Column 2 is Name
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Name updated'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  throw new Error('User not found');
}

// ... (Create Assignment - unchanged) ...
function handleCreateAssignment(body) {
  const { newAssignmentId, startDate, endDate, description } = body;
  if (!newAssignmentId) throw new Error('Missing newAssignmentId');

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (ss.getSheetByName(newAssignmentId)) {
    throw new Error('Assignment already exists: ' + newAssignmentId);
  }

  const rosterSheet = ss.getSheetByName('Roster');
  if (!rosterSheet) throw new Error('Roster sheet is missing');

  let metaSheet = ss.getSheetByName('AssignmentMetadata');
  if (!metaSheet) {
    metaSheet = ss.insertSheet('AssignmentMetadata');
    metaSheet.appendRow(['AssignmentID', 'StartDate', 'EndDate', 'Description', 'CreatedAt']);
  }
  metaSheet.appendRow([
    newAssignmentId,
    startDate || '',
    endDate || '',
    description || '',
    new Date().toISOString()
  ]);

  const rosterData = rosterSheet.getDataRange().getValues();
  const students = [];
  for (let i = 1; i < rosterData.length; i++) {
    students.push({ id: rosterData[i][0], name: rosterData[i][1] });
  }

  const newSheet = ss.insertSheet(newAssignmentId);
  newSheet.appendRow(['StudentID', 'Status', 'SubmittedAt', 'StudentName']);

  const rows = students.map(s => [s.id, '未繳交', '', s.name]);
  if (rows.length > 0) {
    newSheet.getRange(2, 1, rows.length, 4).setValues(rows);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: '作業建立成功: ' + newAssignmentId
  })).setMimeType(ContentService.MimeType.JSON);
}

// --- Modified: Get Assignments with Status Check ---
function handleGetAssignments(body) {
  const { studentId } = body; // Optional
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const assignmentIds = [];

  sheets.forEach(sheet => {
    const name = sheet.getName();
    if (!['Roster', 'Users', 'AssignmentMetadata', 'Questions'].includes(name)) {
      assignmentIds.push(name);
    }
  });

  const metaSheet = ss.getSheetByName('AssignmentMetadata');
  const metadataMap = {};
  if (metaSheet) {
    const data = metaSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      metadataMap[data[i][0]] = {
        startDate: data[i][1],
        endDate: data[i][2],
        description: data[i][3]
      };
    }
  }

  // If studentId provided, check status for each assignment
  const assignments = assignmentIds.map(id => {
    let studentStatus = 'Unknown';
    if (studentId) {
      const sheet = ss.getSheetByName(id);
      if (sheet) {
        const data = sheet.getDataRange().getValues();
        // Row 1 is header
        for (let i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(studentId)) {
            studentStatus = data[i][1]; // Status column
            break;
          }
        }
        if (studentStatus === 'Unknown') studentStatus = '未繳交'; // Default if not found
      }
    }

    return {
      id: id,
      ...metadataMap[id],
      status: studentStatus
    };
  });

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    assignments: assignments
  })).setMimeType(ContentService.MimeType.JSON);
}

// ... (Submit Assignment/Get Status - unchanged) ...
function handleSubmitAssignment(body) {
  const { studentId, assignmentId } = body;
  if (!studentId || !assignmentId) throw new Error('Missing studentId or assignmentId');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(assignmentId);
  if (!sheet) throw new Error('Assignment not found: ' + assignmentId);

  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(studentId)) {
      rowIndex = i + 1;
      break;
    }
  }
  if (rowIndex === -1) throw new Error('Student ID not found in roster');

  const timestamp = new Date();
  sheet.getRange(rowIndex, 2).setValue('已繳交');
  sheet.getRange(rowIndex, 3).setValue(timestamp.toISOString());

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: '繳交成功',
    data: { studentId, assignmentId, timestamp }
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetAssignmentStatus(body) {
  const { assignmentId } = body;
  if (!assignmentId) throw new Error('Missing assignmentId');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(assignmentId);
  if (!sheet) throw new Error('Assignment not found');

  const data = sheet.getDataRange().getValues();
  const statusList = [];
  for (let i = 1; i < data.length; i++) {
    statusList.push({
      studentId: data[i][0],
      status: data[i][1],
      submittedAt: data[i][2],
      studentName: data[i][3] || ''
    });
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    data: statusList
  })).setMimeType(ContentService.MimeType.JSON);
}

// --- Q&A Features ---

function handlePostQuestion(body) {
  const { studentId, assignmentId, questionText } = body;
  if (!studentId || !questionText) throw new Error('Missing info');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let qSheet = ss.getSheetByName('Questions');
  if (!qSheet) {
    qSheet = ss.insertSheet('Questions');
    qSheet.appendRow(['QuestionID', 'StudentID', 'AssignmentID', 'QuestionText', 'Status', 'AnswerText', 'Timestamp']);
  }

  const qId = 'Q' + new Date().getTime();
  qSheet.appendRow([
    qId,
    studentId,
    assignmentId || 'General',
    questionText,
    'Open',
    '',
    new Date().toISOString()
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: '問題已送出'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetQuestions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const qSheet = ss.getSheetByName('Questions');
  if (!qSheet) return ContentService.createTextOutput(JSON.stringify({ status: 'success', questions: [] })).setMimeType(ContentService.MimeType.JSON);

  const data = qSheet.getDataRange().getValues();
  const questions = [];
  // Skip header
  for (let i = 1; i < data.length; i++) {
    questions.push({
      id: data[i][0],
      studentId: data[i][1],
      assignmentId: data[i][2],
      questionText: data[i][3],
      status: data[i][4],
      answerText: data[i][5],
      timestamp: data[i][6]
    });
  }

  // Sort by newest first
  questions.reverse();

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    questions: questions
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleAnswerQuestion(body) {
  const { questionId, answerText } = body;
  if (!questionId || !answerText) throw new Error('Missing info');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const qSheet = ss.getSheetByName('Questions');
  if (!qSheet) throw new Error('Questions sheet missing');

  const data = qSheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(questionId)) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex === -1) throw new Error('Question not found');

  qSheet.getRange(rowIndex, 5).setValue('Answered'); // Status
  qSheet.getRange(rowIndex, 6).setValue(answerText); // AnswerText

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: '回覆成功'
  })).setMimeType(ContentService.MimeType.JSON);
}
