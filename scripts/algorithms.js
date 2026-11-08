/**
 * ECOSTUDY ALGORITHMS & RULE ENGINE
 * Implementation of specifications from DU AN.docx
 * Core Rule: AI Engine + Rule Engine + Scheduling Engine
 */

export const EcoAlgorithms = {
  /**
   * CHỨC NĂNG 2: Công thức tính điểm ưu tiên
   * P = 0.30D + 0.25I + 0.20W + 0.15L + 0.10R
   * @param {Object} task 
   * @returns {Object} { score: number, breakdown: Object, reasoning: string }
   */
  calculatePriorityScore(task) {
    const D = Math.min(10, Math.max(1, Number(task.deadlineProximity || 5)));
    const I = Math.min(10, Math.max(1, Number(task.importance || 5)));
    const W = Math.min(10, Math.max(1, Number(task.difficultyWorkload || 5)));
    const L = Math.min(10, Math.max(1, Number(task.lossConsequence || 5)));
    const R = Math.min(10, Math.max(1, Number(task.prerequisiteRequirement || 5)));

    const score = Number((0.30 * D + 0.25 * I + 0.20 * W + 0.15 * L + 0.10 * R).toFixed(2));

    // Xây dựng lời giải thích lý do ưu tiên theo tài liệu
    const reasons = [];
    if (D >= 8) reasons.push("Deadline đang rất gần (cần hoàn thành sớm)");
    if (I >= 8) reasons.push("Mức độ quan trọng cao đối với mục tiêu học tập");
    if (W >= 8) reasons.push("Khối lượng và độ khó lớn, cần tập trung khi năng lượng cao");
    if (L >= 8) reasons.push("Ảnh hưởng nhiều đến điểm số/kế hoạch nếu bị trễ");
    if (R >= 8) reasons.push("Là kiến thức nền tảng quan trọng cho bài học tiếp theo");

    if (reasons.length === 0) {
      reasons.push("Nhiệm vụ có mức độ ưu tiên ổn định trong kế hoạch thông thường");
    }

    const reasoning = `Điểm ưu tiên ${score}/10: ${reasons.join(", ")}.`;

    return {
      score,
      breakdown: { D, I, W, L, R },
      reasoning
    };
  },

  /**
   * CHỨC NĂNG 2: Đánh giá tính khả thi của lịch học (Feasibility Engine)
   * Kiểm tra: Tổng thời gian nhiệm vụ + nghỉ ngơi vs Thời gian khả dụng
   * Không được nhồi nhét, bảo vệ giờ ngủ.
   */
  assessFeasibility(tasks, availableMinutes, fixedMinutes = 0, fatigueLevel = 2) {
    const activeTasks = tasks.filter(t => t.status !== 'completed');
    const totalTaskMinutes = activeTasks.reduce((sum, t) => sum + (Number(t.estimatedMinutes) || 45), 0);
    
    // Tính toán thời gian nghỉ cần thiết (tối thiểu 10 phút nghỉ cho mỗi 45 phút học)
    const breakSessions = Math.max(1, Math.floor(totalTaskMinutes / 45));
    const totalBreakMinutes = breakSessions * 12;

    const totalNeededMinutes = totalTaskMinutes + totalBreakMinutes;
    const isOverloaded = totalNeededMinutes > availableMinutes;
    const loadPercentage = Math.round((totalNeededMinutes / Math.max(1, availableMinutes)) * 100);

    let status = 'feasible';
    let recommendations = [];

    if (fatigueLevel === 3) {
      status = 'rest_required';
      recommendations.push("Bạn đang trong trạng thái cần nghỉ ngơi. AI đề xuất hoãn các deadline mềm và giảm 40% khối lượng học hôm nay.");
    } else if (isOverloaded) {
      status = 'overloaded';
      const excess = totalNeededMinutes - availableMinutes;
      recommendations.push(`Kế hoạch vượt quá thời gian khả dụng ${excess} phút. AI không cho phép nhồi nhét để bảo vệ giờ ngủ.`);
      recommendations.push("Đề xuất: Chuyển các nhiệm vụ deadline mềm sang ngày mai, hoặc chia nhỏ bài học thành các phần ngắn hơn.");
    } else if (loadPercentage > 85) {
      status = 'tight';
      recommendations.push("Lịch học khá kín. Cần tuân thủ chặt chẽ thời gian nghỉ giải lao để tránh kiệt sức cuối buổi.");
    } else {
      status = 'healthy';
      recommendations.push("Lịch học cân bằng và khả thi! Bạn có đủ thời gian hoàn thành nhiệm vụ và nghỉ ngơi hợp lý.");
    }

    return {
      isFeasible: !isOverloaded && fatigueLevel !== 3,
      status,
      totalTaskMinutes,
      totalBreakMinutes,
      totalNeededMinutes,
      availableMinutes,
      loadPercentage,
      recommendations
    };
  },

  /**
   * CHỨC NĂNG 5: Phân tích xu hướng mệt mỏi (Fatigue & Rest Shield Engine)
   * 3 Trạng thái: Bình thường (1), Cần điều chỉnh (2), Cần nghỉ ngơi (3)
   */
  assessFatigueLevel({ sleepHours = 7, alertness = 7, stressLevel = 4, rescheduleCount = 0 }) {
    let fatiguePoints = 0;

    if (sleepHours < 5.5) fatiguePoints += 3;
    else if (sleepHours < 6.5) fatiguePoints += 1.5;

    if (alertness <= 3) fatiguePoints += 3;
    else if (alertness <= 6) fatiguePoints += 1.5;

    if (stressLevel >= 8) fatiguePoints += 2.5;
    else if (stressLevel >= 6) fatiguePoints += 1.5;

    if (rescheduleCount >= 3) fatiguePoints += 2;

    if (fatiguePoints >= 6) {
      return {
        level: 3,
        name: "Cần nghỉ ngơi (Rest Shield)",
        class: "danger",
        badge: "Cần nghỉ ngơi 🛑",
        advice: "Năng lượng cạn kiệt và thiếu ngủ. Ưu tiên nghỉ ngơi, tạm hoãn các bài tập thứ yếu để bảo vệ sức khỏe."
      };
    } else if (fatiguePoints >= 3) {
      return {
        level: 2,
        name: "Cần điều chỉnh",
        class: "warning",
        badge: "Cần điều chỉnh ⚠️",
        advice: "Có dấu hiệu căng thẳng hoặc mệt mỏi nhẹ. Hãy học phiên ngắn (25-30 phút), nghỉ giải lao thường xuyên."
      };
    } else {
      return {
        level: 1,
        name: "Bình thường",
        class: "green",
        badge: "Năng lượng tốt ✨",
        advice: "Tình trạng thể lực và tinh thần tối ưu. Có thể giải quyết các môn học khó và đòi hỏi tập trung sâu."
      };
    }
  },

  /**
   * CHỨC NĂNG 3: AI Smart Task Decomposition (Chia nhỏ nhiệm vụ thông minh)
   * Tạo các subtasks cụ thể dựa theo môn học và trình độ học sinh
   */
  decomposeTask(taskTitle, subject = "Toán", studentLevel = "trung bình") {
    const templates = {
      "Toán": [
        { title: "Rà soát lý thuyết & công thức trọng tâm", duration: 20, goal: "Nắm vững định nghĩa và điều kiện áp dụng", criteria: "Tự viết lại được 100% công thức cốt lõi" },
        { title: "Làm 5 bài tập nhận biết & thông hiểu cơ bản", duration: 30, goal: "Luyện thói quen nhận dạng dạng bài", criteria: "Đúng ít nhất 4/5 câu cơ bản" },
        { title: "Giải 2 bài toán vận dụng mức độ vừa", duration: 35, goal: "Ghép nối kiến thức vào tình huống phức hợp", criteria: "Trình bày rõ các bước giải mà không nhìn gợi ý" },
        { title: "Phân tích và ghi chép lỗi sai vào Knowledge Gap", duration: 15, goal: "Tránh lặp lại sai lầm trong kỳ thi", criteria: "Ghi rõ lý do sai (nhầm dấu, quên đk, tính sai)" }
      ],
      "Ngữ văn": [
        { title: "Đọc kỹ văn bản & gạch chân luận điểm chính", duration: 25, goal: "Hiểu sâu bối cảnh và cảm xúc tác giả", criteria: "Lập được dàn ý sơ đồ tư duy 3 ý lớn" },
        { title: "Viết đoạn văn mở bài và dẫn chứng trọng tâm", duration: 30, goal: "Mở bài ấn tượng, dẫn dắt tự nhiên", criteria: "Hoàn thiện đoạn văn 150-200 từ chuẩn ngữ pháp" },
        { title: "Phân tích nghệ thuật và giá trị tư tưởng", duration: 35, goal: "Làm nổi bật nét đặc sắc nghệ thuật", criteria: "Chỉ ra 2 biện pháp tu từ và tác dụng nghệ thuật" },
        { title: "Đọc soát lỗi chính tả và diễn đạt mượt mà", duration: 15, goal: "Chăm chút độ trau chuốt của câu chữ", criteria: "Không có lỗi lặp từ và diễn đạt lủng củng" }
      ],
      "Vật lý": [
        { title: "Ôn tập hiện tượng vật lý và bản chất công thức", duration: 20, goal: "Hiểu bản chất thay vì học vẹt", criteria: "Giải thích được đơn vị và ý nghĩa từng đại lượng" },
        { title: "Vẽ sơ đồ mạch điện / sơ đồ phân tích lực", duration: 20, goal: "Hình dung trực quan bài toán", criteria: "Xác định đúng chiều vectơ và điều kiện cân bằng" },
        { title: "Làm 6 câu trắc nghiệm định lượng", duration: 35, goal: "Rèn tốc độ bấm máy tính và thế số", criteria: "Hoàn thành trong 30 phút với độ chính xác cao" },
        { title: "Tổng hợp bẫy đề thi hay gặp", duration: 15, goal: "Nhận biết các trường hợp đặc biệt", criteria: "Ghi chú 2 bẫy đơn vị hoặc biên độ dao động" }
      ],
      "Hóa học": [
        { title: "Viết và cân bằng các phương trình phản ứng mẫu", duration: 20, goal: "Nắm bản chất phản ứng hóa học", criteria: "Viết đúng điều kiện xúc tác, nhiệt độ" },
        { title: "Áp dụng định luật bảo toàn (khối lượng, mol, e)", duration: 30, goal: "Tối ưu hóa tốc độ giải nhanh", criteria: "Giải bài toán mà không cần đặt quá nhiều ẩn số" },
        { title: "Làm bộ câu hỏi bài tập nhận biết chất", duration: 25, goal: "Nhớ hiện tượng kết tủa, bay hơi, đổi màu", criteria: "Nêu đúng thuốc thử và hiện tượng quan sát" }
      ],
      "Tiếng Anh": [
        { title: "Học 10 từ vựng theo chủ đề kèm ngữ cảnh", duration: 20, goal: "Nhớ từ vựng theo cụm Collocation", criteria: "Đặt được 3 câu có nghĩa với từ mới" },
        { title: "Luyện 1 bài đọc hiểu (Reading Comprehension)", duration: 30, goal: "Rèn kỹ năng Skimming & Scanning", criteria: "Gạch chân từ khóa câu hỏi trong đoạn văn" },
        { title: "Luyện 15 câu ngữ pháp chuyên đề", duration: 25, goal: "Khắc phục bẫy thì và mệnh đề quan hệ", criteria: "Đúng từ 12/15 câu trở lên" }
      ]
    };

    const chosen = templates[subject] || templates["Toán"];
    return chosen.map((item, idx) => ({
      id: `sub-${Date.now()}-${idx}`,
      title: item.title,
      duration: studentLevel === 'yếu' ? Math.round(item.duration * 1.25) : item.duration,
      goal: item.goal,
      criteria: item.criteria,
      completed: false
    }));
  },

  /**
   * CHỨC NĂNG 4: Quản lý Ôn tập ngắt quãng (Spaced Repetition & Active Recall)
   * 5 cấp độ ghi nhớ: 1: Không nhớ, 2: Chưa chắc, 3: Cần gợi ý, 4: Tự giải thích, 5: Vận dụng
   */
  calculateNextReview(memoryLevel) {
    const daysMap = {
      1: 1,  // Ngày mai ôn lại ngay
      2: 2,  // Sau 2 ngày
      3: 4,  // Sau 4 ngày
      4: 7,  // Sau 1 tuần
      5: 14  // Sau 2 tuần
    };

    const daysToAdd = daysMap[memoryLevel] || 2;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    const levelDescriptions = {
      1: "Không nhớ - Cần học lại và ôn lại vào ngày mai",
      2: "Nhớ nhưng chưa chắc chắn - Cần củng cố sau 2 ngày",
      3: "Nhớ khi có gợi ý - Ôn lại sau 4 ngày",
      4: "Có thể tự giải thích - Đạt chuẩn, ôn lại sau 7 ngày",
      5: "Có thể vận dụng vào bài tập mới - Nắm rất vững, ôn lại sau 14 ngày"
    };

    return {
      daysToAdd,
      nextReviewDate: nextDate.toISOString().split('T')[0],
      description: levelDescriptions[memoryLevel]
    };
  },

  /**
   * CHỨC NĂNG 6: Phân tích nguyên nhân tồn đọng và đề xuất xử lý
   * Không được tự ý dời sang ngày tiếp theo máy móc.
   */
  handleReschedulingReason(reasonId, task) {
    const solutions = {
      "not_enough_time": {
        title: "Không đủ thời gian thực tế",
        action: "Tính toán lại thời lượng và tìm khoảng thời gian thích hợp trong tuần.",
        proposal: "AI đề xuất chia task thành 2 phiên nhỏ (30 phút mỗi phiên) vào khung giờ sáng mai khi đầu óc tỉnh táo."
      },
      "too_hard": {
        title: "Bài tập khó hơn dự kiến",
        action: "Chia nhỏ nhiệm vụ và bổ sung kiến thức nền tảng trước.",
        proposal: "AI kích hoạt tính năng Task Decomposition, tách phần lý thuyết nền để học 15 phút trước khi làm bài khó."
      },
      "knowledge_gap": {
        title: "Chưa hiểu kiến thức nền",
        action: "Đưa nội dung này vào Knowledge Gap Tracking để ôn tập ngắt quãng.",
        proposal: "AI đã lưu vào mục 'Kho Kiến Thức Cần Củng Cố' và bổ sung câu hỏi tự kiểm tra vào ngày mai."
      },
      "distracted": {
        title: "Mất tập trung / Sao nhãng",
        action: "Đề xuất phiên học ngắn hơn (Pomodoro 25 phút) kèm chặn thông báo.",
        proposal: "Chuyển sang chế độ Pomodoro 25/5 và bật Rest Shield để giảm kích thích gây xao nhãng."
      },
      "fatigued": {
        title: "Cảm thấy mệt mỏi, kiệt sức",
        action: "Ưu tiên bảo vệ giấc ngủ, giảm tải không cố học thêm.",
        proposal: "Bảo vệ giấc ngủ tối nay: Chuyển task sang buổi chiều mai. Đi ngủ trước 23h00."
      },
      "unexpected_event": {
        title: "Có việc đột xuất từ gia đình / trường học",
        action: "Tính toán lại toàn bộ quỹ thời gian khả dụng trong tuần.",
        proposal: "Cân đối lại lịch tuần: Dời task sang khung thời gian trống của thứ Bảy mà không làm xáo trộn các deadline cứng."
      },
      "bad_estimate": {
        title: "Ước tính thời gian ban đầu chưa chính xác",
        action: "Hiệu chỉnh hệ số thời gian (Time Estimation Factor) cho môn này.",
        proposal: "AI tự động nhân hệ số x1.3 thời gian cho các bài tập tương tự của môn học này trong tương lai."
      }
    };

    return solutions[reasonId] || solutions["not_enough_time"];
  },

  /**
   * CHỨC NĂNG 9: Dự đoán nguy cơ trễ deadline
   */
  predictDeadlineRisk(task, remainingAvailableMinutes) {
    const estimatedNeeded = Number(task.estimatedMinutes) || 45;
    const daysUntilDeadline = task.daysRemaining || 1;
    
    if (task.deadlineType === 'hard' && daysUntilDeadline <= 1 && estimatedNeeded > remainingAvailableMinutes) {
      return {
        riskLevel: 'high',
        text: 'Nguy cơ trễ hạn cao ⚠️',
        color: '#dc2626',
        advice: 'Không đủ thời gian theo kế hoạch hiện tại. Hãy ưu tiên tập trung hoàn thành phần cốt lõi ngay.'
      };
    } else if (daysUntilDeadline <= 2 && estimatedNeeded * 1.5 > remainingAvailableMinutes) {
      return {
        riskLevel: 'medium',
        text: 'Có nguy cơ trễ hạn ⏱️',
        color: '#d97706',
        advice: 'Cần chú ý tiến độ, tránh phân tâm sang các môn có deadline mềm.'
      };
    } else {
      return {
        riskLevel: 'safe',
        text: 'Tiến độ an toàn ✅',
        color: '#059669',
        advice: 'Thời gian hoàn toàn khả thi theo kế hoạch đã lập.'
      };
    }
  }
};

