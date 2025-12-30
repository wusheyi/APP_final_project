import qrcode
import json
import os
import time

def generate_qr(student_id, assignment_id=None):
    # Data structure expected by the App
    # If assignment_id is None, the App expects the teacher to select the assignment in the scanner UI.
    data = {
        "studentId": student_id
    }
    
    if assignment_id:
        data["assignmentId"] = assignment_id
        description = f"Assignment-{assignment_id}"
    else:
        description = "Student-Card"
    
    # Convert to JSON string
    json_data = json.dumps(data)
    
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H, # High error correction for better scanning
        box_size=10,
        border=4,
    )
    
    qr.add_data(json_data)
    qr.make(fit=True)

    # Create an image from the QR Code instance
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Ensure directory exists
    output_dir = "qrcodes"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Save the image
    suffix = f"_{assignment_id}" if assignment_id else ""
    filename = f"{output_dir}/QR_{student_id}{suffix}.png"
    img.save(filename)
    print(f"✅ Generated: {filename}")
    print(f"   Content: {json_data}")

def batch_generate():
    students = [
        {"id": "S123456", "name": "Student Demo"},
        {"id": "S001", "name": "Alice"},
        {"id": "S002", "name": "Bob"},
        {"id": "S003", "name": "Charlie"},
    ]
    print(f"\nGeneratinig for {len(students)} demo students...")
    for s in students:
        generate_qr(s["id"])

if __name__ == "__main__":
    print("=========================================")
    print("   智慧作業管理 - QR Code Generator")
    print("=========================================")
    print("1. 生成單一學生 (Single Student)")
    print("2. 批次生成範例學生 (Batch Demo Students)")
    print("3. 生成特定作業繳交卡 (Specific Assignment)")
    
    choice = input("\n請選擇模式 (Enter 1-3): ").strip()
    
    if choice == '1':
        s_id = input("請輸入學生 ID (e.g. S123456): ").strip()
        if s_id:
            generate_qr(s_id)
        else:
            print("❌ ID 不能為空")

    elif choice == '2':
        batch_generate()

    elif choice == '3':
        s_id = input("請輸入學生 ID: ").strip()
        a_id = input("請輸入作業 ID (e.g. HW01): ").strip()
        if s_id and a_id:
            generate_qr(s_id, a_id)
        else:
            print("❌ ID 不能為空")
            
    else:
        print("未知的選項")

    print("\n完成。檔案已儲存於 'qrcodes' 資料夾。")
