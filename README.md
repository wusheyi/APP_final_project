# 課堂作業 QR Code 登記與管理系統 (Classroom Assignment System)

這是一個基於 React Native (Expo) 與 Google Apps Script (GAS) 開發的作業管理系統。
學生可以透過掃描 QR Code 繳交作業，老師可以即時建立作業並查看全班繳交狀況。

---

## 🚀 專案安裝流程 (Frontend)

本專案使用 Expo 開發，請確保你的電腦已安裝 [Node.js](https://nodejs.org/)。

1.  **安裝依賴套件**:
    在專案根目錄開啟終端機，執行：
    ```bash
    npm install
    ```

2.  **設定環境變數**:
    打開 `.env` 檔案，將你的 Google Apps Script 部署網址填入 (獲取方式請見下方後端設置)：
    ```env
    EXPO_PUBLIC_API_URL=https://script.google.com/macros/s/你的部署ID/exec
    ```
    *(若暫時沒有 URL，系統會自動使用各種 Mock 模式進行模擬測試)*

3.  **啟動專案**:
    ```bash
    npx expo start
    ```
    - 使用 Expo Go App 掃描 QR Code (實機測試)。
    - 或按 `w` 開啟網頁版預覽。

---

## ☁️ 後端設置流程 (Google Sheets & Apps Script)

本系統使用 Google Sheets 當作資料庫，無需架設伺服器。請務必依照以下步驟操作：

### 第一步：建立 Google Sheet (資料庫結構更新)
請確保你的 Google Sheet 包含以下工作表 (Sheet)，請**精確依照大小寫**命名：

1.  **`Roster`** (學生名冊):
    - 欄位: `StudentID`, `StudentName`
2.  **`Users`** (權限管理) **[NEW]**:
    - 欄位: `UserID`, `Name`, `Role` (填 `teacher` 或 `student`), `ClassID`
    - 說明: 這是登入驗證用的。
3.  **`AssignmentMetadata`** (作業資訊) **[NEW]**:
    - 欄位: `AssignmentID`, `StartDate`, `EndDate`, `Description`, `CreatedAt`
    - 說明: 系統會自動記錄，老師不用手動填。
4.  **`Questions`** (問題區) **[NEW]**:
    - 欄位: `QuestionID`, `StudentID`, `AssignmentID`, `QuestionText`, `Status`, `AnswerText`, `Timestamp`

### 第二步：部署 Google Apps Script
1.  在 Google Sheet 上方選單，點擊 **「擴充功能」 > 「Apps Script」**。
2.  **清空舊程式碼**，複製本專案 `backend/Code.js` 的所有新內容貼上。
3.  點擊 **「部署」(Deploy) > 「管理部署」 (Manage deployments)**。
4.  點擊右上角的 **鉛筆圖示 (Edit)**，在「版本」處選擇 **「建立新版本」 (New version)**。
5.  點擊 **「部署」 (Deploy)**。
6.  **重要**: 網址通常不會變，但如果變了，請更新 `.env` 檔案。

---

## 📱 功能操作說明

### 1. 產生學生 QR Code
本系統提供一個 Python 腳本方便你生成測試用的 QR Code。
1.  安裝 Python 套件：`pip install qrcode[pil]`
2.  執行腳本：`python generate_qr.py`
3.  輸入學號 (需與 Sheet `Roster` 中的一致) 和作業 ID (例如 `HW01`)。
4.  生成的 QR Code 圖片會直接儲存在資料夾中。

### 2. 老師端操作
- **新增作業**:
    - 在 APP 點擊「我是老師」>「新增作業」。
    - 輸入例如 `HW01`。
    - 系統會自動在 Google Sheet 建立一張名為 `HW01` 的工作表，並將 `Roster` 的名單複製過去。
- **查看狀態**:
    - 點擊「查看作業狀態」，可以看到全班該次作業的繳交情形。

### 3. 學生端操作
- **繳交作業**:
    - 在 APP 點擊「我是學生」>「掃描作業」。
    - 掃描剛才產生的 QR Code。
    - 系統會自動將狀態更新為「已繳交」。

---

## 🛠️ 開發與除錯
- 如果 APP 出現「網路連線錯誤」，請檢查 `.env` 中的 URL 是否正確，以及 Apps Script 部署權限是否為「所有人」。
- `src/api/sheetApi.js` 內建 Mock 機制，如果 `.env` 沒有設定好，APP 會自動切換為模擬模式以便測試 UI。
- **Web 開發模式**：在網頁版測試時，由於無法使用相機，系統會自動顯示「網頁版測試模式」，你可以直接輸入 QR Code 的 JSON 內容 (預設已自動填入範例) 並點擊「模擬送出」來測試 API 流程。

