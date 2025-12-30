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
      case 'getDailySummary': // NEW
        return handleGetDailySummary(body);
      case 'updateGrade': // NEW
        return handleUpdateGrade(body);
      // Phase 2: Points System
      case 'getStudentPoints':
        return handleGetStudentPoints(body);
      case 'adjustPoints':
        return handleAdjustPoints(body);
      // Phase 2: Contact Book
      case 'getLatestContactNote':
        return handleGetLatestContactNote(body);
      case 'createContactNote':
        return handleCreateContactNote(body);
      case 'signContactNote':
        return handleSignContactNote(body);
      // Phase 2: Analytics
      case 'getStudentStats':
        return handleGetStudentStats(body);
      case 'getClassStats': // NEW
        return handleGetClassStats(body);
      case 'getStudents': // NEW
        return handleGetStudents(body);
      case 'updateAssignmentMetadata': // NEW - Edit Description
        return handleUpdateAssignmentMetadata(body);
      case 'deleteAssignment': // NEW - Delete Assignment
        return handleDeleteAssignment(body);
      case 'updateStatus': // NEW - Manually update submission status
        return handleUpdateStatus(body);
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
// ... (Create Assignment) ...
function handleCreateAssignment(body) {
  const { newAssignmentId, startDate, endDate, description, teacherId } = body;
  if (!newAssignmentId) throw new Error('Missing newAssignmentId');
  if (!teacherId) throw new Error('Missing teacherId'); // Required to know which class

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (ss.getSheetByName(newAssignmentId)) {
    throw new Error('Assignment already exists: ' + newAssignmentId);
  }

  // 1. Get Teacher's ClassID
  const usersSheet = ss.getSheetByName('Users');
  if (!usersSheet) throw new Error('Users sheet missing');

  const usersData = usersSheet.getDataRange().getValues();
  let teacherClassId = null;

  // Find Teacher's Class
  for (let i = 1; i < usersData.length; i++) {
    if (String(usersData[i][0]) === String(teacherId) && usersData[i][2] === 'teacher') {
      teacherClassId = usersData[i][3];
      break;
    }
  }

  if (!teacherClassId) throw new Error('Teacher not found or no class assigned');

  // 2. Filter Students in the same class
  const students = [];
  for (let i = 1; i < usersData.length; i++) {
    // Role is col 2 (index 2), ClassID is col 3 (index 3)
    if (usersData[i][2] === 'student' && String(usersData[i][3]) === String(teacherClassId)) {
      students.push({ id: usersData[i][0], name: usersData[i][1] });
    }
  }

  // 3. Create Metadata
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

  // 4. Create Assignment Sheet
  const newSheet = ss.insertSheet(newAssignmentId);
  newSheet.appendRow(['StudentID', 'Status', 'SubmittedAt', 'StudentName', 'Grade']);

  const rows = students.map(s => [s.id, '未繳交', '', s.name, '']);
  if (rows.length > 0) {
    newSheet.getRange(2, 1, rows.length, 5).setValues(rows);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: '作業建立成功: ' + newAssignmentId + ' (Class ' + teacherClassId + ')'
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
    if (!['Roster', 'Users', 'AssignmentMetadata', 'Questions', 'PointsLog', 'ContactBook', 'ContactSignatures'].includes(name)) {
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
      studentName: data[i][3] || '',
      grade: data[i][4] || '' // Read Grade
    });
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    data: statusList
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleUpdateGrade(body) {
  const { studentId, assignmentId, grade } = body;
  if (!studentId || !assignmentId) throw new Error('Missing info');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(assignmentId);
  if (!sheet) throw new Error('Assignment not found');

  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(studentId)) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex === -1) throw new Error('Student not found');

  // Grade is Col 5 (Index 4, RowIndex, 5)
  sheet.getRange(rowIndex, 5).setValue(grade);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: '成績已更新'
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

// --- Daily Summary ---

