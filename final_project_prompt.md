# 角色
你是一位全端工程師，精通以 React Native (Expo) 開發前端，並擅長使用 Google Apps Script 撰寫多功能的後端 API 來與 Google Sheets 互動。請為我設計一個包含「學生端」與「老師端」功能的「課堂作業 QR Code 登記與管理系統」。

# UI/UX 需求
- **前端框架**：React Native (Expo)
- **風格**：簡潔、現代的實用工具風格。
- **核心畫面規劃**：
    1.  **HomeScreen**: APP 啟動頁，提供兩個入口按鈕：「掃描作業 (學生模式)」和「管理作業 (老師模式)」。
    2.  **ScannerScreen**: (學生模式) 相機掃描畫面。
    3.  **ResultScreen**: (學生/老師共用) 顯示操作結果的確認畫面（如繳交成功、新增作業成功等）。
    4.  **TeacherDashboardScreen**: (老師模式) 老師模式的主選單，提供「新增作業」和「查看作業狀態」兩個功能入口。
    5.  **CreateAssignmentScreen**: (老師模式) 一個表單，包含一個文字輸入框讓老師填寫新的 `assignmentId`，以及一個「確認新增」按鈕。
    6.  **AssignmentListScreen**: (老師模式) 顯示所有已建立的作業列表，列表中的每個項目都可點擊。
    7.  **StatusDashboardScreen**: (老師模式) 顯示特定作業的全班學生繳交狀態列表（學生ID、狀態、繳交時間）。

# Google Sheets 配置 (資料庫)
- **Roster (學生名冊) 工作表**: 一個名為 `Roster` 的固定工作表，用來存放此班級所有的學生資料。
    - 欄位: `StudentID`, `StudentName`
- **Assignment (作業) 工作表**: 每個作業都是一張獨立的工作表，**其工作表名稱即為 `assignmentId`** (例如 `HW01`, `HW02`)。
    - 欄位: `StudentID`, `Status`, `SubmittedAt`

# Google Apps Script 功能 (後端 API)
- 在 Google Sheets 文件中建立的 Apps Script 專案。
- 撰寫一個 `doPost(e)` 函式作為統一的 API 入口，並將其部署為網路應用程式。
- **API 路由邏輯**: `doPost` 函式應解析請求 Body 中的 `action` 參數，並根據 `action` 的值執行不同的功能。

```javascript
// doPost(e) 偽代碼
function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const action = body.action;

  switch (action) {
    case "submitAssignment":
      return handleSubmitAssignment(body); // 學生繳交作業
    case "createAssignment":
      return handleCreateAssignment(body); // 老師新增作業
    case "getAssignments":
      return handleGetAssignments();       // 老師取得所有作業列表
    case "getAssignmentStatus":
      return handleGetAssignmentStatus(body); // 老師取得特定作業的繳交狀況
    default:
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "無效的操作" }));
  }
}
```

- **各 `action` 功能詳述**:
    1.  `action: "submitAssignment"`: (學生用) 接收 `studentId`, `assignmentId`。找到對應的工作表和學生，將「未繳交」更新為「已繳交」並記錄時間戳。
    2.  `action: "createAssignment"`: (老師用) 接收 `newAssignmentId`。
        - 檢查是否已存在同名工作表。
        - 讀取 `Roster` 工作表中的所有 `StudentID`。
        - 建立一張以 `newAssignmentId` 命名的新工作表。
        - 將 `Roster` 的 `StudentID` 填入新表，並將 `Status` 預設為「未繳交」。
    3.  `action: "getAssignments"`: (老師用) 不需參數。回傳所有工作表的名稱列表（需過濾掉 `Roster` 這張表）。
    4.  `action: "getAssignmentStatus"`: (老師用) 接收 `assignmentId`。讀取對應工作表的所有內容，並以 JSON 陣列格式回傳。

# 核心操作流程

## 學生流程 (掃描作業)
1.  在 `HomeScreen` 點擊「掃描作業」。
2.  進入 `ScannerScreen`，掃描 QR Code 取得 `studentId` 和 `assignmentId`。
3.  APP 向後端發送 `action: "submitAssignment"` 的 `POST` 請求。
4.  跳轉到 `ResultScreen` 顯示後端回傳的成功或失敗訊息。

## 老師流程 (管理作業)
1.  在 `HomeScreen` 點擊「管理作業」。
2.  進入 `TeacherDashboardScreen`。
3.  **新增作業**:
    - 點擊「新增作業」，進入 `CreateAssignmentScreen`。
    - 輸入新的作業 ID (如 `HW03`) 並點擊送出。
    - APP 向後端發送 `action: "createAssignment"` 的 `POST` 請求。
    - `ResultScreen` 顯示新增結果。
4.  **查看作業狀態**:
    - 點擊「查看作業狀態」。
    - APP 先向後端發送 `action: "getAssignments"` 請求，取得作業列表後進入 `AssignmentListScreen`。
    - `AssignmentListScreen` 顯示所有作業的按鈕列表。
    - 老師點擊某個作業 (如 `HW01`)。
    - APP 向後端發送 `action: "getAssignmentStatus"` 並帶上 `assignmentId: "HW01"`。
    - 進入 `StatusDashboardScreen`，以列表形式顯示後端回傳的全班繳交狀況。

# 環境變數設定 (.env)
- `GOOGLE_APP_SCRIPT_URL`: 你部署的 Google Apps Script 網路應用程式的統一 URL。