/**
 * ECOSTUDY CENTRAL STATE STORE
 * Manages reactive data, LocalStorage persistence, and initial datasets
 */

const STORAGE_KEY = "ECOSTUDY_DATA_STORE_V1";

const initialTasks = [
  {
    id: "task-1",
    title: "Giải đề Toán: Ứng dụng Tích phân tính Diện tích hình phẳng",
    subject: "Toán",
    deadline: "2026-11-09",
    deadlineType: "hard", // 'hard' | 'soft'
    importance: 9,
    difficultyWorkload: 8,
    deadlineProximity: 9,
    lossConsequence: 8,
    prerequisiteRequirement: 9,
    estimatedMinutes: 60,
    actualMinutes: null,
    status: "in_progress", // 10 states as specified
    subtasks: [
      { id: "sub-1-1", title: "Ôn lại 3 công thức tính tích phân giới hạn bởi 2 đường cong", duration: 15, goal: "Nhớ công thức", criteria: "Viết đúng công thức", completed: true },
      { id: "sub-1-2", title: "Giải 5 bài cơ bản tìm hoành độ giao điểm", duration: 25, goal: "Rèn phản xạ giải phương trình", criteria: "Đúng 5/5 bài", completed: true },
      { id: "sub-1-3", title: "Giải 3 bài toán thực tế có đồ thị hàm bậc ba", duration: 20, goal: "Vận dụng cao", criteria: "Lập đúng biểu thức diện tích", completed: false }
    ],
    knowledgeGaps: ["Dạng toán đồ thị có 2 phần diện tích đối xứng"],
    rescheduleCount: 0,
    timeSlot: "19:30 - 20:30",
    notes: "Bài kiểm tra 1 tiết sắp tới chiếm 20% điểm số."
  },
  {
    id: "task-2",
    title: "Tiếng Anh: Luyện 2 bài Reading Comprehension chủ đề Môi trường",
    subject: "Tiếng Anh",
    deadline: "2026-11-11",
    deadlineType: "soft",
    importance: 7,
    difficultyWorkload: 6,
    deadlineProximity: 5,
    lossConsequence: 5,
    prerequisiteRequirement: 6,
    estimatedMinutes: 45,
    actualMinutes: null,
    status: "scheduled",
    subtasks: [],
    knowledgeGaps: [],
    rescheduleCount: 0,
    timeSlot: "20:45 - 21:30",
    notes: "Tập trung gạch chân keywords và tra 8 từ mới Collocation."
  },
  {
    id: "task-3",
    title: "Vật lý: Bài tập Định luật Cu-lông & Lực điện trường",
    subject: "Vật lý",
    deadline: "2026-11-08",
    deadlineType: "soft",
    importance: 8,
    difficultyWorkload: 7,
    deadlineProximity: 8,
    lossConsequence: 7,
    prerequisiteRequirement: 8,
    estimatedMinutes: 40,
    actualMinutes: null,
    status: "needs_support", // Task tồn đọng cần giải quyết thông minh
    subtasks: [],
    knowledgeGaps: ["Vectơ cường độ điện trường tổng hợp khi các điện tích thẳng hàng"],
    rescheduleCount: 2,
    timeSlot: "Chờ điều chỉnh",
    notes: "Hôm qua chưa làm xong do phần tổng hợp lực vectơ bị nhầm góc lượng giác."
  },
  {
    id: "task-4",
    title: "Hóa học: Viết cơ chế phản ứng Thủy phân Este trong môi trường Kiềm",
    subject: "Hóa học",
    deadline: "2026-11-12",
    deadlineType: "soft",
    importance: 6,
    difficultyWorkload: 5,
    deadlineProximity: 4,
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

const initialKnowledgeGaps = [
  {
    id: "gap-1",
    subject: "Toán",
    topic: "Tích phân hàm ẩn và đổi biến số",
    notes: "Hay nhầm lẫn giữa việc đổi biến và vi phân trực tiếp dt = u'(x)dx",
    errorFrequency: 3,
    memoryLevel: 2, // 1 -> 5
    nextReviewDate: "2026-11-09",
    lastReviewed: "2026-11-07"
  },
  {
    id: "gap-2",
    subject: "Vật lý",
    topic: "Tổng hợp lực điện trường bằng quy tắc hình bình hành",
    notes: "Quên bình phương khi áp dụng định lý cosin trong tam giác lực",
    errorFrequency: 2,
    memoryLevel: 1,
    nextReviewDate: "2026-11-09",
    lastReviewed: "2026-11-06"
  },
  {
    id: "gap-3",
    subject: "Tiếng Anh",
    topic: "Mệnh đề quan hệ rút gọn (V-ing / V-ed)",
    notes: "Thường nhầm giữa thể chủ động (V-ing) và bị động (P.P)",
    errorFrequency: 1,
    memoryLevel: 4,
    nextReviewDate: "2026-11-14",
    lastReviewed: "2026-11-07"
  }
];

const initialFlashcards = [
  {
    id: "fc-1",
    subject: "Toán",
    question: "Công thức tính diện tích hình phẳng giới hạn bởi đồ thị y = f(x), trục hoành và hai đường thẳng x=a, x=b là gì?",
    answer: "S = ∫[a đến b] |f(x)| dx (Luôn có dấu giá trị tuyệt đối để diện tích không âm!)",
    memoryLevel: 3
  },
  {
    id: "fc-2",
    subject: "Vật lý",
    question: "Biểu thức độ lớn định luật Cu-lông giữa 2 điện tích điểm trong chân không?",
    answer: "F = k * (|q1 * q2|) / r² với k = 9.10⁹ N.m²/C²",
    memoryLevel: 4
  },
  {
    id: "fc-3",
    subject: "Hóa học",
    question: "Phản ứng xà phòng hóa este là phản ứng một chiều hay thuận nghịch?",
    answer: "Là phản ứng MỘT CHIỀU (thủy phân este trong môi trường kiềm có đun nóng tạo muối và ancol/phenol).",
    memoryLevel: 5
  }
];

const initialCheckInData = {
  date: "2026-11-08",
  sleepHours: 7,
  alertness: 7,
  stressLevel: 4,
  availableMinutes: 180, // 3 tiếng dành cho học tập tối nay
  studyStartTime: "19:00",
  studyEndTime: "22:30",
  fixedActivities: "Ăn tối & tắm rửa (18h-19h), giải trí nghe nhạc (21h30-22h)",
  userNotes: "Hôm nay tâm trạng khá ổn định, muốn hoàn thành xong phần tích phân Toán.",
  completedAt: "2026-11-08T07:15:00.000Z"
};

const initialJournalEntries = [
  {
    id: "jr-1",
    date: "2026-11-07",
    learned: "Nắm được cách đặt ẩn phụ trong bài toán tích phân lượng giác.",
    difficulties: "Bài toán vật lý điện trường câu cuối tốn nhiều thời gian vẽ hình.",
    distractions: "Điện thoại rung tin nhắn nhóm bạn lúc 20h15 làm gián đoạn 15 phút.",
    goodManagement: "Tuân thủ đúng 2 phiên Pomodoro 25 phút không rời bàn học.",
    improvementTomorrow: "Bật chế độ Sleep Shield và cất điện thoại sang phòng khác trước khi học."
  }
];

class StateStore {
  constructor() {
    this.data = this.load();
    this.listeners = [];
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read from localStorage, using initial mock data.", e);
    }

    return {
      currentUser: {
        id: "student-01",
        name: "Nguyễn Minh Khoa",
        grade: "Lớp 12A1 - THPT Chuyên",
        targetExam: "Kỳ thi Tốt nghiệp THPT & ĐGNL",
        role: "student" // 'student' | 'parent' | 'school'
      },
      currentMode: "normal", // 'normal' | 'low_energy' | 'rest_day' | 'exam_prep'
      settings: {
        sleepStart: "23:00",
        sleepEnd: "06:30",
        breakIntervalMinutes: 45,
        breakDurationMinutes: 10,
        enableSleepShield: true,
        allowParentView: true,
        allowSchoolAggregates: true,
        sharePrivateJournal: false // Docx quy định: không chia sẻ nhật ký riêng tư
      },
      tasks: initialTasks,
      knowledgeGaps: initialKnowledgeGaps,
      flashcards: initialFlashcards,
      todayCheckIn: initialCheckInData,
      journal: initialJournalEntries,
      weeklyStats: {
        completionRate: 85,
        onTimeRate: 91,
        totalStudyMinutes: 980,
        totalBreakMinutes: 195,
        rescheduledCount: 2,
        sleepAverageHours: 7.1,
        subjectBreakdown: {
          "Toán": 360,
          "Tiếng Anh": 240,
          "Vật lý": 210,
          "Hóa học": 170
        }
      }
    };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.data));
  }

  // Task Actions
  addTask(task) {
    const newTask = {
      id: `task-${Date.now()}`,
      status: "pending",
      subtasks: [],
      knowledgeGaps: [],
      rescheduleCount: 0,
      actualMinutes: null,
      ...task
    };
    this.data.tasks.push(newTask);
    this.save();
    return newTask;
  }

  updateTask(taskId, updates) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task) {
      Object.assign(task, updates);
      this.save();
    }
    return task;
  }

  deleteTask(taskId) {
    this.data.tasks = this.data.tasks.filter(t => t.id !== taskId);
    this.save();
  }

  setRole(newRole) {
    this.data.currentUser.role = newRole;
    this.save();
  }

  setMode(newMode) {
    this.data.currentMode = newMode;
    this.save();
  }

  saveCheckIn(checkInData) {
    this.data.todayCheckIn = {
      ...checkInData,
      date: new Date().toISOString().split('T')[0],
      completedAt: new Date().toISOString()
    };
    this.save();
  }

  saveJournal(entry) {
    this.data.journal.unshift({
      id: `jr-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...entry
    });
    this.save();
  }

  addKnowledgeGap(gap) {
    this.data.knowledgeGaps.unshift({
      id: `gap-${Date.now()}`,
      memoryLevel: 2,
      errorFrequency: 1,
      lastReviewed: new Date().toISOString().split('T')[0],
      ...gap
    });
    this.save();
  }

  updateKnowledgeGap(gapId, memoryLevel) {
    const gap = this.data.knowledgeGaps.find(g => g.id === gapId);
    if (gap) {
      gap.memoryLevel = memoryLevel;
      gap.lastReviewed = new Date().toISOString().split('T')[0];
      this.save();
    }
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.load();
    this.save();
  }
}

export const store = new StateStore();

