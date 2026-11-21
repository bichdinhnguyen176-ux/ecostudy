/**
 * ECOSTUDY CENTRAL STATE STORE
 * Manages multi-user authentication, data isolation, LocalStorage persistence,
 * reactive state subscriptions, timetable schedules, tasks, notifications, and settings.
 */

const ACCOUNTS_STORAGE_KEY = "ECOSTUDY_ACCOUNTS_V2";
const SESSION_KEY = "ECOSTUDY_CURRENT_USER_V2";
const DATA_PREFIX = "ECOSTUDY_USER_DATA_V2_";

// Default initial tasks for demo/new student account
const getDefaultInitialTasks = () => [
  {
    id: "task-1",
    title: "Giải đề Toán: Ứng dụng Tích phân tính diện tích hình phẳng",
    subject: "Toán",
    deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Ngày mai
    deadlineType: "hard", // 'hard' | 'soft'
    importance: 9,
    difficultyWorkload: 8,
    deadlineProximity: 9,
    lossConsequence: 8,
    prerequisiteRequirement: 9,
    estimatedMinutes: 60,
    actualMinutes: null,
    status: "in_progress", // 'not_started' | 'scheduled' | 'in_progress' | 'completed' | 'partially_completed' | 'overdue' | 'needs_support'
    subtasks: [
      { id: "sub-1-1", title: "Ôn lại 3 công thức tính tích phân giới hạn bởi 2 đường cong", duration: 15, goal: "Nhớ công thức", criteria: "Viết đúng công thức chuẩn", completed: true },
      { id: "sub-1-2", title: "Giải 5 bài cơ bản tìm hoành độ giao điểm", duration: 25, goal: "Rèn phản xạ giải phương trình", criteria: "Đúng 5/5 bài", completed: true },
      { id: "sub-1-3", title: "Giải 2 bài toán thực tế có đồ thị hàm bậc ba", duration: 20, goal: "Vận dụng nâng cao", criteria: "Lập đúng biểu thức diện tích", completed: false }
    ],
    knowledgeGaps: ["Dạng toán đồ thị có 2 phần diện tích đối xứng"],
    rescheduleCount: 0,
    timeSlot: "19:30 - 20:30",
    notes: "Bài kiểm tra 1 tiết sắp tới chiếm 20% điểm số học kỳ."
  },
  {
    id: "task-2",
    title: "Tiếng Anh: Luyện 2 bài Reading Comprehension chủ đề Môi trường",
    subject: "Tiếng Anh",
    deadline: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Ngày mốt
    deadlineType: "soft",
    importance: 7,
    difficultyWorkload: 6,
    deadlineProximity: 6,
    lossConsequence: 5,
    prerequisiteRequirement: 6,
    estimatedMinutes: 45,
    actualMinutes: null,
    status: "scheduled",
    subtasks: [],
    knowledgeGaps: [],
    rescheduleCount: 0,
    timeSlot: "20:45 - 21:30",
    notes: "Tập trung gạch chân keywords và tra cứu 8 collocations mới."
  },
  {
    id: "task-3",
    title: "Vật lý: Bài tập Định luật Cu-lông & Cường độ điện trường",
    subject: "Vật lý",
    deadline: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Hôm qua (Quá hạn)
    deadlineType: "hard",
    importance: 8,
    difficultyWorkload: 8,
    deadlineProximity: 10,
    lossConsequence: 8,
    prerequisiteRequirement: 8,
    estimatedMinutes: 45,
    actualMinutes: null,
    status: "overdue", // Tồn đọng quá hạn
    subtasks: [],
    knowledgeGaps: ["Vectơ cường độ điện trường tổng hợp khi các điện tích thẳng hàng"],
    rescheduleCount: 1,
    timeSlot: "Chờ sắp xếp lại",
    notes: "Chưa hoàn thành do tối qua bị sốt nhẹ, cần sắp xếp lại lịch học vào khoảng trống thích hợp."
  },
  {
    id: "task-4",
    title: "Ngữ văn: Lập dàn ý bài văn nghị luận xã hội về lối sống xanh",
    subject: "Ngữ văn",
    deadline: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    deadlineType: "soft",
    importance: 6,
    difficultyWorkload: 5,
    deadlineProximity: 4,
    lossConsequence: 4,
    prerequisiteRequirement: 5,
    estimatedMinutes: 40,
    actualMinutes: null,
    status: "not_started",
    subtasks: [],
    knowledgeGaps: [],
    rescheduleCount: 0,
    timeSlot: "Chưa xếp lịch",
    notes: "Sưu tầm 2 dẫn chứng thời sự tiêu biểu."
  },
  {
    id: "task-5",
    title: "Hóa học: Viết cơ chế phản ứng Thủy phân Este trong môi trường Kiềm",
    subject: "Hóa học",
    deadline: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    deadlineType: "soft",
    importance: 7,
    difficultyWorkload: 5,
    deadlineProximity: 2,
    lossConsequence: 4,
    prerequisiteRequirement: 7,
    estimatedMinutes: 30,
    actualMinutes: 35,
    status: "completed",
    subtasks: [],
    knowledgeGaps: [],
    rescheduleCount: 0,
    timeSlot: "17:00 - 17:35",
    notes: "Đã hoàn thành và đối chiếu kết quả chuẩn."
  }
];