function handleGetDailySummary() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var assignmentSheet = ss.getSheetByName("Assignments"); // Or "AssignmentMetadata" depending on your schema.
  // Wait, the user's schema seems to use "AssignmentMetadata" for metadata, and individual sheets for submissions.
  // Let's check handleGetAssignments (line 153). It uses "AssignmentMetadata". 
  // BUT handleCreateAssignment (line 93) creates sheets named by ID.
  // My previous gas_daily_summary.js assumed a single "Assignments" sheet.
  // I need to adapt to the logic in Code.js:

  // 1. Get assignments from "AssignmentMetadata"
  var metaSheet = ss.getSheetByName("AssignmentMetadata");
  if (!metaSheet) return ContentService.createTextOutput(JSON.stringify({ status: "success", summary: [] })).setMimeType(ContentService.MimeType.JSON);

  var today = new Date();
  var todayStr = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM-dd");

  var assignmentsData = metaSheet.getDataRange().getValues();
  var targetAssignments = [];

  // Skip header
  for (var i = 1; i < assignmentsData.length; i++) {
    // Col0: ID, Col1: Start, Col2: End, Col3: Desc
    // Check dates. Note: Code.js uses Date objects in sheet? handleCreateAssignment puts ISO string. 
    // We should be careful. Let's format it.
    var id = assignmentsData[i][0];
    var endDate = formatDate(assignmentsData[i][2]);

    if (endDate === todayStr) {
      targetAssignments.push({ id: id, desc: assignmentsData[i][3] });
    }
  }

  // 2. Get Users/Students
  var usersSheet = ss.getSheetByName('Users');
  var studentMap = {};
  if (usersSheet) {
    var users = usersSheet.getDataRange().getValues();
    // A:ID, B:Name, C:Role, D:ClassID, E:Number (New)
    for (var i = 1; i < users.length; i++) {
      if (users[i][2] === 'student') {
        var id = users[i][0];
        var number = (users[i].length > 4) ? users[i][4] : "";
        studentMap[id] = number || id; // Fallback to ID
      }
    }
  }

  // 3. Check each target assignment sheet
  var summary = [];

  targetAssignments.forEach(function (assignment) {
    var sheet = ss.getSheetByName(assignment.id);
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      var submittedIds = [];
      // Row 1 header: StudentID, Status, SubmittedAt, Name
      for (var r = 1; r < data.length; r++) {
        if (data[r][1] === '已繳交') {
          submittedIds.push(String(data[r][0]));
        }
      }

      var missing = [];
      for (var studentId in studentMap) {
        if (submittedIds.indexOf(String(studentId)) === -1) {
          missing.push(studentMap[studentId]);
        }
      }

      if (missing.length > 0) {
        summary.push({
          subject: assignment.desc || assignment.id, // Use description if available
          missing: missing
        });
      }
    }
  });

  return ContentService.createTextOutput(JSON.stringify({ status: "success", summary: summary }))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatDate(dateObj) {
  if (!dateObj) return "";
  return Utilities.formatDate(new Date(dateObj), Session.getScriptTimeZone(), "yyyy-MM-dd");
}

// ==========================================
// Phase 2: Advanced Features Implementation
// ==========================================

// --- 1. Reward Points System ---

function handleGetStudentPoints(body) {
  const { studentId } = body;
  if (!studentId) throw new Error('Missing studentId');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let pointsSheet = ss.getSheetByName('PointsLog');

  if (!pointsSheet) {
    // If not exists, create it and return 0
    pointsSheet = ss.insertSheet('PointsLog');
    pointsSheet.appendRow(['LogID', 'StudentID', 'Change', 'Reason', 'Timestamp', 'TeacherID']);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', points: 0, history: [] })).setMimeType(ContentService.MimeType.JSON);
  }

  const data = pointsSheet.getDataRange().getValues();
  let totalPoints = 0;
  const history = [];

  // Skip header
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]) === String(studentId)) {
      totalPoints += Number(data[i][2]);
      history.push({
        id: data[i][0],
        change: data[i][2],
        reason: data[i][3],
        timestamp: data[i][4]
      });
    }
  }

  // Return last 10 records descending
  history.reverse();
  const recentHistory = history.slice(0, 10);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    points: totalPoints,
    history: recentHistory
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleAdjustPoints(body) {
  const { studentId, change, reason, teacherId } = body;
  if (!studentId || !change) throw new Error('Missing info');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let pointsSheet = ss.getSheetByName('PointsLog');
  if (!pointsSheet) {
    pointsSheet = ss.insertSheet('PointsLog');
    pointsSheet.appendRow(['LogID', 'StudentID', 'Change', 'Reason', 'Timestamp', 'TeacherID']);
  }

  const logId = 'P' + new Date().getTime();
  pointsSheet.appendRow([
    logId,
    studentId,
    change,
    reason || '',
    new Date().toISOString(),
    teacherId || 'System'
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Points updated'
  })).setMimeType(ContentService.MimeType.JSON);
}

// --- 2. Digital Contact Book ---

