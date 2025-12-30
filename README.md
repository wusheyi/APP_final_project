# 課堂作業 QR Code 登記與管理系統 (Classroom Assignment Management System)

這是一個專為老師與學生設計的互動式作業管理系統，結合 **React Native (Expo)** 前端應用程式與 **Google Apps Script** 後端資料庫。
系統支援掃描 QR Code 繳交作業、自動批改與點名、獎勵點數系統、以及電子聯絡簿功能。

---

## ✨ 核心功能

### 👨‍🏫 老師端 (Teacher)
*   **新增作業 (Create Assignment)**:
    *   支援日期選擇器 (Date Picker) 設定開始與截止日期。
    *   **自動指派**: 自動抓取同班級 (`ClassID`) 的所有學生，無需手動建立名單。
    *   **ID 自動生成**: 系統依日期時間產生唯一作業 ID (例如 `HW20251230-1645`)。
*   **批改作業 (Grading)**: 檢視全班繳交狀況，並可直接輸入成績。
*   **學習分析 (Analytics)**:
    *   **班級概況**: 查看全班平均繳交率與平均分數。
    *   **學生詳情**: 點擊學生可查看個人的詳細繳交紀錄與成績趨勢。
*   **給予獎勵 (Rewards)**: 為學生加扣分（如：回答問題 +5 分），系統自動記錄歷程。
*   **電子聯絡簿 (Contact Book)**: 發布每日聯絡事項，並查看學生/家長簽名狀況。
*   **學生問答 (Q&A)**: 回覆學生對作業提出的問題。

### 👨‍🎓 學生端 (Student)
*   **掃描作業 (Scan QR)**:
    *   開啟相機掃描 QR Code 即完成繳交。
    *   **人性化介面**: 顯示作業說明 (例如 "數學習作 P.5") 而非難懂的 ID。
*   **我的作業 (My Assignments)**: 查看待繳交、已繳交、已批改的作業列表 (含成績)。
*   **獎勵積點 (Points)**: 查看目前的獎勵點數與詳細增減紀錄。
*   **電子聯絡簿**: 查看老師發布的聯絡事項並進行「簽名」。
*   **提出問題**: 對特定作業提出疑問。

---

## �️ 安裝與執行 (Frontend)

本專案使用 Expo 開發，請確保已安裝 [Node.js](https://nodejs.org/)。

1.  **安裝依賴套件**:
    ```bash
    npm install
    ```

2.  **設定環境變數**:
    打開 `.env` 檔案，填入你的 Google Apps Script 部署網址：
    ```env
    EXPO_PUBLIC_API_URL=https://script.google.com/macros/s/你的部署ID/exec
    ```

3.  **啟動專案**:
    ```bash
    npx expo start
    ```
    - 按 `a` 開啟 Android 模擬器或連接實機。
    - 使用 Expo Go App 掃描 QR Code。

---

## ☁️ 後端資料庫結構 (Google Sheets)

本系統使用 Google Sheets 作為資料庫，無需架設伺服器。以下是必要的工作表 (Sheets) 結構：

> **⚠️ 注意**: 大小寫必須完全一致！

### 1. 基礎設定
*   **`Users`** (使用者名單 - 取代舊版 Roster):
    *   欄位: `UserID` | `Name` | `Role` | `ClassID`
    *   範例: `T001` | `王老師` | `teacher` | `ClassA`
    *   範例: `S001` | `陳小明` | `student` | `ClassA`
    *   *說明: 系統依據 `ClassID` 自動將學生分班，老師只能指派作業給同班學生。*

### 2. 作業管理
*   **`AssignmentMetadata`** (作業清單):
    *   欄位: `AssignmentID` | `StartDate` | `EndDate` | `Description` | `CreatedAt`
    *   *說明: 記錄作業的基本資訊與說明。*
*   **`[AssignmentID]`** (個別作業表 - 動態產生):
    *   名稱範例: `HW20251230-1645`
    *   欄位: `StudentID` | `Status` | `SubmittedAt` | `StudentName` | `Grade`
    *   *說明: 每建立一份新作業，系統會自動產生一張對應的工作表，並填入該班級所有學生。*

### 3. 進階功能
*   **`PointsLog`** (獎勵紀錄):
    *   欄位: `LogID` | `StudentID` | `Change` | `Reason` | `Timestamp` | `TeacherID`
*   **`ContactBook`** (聯絡簿內容):
    *   欄位: `NoteID` | `Date` | `Content` | `TeacherID` | `CreatedAt`
*   **`ContactSignatures`** (聯絡簿簽名):
    *   欄位: `NoteID` | `StudentID` | `Status` | `SignedAt`
*   **`Questions`** (問答紀錄):
    *   欄位: `QuestionID` | `StudentID` | `AssignmentID` | `QuestionText` | `Status` | `AnswerText` | ...

---

## 🚀 部署 Google Apps Script

1.  開啟 Google Sheet，點擊 **「擴充功能」 > 「Apps Script」**。
2.  將專案中 `backend/Code.js` 的內容完整複製貼上。
3.  點擊 **「部署」 > 「建立新部署」 (New Deployment)**。
4.  **類型**: 網頁應用程式 (Web App)。
5.  **執行身分**: 我 (Me)。
6.  **存取權**: **所有使用者 (Anyone)** *(這點非常重要，否則 App 無法存取)*。
7.  複製產生的 URL，貼回專案的 `.env` 檔案中。

---

## � 資料庫優化建議 (Future Improvements)

目前的架構採用「一作業一工作表 (Sheet)」的模式，優點是直觀、易於人工查閱。但若長期使用，工作表數量過多可能導致 Google Sheets 效能下降 (上限約 200 張工作表)。

**建議未來的重構方向**:
*   **單一 Submission 表**: 建立一張總表 `Submissions`，欄位包含 `AssignmentID`，將所有作業的繳交紀錄集中管理。
*   **優點**: 更易於進行全學期的大數據分析，且不會有工作表數量限制的問題。

---

## 📱 QR Code 生成工具

專案內附 `generate_qr.py` (Python)，可快速生成測試用的 QR Code。
*   **使用方式**:
    ```bash
    python generate_qr.py
    ```
*   **邏輯**: 只需包含 `studentId` 的 JSON (例如 `{"studentId": "S001"}`)，即可重複使用於所有作業。

---
© 2025 Classroom Assignment System Project