// Default initial timetable slots (Thứ 2 = 2, ..., Chủ Nhật = 8 hoặc 1..7)
// Sử dụng chuẩn: 2: Thứ 2, 3: Thứ 3, ..., 7: Thứ 7, 8: Chủ Nhật
const getDefaultInitialTimetable = () => [
  { id: "slot-1", dayOfWeek: 2, startTime: "07:00", endTime: "11:30", subject: "Lịch học chính khóa sáng", room: "Lớp 12A1", isFixed: true, notes: "Toán, Văn, Anh, GDCD" },
  { id: "slot-2", dayOfWeek: 2, startTime: "14:00", endTime: "16:30", subject: "Bồi dưỡng Toán chuyên đề", room: "Phòng A203", isFixed: true, notes: "Chuyên đề tích phân nâng cao" },
  { id: "slot-3", dayOfWeek: 2, startTime: "19:30", endTime: "20:30", subject: "Tự học: Giải đề Toán Tích phân", room: "Góc học tập", isFixed: false, linkedTaskId: "task-1", notes: "Theo kế hoạch EcoStudy" },
  { id: "slot-4", dayOfWeek: 2, startTime: "20:45", endTime: "21:30", subject: "Tự học: Tiếng Anh Reading", room: "Góc học tập", isFixed: false, linkedTaskId: "task-2", notes: "Luyện đọc hiểu 2 bài" },
  
  { id: "slot-5", dayOfWeek: 3, startTime: "07:00", endTime: "11:30", subject: "Lịch học chính khóa sáng", room: "Lớp 12A1", isFixed: true, notes: "Lý, Hóa, Sinh, Tin" },
  { id: "slot-6", dayOfWeek: 3, startTime: "15:00", endTime: "17:00", subject: "Học thêm Vật lý", room: "Trung tâm", isFixed: true, notes: "Điện trường và dòng điện không đổi" },
  { id: "slot-7", dayOfWeek: 3, startTime: "19:30", endTime: "21:00", subject: "Tự học: Ôn tập Lý & Ngữ văn", room: "Góc học tập", isFixed: false, notes: "Bù bài tồn đọng" },

  { id: "slot-8", dayOfWeek: 4, startTime: "07:00", endTime: "11:30", subject: "Lịch học chính khóa sáng", room: "Lớp 12A1", isFixed: true, notes: "Toán, Văn, Anh, Sử" },
  { id: "slot-9", dayOfWeek: 4, startTime: "19:30", endTime: "21:30", subject: "Tự học & Làm bài tập tuần", room: "Góc học tập", isFixed: false, notes: "Khung giờ trống linh hoạt" },

  { id: "slot-10", dayOfWeek: 5, startTime: "07:00", endTime: "11:30", subject: "Lịch học chính khóa sáng", room: "Lớp 12A1", isFixed: true, notes: "Lý, Hóa, Địa, Thể dục" },
  { id: "slot-11", dayOfWeek: 5, startTime: "14:30", endTime: "16:30", subject: "CLB Khoa học & STEM", room: "Hội trường", isFixed: true, notes: "Hoạt động ngoại khóa" },

  { id: "slot-12", dayOfWeek: 6, startTime: "07:00", endTime: "11:30", subject: "Lịch học chính khóa sáng", room: "Lớp 12A1", isFixed: true, notes: "Toán, Văn, Anh, Sinh hoạt" },
  { id: "slot-13", dayOfWeek: 6, startTime: "19:00", endTime: "20:30", subject: "Ôn tập tổng hợp cuối tuần", room: "Góc học tập", isFixed: false, notes: "Giải đề thử" },

  { id: "slot-14", dayOfWeek: 7, startTime: "08:30", endTime: "10:30", subject: "Tự học sáng thứ 7", room: "Thư viện", isFixed: false, notes: "Đọc sách tham khảo" },
  { id: "slot-15", dayOfWeek: 8, startTime: "09:00", endTime: "11:00", subject: "Nghỉ ngơi & Thể thao Chủ Nhật", room: "Công viên", isFixed: true, notes: "Tái tạo năng lượng" }
];

