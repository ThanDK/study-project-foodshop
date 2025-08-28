# 🍔 Foodies API & Frontend: A Full-Stack Learning Project

โปรเจคนี้คือการสร้างระบบสั่งอาหารออนไลน์แบบ Full-Stack โดยมีวัตถุประสงค์หลักเพื่อการเรียนรู้และทำความเข้าใจการทำงานของเทคโนโลยีต่างๆ ที่ใช้ในการสร้างเว็บแอปพลิเคชันสมัยใหม่ ตั้งแต่การสร้าง Backend API ด้วย **Spring Boot**, การจัดการข้อมูลด้วย **MongoDB**, ไปจนถึงการสร้าง Frontend ทั้งฝั่งผู้ใช้และผู้ดูแลระบบด้วย **React**

> ⚠️ **หมายเหตุ:** โปรเจคนี้สร้างขึ้นเพื่อการศึกษา เพื่อใช้เป็นพื้นที่ในการทดลองและเรียนรู้เทคโนโลยีต่างๆ โค้ดบางส่วนอาจจะยังไม่สมบูรณ์, ไม่ได้ถูกปรับปรุงประสิทธิภาพอย่างเต็มที่, และอาจมี Bug หลงเหลืออยู่ ซึ่งทั้งหมดนี้ถือเป็นส่วนหนึ่งของกระบวนการเรียนรู้

---

## 🎯 วัตถุประสงค์และสิ่งที่ได้เรียนรู้จากโปรเจค

การสร้างโปรเจคนี้ขึ้นมาเป็นการสำรวจหัวข้อต่างๆ ในโลกของการพัฒนาซอฟต์แวร์ โดยแต่ละฟีเจอร์ที่พัฒนาขึ้นถือเป็นบทเรียนที่สำคัญ:

1.  **การสร้าง RESTful API ด้วย Spring Boot:**
    -   เรียนรู้การออกแบบ Endpoints สำหรับ CRUD, การใช้ Annotations ต่างๆ ของ Spring Web, และการจัดการ Request/Response

2.  **การจัดการความปลอดภัยด้วย Spring Security และ JWT:**
    -   เป็นหัวข้อที่มีความท้าทาย ซึ่งได้ทดลองสร้างระบบล็อกอินและลงทะเบียน, เรียนรู้การเข้ารหัสรหัสผ่านด้วย BCrypt, และทำความเข้าใจหลักการทำงานของ JSON Web Tokens (JWT) ในการยืนันตัวตน

3.  **การเชื่อมต่อกับบริการภายนอก:**
    -   **AWS S3:** ทดลองเขียนโค้ดเพื่ออัปโหลดไฟล์รูปภาพจาก Frontend ไปจัดเก็บบน S3 Bucket และเรียนรู้วิธีการจัดการ credentials อย่างปลอดภัย
    -   **PayPal:** ทำความเข้าใจ Flow การชำระเงินผ่าน API ตั้งแต่การสร้างลิงก์, การรับ Callback, และการตรวจสอบสถานะ

4.  **การสร้าง Frontend ด้วย React:**
    -   โปรเจคนี้มี Frontend 2 ส่วน (User และ Admin) ทำให้ได้ฝึกฝนการสร้าง UI แบบ Component-based, การใช้ React Router, และการใช้ **React Context API** เพื่อจัดการ State ส่วนกลาง

5.  **การทำ Containerization ด้วย Docker:**
    -   ได้เรียนรู้การเขียน `Dockerfile` สำหรับแอปพลิเคชัน Spring Boot และ React (Nginx) และใช้ `docker-compose.yml` เพื่อจำลองสภาพแวดล้อมทั้งหมดให้สามารถรันขึ้นมาทำงานพร้อมกันได้ด้วยคำสั่งเดียว

---

## ✨ ฟังก์ชันการทำงานที่พัฒนาขึ้น

-   **ฝั่งผู้ใช้:**
    -   หน้าเว็บสำหรับแสดงรายการอาหาร สามารถเพิ่ม/ลด สินค้าลงในตะกร้าได้
    -   ระบบล็อกอินและลงทะเบียนสมาชิก
    -   กระบวนการสั่งซื้อที่ผู้ใช้สามารถกรอกที่อยู่ และชำระเงินผ่าน PayPal ได้
-   **ฝั่งผู้ดูแลระบบ:**
    -   หน้าสำหรับ เพิ่ม/ลบ รายการอาหารพร้อมอัปโหลดรูปภาพ
    -   หน้าสำหรับดูรายการคำสั่งซื้อทั้งหมดจากผู้ใช้ และสามารถอัปเดตสถานะการจัดส่งได้

---

## 🛠️ เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|---|---|
| **Backend** | `Java 21`, `Spring Boot`, `Spring Security`, `Maven` |
| **Frontend** | `React (Vite)`, `React Router`, `Bootstrap 5`, `Axios` |
| **Database** | `MongoDB` |
| **Authentication** | `JSON Web Token (JWT)` |
| **Cloud Storage** | `Amazon Web Services (AWS S3)` |
| **Payment Gateway**| `PayPal REST API` |
| **Deployment** | `Docker`, `Docker Compose` |

---

## 🚀 วิธีการติดตั้งและทดลองใช้งาน

### สิ่งที่ต้องมี
- Java JDK 21+
- Apache Maven
- Node.js & npm
- Docker & Docker Compose
- API Keys จาก AWS และ PayPal Developer

### 1. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ที่ root ของโปรเจค และกำหนดค่าที่จำเป็น:

```env
# MongoDB Connection
SPRING_DATA_MONGODB_URI=mongodb://mongo:27017/foodies

# JWT Secret Key
JWT_SECRET_KEY=YourSecretKeyForJwt

# AWS S3 Bucket Credentials
AWS_ACCESS_KEY=YOUR_AWS_ACCESS_KEY
AWS_SECRET_KEY=YOUR_AWS_SECRET_KEY
AWS_S3_BUCKETNAME=your-s3-bucket-name

# PayPal Developer Credentials
PAYPAL_CLIENT_ID=YOUR_PAYPAL_SANDBOX_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_PAYPAL_SANDBOX_SECRET
PAYPAL_MODE=sandbox

# Frontend URL for redirection
APP_FRONTEND_URL=http://localhost:5173
```

### 2. การรันโปรเจคด้วย Docker
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ThanDK/study-project-foodshop.git
    cd study-project-foodshop
    ```
2.  **Start all services:**
    ```bash
    docker-compose up --build
    ```
    - **Backend API** จะทำงานที่ `http://localhost:8080`
    - **User Frontend** จะทำงานที่ `http://localhost:5173`
    - **Admin Panel** จะทำงานที่ `http://localhost:5174`
    - **MongoDB** จะทำงานที่ `http://localhost:27019` (จากภายนอก)

---

## 📁 โครงสร้างโปรเจค

```
/
├── adminpanel/           # Frontend (React) สำหรับ Admin
├── foodies/              # Frontend (React) สำหรับ User
├── foodiesapi/           # Backend (Spring Boot)
├── .env                  # Environment variables
├── docker-compose.yml    # Docker Compose configuration
└── ...
```