function handleCreateContactNote(body) {
  const { content, teacherId } = body;
  if (!content) throw new Error('Missing content');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let noteSheet = ss.getSheetByName('ContactBook');
  if (!noteSheet) {
    noteSheet = ss.insertSheet('ContactBook');
    noteSheet.appendRow(['NoteID', 'Date', 'Content', 'TeacherID', 'CreatedAt']);
  }

  const noteId = 'N' + new Date().getTime();
  const dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");

  noteSheet.appendRow([
    noteId,
    dateStr,
    content,
    teacherId || 'T001',
    new Date().toISOString()
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Note created'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetLatestContactNote(body) {
  const { studentId } = body;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const noteSheet = ss.getSheetByName('ContactBook');

  // If no notes, return null
  if (!noteSheet || noteSheet.getLastRow() <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', note: null })).setMimeType(ContentService.MimeType.JSON);
  }

  // Get last row
  const lastRowIndex = noteSheet.getLastRow();
  const noteRow = noteSheet.getRange(lastRowIndex, 1, 1, 5).getValues()[0];
  const noteId = noteRow[0];
  const noteData = {
    id: noteId,
    date: formatDate(noteRow[1]),
    content: noteRow[2],
    teacherId: noteRow[3]
  };

  // Check signature
  let isSigned = false;
  let signedAt = null;
  const signSheet = ss.getSheetByName('ContactSignatures');
  if (signSheet && studentId) {
    const data = signSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(noteId) && String(data[i][1]) === String(studentId)) {
        isSigned = true;
        signedAt = data[i][3];
        break;
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    note: noteData,
    isSigned: isSigned,
    signedAt: signedAt
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleSignContactNote(body) {
  const { noteId, studentId } = body;
  if (!noteId || !studentId) throw new Error('Missing info');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let signSheet = ss.getSheetByName('ContactSignatures');
  if (!signSheet) {
    signSheet = ss.insertSheet('ContactSignatures');
    signSheet.appendRow(['NoteID', 'StudentID', 'Status', 'SignedAt']);
  }

  // Check if already signed
  const data = signSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(noteId) && String(data[i][1]) === String(studentId)) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Already signed' })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  signSheet.appendRow([
    noteId,
    studentId,
    'Signed',
    new Date().toISOString()
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Signed successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

// --- 3. Learning Analysis ---

function handleGetStudentStats(body) {
  const { studentId } = body;
  if (!studentId) throw new Error('Missing studentId');

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Get List of Assignments
  const metaSheet = ss.getSheetByName('AssignmentMetadata');
  if (!metaSheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', stats: {} })).setMimeType(ContentService.MimeType.JSON);
  }

  const metaData = metaSheet.getDataRange().getValues();
  let assignmentIds = [];

  // Skip header, collecting all assignment IDs
  for (let i = 1; i < metaData.length; i++) {
    assignmentIds.push(metaData[i][0]);
  }

  let totalAssignments = 0;
  let submittedCount = 0;
  let totalScore = 0;
  let gradedCount = 0;

  // 2. Iterate through each Assignment Sheet
  assignmentIds.forEach(id => {
    const sheet = ss.getSheetByName(id);
    if (sheet) {
      totalAssignments++;
      const data = sheet.getDataRange().getValues();
      // Find student row
      for (let r = 1; r < data.length; r++) {
        if (String(data[r][0]) === String(studentId)) {
          // Status is Col 2 (index 1)
          if (data[r][1] === '已繳交') {
            submittedCount++;
          }
          // Grade is Col 5 (index 4) if exists
          if (data[r].length > 4 && data[r][4]) {
            const score = parseFloat(data[r][4]);
            if (!isNaN(score)) {
              totalScore += score;
              gradedCount++;
            }
          }
          break;
        }
      }
    }
  });

  const submissionRate = totalAssignments > 0 ? Math.round((submittedCount / totalAssignments) * 100) : 0;
  const avgScore = gradedCount > 0 ? Math.round(totalScore / gradedCount) : 0;

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    stats: {
      totalAssignments,
      submittedCount,
      submissionRate,
      avgScore
    }
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetClassStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Get Students
  const usersSheet = ss.getSheetByName('Users');
  if (!usersSheet) return ContentService.createTextOutput(JSON.stringify({ status: 'success', classStats: {}, students: [] })).setMimeType(ContentService.MimeType.JSON);

  const usersData = usersSheet.getDataRange().getValues();
  const students = [];
  for (let i = 1; i < usersData.length; i++) {
    if (usersData[i][2] === 'student') {
      students.push({ id: usersData[i][0], name: usersData[i][1] });
    }
  }

  // 2. Get Assignments
  const metaSheet = ss.getSheetByName('AssignmentMetadata');
  if (!metaSheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', classStats: {}, students: [] })).setMimeType(ContentService.MimeType.JSON);
  }
  const metaData = metaSheet.getDataRange().getValues();
  let assignmentIds = [];
  for (let i = 1; i < metaData.length; i++) {
    assignmentIds.push(metaData[i][0]);
  }

  let totalClassAssignments = 0;
  let totalClassSubmitted = 0;
  let totalClassScore = 0;
  let totalClassGraded = 0;

  // 3. Calculate Stats per Student
  // Optimization: Read all assignment sheets once? 
  // For simplicity/robustness, we iterate assignments and build a map.

  const studentStatsMap = {}; // { studentId: { submitted: 0, total: 0, scoreSum: 0, gradedCount: 0 } }
  students.forEach(s => {
    studentStatsMap[s.id] = { submitted: 0, total: 0, scoreSum: 0, gradedCount: 0 };
  });

  assignmentIds.forEach(id => {
    const sheet = ss.getSheetByName(id);
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      // data[r][0] is StudentID, [1] Status, [4] Grade
      for (let r = 1; r < data.length; r++) {
        const sid = String(data[r][0]);
        if (studentStatsMap[sid]) {
          studentStatsMap[sid].total++;

          if (data[r][1] === '已繳交') {
            studentStatsMap[sid].submitted++;
          }

          if (data[r].length > 4 && data[r][4]) {
            const score = parseFloat(data[r][4]);
            if (!isNaN(score)) {
              studentStatsMap[sid].scoreSum += score;
              studentStatsMap[sid].gradedCount++;
            }
          }
        }
      }
    }
  });

  // 4. Summarize
  const studentResults = students.map(s => {
    const stats = studentStatsMap[s.id];
    const subRate = stats.total > 0 ? Math.round((stats.submitted / stats.total) * 100) : 0;
    const avg = stats.gradedCount > 0 ? Math.round(stats.scoreSum / stats.gradedCount) : 0;

    totalClassAssignments += stats.total;
    totalClassSubmitted += stats.submitted;
    totalClassScore += stats.scoreSum;
    totalClassGraded += stats.gradedCount;

    return {
      id: s.id,
      name: s.name,
      submissionRate: subRate,
      avgScore: avg
    };
  });

  const classSubRate = totalClassAssignments > 0 ? Math.round((totalClassSubmitted / totalClassAssignments) * 100) : 0;
  const classAvgScore = totalClassGraded > 0 ? Math.round(totalClassScore / totalClassGraded) : 0;

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    classStats: {
      submissionRate: classSubRate,
      avgScore: classAvgScore
    },
    students: studentResults
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetStudents() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName('Users');
  if (!usersSheet) return ContentService.createTextOutput(JSON.stringify({ status: 'success', students: [] })).setMimeType(ContentService.MimeType.JSON);

  const data = usersSheet.getDataRange().getValues();
  const students = [];
  // Skip header
  for (let i = 1; i < data.length; i++) {
    // Col 2 (Index 2) is Role
    if (data[i][2] === 'student') {
      students.push({
        id: data[i][0], // StudentID
        name: data[i][1] // Name
      });
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    students: students
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleUpdateAssignmentMetadata(body) {
  const { assignmentId, description } = body;
  if (!assignmentId || !description) throw new Error('Missing assignmentId or description');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const metaSheet = ss.getSheetByName('AssignmentMetadata');
  if (!metaSheet) throw new Error('Metadata sheet not found');

  const data = metaSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(assignmentId)) {
      // Column 4 (Index 3) is Description
      metaSheet.getRange(i + 1, 4).setValue(description);
      break;
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Description updated'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleDeleteAssignment(body) {
  const { assignmentId } = body;
  if (!assignmentId) throw new Error('Missing assignmentId');

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Delete the specific Assignment Sheet
  const assignmentSheet = ss.getSheetByName(assignmentId);
  if (assignmentSheet) {
    ss.deleteSheet(assignmentSheet);
  }

  // 2. Delete from Metadata
  const metaSheet = ss.getSheetByName('AssignmentMetadata');
  if (metaSheet) {
    const data = metaSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(assignmentId)) {
        metaSheet.deleteRow(i + 1); // Row is 1-indexed
        break;
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Assignment deleted successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleUpdateStatus(body) {
  const { studentId, assignmentId, status } = body;
  if (!studentId || !assignmentId || !status) throw new Error('Missing info');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(assignmentId);
  if (!sheet) throw new Error('Assignment not found');

  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(studentId)) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex === -1) throw new Error('Student not found');

  // Status is Col 2 (rowIndex, 2), Timestamp is Col 3 (rowIndex, 3)
  sheet.getRange(rowIndex, 2).setValue(status);

  if (status === '已繳交') {
    // Update timestamp to now
    sheet.getRange(rowIndex, 3).setValue(new Date().toISOString());
  } else if (status === '未繳交') {
    // Clear timestamp
    sheet.getRange(rowIndex, 3).setValue('');
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Status updated'
  })).setMimeType(ContentService.MimeType.JSON);
}