// Default initial notifications
const getDefaultInitialNotifications = () => [
  {
    id: "notif-1",
    type: "deadline_alert",
    title: "Cảnh báo Deadline: Toán Tích phân",
    message: "Bài tập Toán có hạn chót vào ngày mai (23h59). Bạn đã hoàn thành 2/3 bước con.",
    time: "30 phút trước",
    read: false,
    priority: "high"
  },
  {
    id: "notif-2",
    type: "smart_rest",
    title: "Nhắc nhở Giờ nghỉ Thông minh",
    message: "Mục tiêu ngủ hôm nay là 23:00. Vui lòng hoàn thành buổi học trước 22:30 để thư giãn.",
    time: "2 giờ trước",
    read: false,
    priority: "medium"
  },
  {
    id: "notif-3",
    type: "system",
    title: "Chào mừng đến với EcoStudy 2.0!",
    message: "Giao diện đã được nâng cấp theo chuẩn: Learn Smart. Rest Well. Grow Better.",
    time: "1 ngày trước",
    read: true,
    priority: "low"
  }
];

class StateStore {
  constructor() {
    this.listeners = [];
    this.accounts = this.loadAccounts();
    this.currentUser = this.loadCurrentSession();
    this.userData = this.loadUserData(this.currentUser?.id);

    // Apply saved theme to <html> tag immediately
    this.applyThemeToDOM();
  }

