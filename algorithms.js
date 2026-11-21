/**
 * ECOSTUDY ALGORITHMS & RULE ENGINE
 * Implementation of specifications from DU AN.docx & LOI CAN SUA O WEB.docx
 * Core Engine: AI Engine + Rule Engine + Scheduling Engine
 */

export const EcoAlgorithms = {
  /**
   * CHỨC NĂNG 2: Công thức tính điểm ưu tiên
   * P = 0.30D + 0.25I + 0.20W + 0.15L + 0.10R
   * @param {Object} task 
   * @returns {Object} { score: number, breakdown: Object, bulletPoints: Array<string>, reasoning: string }
   */
  calculatePriorityScore(task) {
    const D = Math.min(10, Math.max(1, Number(task.deadlineProximity || 5)));
    const I = Math.min(10, Math.max(1, Number(task.importance || 5)));
    const W = Math.min(10, Math.max(1, Number(task.difficultyWorkload || 5)));
    const L = Math.min(10, Math.max(1, Number(task.lossConsequence || 5)));
    const R = Math.min(10, Math.max(1, Number(task.prerequisiteRequirement || 5)));

    const score = Number((0.30 * D + 0.25 * I + 0.20 * W + 0.15 * L + 0.10 * R).toFixed(2));

    // Yêu cầu từ LOI CAN SUA O WEB.docx: "Giải thích lý do ưu tiên của AI" nên chia thành các ý gạch đầu dòng để dễ nhìn hơn
    const bulletPoints = [];
    if (D >= 8) bulletPoints.push("Hạn chót đang đến rất gần — cần ưu tiên xử lý sớm để tránh bị dồn ép.");
    else if (D <= 3) bulletPoints.push("Thời hạn còn xa — có thể bố trí học đều đặn không cần gấp.");

    if (I >= 8) bulletPoints.push("Độ quan trọng cao — liên quan trực tiếp đến điểm số hoặc mục tiêu thi cử.");
    
    if (W >= 8) bulletPoints.push("Khối lượng & độ khó lớn — nên học vào khung giờ đầu óc tỉnh táo nhất.");
    else if (W <= 3) bulletPoints.push("Độ khó nhẹ — có thể hoàn thành nhanh trong các khoảng thời gian trống ngắn.");

    if (L >= 8) bulletPoints.push("Hậu quả trễ hạn lớn — có nguy cơ mất điểm thành phần hoặc dời lịch dây chuyền.");

    if (R >= 8) bulletPoints.push("Kiến thức nền tảng — là tiền đề bắt buộc cho các bài học hoặc chủ đề tiếp theo.");

    if (bulletPoints.length === 0) {
      bulletPoints.push("Mức độ ưu tiên ổn định trong tiến độ học tập bình thường.");
      bulletPoints.push("Phân bổ cân bằng giữa học kiến thức mới và củng cố bài cũ.");
    }

    const reasoning = `Điểm ưu tiên: ${score}/10. ${bulletPoints[0]}`;

    return {
      score,
      breakdown: { D, I, W, L, R },
      bulletPoints,
      reasoning
    };
  },

  /**
   * CHỨC NĂNG 2 & SMART REST: Đánh giá tính khả thi của lịch học (Feasibility Engine)
   * Kiểm tra: Tổng thời gian nhiệm vụ + nghỉ ngơi vs Thời gian khả dụng trước giờ ngủ
   * Tuyệt đối không được nhồi nhét, bảo vệ giờ ngủ của học sinh.
   */
  assessFeasibility(tasks, availableMinutes = 180, fixedMinutes = 0, fatigueLevel = 1, sleepTarget = "23:00") {
    const activeTasks = (tasks || []).filter(t => t.status !== 'completed');
    const totalTaskMinutes = activeTasks.reduce((sum, t) => sum + (Number(t.estimatedMinutes) || 45), 0);
    
    // Tối thiểu 10-12 phút nghỉ cho mỗi 45 phút học tập liên tục
    const breakSessions = Math.max(0, Math.floor(totalTaskMinutes / 45));
    const totalBreakMinutes = breakSessions * 12;

    const totalNeededMinutes = totalTaskMinutes + totalBreakMinutes;
    const isOverloaded = totalNeededMinutes > availableMinutes;
    const loadPercentage = Math.min(150, Math.round((totalNeededMinutes / Math.max(1, availableMinutes)) * 100));

    let status = 'healthy';
    let recommendations = [];

    if (fatigueLevel === 3) {
      status = 'rest_required';
      recommendations.push("Bạn đang trong trạng thái kiệt sức / thiếu ngủ nặng. AI khuyến nghị hoãn các bài tập có deadline mềm và nghỉ ngơi sớm.");
      recommendations.push(`Bảo vệ giấc ngủ: Đi ngủ đúng ${sleepTarget}, tuyệt đối không thức khuya chạy deadline.`);
    } else if (isOverloaded) {
      status = 'overloaded';
      const excess = totalNeededMinutes - availableMinutes;
      recommendations.push(`Kế hoạch vượt quá thời gian khả dụng ${excess} phút. AI không cho phép nhồi nhét để bảo vệ giờ ngủ ${sleepTarget}.`);
      recommendations.push("Đề xuất: Chuyển nhiệm vụ có độ ưu tiên thấp hoặc deadline mềm sang ngày mai.");
      recommendations.push("Chia nhỏ các bài tập lớn để giải quyết từng phần thay vì ôm đồm toàn bộ.");
    } else if (loadPercentage > 85) {
      status = 'tight';
      recommendations.push("Lịch học khá kín (chiếm >85% thời gian tối nay). Cần tuân thủ thời gian giải lao 10 phút giữa các phiên.");
      recommendations.push(`Cần kết thúc toàn bộ việc học trước ${sleepTarget} để chuẩn bị đi ngủ.`);
    } else {
      status = 'healthy';
      recommendations.push("Lịch học cân bằng và có tính khả thi cao! Bạn có đủ thời gian hoàn thành nhiệm vụ và thư giãn.");
      recommendations.push("Duy trì tốc độ hiện tại để đảm bảo thời gian nghỉ ngơi tối ưu.");
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
   * CHỨC NĂNG 5: Phân tích xu hướng mệt mỏi & Hệ thống nhắc nhở giờ nghỉ thông minh
   * Dựa trên: giờ ngủ thiết lập, thời gian ngủ thực tế, độ tỉnh táo, mức stress, thời lượng học liên tục
   */
  assessFatigueLevel({ sleepHours = 7, alertness = 7, stressLevel = 4, rescheduleCount = 0, studyContinuousMinutes = 0 }) {
    let fatiguePoints = 0;

    if (sleepHours < 5.5) fatiguePoints += 3;
    else if (sleepHours < 6.5) fatiguePoints += 1.5;

    if (alertness <= 3) fatiguePoints += 3;
    else if (alertness <= 6) fatiguePoints += 1.5;

    if (stressLevel >= 8) fatiguePoints += 2.5;
    else if (stressLevel >= 6) fatiguePoints += 1.5;

    if (rescheduleCount >= 3) fatiguePoints += 2;

    if (studyContinuousMinutes >= 90) fatiguePoints += 2.5;
    else if (studyContinuousMinutes >= 60) fatiguePoints += 1.5;

    if (fatiguePoints >= 6) {
      return {
        level: 3,
        name: "Cần nghỉ ngơi (Smart Rest)",
        class: "danger",
        badge: "Cần nghỉ ngơi 🛑",
        advice: "Năng lượng cạn kiệt hoặc thiếu ngủ. AI khuyến cáo tạm dừng học tập, chợp mắt hoặc nghỉ ngơi để phục hồi não bộ."
      };
    } else if (fatiguePoints >= 3) {
      return {
        level: 2,
        name: "Cần điều chỉnh",
        class: "warning",
        badge: "Cần điều chỉnh ⚠️",
        advice: "Có dấu hiệu mệt mỏi hoặc học liên tục. Hãy áp dụng phiên học ngắn 25 phút kèm 5 phút vận động nhẹ."
      };
    } else {
      return {
        level: 1,
        name: "Năng lượng tốt",
        class: "green",
        badge: "Năng lượng tốt ✨",
        advice: "Thể lực và tinh thần tối ưu. Đây là thời điểm vàng để giải quyết các bài tập khó và môn học tư duy sâu."
      };
    }
  },

  /**
   * Tính toán nhắc nhở giờ nghỉ thông minh trong buổi học
   */
  getSmartRestAlert(studyContinuousMinutes = 0, sleepTarget = "23:00") {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    const [targetH, targetM] = sleepTarget.split(':').map(Number);
    const targetTotalMinutes = targetH * 60 + (targetM || 0);

    const minutesUntilSleep = targetTotalMinutes - currentTotalMinutes;

    if (minutesUntilSleep <= 0 && minutesUntilSleep > -180) {
      return {
        shouldStop: true,
        type: 'sleep_time',
        title: '🌙 Đã đến giờ đi ngủ mục tiêu!',
        message: `Đã đến mốc ${sleepTarget}. Hãy cất sách vở và chuẩn bị đi ngủ. Giấc ngủ đủ giúp củng cố 40% trí nhớ dài hạn.`,
        priority: 'high'
      };
    } else if (minutesUntilSleep > 0 && minutesUntilSleep <= 30) {
      return {
        shouldStop: false,
        type: 'pre_sleep',
        title: '⏳ Sắp đến giờ nghỉ ngơi (30 phút nữa)',
        message: `Chỉ còn ${minutesUntilSleep} phút trước mốc ${sleepTarget}. Hãy thu dọn bàn học, hoàn thành nốt đoạn đang viết dở.`,
        priority: 'medium'
      };
    }

    if (studyContinuousMinutes >= 60) {
      return {
        shouldStop: false,
        type: 'break_needed',
        title: '☕ Bạn đã học liên tục 60 phút!',
        message: 'Hãy đứng dậy, uống nước, vươn vai và nhìn xa trong 5-10 phút để tránh căng thẳng mắt và mỏi cơ.',
        priority: 'medium'
      };
    }

    return null;
  },

  /**
   * CHỨC NĂNG 3: AI Smart Task Decomposition (Chia nhỏ nhiệm vụ thông minh)
   * Tự động phân tách nhiệm vụ lớn thành các bước hành động cụ thể có mục tiêu và tiêu chí đạt
   */
  decomposeTask(taskTitle, subject = "Toán", studentLevel = "trung bình") {
    const templates = {
      "Toán": [
        { title: "Rà soát lý thuyết & công thức trọng tâm", duration: 15, goal: "Nắm vững định nghĩa và điều kiện áp dụng", criteria: "Tự viết lại đúng 100% công thức cốt lõi" },
        { title: "Làm 5 bài tập nhận biết & thông hiểu cơ bản", duration: 25, goal: "Luyện thói quen nhận dạng dạng bài", criteria: "Đúng ít nhất 4/5 câu cơ bản" },
        { title: "Giải 2 bài toán vận dụng mức độ vừa", duration: 30, goal: "Ghép nối kiến thức vào tình huống phức hợp", criteria: "Trình bày rõ các bước giải mạch lạc" },
        { title: "Phân tích và ghi chép lỗi sai", duration: 15, goal: "Tránh lặp lại sai lầm trong kỳ thi", criteria: "Ghi rõ lý do sai (nhầm dấu, điều kiện, tính toán)" }
      ],
      "Ngữ văn": [
        { title: "Đọc kỹ văn bản & gạch chân luận điểm chính", duration: 20, goal: "Hiểu sâu bối cảnh và cảm xúc tác giả", criteria: "Lập được dàn ý sơ đồ tư duy 3 ý lớn" },
        { title: "Viết đoạn văn mở bài và luận điểm 1", duration: 25, goal: "Mở bài ấn tượng, dẫn dắt tự nhiên", criteria: "Hoàn thiện đoạn văn 150-200 từ chuẩn ngữ pháp" },
        { title: "Phân tích nghệ thuật và giá trị tư tưởng", duration: 30, goal: "Làm nổi bật nét đặc sắc nghệ thuật", criteria: "Chỉ ra 2 biện pháp tu từ và tác dụng biểu đạt" },
        { title: "Đọc soát lỗi chính tả và diễn đạt mượt mà", duration: 15, goal: "Chăm chút độ trau chuốt của câu chữ", criteria: "Không có lỗi lặp từ và diễn đạt lủng củng" }
      ],
      "Vật lý": [
        { title: "Ôn tập hiện tượng vật lý và bản chất công thức", duration: 15, goal: "Hiểu bản chất thay vì học vẹt", criteria: "Giải thích được đơn vị và ý nghĩa từng đại lượng" },
        { title: "Vẽ sơ đồ mạch điện / sơ đồ phân tích lực", duration: 20, goal: "Hình dung trực quan bài toán", criteria: "Xác định đúng chiều vectơ và điều kiện cân bằng" },
        { title: "Làm 6 câu trắc nghiệm định lượng", duration: 30, goal: "Rèn tốc độ bấm máy tính và thế số", criteria: "Hoàn thành trong 25 phút với độ chính xác cao" },
        { title: "Tổng hợp bẫy đề thi hay gặp", duration: 15, goal: "Nhận biết các trường hợp đặc biệt", criteria: "Ghi chú 2 bẫy đơn vị hoặc biên độ dao động" }
      ],
      "Hóa học": [
        { title: "Viết và cân bằng các phương trình phản ứng mẫu", duration: 15, goal: "Nắm bản chất phản ứng hóa học", criteria: "Viết đúng điều kiện xúc tác, nhiệt độ" },
        { title: "Áp dụng định luật bảo toàn (khối lượng, mol, e)", duration: 25, goal: "Tối ưu hóa tốc độ giải nhanh", criteria: "Giải bài toán mà không cần đặt quá nhiều ẩn số" },
        { title: "Làm bộ câu hỏi bài tập nhận biết chất", duration: 20, goal: "Nhớ hiện tượng kết tủa, bay hơi, đổi màu", criteria: "Nêu đúng thuốc thử và hiện tượng quan sát" }
      ],
      "Tiếng Anh": [
        { title: "Học 10 từ vựng theo chủ đề kèm ngữ cảnh", duration: 15, goal: "Nhớ từ vựng theo cụm Collocation", criteria: "Đặt được 3 câu có nghĩa với từ mới" },
        { title: "Luyện 1 bài đọc hiểu (Reading Comprehension)", duration: 25, goal: "Rèn kỹ năng Skimming & Scanning", criteria: "Gạch chân từ khóa câu hỏi trong đoạn văn" },
        { title: "Luyện 15 câu ngữ pháp chuyên đề", duration: 20, goal: "Khắc phục bẫy thì và mệnh đề quan hệ", criteria: "Đúng từ 12/15 câu trở lên" }
      ]
    };

    const chosen = templates[subject] || templates["Toán"];
    const multiplier = studentLevel === 'yếu' ? 1.25 : studentLevel === 'khá' ? 0.9 : 1.0;

    return chosen.map((item, idx) => ({
      id: `sub-${Date.now()}-${idx}`,
      title: item.title,
      duration: Math.round(item.duration * multiplier),
      goal: item.goal,
      criteria: item.criteria,
      completed: false
    }));
  },

  /**
   * Phát hiện xung đột lịch và nhận diện khoảng thời gian trống
   */
  analyzeTimetableSlots(slots = [], dayOfWeek = 1) {
    const daySlots = (slots || [])
      .filter(s => Number(s.dayOfWeek) === Number(dayOfWeek))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const conflicts = [];
    const freeSlots = [];

    // Kiểm tra xung đột giữa các tiết liền kề
    for (let i = 0; i < daySlots.length - 1; i++) {
      const cur = daySlots[i];
      const next = daySlots[i + 1];

      if (cur.endTime > next.startTime) {
        conflicts.push({
          slot1: cur,
          slot2: next,
          message: `Trùng giờ giữa "${cur.subject}" (${cur.startTime}-${cur.endTime}) và "${next.subject}" (${next.startTime}-${next.endTime})`
        });
      } else if (cur.endTime < next.startTime) {
        // Có khoảng thời gian trống
        const [h1, m1] = cur.endTime.split(':').map(Number);
        const [h2, m2] = next.startTime.split(':').map(Number);
        const durationMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);

        if (durationMinutes >= 30) {
          freeSlots.push({
            startTime: cur.endTime,
            endTime: next.startTime,
            durationMinutes,
            suitableForTask: durationMinutes >= 45 ? "Đủ thời gian học 1 phiên 45p" : "Thích hợp ôn lại từ vựng hoặc giải lao"
          });
        }
      }
    }

    return {
      daySlots,
      conflicts,
      freeSlots
    };
  },

  /**
   * CHỨC NĂNG 6: Phân tích nguyên nhân tồn đọng và đề xuất xử lý thông minh
   * Không được tự ý dời sang ngày tiếp theo một cách máy móc, không tự xóa, không sửa deadline cứng.
   */
  handleReschedulingReason(reasonId, task) {
    const solutions = {
      "not_enough_time": {
        title: "Không đủ thời gian thực tế",
        action: "Tính toán lại quỹ thời gian khả dụng và tìm khoảng trống thích hợp trong tuần.",
        proposal: "AI đề xuất chia nhiệm vụ thành 2 phiên nhỏ (25-30 phút) vào khung giờ trống buổi chiều mai."
      },
      "too_hard": {
        title: "Bài tập khó hơn dự kiến",
        action: "Chia nhỏ nhiệm vụ và bổ sung kiến thức nền trước khi làm bài tập lớn.",
        proposal: "AI kích hoạt tính năng Chia Nhỏ Nhiệm Vụ, tách riêng phần rà soát lý thuyết 15 phút trước khi giải bài tập vận dụng."
      },
      "knowledge_gap": {
        title: "Chưa nắm vững kiến thức nền",
        action: "Đưa nội dung này vào danh mục cần củng cố và lên lịch ôn tập ngắt quãng.",
        proposal: "AI ghi nhận lỗ hổng kiến thức vào mục củng cố và đề xuất ôn lại kiến thức cốt lõi trước 1 ngày."
      },
      "distracted": {
        title: "Mất tập trung / Xao nhãng",
        action: "Đề xuất áp dụng phiên học ngắn Pomodoro 25 phút kèm chế độ hạn chế thông báo.",
        proposal: "Chuyển sang chế độ Pomodoro 25/5 và tắt chuông thông báo không cần thiết."
      },
      "fatigued": {
        title: "Cảm thấy mệt mỏi, kiệt sức",
        action: "Ưu tiên bảo vệ giấc ngủ, giảm tải không cố học thêm vào ban đêm.",
        proposal: "Bảo vệ giấc ngủ tối nay: Dời nhiệm vụ sang khung giờ sáng mai khi não bộ hồi phục năng lượng."
      },
      "unexpected_event": {
        title: "Có việc đột xuất từ gia đình / trường học",
        action: "Cân đối lại toàn bộ lịch tuần mà không vi phạm các deadline cứng.",
        proposal: "Cân đối lại lịch tuần: Xếp nhiệm vụ vào khoảng trống thứ Bảy/Chủ nhật."
      },
      "bad_estimate": {
        title: "Ước tính thời gian ban đầu chưa chính xác",
        action: "Hiệu chỉnh hệ số thời gian (Time Estimation Factor) cho môn học này.",
        proposal: "AI tự động nhân hệ số x1.25 thời lượng cho các bài tập tương tự của môn học này."
      }
    };

    return solutions[reasonId] || solutions["not_enough_time"];
  },

  /**
   * CHỨC NĂNG 9: Dự đoán nguy cơ trễ deadline
   */
  predictDeadlineRisk(task, remainingAvailableMinutes = 180) {
    const estimatedNeeded = Number(task.estimatedMinutes) || 45;
    
    // Tính số ngày còn lại đến deadline
    let daysUntilDeadline = 2;
    if (task.deadline) {
      const today = new Date();
      today.setHours(0,0,0,0);
      const dlDate = new Date(task.deadline);
      dlDate.setHours(0,0,0,0);
      const diffTime = dlDate.getTime() - today.getTime();
      daysUntilDeadline = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    if (daysUntilDeadline < 0) {
      return {
        riskLevel: 'overdue',
        text: 'Đã quá hạn 🚨',
        color: 'var(--color-alert)',
        advice: 'Nhiệm vụ đã quá deadline! Cần đưa vào Backlog Manager để phân tích nguyên nhân và sắp xếp lại kế hoạch.'
      };
    } else if (task.deadlineType === 'hard' && daysUntilDeadline <= 1 && estimatedNeeded > remainingAvailableMinutes) {
      return {
        riskLevel: 'high',
        text: 'Nguy cơ trễ hạn cao ⚠️',
        color: 'var(--color-alert)',
        advice: 'Thời gian khả dụng tối nay không đủ cho bài tập này. Cần tập trung giải quyết phần trọng tâm ngay lập tức.'
      };
    } else if (daysUntilDeadline <= 1) {
      return {
        riskLevel: 'medium',
        text: 'Hạn chót hôm nay / ngày mai ⏱️',
        color: 'var(--color-warning)',
        advice: 'Sắp đến hạn, nên xếp vào danh sách nhiệm vụ ưu tiên hoàn thành trong ngày.'
      };
    } else {
      return {
        riskLevel: 'safe',
        text: 'Tiến độ an toàn ✅',
        color: 'var(--color-success)',
        advice: 'Thời gian còn dồi dào, hãy phân bổ đều đặn theo thời khóa biểu.'
      };
    }
  }
};
