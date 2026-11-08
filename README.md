# 🌱 EcoStudy – Trợ Lý AI Đồng Hành Cùng Học Sinh

> **Thông điệp cốt lõi:** *"Learn Smart. Rest Well. Grow Better."*

EcoStudy là nền tảng web ứng dụng trí tuệ nhân tạo (AI) để trở thành trợ lý học tập cá nhân hóa cho học sinh THPT, hỗ trợ quản lý thời gian, chia nhỏ nhiệm vụ khó, theo dõi lỗ hổng kiến thức và **bảo vệ cân bằng giữa việc học với nghỉ ngơi, giấc ngủ**.

---

## 🎯 12 Chức Năng Cốt Lõi Đã Được Xây Dựng Đầy Đủ

1. **Check-in đầu ngày (AI Companion):**
   - Trò chuyện ân cần, thu thập dữ liệu về giấc ngủ, mức độ tỉnh táo (1-10), mức độ áp lực và thời gian khả dụng.
   - Tránh gây cảm giác bị khảo sát bằng các thẻ chọn nhanh (Quick-pick chips).

2. **Phân tích tính khả thi & Lập lịch cá nhân hóa (AI + Rule + Scheduling Engine):**
   - Áp dụng công thức tính điểm ưu tiên chuẩn:
     $$P = 0.30D + 0.25I + 0.20W + 0.15L + 0.10R$$
     *(D: Deadline, I: Quan trọng, W: Khó/Khối lượng, L: Hậu quả nếu trễ, R: Kiến thức nền tảng)*
   - AI giải thích rõ ràng lý do ưu tiên từng nhiệm vụ cho học sinh.
   - **Quy tắc bất khả xâm phạm:** Không nhồi nhét; cảnh báo quá tải (Overload Alert) nếu tổng thời gian học + nghỉ ngơi vượt quá thời gian khả dụng; bảo vệ tuyệt đối giờ ngủ (Sleep Shield).

3. **Chia nhỏ nhiệm vụ thông minh (Smart Task Decomposition):**
   - Tự động phân rã các bài học lớn (Toán, Văn, Lý, Hóa, Tiếng Anh...) thành các bước nhỏ với mục tiêu, thời lượng dự kiến và tiêu chí hoàn thành cụ thể.

4. **Ôn tập ngắt quãng & Quản lý lỗ hổng kiến thức (Active Recall & Spaced Repetition):**
   - Thẻ nhớ tương tác (Flashcard 3D flip) với 5 cấp độ ghi nhớ để tính toán chu kỳ lặp lại tối ưu (1 ngày, 2 ngày, 4 ngày, 7 ngày, 14 ngày).
   - *Knowledge Gap Tracking:* Lưu trữ lỗi sai thường gặp để nhắc nhở củng cố.

5. **Theo dõi xu hướng mệt mỏi & Bảo vệ thời gian nghỉ (Rest Shield):**
   - Tự động phân loại 3 trạng thái: *Bình thường*, *Cần điều chỉnh*, *Cần nghỉ ngơi*.
   - Đồng hồ Pomodoro 25/5 thông minh hỗ trợ nghỉ giải lao, thư giãn mắt và giãn cơ.

6. **Quản lý nhiệm vụ tồn đọng & Tự động điều chỉnh lịch (Backlog Engine):**
   - Hỗ trợ 10 trạng thái nhiệm vụ (*Pending, Scheduled, In Progress, Completed, Partially Completed, Blocked, Not Reported, Pending Review, Needs Support, Rescheduled*).
   - Tuyệt đối không dời máy móc sang ngày mai; phân tích 7 nhóm nguyên nhân (khó, mất tập trung, mệt mỏi, thiếu kiến thức nền...) và đưa ra giải pháp xử lý.

7. **Check-out sau mỗi phiên học:**
   - Cập nhật thời gian thực tế, phát hiện lỗ hổng kiến thức và đưa trực tiếp vào Kho kiến thức cần ôn tập.

8. **Báo cáo tiến độ hàng tuần (Weekly Analytics):**
   - Thống kê tỷ lệ hoàn thành, tỷ lệ đúng hạn, biểu đồ thời gian theo từng môn học và lời khuyên cá nhân hóa từ AI.

9. **Dự đoán nguy cơ trễ deadline:**
   - Cảnh báo rủi ro (Cao / Trung bình / An toàn) dựa trên tiến độ và thời gian còn lại.

10. **Chế độ học tập linh hoạt (Flexible Modes):**
    - 4 chế độ thích ứng: *Ngày bình thường*, *Ngày ít năng lượng*, *Ngày cần nghỉ ngơi*, *Chế độ ôn thi*.

11. **Nhật ký học tập & Tự đánh giá (Reflective Journal):**
    - 5 câu hỏi phản chiếu cuối ngày giúp học sinh rèn luyện năng lực tự học bền vững mà không bị phụ thuộc vào AI.

12. **Cổng Phụ Huynh & Nhà Trường (Role-Based Access):**
    - Phân quyền nghiêm ngặt: Phụ huynh xem báo cáo tổng quát được cho phép; **tuyệt đối không chia sẻ nhật ký cá nhân**.
    - Nhà trường xem báo cáo giáo dục ẩn danh; **không dùng mức độ mệt mỏi để xếp hạng học sinh**.

---

## 🚀 Cách Khởi Chạy Website Trực Tiếp

Dự án được xây dựng với cấu trúc độc lập (zero-dependency, không cần cài đặt thêm gói npm từ bên ngoài). Bạn có thể mở và sử dụng ngay lập tức:

### Cách 1: Khởi chạy bằng Node.js Server tích hợp sẵn
Mở Terminal tại thư mục `c:\eco study` và chạy:
```powershell
node server.js
```
Truy cập trình duyệt tại địa chỉ: **http://localhost:3000**

### Cách 2: Mở trực tiếp file HTML
Bạn có thể nhấp đúp trực tiếp vào file `index.html` trong thư mục `c:\eco study` bằng trình duyệt Chrome, Edge hoặc Cốc Cốc.

---

## 📁 Cấu Trúc Mã Nguồn

```
c:\eco study\
├── DỰ ÁN.docx                 # Tài liệu đặc tả yêu cầu gốc
├── index.html                 # Giao diện chính của ứng dụng
├── server.js                  # Máy chủ Node.js cục bộ
├── README.md                  # Hướng dẫn và tài liệu dự án
├── styles\
│   └── main.css               # Hệ thống thiết kế Eco-friendly UI
└── scripts\
    ├── algorithms.js          # Thuật toán tính điểm P, Feasibility, Spaced Repetition, Fatigue
    ├── state.js               # Quản lý dữ liệu LocalStorage & Dữ liệu mẫu học sinh
    ├── ui.js                  # Render động 15 màn hình giao diện và xử lý tương tác
    └── app.js                 # Điểm khởi chạy ứng dụng
```