  // ---------------- AUTHENTICATION & MULTI-USER ----------------
  loadAccounts() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Could not load accounts list", e);
    }
    // Default account
    const defaultAccount = {
      id: "student-minhkhoa",
      name: "Nguyễn Minh Khoa",
      email: "minhkhoa@ecostudy.edu.vn",
      phone: "0901234567",
      password: "123", // demo password
      grade: "Lớp 12A1",
      school: "THPT Chuyên Hà Nội - Amsterdam",
      targetExam: "Kỳ thi Tốt nghiệp THPT & ĐGNL ĐHQG",
      role: "student",
      createdAt: new Date().toISOString()
    };
    const list = [defaultAccount];
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
    return list;
  }

  saveAccounts() {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(this.accounts));
    } catch (e) {
      console.error("Failed to save accounts", e);
    }
  }

  loadCurrentSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const found = this.accounts.find(a => a.id === raw);
        if (found) return found;
      }
    } catch (e) {}
    // Fallback to first account
    return this.accounts[0] || null;
  }

  saveCurrentSession(userId) {
    try {
      if (userId) {
        localStorage.setItem(SESSION_KEY, userId);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {}
  }

  login(identifier, password) {
    const cleanId = (identifier || '').trim().toLowerCase();
    const account = this.accounts.find(a => 
      (a.email.toLowerCase() === cleanId || a.phone === cleanId) && a.password === password
    );
    if (!account) {
      throw new Error("Email/Số điện thoại hoặc mật khẩu không chính xác.");
    }
    this.currentUser = account;
    this.saveCurrentSession(account.id);
    this.userData = this.loadUserData(account.id);
    this.applyThemeToDOM();
    this.notify();
    return account;
  }

  register({ name, email, phone, password, grade, school }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();

    if (!name || name.trim().length < 2) throw new Error("Vui lòng nhập họ và tên hợp lệ.");
    if (!cleanEmail && !cleanPhone) throw new Error("Vui lòng cung cấp email hoặc số điện thoại.");
    if (!password || password.length < 3) throw new Error("Mật khẩu phải từ 3 ký tự trở lên.");

    if (cleanEmail && this.accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
      throw new Error("Email này đã được đăng ký tài khoản.");
    }
    if (cleanPhone && this.accounts.some(a => a.phone === cleanPhone)) {
      throw new Error("Số điện thoại này đã được đăng ký tài khoản.");
    }

    const newAccount = {
      id: `student-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail || `${cleanPhone}@phone.ecostudy.vn`,
      phone: cleanPhone || "",
      password,
      grade: grade || "Lớp 12",
      school: school || "THPT",
      targetExam: "Tốt nghiệp THPT",
      role: "student",
      createdAt: new Date().toISOString()
    };

    this.accounts.push(newAccount);
    this.saveAccounts();

    // Log in with new account
    this.currentUser = newAccount;
    this.saveCurrentSession(newAccount.id);
    this.userData = this.createDefaultUserData(newAccount.id);
    this.saveUserData();
    this.applyThemeToDOM();
    this.notify();
    return newAccount;
  }

  logout() {
    this.saveCurrentSession(null);
    this.currentUser = null;
    this.userData = null;
    this.notify();
  }

  resetPassword(identifier, newPassword) {
    const cleanId = (identifier || '').trim().toLowerCase();
    const account = this.accounts.find(a => a.email.toLowerCase() === cleanId || a.phone === cleanId);
    if (!account) {
      throw new Error("Không tìm thấy tài khoản tương ứng với thông tin đã nhập.");
    }
    account.password = newPassword || "123";
    this.saveAccounts();
    return true;
  }

  // ---------------- USER DATA ISOLATION ----------------
  getUserDataKey(userId) {
    return `${DATA_PREFIX}${userId || 'default'}`;
  }

  createDefaultUserData(userId) {
    return {
      userId,
      currentMode: "normal", // 'normal' | 'low_energy' | 'rest_day' | 'exam_prep'
      theme: "light", // 'light' (xanh lơ nhạt) | 'dark'
      studyContinuousMinutes: 0,
      settings: {
        sleepStart: "23:00",
        sleepEnd: "06:30",
        breakIntervalMinutes: 45,
        breakDurationMinutes: 10,
        enableSmartRest: true,
        // Notifications settings
        notifyInApp: true,
        notifyEmail: true,
        notifySMS: false,
        targetEmail: this.currentUser?.email || "",
        targetPhone: this.currentUser?.phone || "",
        notifyStudyStart: true,
        notifyBreakTime: true,
        notifyDeadlineWarning: true,
        notifyBedtime: true,
        notifyWeeklyReport: true,
        // Service configurations (User environment config)
        googleClientId: "",
        smsApiKey: "",
        smtpHost: ""
      },
      tasks: getDefaultInitialTasks(),
      timetable: getDefaultInitialTimetable(),
      notifications: getDefaultInitialNotifications(),
      todayCheckIn: {
        date: new Date().toISOString().split('T')[0],
        sleepHours: 7,
        alertness: 7,
        stressLevel: 3,
        availableMinutes: 180,
        studyStartTime: "19:00",
        studyEndTime: "22:30",
        fixedActivities: "Ăn tối & tắm rửa (18h-19h), nghe nhạc (21h30-22h)",
        userNotes: "Tâm trạng thoải mái, sẵn sàng hoàn thành nhiệm vụ.",
        completedAt: new Date().toISOString()
      },
      weeklyStats: {
        completionRate: 85,
        onTimeRate: 92,
        totalStudyMinutes: 980,
        totalBreakMinutes: 195,
        rescheduledCount: 1,
        sleepAverageHours: 7.2,
        subjectBreakdown: {
          "Toán": 360,
          "Tiếng Anh": 240,
          "Vật lý": 210,
          "Hóa học": 110,
          "Ngữ văn": 60
        }
      }
    };
  }

  loadUserData(userId) {
    if (!userId) return null;
    const key = this.getUserDataKey(userId);
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure default fields exist
        if (!parsed.timetable) parsed.timetable = getDefaultInitialTimetable();
        if (!parsed.notifications) parsed.notifications = getDefaultInitialNotifications();
        if (!parsed.theme) parsed.theme = "light";
        return parsed;
      }
    } catch (e) {
      console.warn("Could not read user data, initializing default.", e);
    }
    const defData = this.createDefaultUserData(userId);
    try {
      localStorage.setItem(key, JSON.stringify(defData));
    } catch (e) {}
    return defData;
  }

  saveUserData() {
    if (!this.currentUser || !this.userData) return;
    const key = this.getUserDataKey(this.currentUser.id);
    try {
      localStorage.setItem(key, JSON.stringify(this.userData));
    } catch (e) {
      console.error("Failed to save user data to localStorage", e);
    }
    this.notify();
  }

  applyThemeToDOM() {
    const theme = this.userData?.theme || "light";
    document.documentElement.setAttribute('data-theme', theme);
  }

  // ---------------- SUBSCRIPTIONS ----------------
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this.getState());
      } catch (e) {
        console.error("Error in state subscriber callback:", e);
      }
    });
  }

  getState() {
    return {
      currentUser: this.currentUser,
      isLoggedIn: !!this.currentUser,
      data: this.userData
    };
  }

  // ---------------- TASK ACTIONS ----------------
  addTask(task) {
    if (!this.userData) return null;
    const newTask = {
      id: `task-${Date.now()}`,
      status: "not_started",
      subtasks: [],
      knowledgeGaps: [],
      rescheduleCount: 0,
      actualMinutes: null,
      deadlineType: task.deadlineType || "soft",
      importance: Number(task.importance) || 5,
      difficultyWorkload: Number(task.difficultyWorkload) || 5,
      deadlineProximity: Number(task.deadlineProximity) || 5,
      lossConsequence: Number(task.lossConsequence) || 5,
      prerequisiteRequirement: Number(task.prerequisiteRequirement) || 5,
      estimatedMinutes: Number(task.estimatedMinutes) || 45,
      ...task
    };
    this.userData.tasks.unshift(newTask);
    this.saveUserData();
    return newTask;
  }

  updateTask(taskId, updates) {
    if (!this.userData) return null;
    const task = this.userData.tasks.find(t => t.id === taskId);
    if (task) {
      Object.assign(task, updates);
      this.saveUserData();
    }
    return task;
  }

  deleteTask(taskId) {
    if (!this.userData) return;
    this.userData.tasks = this.userData.tasks.filter(t => t.id !== taskId);
    this.saveUserData();
  }

  // ---------------- TIMETABLE ACTIONS ----------------
  addScheduleSlot(slot) {
    if (!this.userData) return null;
    const newSlot = {
      id: `slot-${Date.now()}`,
      dayOfWeek: Number(slot.dayOfWeek) || 2,
      startTime: slot.startTime || "08:00",
      endTime: slot.endTime || "09:30",
      subject: slot.subject || "Môn học",
      room: slot.room || "",
      isFixed: !!slot.isFixed,
      linkedTaskId: slot.linkedTaskId || null,
      notes: slot.notes || ""
    };
    this.userData.timetable.push(newSlot);
    this.saveUserData();
    return newSlot;
  }

  updateScheduleSlot(slotId, updates) {
    if (!this.userData) return null;
    const slot = this.userData.timetable.find(s => s.id === slotId);
    if (slot) {
      Object.assign(slot, updates);
      this.saveUserData();
    }
    return slot;
  }

  deleteScheduleSlot(slotId) {
    if (!this.userData) return;
    this.userData.timetable = this.userData.timetable.filter(s => s.id !== slotId);
    this.saveUserData();
  }

  // ---------------- NOTIFICATIONS ----------------
  addNotification(notif) {
    if (!this.userData) return;
    const newNotif = {
      id: `notif-${Date.now()}`,
      time: "Vừa xong",
      read: false,
      priority: notif.priority || "medium",
      ...notif
    };
    this.userData.notifications.unshift(newNotif);
    this.saveUserData();
    return newNotif;
  }

  markNotificationAsRead(notifId) {
    if (!this.userData) return;
    if (notifId === 'all') {
      this.userData.notifications.forEach(n => n.read = true);
    } else {
      const target = this.userData.notifications.find(n => n.id === notifId);
      if (target) target.read = true;
    }
    this.saveUserData();
  }

  clearNotifications() {
    if (!this.userData) return;
    this.userData.notifications = [];
    this.saveUserData();
  }

  // ---------------- APP PREFERENCES ----------------
  setTheme(theme) {
    if (!this.userData) return;
    this.userData.theme = theme;
    this.saveUserData();
    this.applyThemeToDOM();
  }

  setMode(newMode) {
    if (!this.userData) return;
    this.userData.currentMode = newMode;
    this.saveUserData();
  }

  saveCheckIn(checkInData) {
    if (!this.userData) return;
    this.userData.todayCheckIn = {
      ...checkInData,
      date: new Date().toISOString().split('T')[0],
      completedAt: new Date().toISOString()
    };
    this.saveUserData();
  }

  saveSettings(newSettings) {
    if (!this.userData) return;
    this.userData.settings = {
      ...this.userData.settings,
      ...newSettings
    };
    this.saveUserData();
  }

  updateProfile(profileData) {
    if (!this.currentUser) return;
    Object.assign(this.currentUser, profileData);
    const acc = this.accounts.find(a => a.id === this.currentUser.id);
    if (acc) Object.assign(acc, profileData);
    this.saveAccounts();
    this.notify();
  }

  resetUserData() {
    if (!this.currentUser) return;
    this.userData = this.createDefaultUserData(this.currentUser.id);
    this.saveUserData();
    this.applyThemeToDOM();
  }
}

export const store = new StateStore();
