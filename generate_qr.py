import qrcode
import json
import os

def generate_qr(student_id, assignment_id):
    # Data structure expected by the App
    data = {
        "studentId": student_id,
        "assignmentId": assignment_id
    }
    
    # Convert to JSON string
    json_data = json.dumps(data)
    
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    qr.add_data(json_data)
    qr.make(fit=True)

    # Create an image from the QR Code instance
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save the image
    filename = f"qr_{student_id}_{assignment_id}.png"
    img.save(filename)
    print(f"✅ Generated QR Code: {filename}")
    print(f"   Content: {json_data}")

if __name__ == "__main__":
    print("--- Classroom Assignment QR Generator ---")
    
    # You can loop here or ask for input
    s_id = input("Enter Student ID (e.g. S123456): ").strip()
    a_id = input("Enter Assignment ID (e.g. HW01): ").strip()
    
    if s_id and a_id:
        generate_qr(s_id, a_id)
    else:
        print("❌ Error: Both IDs are required.")
