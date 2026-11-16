# 🌱 EcoStudy 2.0 – Trợ Lý AI Đồng Hành Cùng Học Sinh

> **Thông điệp cốt lõi:** *"Learn Smart. Rest Well. Grow Better."*

EcoStudy là nền tảng web ứng dụng trí tuệ nhân tạo (AI) để trở thành trợ lý học tập cá nhân hóa cho học sinh THPT, hỗ trợ quản lý thời gian, tổ chức bài tập, lập lịch khả thi, nhận diện nguy cơ trễ hạn và **bảo vệ cân bằng giữa việc học với nghỉ ngơi, giấc ngủ**.

---

## 🎯 Cấu Trúc Điều Hướng & 5 Phân Hệ Chính (EcoStudy 2.0)

Theo các yêu cầu nâng cấp mới nhất trong tài liệu `LỖI CẦN SỬA Ở WEB.docx` và `DỰ ÁN.docx`, EcoStudy 2.0 được tổ chức lại theo 5 phân hệ chuẩn:

1. **Tổng Quát / Dashboard (Trang Chủ Sau Khi Đăng Nhập):**
   - **Check-in đầu ngày & AI Chatbot làm trung tâm tương tác:** Trò chuyện tự nhiên, hỏi thăm tình trạng sức khỏe, giấc ngủ đêm qua, mức độ tỉnh táo và kế hoạch bài tập hôm nay. Cho phép học sinh trả lời bằng tin nhắn hoặc các nút chọn nhanh (Quick choices).
   - **Thanh nhập nhiệm vụ nhanh (Quick Add Task):** Nhập tên bài tập, môn học, deadline, mức độ quan trọng (Đỏ/Vàng/Xanh) và thời lượng dự kiến; tự động phân tích điểm ưu tiên và đồng bộ ngay vào Study Planner.
   - **Nhiệm vụ cần ưu tiên hôm nay:** Tính toán theo công thức chuẩn $P = 0.30D + 0.25I + 0.20W + 0.15L + 0.10R$, **AI giải thích lý do ưu tiên bằng các gạch đầu dòng ngắn gọn, trực quan, dễ nhìn**.
   - **Đánh giá tính khả thi (Feasibility Engine):** So sánh tổng thời gian cần vs quỹ thời gian khả dụng trước giờ ngủ; cảnh báo quá tải nếu vượt quá để bảo vệ sức khỏe học sinh.
   - **Thời khóa biểu trong ngày (Daily Mini-Agenda):** Hiển thị các ca học chính khóa và ca tự học.

2. **Quản Lý Học Tập / Study Planner (Hợp Nhất Quản Lý Nhiệm Vụ & Lập Lịch):**
   Gồm 5 mục con chuyển tab mượt mà:
   - **Overview:** Thống kê trực quan số lượng nhiệm vụ (Hoàn thành, Đang làm, Quá hạn), phân tích tính khả thi và thanh tiến độ môn học.
   - **Thời Khóa Biểu:** Hỗ trợ 2 chế độ xem: **Daily View** (xem lịch theo timeline giờ) và **Weekly View** (xem cả tuần từ Thứ 2 đến Chủ Nhật). Cho phép thêm, sửa, xóa tiết học, phát hiện trùng lịch và nhận diện các khoảng thời gian trống (Free slots).
   - **Bài Tập & Deadlines:** Phân loại theo môn học, thời hạn và trạng thái; tích hợp **AI Chia nhỏ nhiệm vụ (Task Decomposition)** thành các bước hành động cụ thể kèm mục tiêu và tiêu chí đạt; gạch đầu dòng giải thích điểm ưu tiên.
   - **Backlog Manager (Xử Lý Tồn Đọng):** Phân loại nhiệm vụ quá hạn và chưa thực hiện; phân tích nguyên nhân (thiếu thời gian, quá khó, mất tập trung, mệt mỏi...); AI đề xuất phương án sắp xếp lại lịch thông minh; có nút **Xác nhận kế hoạch mới**.
   - **Study Review (Check-out Tích Hợp):** Sau mỗi phiên học, học sinh cập nhật mức độ hoàn thành (%), thời gian thực tế, khó khăn gặp phải và kiến thức chưa nắm vững để AI hiệu chỉnh hệ số thời gian.

3. **Sức Khỏe & Giấc Ngủ (Smart Rest & Sleep Shield):**
   - Hệ thống nhắc nhở giờ nghỉ thông minh: Dựa trên giờ ngủ do học sinh thiết lập, thời gian ngủ thực tế, độ tỉnh táo, mức độ mệt mỏi và thời lượng học liên tục.
   - Đồng hồ Pomodoro 25/5 tương tác có âm thanh chuông báo (Audio Synthesizer Chime).
   - Cảnh báo bảo vệ giấc ngủ khoa học, không hy sinh giờ ngủ để chạy deadline.

4. **Báo Cáo Học Tập (Weekly Analytics):**
   - Thống kê tỷ lệ hoàn thành, tỷ lệ đúng deadline, tổng thời gian học (dự kiến vs thực tế), số nhiệm vụ bị dời lịch và phân bổ thời gian theo môn học.
   - AI đưa ra nhận xét và đề xuất cải thiện có căn cứ dựa trên số liệu thực tế đã ghi nhận.

5. **Cài Đặt & Quyền Riêng Tư:**
   - **Giao diện Sáng / Tối:** Chế độ Sáng sử dụng màu nền xanh lơ rất nhạt (`#f0f7f6`) kết hợp thẻ trắng và màu nhấn xanh lá nhận diện. Chế độ Tối có độ tương phản cao, êm mắt khi học ban đêm.
   - **Hệ thống thông báo:** Bật/tắt thông báo In-app, Email, SMS; cấu hình biến môi trường và khóa API thực tế (`GOOGLE_CLIENT_ID`, `SMS_API_KEY`).
   - **Hồ sơ cá nhân & Quản lý dữ liệu:** Xuất dữ liệu học tập ra file JSON, đặt lại dữ liệu mặc định, bảo vệ sự cô lập giữa các tài khoản.

---

## 🔐 Tài Khoản Đăng Nhập Thử Nghiệm

Hệ thống hỗ trợ quản lý đa tài khoản độc lập trong LocalStorage. Dữ liệu của từng tài khoản được lưu riêng biệt:

- **Tài khoản mẫu có sẵn:**
  - **Email:** `minhkhoa@ecostudy.edu.vn`
  - **Mật khẩu:** `123`
  - *(Tài khoản này đã có sẵn dữ liệu nhiệm vụ, thời khóa biểu và lịch sử học tập phong phú để bạn kiểm thử ngay lập tức).*
- **Đăng ký tài khoản mới:** Bạn có thể bấm "Đăng ký miễn phí" trong modal Đăng nhập để tạo thêm tài khoản riêng.

---

## 🚀 Hướng Dẫn Khởi Chạy Website

Dự án không có phụ thuộc phức tạp, bạn có thể chạy bằng Python hoặc Node.js:

### Cách 1: Chạy bằng Python (Khuyến nghị trên máy đã cài Python)
Mở PowerShell tại thư mục dự án và chạy:
```powershell
python server.py
```
Sau đó mở trình duyệt và truy cập: **http://localhost:3000**

### Cách 2: Chạy bằng Node.js (nếu máy đã cài Node.js)
```powershell
node server.js
```

---

## 📁 Cấu Trúc Mã Nguồn

```
c:\Users\SPB\Desktop\VY\ECOSTUDY\
├── DỰ ÁN.docx                 # Tài liệu đặc tả nghiệp vụ và kiến trúc gốc
├── LỖI CẦN SỬA Ở WEB.docx     # Tài liệu yêu cầu chỉnh sửa và cải tiến giao diện
├── index.html                 # Giao diện chính theo cấu trúc 5 phân hệ mới
├── server.py                  # Local Web Server chạy bằng Python 3
├── server.js                  # Local Web Server chạy bằng Node.js
├── README.md                  # Hướng dẫn chi tiết dự án
├── styles/
│   └── main.css               # Hệ thống thiết kế EcoStudy 2.0 (Theme sáng/tối, Responsive)
└── scripts/
    ├── algorithms.js          # Thuật toán điểm P, Feasibility, Smart Rest, Timetable, Decompose
    ├── state.js               # Quản lý tài khoản đa người dùng, dữ liệu cô lập, LocalStorage
    ├── ui.js                  # Điều khiển tương tác 5 tabs, Chatbot, Modals, Pomodoro
    └── app.js                 # Điểm khởi chạy ứng dụng (Entry point)
```
