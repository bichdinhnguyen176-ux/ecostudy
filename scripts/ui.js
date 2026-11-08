/**
 * ECOSTUDY UI RENDERER & INTERACTIVE COMPONENTS
 * Full implementation including:
 * - Landing Page (Public Showcase)
 * - Weekly Calendar (Time Blocks & Sleep Shield)
 * - Pomodoro Web Audio Chimes
 * - Dynamic Canvas Analytics Charts
 * - 12 Core Features from DU AN.docx
 */

import { store } from './state.js';
import { EcoAlgorithms } from './algorithms.js';

export const UI = {
  activeTab: 'dashboard',
  pomodoroTimerInterval: null,
  pomodoroTimeRemaining: 25 * 60,
  pomodoroRunning: false,
  pomodoroMode: 'work', // 'work' | 'break'

  init() {
    this.bindNavigation();
    this.bindRoleSwitcher();
    this.bindModeSelector();
    this.render();

    store.subscribe(() => {
      this.render();
    });
  },

  playChime(type = 'bell') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'bell') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz calming tone
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } else if (type === 'alert') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {
      console.log("Audio play prevented or unavailable:", e);
    }
  },

  bindNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        if (tab) {
          this.switchTab(tab);
        }
      });
    });
  },

  bindRoleSwitcher() {
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        store.setRole(role);
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (role === 'parent') {
          this.switchTab('parent-portal');
        } else if (role === 'school') {
          this.switchTab('school-portal');
        } else {
          this.switchTab('dashboard');
        }
      });
    });
  },

  bindModeSelector() {
    document.querySelectorAll('.mode-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const mode = pill.getAttribute('data-mode');
        store.setMode(mode);
        document.querySelectorAll('.mode-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        UI.showToast(`Đã chuyển sang chế độ: ${pill.innerText}`);
      });
    });
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-tab') === tabName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const pageTitleMap = {
      'landing': 'Chào Mừng Đến Với EcoStudy',
      'dashboard': 'Tổng Quan Học Tập & Trạng Thái',
      'calendar': 'Lịch Học Cá Nhân (Weekly Time Blocks)',
      'check-in': 'Check-in Đầu Ngày (AI Companion)',
      'schedule': 'Phân Tích Tính Khả Thi & Lập Lịch',
      'tasks': 'Quản Lý Nhiệm Vụ & Chia Nhỏ Thông Minh',
      'backlog': 'Xử Lý Tồn Đọng & Tự Động Điều Chỉnh',
      'check-out': 'Check-out & Đánh Giá Nhiệm Vụ',
      'knowledge': 'Kho Kiến Thức & Ôn Tập Ngắt Quãng',
      'weekly-report': 'Báo Cáo Tiến Độ Hàng Tuần',
      'modes': 'Chế Độ Học Tập Linh Hoạt & Bảo Vệ Nghỉ Ngơi',
      'journal': 'Nhật Ký Học Tập & Tự Đánh Giá',
      'parent-portal': 'Cổng Phụ Huynh (Báo Cáo & Đồng Hành)',
      'school-portal': 'Cổng Nhà Trường (Tổng Hợp Giáo Dục)',
      'settings': 'Cài Đặt & Quyền Riêng Tư (Privacy Shield)'
    };

    const titleEl = document.getElementById('current-page-title');
    if (titleEl) {
      titleEl.innerText = pageTitleMap[tabName] || 'EcoStudy';
    }

    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  render() {
    const container = document.getElementById('app-main-content');
    if (!container) return;

    this.updateTopbarEnergyBadge();

    switch (this.activeTab) {
      case 'landing':
        container.innerHTML = this.renderLanding();
        this.bindLandingEvents();
        break;
      case 'dashboard':
        container.innerHTML = this.renderDashboard();
        this.bindDashboardEvents();
        break;
      case 'calendar':
        container.innerHTML = this.renderCalendar();
        this.bindCalendarEvents();
        break;
      case 'check-in':
        container.innerHTML = this.renderCheckIn();
        this.bindCheckInEvents();
        break;
      case 'schedule':
        container.innerHTML = this.renderSchedulePlanner();
        this.bindScheduleEvents();
        break;
      case 'tasks':
        container.innerHTML = this.renderTasks();
        this.bindTasksEvents();
        break;
      case 'backlog':
        container.innerHTML = this.renderBacklog();
        this.bindBacklogEvents();
        break;
      case 'check-out':
        container.innerHTML = this.renderCheckOut();
        this.bindCheckOutEvents();
        break;
      case 'knowledge':
        container.innerHTML = this.renderKnowledgeReview();
        this.bindKnowledgeEvents();
        break;
      case 'weekly-report':
        container.innerHTML = this.renderWeeklyReport();
        this.bindWeeklyReportEvents();
        break;
      case 'modes':
        container.innerHTML = this.renderModes();
        this.bindModesEvents();
        break;
      case 'journal':
        container.innerHTML = this.renderJournal();
        this.bindJournalEvents();
        break;
      case 'parent-portal':
        container.innerHTML = this.renderParentPortal();
        break;
      case 'school-portal':
        container.innerHTML = this.renderSchoolPortal();
        break;
      case 'settings':
        container.innerHTML = this.renderSettings();
        this.bindSettingsEvents();
        break;
      default:
        container.innerHTML = this.renderDashboard();
        this.bindDashboardEvents();
    }
  },

  updateTopbarEnergyBadge() {
    const checkIn = store.data.todayCheckIn || {};
    const fatigue = EcoAlgorithms.assessFatigueLevel({
      sleepHours: checkIn.sleepHours || 7,
      alertness: checkIn.alertness || 7,
      stressLevel: checkIn.stressLevel || 4
    });

    const badgeEl = document.getElementById('topbar-energy-badge');
    if (badgeEl) {
      badgeEl.className = `energy-badge ${fatigue.class}`;
      badgeEl.innerHTML = `<span>⚡</span> <span>${fatigue.badge}</span>`;
    }
  },

  /* =========================================================================
     SCREEN 0: LANDING PAGE
     ========================================================================= */
  renderLanding() {
    return `
      <div class="landing-hero">
        <div class="landing-tagline">
          🌱 ECOSTUDY PLATFORM • THIẾT KẾ CHO HỌC SINH THPT
        </div>
        <h1 class="landing-title">
          Học Thông Minh Hơn, Nghỉ Ngơi Tốt Hơn, <span>Không Bao Giờ Quá Tải</span>
        </h1>
        <p class="landing-subtitle">
          EcoStudy là trợ lý AI đồng hành cá nhân hóa, tự động điều chỉnh lịch học theo tiến độ thực tế, 
          chia nhỏ bài khó và bảo vệ trọn vẹn giấc ngủ của bạn.
        </p>
        <div class="landing-cta-group">
          <button class="btn btn-primary btn-lg" id="btn-landing-to-dashboard">
            🚀 Khám Phá Dashboard Ngay
          </button>
          <button class="btn btn-secondary btn-lg" id="btn-landing-to-checkin">
            🌅 Bắt Đầu Check-in Đầu Ngày
          </button>
        </div>
      </div>

      <div style="margin-bottom: 2rem;">
        <h3 style="text-align: center; font-size: 1.5rem; font-weight: 800; color: var(--neutral-900); margin-bottom: 0.5rem;">
          Vì Sao EcoStudy Khác Biệt?
        </h3>
        <p style="text-align: center; font-size: 0.95rem; color: var(--neutral-600); max-width: 600px; margin: 0 auto 2rem auto;">
          Không đơn thuần là to-do list máy móc. Đây là hệ thống thông minh hiểu và tôn trọng nhịp sinh học của học sinh.
        </p>

        <div class="grid-3">
          <div class="feature-pill-card">
            <div class="feature-pill-icon">🛡️</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--neutral-900); margin-bottom: 0.5rem;">
              Nguyên Tắc Sleep Shield
            </h4>
            <p style="font-size: 0.85rem; color: var(--neutral-600); line-height: 1.5;">
              Tuyệt đối không hy sinh giờ ngủ để nhồi nhét bài tập. Cảnh báo quá tải nếu kế hoạch vượt thời gian khả dụng.
            </p>
          </div>

          <div class="feature-pill-card">
            <div class="feature-pill-icon">🧩</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--neutral-900); margin-bottom: 0.5rem;">
              Smart Task Decomposition
            </h4>
            <p style="font-size: 0.85rem; color: var(--neutral-600); line-height: 1.5;">
              Tự động phân rã các chuyên đề lớn môn Toán, Văn, Lý, Hóa thành các bước nhỏ có mục tiêu và tiêu chí rõ ràng.
            </p>
          </div>

          <div class="feature-pill-card">
            <div class="feature-pill-icon">🧠</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--neutral-900); margin-bottom: 0.5rem;">
              Active Recall & Spaced Repetition
            </h4>
            <p style="font-size: 0.85rem; color: var(--neutral-600); line-height: 1.5;">
              Hệ thống theo dõi Knowledge Gap và ôn tập ngắt quãng khoa học, giúp ghi nhớ lâu bền cho kỳ thi THPT.
            </p>
          </div>
        </div>
      </div>
    `;
  },

  bindLandingEvents() {
    document.getElementById('btn-landing-to-dashboard')?.addEventListener('click', () => {
      this.switchTab('dashboard');
    });
    document.getElementById('btn-landing-to-checkin')?.addEventListener('click', () => {
      this.switchTab('check-in');
    });
  },

  /* =========================================================================
     SCREEN 1: DASHBOARD
     ========================================================================= */
  renderDashboard() {
    const { tasks, todayCheckIn, settings } = store.data;
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const completionRate = Math.round((completedTasks.length / Math.max(1, tasks.length)) * 100);

    const fatigue = EcoAlgorithms.assessFatigueLevel({
      sleepHours: todayCheckIn.sleepHours || 7,
      alertness: todayCheckIn.alertness || 7,
      stressLevel: todayCheckIn.stressLevel || 4
    });

    const feasibility = EcoAlgorithms.assessFeasibility(
      tasks,
      todayCheckIn.availableMinutes || 180,
      0,
      fatigue.level
    );

    return `
      <!-- AI Insight Banner -->
      <div class="${feasibility.isFeasible ? 'ai-banner' : 'warning-banner'}">
        <div class="${feasibility.isFeasible ? 'ai-banner-icon' : 'warning-banner-icon'}">
          ${feasibility.isFeasible ? '🌱' : '⚠️'}
        </div>
        <div class="ai-banner-content" style="flex: 1;">
          <h4>${feasibility.isFeasible ? 'Lịch học hôm nay được tối ưu hóa' : 'Cảnh báo tính khả thi: Có nguy cơ quá tải!'}</h4>
          <p>${feasibility.recommendations[0]}</p>
          <div class="ai-banner-actions">
            <button class="btn btn-sm ${feasibility.isFeasible ? 'btn-primary' : 'btn-danger'}" id="btn-quick-checkin">
              ${todayCheckIn.completedAt ? 'Cập nhật Check-in' : 'Bắt đầu Check-in sáng'}
            </button>
            <button class="btn btn-sm btn-secondary" id="btn-view-feasibility">Xem phân tích thời gian</button>
            <button class="btn btn-sm btn-outline-primary" id="btn-view-calendar">Xem thời khóa biểu tuần</button>
          </div>
        </div>
      </div>

      <!-- Quick Stats Row -->
      <div class="grid-4" style="margin-bottom: 1.5rem;">
        <div class="stat-widget">
          <div class="stat-icon green">🎯</div>
          <div class="stat-content">
            <h3>${completionRate}%</h3>
            <p>Tiến độ hoàn thành (${completedTasks.length}/${tasks.length})</p>
          </div>
        </div>
        <div class="stat-widget">
          <div class="stat-icon blue">⏱️</div>
          <div class="stat-content">
            <h3>${todayCheckIn.availableMinutes || 180} p</h3>
            <p>Quỹ thời gian khả dụng</p>
          </div>
        </div>
        <div class="stat-widget">
          <div class="stat-icon ${fatigue.level === 3 ? 'rose' : (fatigue.level === 2 ? 'amber' : 'green')}">
            ${fatigue.level === 3 ? '🛑' : (fatigue.level === 2 ? '⚡' : '🌟')}
          </div>
          <div class="stat-content">
            <h3>${fatigue.name}</h3>
            <p>Ngủ: ${todayCheckIn.sleepHours || 7}h | Áp lực: ${todayCheckIn.stressLevel || 4}/10</p>
          </div>
        </div>
        <div class="stat-widget">
          <div class="stat-icon rose">🛡️</div>
          <div class="stat-content">
            <h3>${settings.sleepStart}</h3>
            <p>Sleep Shield (Bảo vệ giờ ngủ)</p>
          </div>
        </div>
      </div>

      <!-- Main Columns: Today's Schedule + Pomodoro & Rest Shield -->
      <div class="grid-main-side">
        <!-- Left: Today's Timeline -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">📅 Lịch Học Hôm Nay (Thích ứng theo tiến độ)</div>
              <div class="card-subtitle">Tuân thủ nguyên tắc: Không nhồi nhét, có khoảng nghỉ dự phòng</div>
            </div>
            <button class="btn btn-sm btn-outline-primary" id="btn-add-quick-task">+ Thêm nhiệm vụ</button>
          </div>

          <div class="schedule-timeline">
            ${tasks.map(task => {
              const priority = EcoAlgorithms.calculatePriorityScore(task);
              const risk = EcoAlgorithms.predictDeadlineRisk(task, todayCheckIn.availableMinutes || 180);
              return `
                <div class="timeline-item ${task.status === 'completed' ? 'break' : ''}">
                  <div class="timeline-time">${task.timeSlot || 'Linh hoạt'}</div>
                  <div class="timeline-body">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                      <h4>${task.title}</h4>
                      <span class="badge badge-${task.status.replace('_', '')}">${this.getStatusText(task.status)}</span>
                      <span class="deadline-pill ${task.deadlineType === 'hard' ? 'deadline-hard' : 'deadline-soft'}">
                        ${task.deadlineType === 'hard' ? 'Hạn cứng 📌' : 'Hạn mềm 🍃'}
                      </span>
                    </div>
                    <p style="margin-bottom: 0.35rem;">${task.notes || 'Không có ghi chú thêm'}</p>
                    <div style="display: flex; gap: 0.75rem; font-size: 0.75rem; color: var(--neutral-500);">
                      <span class="priority-score-badge">Điểm ưu tiên P = ${priority.score}</span>
                      <span>⏱️ ${task.estimatedMinutes} phút</span>
                      <span style="color: ${risk.color}; font-weight: 600;">${risk.text}</span>
                    </div>
                  </div>
                  <div>
                    ${task.status !== 'completed' ? `
                      <button class="btn btn-sm btn-primary btn-checkout-task" data-id="${task.id}">Check-out</button>
                    ` : `
                      <span style="color: #059669; font-weight: 700; font-size: 0.85rem;">✓ Đã xong</span>
                    `}
                  </div>
                </div>
              `;
            }).join('')}

            <!-- Recommended Break Session -->
            <div class="timeline-item break">
              <div class="timeline-time">20:30 - 20:45</div>
              <div class="timeline-body">
                <h4>🌿 Khoảng Nghỉ Giải Lao Thông Minh (Rest Interval)</h4>
                <p>Uống nước, thư giãn mắt 20-20-20, vươn vai nhẹ nhàng. Không lướt mạng xã hội.</p>
              </div>
              <span class="badge badge-completed">Được bảo vệ 🛡️</span>
            </div>
          </div>
        </div>

        <!-- Right: Pomodoro Rest Shield & Quick Knowledge Reminder -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="card pomodoro-box">
            <div class="card-title" style="justify-content: center;">🍅 Phiên Tập Trung & Nghỉ Ngơi</div>
            <p style="font-size: 0.8rem; color: var(--neutral-600); margin-top: 0.25rem;">
              Âm thanh chuông thư giãn 528Hz bảo vệ mắt & chống mỏi
            </p>

            <div class="timer-circle">
              <div class="timer-time" id="pomodoro-display">25:00</div>
              <div class="timer-label" id="pomodoro-label">Tập Trung Học</div>
            </div>

            <div style="display: flex; gap: 0.5rem; justify-content: center;">
              <button class="btn btn-primary" id="btn-pomodoro-toggle">Bắt đầu</button>
              <button class="btn btn-secondary" id="btn-pomodoro-reset">Đặt lại</button>
              <button class="btn btn-outline-primary btn-sm" id="btn-test-chime" title="Thử chuông thiền">🔔</button>
            </div>
          </div>

          <!-- Knowledge Gap Reminder Widget -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">🧠 Cần Ôn Tập Hôm Nay</div>
              <a href="#" class="btn btn-sm btn-outline-primary" id="btn-go-knowledge">Xem tất cả</a>
            </div>
            <p style="font-size: 0.82rem; color: var(--neutral-600); margin-bottom: 0.75rem;">
              Áp dụng Spaced Repetition (Ôn tập ngắt quãng) trước khi kiến thức bị phai mờ:
            </p>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${store.data.knowledgeGaps.slice(0, 2).map(gap => `
                <div style="padding: 0.65rem; background: var(--neutral-50); border-radius: var(--radius-md); border-left: 3px solid var(--primary-500);">
                  <div style="font-size: 0.82rem; font-weight: 600;">[${gap.subject}] ${gap.topic}</div>
                  <div style="font-size: 0.75rem; color: var(--neutral-500);">${gap.notes}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindDashboardEvents() {
    document.getElementById('btn-quick-checkin')?.addEventListener('click', () => {
      this.switchTab('check-in');
    });

    document.getElementById('btn-view-feasibility')?.addEventListener('click', () => {
      this.switchTab('schedule');
    });

    document.getElementById('btn-view-calendar')?.addEventListener('click', () => {
      this.switchTab('calendar');
    });

    document.getElementById('btn-go-knowledge')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchTab('knowledge');
    });

    document.querySelectorAll('.btn-checkout-task').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-id');
        this.openCheckOutModal(taskId);
      });
    });

    document.getElementById('btn-add-quick-task')?.addEventListener('click', () => {
      this.openAddTaskModal();
    });

    document.getElementById('btn-test-chime')?.addEventListener('click', () => {
      this.playChime('bell');
      this.showToast('🔔 Chuông thiền 528Hz đã phát!');
    });

    // Pomodoro Timer events
    const toggleBtn = document.getElementById('btn-pomodoro-toggle');
    const resetBtn = document.getElementById('btn-pomodoro-reset');

    toggleBtn?.addEventListener('click', () => {
      if (this.pomodoroRunning) {
        clearInterval(this.pomodoroTimerInterval);
        this.pomodoroRunning = false;
        toggleBtn.innerText = 'Tiếp tục';
      } else {
        this.pomodoroRunning = true;
        toggleBtn.innerText = 'Tạm dừng';
        this.playChime('bell');
        this.pomodoroTimerInterval = setInterval(() => {
          if (this.pomodoroTimeRemaining > 0) {
            this.pomodoroTimeRemaining--;
            this.updatePomodoroDisplay();
          } else {
            clearInterval(this.pomodoroTimerInterval);
            this.pomodoroRunning = false;
            this.playChime('alert');
            
            if (this.pomodoroMode === 'work') {
              this.pomodoroMode = 'break';
              this.pomodoroTimeRemaining = 5 * 60;
              this.showToast('🔔 Hết phiên học! Hãy đứng dậy uống nước và nghỉ ngơi 5 phút.');
            } else {
              this.pomodoroMode = 'work';
              this.pomodoroTimeRemaining = 25 * 60;
              this.showToast('✨ Hết giờ nghỉ! Sẵn sàng cho phiên học tiếp theo.');
            }
            toggleBtn.innerText = 'Bắt đầu';
            this.updatePomodoroDisplay();
          }
        }, 1000);
      }
    });

    resetBtn?.addEventListener('click', () => {
      clearInterval(this.pomodoroTimerInterval);
      this.pomodoroRunning = false;
      this.pomodoroMode = 'work';
      this.pomodoroTimeRemaining = 25 * 60;
      if (toggleBtn) toggleBtn.innerText = 'Bắt đầu';
      this.updatePomodoroDisplay();
    });
  },

  updatePomodoroDisplay() {
    const display = document.getElementById('pomodoro-display');
    const label = document.getElementById('pomodoro-label');
    if (!display) return;

    const m = Math.floor(this.pomodoroTimeRemaining / 60);
    const s = this.pomodoroTimeRemaining % 60;
    display.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    if (label) {
      label.innerText = this.pomodoroMode === 'work' ? 'Tập Trung Học' : 'Nghỉ Giải Lao 🌿';
    }
  },

  /* =========================================================================
     SCREEN 1.5: CALENDAR VIEW (WEEKLY TIME BLOCKS)
     ========================================================================= */
  renderCalendar() {
    const days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    const timeSlots = [
      '07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ];

    return `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">📅 Thời Khóa Biểu Học Tập & Khoảng Nghỉ (Weekly Calendar)</div>
            <div class="card-subtitle">
              Trực quan hóa khối thời gian học tập, khoảng nghỉ Pomodoro và khung giờ Sleep Shield được bảo vệ
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-sm btn-secondary" onclick="window.print()">🖨️ In lịch biểu</button>
            <button class="btn btn-sm btn-primary" id="btn-sync-calendar">Tối ưu lại lịch</button>
          </div>
        </div>

        <!-- Legend -->
        <div style="display: flex; gap: 1rem; font-size: 0.78rem; margin-bottom: 1rem; flex-wrap: wrap;">
          <span style="display: flex; align-items: center; gap: 0.35rem;">
            <span style="width: 12px; height: 12px; background: #10b981; border-radius: 2px;"></span> Phiên học tập trung
          </span>
          <span style="display: flex; align-items: center; gap: 0.35rem;">
            <span style="width: 12px; height: 12px; background: #0284c7; border-radius: 2px;"></span> Nghỉ ngơi Pomodoro
          </span>
          <span style="display: flex; align-items: center; gap: 0.35rem;">
            <span style="width: 12px; height: 12px; background: #64748b; border-radius: 2px;"></span> Sleep Shield (Giờ ngủ)
          </span>
        </div>

        <div class="calendar-time-grid">
          <div class="calendar-header-cell">Giờ</div>
          ${days.map(d => `<div class="calendar-header-cell">${d}</div>`).join('')}

          <!-- 07:00 -->
          <div class="calendar-time-col">07:00</div>
          ${days.map((d, i) => `
            <div class="calendar-cell">
              <div class="timeblock-event timeblock-study">Lớp học trên trường</div>
            </div>
          `).join('')}

          <!-- 13:00 -->
          <div class="calendar-time-col">13:00</div>
          ${days.map((d, i) => `
            <div class="calendar-cell">
              ${i % 2 === 0 ? '<div class="timeblock-event timeblock-break">Nghỉ trưa & Nạp năng lượng</div>' : '<div class="timeblock-event timeblock-study">Tự học thư viện</div>'}
            </div>
          `).join('')}

          <!-- 19:00 -->
          <div class="calendar-time-col">19:00</div>
          ${days.map((d, i) => `
            <div class="calendar-cell">
              ${i === 0 ? '<div class="timeblock-event timeblock-study">Toán: Tích phân diện tích</div>' : (i === 1 ? '<div class="timeblock-event timeblock-study">Tiếng Anh: Reading 2</div>' : '<div class="timeblock-event timeblock-study">Vật lý: Định luật Cu-lông</div>')}
            </div>
          `).join('')}

          <!-- 20:30 -->
          <div class="calendar-time-col">20:30</div>
          ${days.map((d, i) => `
            <div class="calendar-cell">
              <div class="timeblock-event timeblock-break">Nghỉ 15p (Rest Shield)</div>
            </div>
          `).join('')}

          <!-- 21:00 -->
          <div class="calendar-time-col">21:00</div>
          ${days.map((d, i) => `
            <div class="calendar-cell">
              <div class="timeblock-event timeblock-study">Active Recall ôn tập</div>
            </div>
          `).join('')}

          <!-- 23:00 -->
          <div class="calendar-time-col">23:00</div>
          ${days.map(() => `
            <div class="calendar-cell">
              <div class="timeblock-event timeblock-sleep">🛡️ Sleep Shield (Đi ngủ)</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  bindCalendarEvents() {
    document.getElementById('btn-sync-calendar')?.addEventListener('click', () => {
      this.playChime('bell');
      this.showToast('✅ Đã đồng bộ và phân bổ lại thời khóa biểu thông minh!');
    });
  },

  /* =========================================================================
     SCREEN 2: CHỨC NĂNG 1 - CHECK-IN ĐẦU NGÀY
     ========================================================================= */
  renderCheckIn() {
    const checkIn = store.data.todayCheckIn || {};
    return `
      <div class="companion-chat-box">
        <div class="chat-bubble">
          <div class="chat-avatar">🌱</div>
          <div class="chat-bubble-content">
            <h4 style="font-weight: 700; color: var(--primary-800); margin-bottom: 0.25rem;">
              Chào Minh Khoa! Hôm nay bạn cảm thấy thế nào?
            </h4>
            <p>
              EcoStudy ở đây để lắng nghe và giúp bạn có một ngày học tập hiệu quả, không bị quá tải. 
              Hãy chia sẻ nhanh về giấc ngủ và mức năng lượng hiện tại nhé.
            </p>
          </div>
        </div>

        <div class="card" style="margin-top: 1rem;">
          <form id="form-checkin">
            <div class="form-group">
              <label class="form-label">Tối qua bạn ngủ được khoảng bao nhiêu tiếng?</label>
              <div class="quick-pick-chips" id="chips-sleep">
                ${[5, 6, 6.5, 7, 7.5, 8, 9].map(h => `
                  <button type="button" class="quick-chip ${(checkIn.sleepHours || 7) === h ? 'selected' : ''}" data-val="${h}">
                    ${h} tiếng
                  </button>
                `).join('')}
              </div>
              <input type="hidden" id="checkin-sleep" value="${checkIn.sleepHours || 7}">
            </div>

            <div class="form-group">
              <label class="form-label">Mức độ tỉnh táo hiện tại của bạn? (1: Rất buồn ngủ, 10: Tràn đầy năng lượng)</label>
              <div style="display: flex; align-items: center; gap: 1rem;">
                <input type="range" class="form-control" id="checkin-alertness" min="1" max="10" value="${checkIn.alertness || 7}">
                <span id="alertness-val" style="font-weight: 700; font-size: 1.1rem; color: var(--primary-700); min-width: 30px;">
                  ${checkIn.alertness || 7}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Bạn có đang cảm thấy áp lực bài tập/kỳ thi không?</label>
              <div class="quick-pick-chips" id="chips-stress">
                <button type="button" class="quick-chip ${(checkIn.stressLevel || 4) <= 3 ? 'selected' : ''}" data-val="2">Thư thái, nhẹ nhàng 😊</button>
                <button type="button" class="quick-chip ${(checkIn.stressLevel || 4) > 3 && (checkIn.stressLevel || 4) <= 6 ? 'selected' : ''}" data-val="5">Áp lực vừa phải 📝</button>
                <button type="button" class="quick-chip ${(checkIn.stressLevel || 4) > 6 ? 'selected' : ''}" data-val="8">Khá căng thẳng / Lo lắng 😰</button>
              </div>
              <input type="hidden" id="checkin-stress" value="${checkIn.stressLevel || 4}">
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Tổng thời gian có thể dành cho việc học tối nay</label>
                <select class="form-control" id="checkin-available">
                  <option value="120" ${checkIn.availableMinutes === 120 ? 'selected' : ''}>2 tiếng (120 phút)</option>
                  <option value="180" ${checkIn.availableMinutes === 180 ? 'selected' : ''}>3 tiếng (180 phút)</option>
                  <option value="210" ${checkIn.availableMinutes === 210 ? 'selected' : ''}>3.5 tiếng (210 phút)</option>
                  <option value="240" ${checkIn.availableMinutes === 240 ? 'selected' : ''}>4 tiếng (240 phút)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Thời gian bắt đầu học dự kiến</label>
                <input type="time" class="form-control" id="checkin-starttime" value="${checkIn.studyStartTime || '19:00'}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Khoảng thời gian muốn dành riêng cho bản thân / hoạt động cố định</label>
              <input type="text" class="form-control" id="checkin-fixed" 
                value="${checkIn.fixedActivities || 'Ăn tối (18h30-19h), giải trí nghe nhạc (21h30-22h)'}" 
                placeholder="VD: Tập thể thao 45 phút, ăn cơm cùng gia đình...">
            </div>

            <div class="form-group">
              <label class="form-label">Tâm trạng hoặc ghi chú thêm cho AI</label>
              <textarea class="form-control" id="checkin-notes" rows="2" 
                placeholder="Hôm nay mình muốn tập trung ôn Toán, tránh để bị trễ bài...">${checkIn.userNotes || ''}</textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
              <button type="submit" class="btn btn-primary btn-lg">🌱 Xác Nhận Check-In & Tối Ưu Lịch</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  bindCheckInEvents() {
    document.querySelectorAll('#chips-sleep .quick-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#chips-sleep .quick-chip').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        document.getElementById('checkin-sleep').value = btn.getAttribute('data-val');
      });
    });

    document.querySelectorAll('#chips-stress .quick-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#chips-stress .quick-chip').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        document.getElementById('checkin-stress').value = btn.getAttribute('data-val');
      });
    });

    const rangeAlert = document.getElementById('checkin-alertness');
    const valAlert = document.getElementById('alertness-val');
    rangeAlert?.addEventListener('input', () => {
      if (valAlert) valAlert.innerText = rangeAlert.value;
    });

    document.getElementById('form-checkin')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const sleepHours = parseFloat(document.getElementById('checkin-sleep').value);
      const alertness = parseInt(document.getElementById('checkin-alertness').value);
      const stressLevel = parseInt(document.getElementById('checkin-stress').value);
      const availableMinutes = parseInt(document.getElementById('checkin-available').value);
      const studyStartTime = document.getElementById('checkin-starttime').value;
      const fixedActivities = document.getElementById('checkin-fixed').value;
      const userNotes = document.getElementById('checkin-notes').value;

      store.saveCheckIn({
        sleepHours,
        alertness,
        stressLevel,
        availableMinutes,
        studyStartTime,
        fixedActivities,
        userNotes
      });

      this.playChime('bell');
      this.showToast('✅ Check-in thành công! AI đã phân tích tính khả thi và lập lịch.');
      this.switchTab('schedule');
    });
  },

  /* =========================================================================
     SCREEN 3: CHỨC NĂNG 2 & 9 - PHÂN TÍCH TÍNH KHẢ THI & LẬP LỊCH
     ========================================================================= */
  renderSchedulePlanner() {
    const { tasks, todayCheckIn } = store.data;
    const fatigue = EcoAlgorithms.assessFatigueLevel({
      sleepHours: todayCheckIn.sleepHours || 7,
      alertness: todayCheckIn.alertness || 7,
      stressLevel: todayCheckIn.stressLevel || 4
    });

    const feasibility = EcoAlgorithms.assessFeasibility(
      tasks,
      todayCheckIn.availableMinutes || 180,
      0,
      fatigue.level
    );

    return `
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">⚖️ Phân Tích Tính Khả Thi Của Kế Hoạch (Feasibility Engine)</div>
            <div class="card-subtitle">AI cam kết: Tuyệt đối không nhồi nhét, bảo vệ giờ ngủ của học sinh</div>
          </div>
          <span class="badge ${feasibility.isFeasible ? 'badge-completed' : 'badge-blocked'}" style="font-size: 0.85rem; padding: 0.4rem 0.8rem;">
            ${feasibility.isFeasible ? '✓ Kế hoạch Khả Thi' : '⚠️ Cảnh Báo Quá Tải'}
          </span>
        </div>

        <div class="grid-3" style="margin-bottom: 1rem;">
          <div style="background: var(--neutral-50); padding: 1rem; border-radius: var(--radius-md);">
            <div style="font-size: 0.8rem; color: var(--neutral-500);">Tổng thời gian nhiệm vụ</div>
            <div style="font-size: 1.3rem; font-weight: 700; color: var(--neutral-900);">${feasibility.totalTaskMinutes} phút</div>
          </div>
          <div style="background: var(--neutral-50); padding: 1rem; border-radius: var(--radius-md);">
            <div style="font-size: 0.8rem; color: var(--neutral-500);">Thời gian nghỉ Pomodoro dự kiến</div>
            <div style="font-size: 1.3rem; font-weight: 700; color: #0284c7;">+ ${feasibility.totalBreakMinutes} phút</div>
          </div>
          <div style="background: var(--neutral-50); padding: 1rem; border-radius: var(--radius-md);">
            <div style="font-size: 0.8rem; color: var(--neutral-500);">Quỹ thời gian thực tế khả dụng</div>
            <div style="font-size: 1.3rem; font-weight: 700; color: #059669;">${feasibility.availableMinutes} phút</div>
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.35rem;">
            <span>Tỷ lệ lấp đầy quỹ thời gian: <strong>${feasibility.loadPercentage}%</strong></span>
            <span>Ngưỡng an toàn tối đa: 85%</span>
          </div>
          <div style="width: 100%; height: 10px; background: var(--neutral-200); border-radius: 9999px; overflow: hidden;">
            <div style="width: ${Math.min(100, feasibility.loadPercentage)}%; height: 100%; background: ${feasibility.loadPercentage > 100 ? '#ef4444' : (feasibility.loadPercentage > 85 ? '#f59e0b' : '#10b981')}; transition: width 0.3s ease;"></div>
          </div>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 1rem;">
          <strong style="color: #047857; font-size: 0.85rem;">Lời khuyên từ AI Scheduler:</strong>
          <ul style="margin-top: 0.35rem; padding-left: 1.25rem; font-size: 0.85rem; color: #065f46;">
            ${feasibility.recommendations.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🧮 Phân Bổ Mức Độ Ưu Tiên Theo Công Thức Khoa Học</div>
            <div class="card-subtitle">Công thức: P = 0.30D + 0.25I + 0.20W + 0.15L + 0.10R (Có giải thích lý do cho từng môn)</div>
          </div>
          <button class="btn btn-sm btn-primary" id="btn-confirm-all-schedule">Xác nhận lịch đề xuất</button>
        </div>

        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nhiệm vụ</th>
                <th>Môn</th>
                <th>Deadline</th>
                <th>Phân loại</th>
                <th>Điểm P</th>
                <th>Thời lượng</th>
                <th>Giải thích lý do ưu tiên của AI</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              ${tasks.map(task => {
                const prio = EcoAlgorithms.calculatePriorityScore(task);
                return `
                  <tr>
                    <td><strong>${task.title}</strong></td>
                    <td>${task.subject}</td>
                    <td>${task.deadline}</td>
                    <td>
                      <span class="deadline-pill ${task.deadlineType === 'hard' ? 'deadline-hard' : 'deadline-soft'}">
                        ${task.deadlineType === 'hard' ? 'Deadline Cứng' : 'Deadline Mềm'}
                      </span>
                    </td>
                    <td><span class="priority-score-badge">${prio.score}</span></td>
                    <td>${task.estimatedMinutes}p</td>
                    <td style="font-size: 0.78rem; color: var(--neutral-600); max-width: 320px;">
                      ${prio.reasoning}
                    </td>
                    <td>
                      <button class="btn btn-sm btn-secondary btn-decompose-trigger" data-id="${task.id}" title="Chia nhỏ nhiệm vụ">
                        🧩 Chia nhỏ
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  bindScheduleEvents() {
    document.getElementById('btn-confirm-all-schedule')?.addEventListener('click', () => {
      this.playChime('bell');
      this.showToast('🎉 Đã xác nhận lịch học tối ưu! AI sẽ đồng hành và nhắc nhở đúng giờ.');
    });

    document.querySelectorAll('.btn-decompose-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-id');
        this.openDecomposeModal(taskId);
      });
    });
  },

  /* =========================================================================
     SCREEN 4: CHỨC NĂNG 3 - QUẢN LÝ NHIỆM VỤ & CHIA NHỎ THÔNG MINH
     ========================================================================= */
  renderTasks() {
    const { tasks } = store.data;
    return `
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">📋 Danh Sách Nhiệm Vụ Học Tập</div>
            <div class="card-subtitle">Hỗ trợ 10 trạng thái quản lý & AI Task Decomposition</div>
          </div>
          <button class="btn btn-primary" id="btn-open-add-task">+ Thêm nhiệm vụ mới</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${tasks.map(task => {
            const prio = EcoAlgorithms.calculatePriorityScore(task);
            return `
              <div style="border: 1px solid var(--neutral-200); border-radius: var(--radius-md); padding: 1.25rem; background: white;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                  <div>
                    <h4 style="font-size: 1rem; font-weight: 700; color: var(--neutral-900); margin-bottom: 0.25rem;">
                      ${task.title}
                    </h4>
                    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                      <span class="badge badge-${task.status.replace('_', '')}">${this.getStatusText(task.status)}</span>
                      <span class="deadline-pill ${task.deadlineType === 'hard' ? 'deadline-hard' : 'deadline-soft'}">
                        ${task.deadlineType === 'hard' ? 'Deadline Cứng' : 'Deadline Mềm'}
                      </span>
                      <span style="font-size: 0.75rem; color: var(--neutral-500);">Hạn: ${task.deadline}</span>
                      <span class="priority-score-badge">Ưu tiên: ${prio.score}</span>
                      <span style="font-size: 0.75rem; color: var(--neutral-600);">⏱️ ${task.estimatedMinutes} phút</span>
                    </div>
                  </div>
                  <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-sm btn-outline-primary btn-decompose-trigger" data-id="${task.id}">
                      🧩 AI Chia nhỏ (${task.subtasks ? task.subtasks.length : 0})
                    </button>
                    <button class="btn btn-sm btn-danger btn-delete-task" data-id="${task.id}">Xóa</button>
                  </div>
                </div>

                ${task.subtasks && task.subtasks.length > 0 ? `
                  <div style="margin-top: 0.75rem; padding: 0.75rem; background: var(--neutral-50); border-radius: var(--radius-sm);">
                    <div style="font-size: 0.78rem; font-weight: 700; color: var(--neutral-700); margin-bottom: 0.5rem;">
                      CÁC BƯỚC THỰC HIỆN ĐÃ CHIA NHỎ (SUBTASKS):
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                      ${task.subtasks.map(st => `
                        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; background: white; padding: 0.4rem 0.6rem; border-radius: 4px; border: 1px solid var(--neutral-200);">
                          <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" class="subtask-checkbox" data-taskid="${task.id}" data-subid="${st.id}" ${st.completed ? 'checked' : ''}>
                            <span style="${st.completed ? 'text-decoration: line-through; color: var(--neutral-400);' : ''}">${st.title}</span>
                          </div>
                          <div style="display: flex; gap: 0.75rem; font-size: 0.72rem; color: var(--neutral-500);">
                            <span>⏱️ ${st.duration}p</span>
                            <span style="color: var(--primary-700);">Tiêu chí: ${st.criteria || 'Hoàn thành'}</span>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  bindTasksEvents() {
    document.getElementById('btn-open-add-task')?.addEventListener('click', () => {
      this.openAddTaskModal();
    });

    document.querySelectorAll('.btn-decompose-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-id');
        this.openDecomposeModal(taskId);
      });
    });

    document.querySelectorAll('.btn-delete-task').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-id');
        if (confirm('Bạn có chắc muốn xóa nhiệm vụ này không?')) {
          store.deleteTask(taskId);
          this.showToast('Đã xóa nhiệm vụ.');
        }
      });
    });

    document.querySelectorAll('.subtask-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const taskId = cb.getAttribute('data-taskid');
        const subId = cb.getAttribute('data-subid');
        const task = store.data.tasks.find(t => t.id === taskId);
        if (task && task.subtasks) {
          const sub = task.subtasks.find(s => s.id === subId);
          if (sub) {
            sub.completed = cb.checked;
            store.save();
            this.playChime('bell');
            this.showToast(cb.checked ? 'Đã hoàn thành bước nhỏ!' : 'Đã bỏ đánh dấu bước nhỏ');
          }
        }
      });
    });
  },

  /* =========================================================================
     SCREEN 5: CHỨC NĂNG 6 - QUẢN LÝ NHIỆM VỤ TỒN ĐỌNG (BACKLOG ENGINE)
     ========================================================================= */
  renderBacklog() {
    const backlogTasks = store.data.tasks.filter(t => t.status === 'needs_support' || t.status === 'blocked' || t.rescheduleCount > 0);
    return `
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">🔄 Xử Lý Nhiệm Vụ Tồn Đọng Thông Minh</div>
            <div class="card-subtitle">Không chuyển nhiệm vụ sang ngày tiếp theo một cách máy móc; tìm nguyên nhân thực tế</div>
          </div>
        </div>

        <div class="ai-banner">
          <div class="ai-banner-icon">💡</div>
          <div class="ai-banner-content">
            <h4>Cơ chế chống tồn đọng của EcoStudy</h4>
            <p>
              Nếu một nhiệm vụ bị dời nhiều lần, AI không dồn đống sang ngày mai để tránh gây hoảng loạn. 
              Hệ thống sẽ cùng bạn phân tích nguyên nhân (do bài khó, thiếu kiến thức nền, hay mất tập trung) và đưa ra giải pháp xử lý triệt để.
            </p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${backlogTasks.length === 0 ? `
            <div style="text-align: center; padding: 2rem; color: var(--neutral-500);">
              🎉 Tuyệt vời! Bạn không có nhiệm vụ nào bị tồn đọng hoặc dời lịch.
            </div>
          ` : backlogTasks.map(task => `
            <div style="border: 1px solid #fecaca; background: #fffaf0; border-radius: var(--radius-md); padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                  <h4 style="font-weight: 700; color: #9a3412;">${task.title}</h4>
                  <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem; font-size: 0.78rem;">
                    <span class="badge badge-needssupport">Cần hỗ trợ</span>
                    <span style="color: #c2410c;">Đã dời ${task.rescheduleCount || 1} lần</span>
                  </div>
                </div>
                <button class="btn btn-sm btn-primary btn-resolve-backlog" data-id="${task.id}">
                  Phân tích nguyên nhân & Xử lý
                </button>
              </div>

              <div style="font-size: 0.85rem; color: var(--neutral-700); background: white; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--neutral-200);">
                <strong>Ghi chú trở ngại:</strong> ${task.notes || 'Chưa ghi rõ nguyên nhân'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  bindBacklogEvents() {
    document.querySelectorAll('.btn-resolve-backlog').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-id');
        this.openResolveBacklogModal(taskId);
      });
    });
  },

  /* =========================================================================
     SCREEN 6: CHỨC NĂNG 7 - CHECK-OUT SAU NHIỆM VỤ
     ========================================================================= */
  renderCheckOut() {
    const uncompletedTasks = store.data.tasks.filter(t => t.status !== 'completed');
    return `
      <div class="card" style="max-width: 800px; margin: 0 auto;">
        <div class="card-header">
          <div>
            <div class="card-title">✅ Check-out & Cập Nhật Sau Mỗi Nhiệm Vụ</div>
            <div class="card-subtitle">Đối chiếu thời gian thực tế, phát hiện lỗ hổng kiến thức để hoàn thiện vòng lặp học tập</div>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--neutral-600); margin-bottom: 1.25rem;">
          Chọn nhiệm vụ bạn vừa học xong để cập nhật kết quả:
        </p>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${uncompletedTasks.map(task => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: white;">
              <div>
                <h4 style="font-weight: 600; font-size: 0.95rem;">${task.title}</h4>
                <div style="font-size: 0.75rem; color: var(--neutral-500);">Thời lượng dự kiến: ${task.estimatedMinutes} phút</div>
              </div>
              <button class="btn btn-primary btn-checkout-trigger" data-id="${task.id}">
                Cập nhật kết quả
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  bindCheckOutEvents() {
    document.querySelectorAll('.btn-checkout-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-id');
        this.openCheckOutModal(taskId);
      });
    });
  },

  /* =========================================================================
     SCREEN 7: CHỨC NĂNG 4 - KHO KIẾN THỨC & ÔN TẬP NGẮT QUÃNG
     ========================================================================= */
  renderKnowledgeReview() {
    const { knowledgeGaps, flashcards } = store.data;
    return `
      <div class="grid-main-side">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">🃏 Thẻ Nhớ Ôn Tập (Active Recall & Spaced Repetition)</div>
              <div class="card-subtitle">Nhấn vào thẻ để lật mặt đáp án. Đánh giá mức độ ghi nhớ từ 1 đến 5 để AI tính ngày ôn tiếp theo.</div>
            </div>
          </div>

          ${flashcards.map(fc => `
            <div class="flashcard" onclick="this.classList.toggle('flipped')">
              <div class="flashcard-inner">
                <div class="flashcard-front">
                  <span class="badge badge-scheduled" style="margin-bottom: 0.75rem;">${fc.subject}</span>
                  <h3 style="font-size: 1.05rem; font-weight: 600; color: var(--neutral-800);">${fc.question}</h3>
                  <span style="font-size: 0.75rem; color: var(--neutral-400); margin-top: 1rem;">(Nhấn vào đây để xem đáp án)</span>
                </div>
                <div class="flashcard-back">
                  <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--primary-200); margin-bottom: 0.5rem;">Đáp Án & Bản Chất</span>
                  <p style="font-size: 0.95rem; line-height: 1.5;">${fc.answer}</p>
                  <span style="font-size: 0.75rem; color: var(--primary-300); margin-top: 1rem;">(Nhấn để lật lại)</span>
                </div>
              </div>
            </div>

            <div style="background: var(--neutral-50); padding: 0.75rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
              <div style="font-size: 0.78rem; font-weight: 700; color: var(--neutral-600); margin-bottom: 0.5rem; text-align: center;">
                ĐÁNH GIÁ MỨC ĐỘ GHI NHỚ:
              </div>
              <div style="display: flex; gap: 0.35rem; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-sm btn-secondary btn-rate-memory" data-id="${fc.id}" data-level="1">1: Không nhớ (Mai ôn)</button>
                <button class="btn btn-sm btn-secondary btn-rate-memory" data-id="${fc.id}" data-level="2">2: Chưa chắc (2 ngày)</button>
                <button class="btn btn-sm btn-secondary btn-rate-memory" data-id="${fc.id}" data-level="3">3: Cần gợi ý (4 ngày)</button>
                <button class="btn btn-sm btn-outline-primary btn-rate-memory" data-id="${fc.id}" data-level="4">4: Tự giải thích (7 ngày)</button>
                <button class="btn btn-sm btn-primary btn-rate-memory" data-id="${fc.id}" data-level="5">5: Vận dụng tốt (14 ngày)</button>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">🎯 Knowledge Gap Tracking</div>
              <div class="card-subtitle">Lưu lại lỗi sai & lỗ hổng kiến thức</div>
            </div>
            <button class="btn btn-sm btn-outline-primary" id="btn-add-gap">+ Thêm</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${knowledgeGaps.map(gap => `
              <div style="padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--neutral-200); background: white;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
                  <strong style="font-size: 0.85rem; color: var(--neutral-900);">[${gap.subject}] ${gap.topic}</strong>
                  <span class="badge ${gap.memoryLevel <= 2 ? 'badge-blocked' : 'badge-completed'}">Cấp độ ${gap.memoryLevel}/5</span>
                </div>
                <p style="font-size: 0.78rem; color: var(--neutral-600); margin-bottom: 0.35rem;">${gap.notes}</p>
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--neutral-500);">
                  <span>Lặp lại lỗi: ${gap.errorFrequency} lần</span>
                  <span>Ôn lại: <strong>${gap.nextReviewDate}</strong></span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  bindKnowledgeEvents() {
    document.querySelectorAll('.btn-rate-memory').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const level = parseInt(btn.getAttribute('data-level'));
        const review = EcoAlgorithms.calculateNextReview(level);
        this.playChime('bell');
        this.showToast(`✨ Đã ghi nhận! ${review.description}`);
      });
    });

    document.getElementById('btn-add-gap')?.addEventListener('click', () => {
      const topic = prompt('Nhập kiến thức bạn đang còn yếu hoặc dễ nhầm lẫn:');
      if (topic) {
        const subject = prompt('Môn học (Toán, Lý, Hóa, Tiếng Anh, Văn...):', 'Toán');
        const notes = prompt('Ghi chú chi tiết lỗi sai thường gặp:');
        store.addKnowledgeGap({
          subject: subject || 'Khác',
          topic,
          notes: notes || '',
          nextReviewDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
        });
        this.showToast('Đã thêm vào Knowledge Gap Tracking!');
      }
    });
  },

  /* =========================================================================
     SCREEN 8: CHỨC NĂNG 8 - BÁO CÁO TIẾN ĐỘ HÀNG TUẦN (WITH CANVAS CHARTS)
     ========================================================================= */
  renderWeeklyReport() {
    const { weeklyStats } = store.data;
    return `
      <div class="grid-4" style="margin-bottom: 1.5rem;">
        <div class="stat-widget">
          <div class="stat-icon green">📊</div>
          <div class="stat-content">
            <h3>${weeklyStats.completionRate}%</h3>
            <p>Task Completion Rate</p>
          </div>
        </div>
        <div class="stat-widget">
          <div class="stat-icon blue">⏱️</div>
          <div class="stat-content">
            <h3>${weeklyStats.onTimeRate}%</h3>
            <p>On-Time Completion Rate</p>
          </div>
        </div>
        <div class="stat-widget">
          <div class="stat-icon amber">💤</div>
          <div class="stat-content">
            <h3>${weeklyStats.sleepAverageHours}h</h3>
            <p>Thời gian ngủ trung bình</p>
          </div>
        </div>
        <div class="stat-widget">
          <div class="stat-icon rose">🛡️</div>
          <div class="stat-content">
            <h3>${weeklyStats.totalBreakMinutes} p</h3>
            <p>Tổng thời gian nghỉ ngơi</p>
          </div>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom: 1.5rem;">
        <!-- Canvas Chart 1: Daily Study Trend -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">📈 Xu Hướng Thời Gian Học Trong Tuần (Phút)</div>
          </div>
          <div class="chart-canvas-box">
            <canvas id="canvas-daily-trend" width="500" height="240"></canvas>
          </div>
        </div>

        <!-- Canvas Chart 2: Subject Breakdown -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">📚 Tỷ Trọng Thời Gian Theo Môn Học</div>
          </div>
          <div class="chart-canvas-box">
            <canvas id="canvas-subject-breakdown" width="500" height="240"></canvas>
          </div>
        </div>
      </div>

      <!-- AI Insights -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🤖 Đánh Giá & Đề Xuất Của AI Tuần Này</div>
          <button class="btn btn-sm btn-secondary" onclick="window.print()">🖨️ Xuất báo cáo PDF</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem; line-height: 1.5;">
          <div style="background: #f0fdf4; padding: 0.85rem; border-radius: var(--radius-md); border-left: 3px solid #10b981;">
            <strong style="color: #047857;">👍 Điểm làm tốt:</strong>
            <p style="color: #065f46; margin-top: 0.25rem;">
              Bạn duy trì giấc ngủ trung bình 7.1 tiếng/ngày, đạt chuẩn Sleep Shield. Tỷ lệ hoàn thành đúng hạn 91% là rất xuất sắc!
            </p>
          </div>
          <div style="background: #fffbeb; padding: 0.85rem; border-radius: var(--radius-md); border-left: 3px solid #f59e0b;">
            <strong style="color: #b45309;">⚠️ Điểm cần lưu ý:</strong>
            <p style="color: #92400e; margin-top: 0.25rem;">
              Môn Toán chiếm 37% tổng thời gian học, nhưng vẫn có 3 kiến thức nằm trong Knowledge Gap. Nên áp dụng Active Recall 15 phút mỗi sáng để củng cố.
            </p>
          </div>
          <div style="background: #f8fafc; padding: 0.85rem; border-radius: var(--radius-md); border-left: 3px solid var(--accent-blue);">
            <strong style="color: #0369a1;">🎯 Đề xuất cho tuần tới:</strong>
            <p style="color: #0f172a; margin-top: 0.25rem;">
              Giảm nhẹ 20 phút học buổi tối thứ Tư và tăng cường một phiên ôn tập tổng hợp môn Hóa vào chiều thứ Bảy.
            </p>
          </div>
        </div>
      </div>
    `;
  },

  bindWeeklyReportEvents() {
    // Draw Canvas Charts
    setTimeout(() => {
      this.drawDailyTrendChart();
      this.drawSubjectBreakdownChart();
    }, 50);
  },

  drawDailyTrendChart() {
    const canvas = document.getElementById('canvas-daily-trend');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const studyMins = [140, 160, 120, 180, 150, 190, 110];
    const maxVal = 220;

    // Grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = 30 + i * 40;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Draw Bars
    const barWidth = 32;
    const startX = 60;
    const spacing = (width - 100) / 7;

    studyMins.forEach((val, idx) => {
      const x = startX + idx * spacing;
      const barH = (val / maxVal) * 150;
      const y = height - 40 - barH;

      // Gradient Fill
      const grad = ctx.createLinearGradient(0, y, 0, height - 40);
      grad.addColorStop(0, '#10b981');
      grad.addColorStop(1, '#6ee7b7');
      ctx.fillStyle = grad;
      ctx.fillRect(x - barWidth / 2, y, barWidth, barH);

      // Label Value
      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(val + 'p', x, y - 6);

      // Label Day
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText(days[idx], x, height - 20);
    });
  },

  drawSubjectBreakdownChart() {
    const canvas = document.getElementById('canvas-subject-breakdown');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const data = [
      { subject: 'Toán', val: 360, color: '#10b981' },
      { subject: 'Tiếng Anh', val: 240, color: '#0284c7' },
      { subject: 'Vật lý', val: 210, color: '#f59e0b' },
      { subject: 'Hóa học', val: 170, color: '#8b5cf6' }
    ];

    const total = data.reduce((s, d) => s + d.val, 0);
    let startAngle = -Math.PI / 2;
    const centerX = 120;
    const centerY = height / 2;
    const radius = 70;

    // Draw Donut Pie
    data.forEach(item => {
      const sliceAngle = (item.val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, 38, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Draw Legend
    const legendX = 240;
    let legendY = 60;
    data.forEach(item => {
      const pct = Math.round((item.val / total) * 100);
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, legendY - 10, 14, 14);

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${item.subject}: ${item.val}p (${pct}%)`, legendX + 24, legendY + 2);
      legendY += 34;
    });
  },

  /* =========================================================================
     SCREEN 9: CHẾ ĐỘ HỌC LINH HOẠT
     ========================================================================= */
  renderModes() {
    const currentMode = store.data.currentMode;
    const modes = [
      { id: 'normal', name: 'Ngày bình thường', icon: '☀️', desc: 'Thực hiện lịch học tiêu chuẩn theo kế hoạch đề xuất.' },
      { id: 'low_energy', name: 'Ngày ít năng lượng', icon: '🌙', desc: 'Giảm 30% khối lượng, ưu tiên nhiệm vụ quan trọng, chia ngắn phiên học 20 phút.' },
      { id: 'rest_day', name: 'Ngày cần nghỉ ngơi', icon: '🌿', desc: 'Ưu tiên tối đa cho sức khỏe. Tạm hoãn mọi deadline mềm, không nhồi nhét.' },
      { id: 'exam_prep', name: 'Chế độ ôn thi cao điểm', icon: '🎯', desc: 'Tập trung cao độ vào kiến thức còn yếu trong Knowledge Gap, giải đề có bấm giờ.' }
    ];

    return `
      <div class="card" style="max-width: 800px; margin: 0 auto;">
        <div class="card-header">
          <div>
            <div class="card-title">🛡️ Chế Độ Học Tập Linh Hoạt & Bảo Vệ Nghỉ Ngơi</div>
            <div class="card-subtitle">AI điều chỉnh nhịp điệu phù hợp với thể trạng thực tế của bạn</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1rem;">
          ${modes.map(m => `
            <div class="mode-card ${currentMode === m.id ? 'active' : ''}" style="border: 2px solid ${currentMode === m.id ? 'var(--primary-500)' : 'var(--neutral-200)'}; background: ${currentMode === m.id ? 'var(--primary-50)' : 'white'}; border-radius: var(--radius-lg); padding: 1.25rem; cursor: pointer; transition: all 0.2s;" data-mode="${m.id}">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">${m.icon}</div>
              <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--neutral-900); margin-bottom: 0.25rem;">
                ${m.name}
              </h3>
              <p style="font-size: 0.82rem; color: var(--neutral-600); line-height: 1.45;">
                ${m.desc}
              </p>
              ${currentMode === m.id ? `
                <div style="margin-top: 0.75rem; font-size: 0.75rem; font-weight: 700; color: var(--primary-700);">
                  ✓ ĐANG KÍCH HOẠT
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  bindModesEvents() {
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.getAttribute('data-mode');
        store.setMode(mode);
        this.playChime('bell');
        this.showToast(`Đã chuyển sang chế độ: ${card.querySelector('h3').innerText}`);
      });
    });
  },

  /* =========================================================================
     SCREEN 10: NHẬT KÝ HỌC TẬP (REFLECTION)
     ========================================================================= */
  renderJournal() {
    const { journal } = store.data;
    return `
      <div class="grid-main-side">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">✍️ Nhật Ký Học Tập Cuối Ngày</div>
              <div class="card-subtitle">5 câu hỏi rèn luyện kỹ năng tự học và tự quản lý thời gian</div>
            </div>
          </div>

          <form id="form-journal">
            <div class="form-group">
              <label class="form-label">1. Hôm nay bạn học được điều gì mới hoặc cảm thấy tâm đắc?</label>
              <textarea class="form-control" id="j-learned" rows="2" placeholder="VD: Nắm được công thức đổi biến số tích phân..." required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">2. Phần nào khiến bạn gặp khó khăn nhất?</label>
              <textarea class="form-control" id="j-diff" rows="2" placeholder="VD: Câu 5 đề Vật lý phần điện trường còn lúng túng..." required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">3. Điều gì khiến bạn bị mất tập trung trong buổi học?</label>
              <textarea class="form-control" id="j-dist" rows="2" placeholder="VD: Thông báo tin nhắn Facebook lúc 20h..." required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">4. Bạn đã quản lý thời gian tốt ở điểm nào hôm nay?</label>
              <textarea class="form-control" id="j-good" rows="2" placeholder="VD: Hoàn thành đúng giờ môn Toán mà không cần nhắc..." required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">5. Ngày mai bạn muốn cải thiện điều gì?</label>
              <textarea class="form-control" id="j-improve" rows="2" placeholder="VD: Dành 15 phút đầu giờ sáng ôn lại công thức..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">Lưu Nhật Ký Ngày Hôm Nay</button>
          </form>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">📖 Lịch Sử Suy Ngẫm</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${journal.map(jr => `
              <div style="padding: 1rem; border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-50);">
                <div style="font-size: 0.78rem; font-weight: 700; color: var(--primary-700); margin-bottom: 0.35rem;">
                  Ngày: ${jr.date}
                </div>
                <p style="font-size: 0.82rem; margin-bottom: 0.25rem;"><strong>Đã học:</strong> ${jr.learned}</p>
                <p style="font-size: 0.82rem; margin-bottom: 0.25rem;"><strong>Khó khăn:</strong> ${jr.difficulties}</p>
                <p style="font-size: 0.82rem; color: var(--neutral-600);"><strong>Mục tiêu mai:</strong> ${jr.improvementTomorrow}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  bindJournalEvents() {
    document.getElementById('form-journal')?.addEventListener('submit', (e) => {
      e.preventDefault();
      store.saveJournal({
        learned: document.getElementById('j-learned').value,
        difficulties: document.getElementById('j-diff').value,
        distractions: document.getElementById('j-dist').value,
        goodManagement: document.getElementById('j-good').value,
        improvementTomorrow: document.getElementById('j-improve').value
      });

      this.playChime('bell');
      this.showToast('🌟 Đã lưu nhật ký học tập thành công!');
      document.getElementById('form-journal').reset();
    });
  },

  /* =========================================================================
     SCREEN 11 & 12: CỔNG PHỤ HUYNH & NHÀ TRƯỜNG
     ========================================================================= */
  renderParentPortal() {
    const { weeklyStats } = store.data;
    return `
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header">
          <div>
            <div class="card-title">👨‍👩‍👦 Cổng Phụ Huynh – Đồng Hành Cùng Con</div>
            <div class="card-subtitle">Tuân thủ nghiêm ngặt nguyên tắc bảo vệ quyền riêng tư của học sinh</div>
          </div>
          <span class="badge badge-completed">Đã phân quyền an toàn 🛡️</span>
        </div>

        <div class="ai-banner">
          <div class="ai-banner-icon">🤝</div>
          <div class="ai-banner-content">
            <h4>Nguyên tắc chia sẻ thông tin với Phụ Huynh:</h4>
            <p>
              Phụ huynh được xem báo cáo tiến độ tổng quan, tỷ lệ hoàn thành nhiệm vụ và các đề xuất hỗ trợ. 
              <strong>Hệ thống không chia sẻ nhật ký riêng tư</strong> hoặc dữ liệu tự đánh giá mệt mỏi chi tiết để tạo không gian an toàn cho con.
            </p>
          </div>
        </div>

        <div class="grid-3" style="margin-bottom: 1.5rem;">
          <div class="stat-widget">
            <div class="stat-icon green">🎯</div>
            <div class="stat-content">
              <h3>${weeklyStats.completionRate}%</h3>
              <p>Tiến độ hoàn thành nhiệm vụ</p>
            </div>
          </div>
          <div class="stat-widget">
            <div class="stat-icon blue">💤</div>
            <div class="stat-content">
              <h3>${weeklyStats.sleepAverageHours} giờ/đêm</h3>
              <p>Mức độ duy trì giấc ngủ</p>
            </div>
          </div>
          <div class="stat-widget">
            <div class="stat-icon amber">🌱</div>
            <div class="stat-content">
              <h3>Tích Cực</h3>
              <p>Thói quen học tập tổng thể</p>
            </div>
          </div>
        </div>

        <div class="card" style="background: #f8fafc; border: 1px solid var(--neutral-200);">
          <div class="card-title" style="margin-bottom: 0.5rem;">💡 Đề Xuất Dành Cho Bố Mẹ Tuần Này:</div>
          <ul style="padding-left: 1.25rem; font-size: 0.88rem; line-height: 1.6; color: var(--neutral-700);">
            <li>Minh Khoa đang học tập rất chăm chỉ ở môn Toán và Tiếng Anh. Bố mẹ hãy khen ngợi sự nỗ lực của con thay vì chỉ nhìn vào điểm số.</li>
            <li>Con thường kết thúc phiên học lúc 22h30. Bố mẹ có thể chuẩn bị một ly sữa ấm hoặc hoa quả nhẹ để động viên con.</li>
            <li>Khuyến khích con duy trì việc đi ngủ trước 23h00 để đảm bảo tinh thần tỉnh táo cho ngày mai.</li>
          </ul>
        </div>
      </div>
    `;
  },

  renderSchoolPortal() {
    return `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🏫 Báo Cáo Giáo Dục Dành Cho Nhà Trường</div>
            <div class="card-subtitle">Hỗ trợ phát triển kỹ năng tự học & Quản lý thời gian học sinh</div>
          </div>
          <span class="badge badge-completed">Báo cáo ẩn danh & tổng hợp</span>
        </div>

        <div class="warning-banner">
          <div class="warning-banner-icon">⚖️</div>
          <div class="warning-banner-content">
            <h4>Nguyên tắc đạo đức & Bảo vệ học sinh:</h4>
            <p>
              Tuyệt đối không sử dụng EcoStudy để xếp hạng học sinh dựa trên mức độ mệt mỏi hoặc các dữ liệu tự đánh giá cá nhân. 
              Dữ liệu chỉ phục vụ mục đích giáo dục và phát hiện các khó khăn chung trong việc phân bổ thời gian.
            </p>
          </div>
        </div>

        <div class="grid-3" style="margin-bottom: 1.5rem;">
          <div class="stat-widget">
            <div class="stat-icon green">👥</div>
            <div class="stat-content">
              <h3>94%</h3>
              <p>Mức độ tham gia Check-in</p>
            </div>
          </div>
          <div class="stat-widget">
            <div class="stat-icon blue">📈</div>
            <div class="stat-content">
              <h3>88.5%</h3>
              <p>Schedule Adherence trung bình</p>
            </div>
          </div>
          <div class="stat-widget">
            <div class="stat-icon rose">🛡️</div>
            <div class="stat-content">
              <h3>100%</h3>
              <p>Tuân thủ Sleep Shield</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* =========================================================================
     SCREEN 13: CÀI ĐẶT & BẢO MẬT
     ========================================================================= */
  renderSettings() {
    const { settings } = store.data;
    return `
      <div class="card" style="max-width: 720px; margin: 0 auto;">
        <div class="card-header">
          <div>
            <div class="card-title">⚙️ Cài Đặt & Quyền Riêng Tư (Privacy Shield)</div>
            <div class="card-subtitle">Bảo vệ dữ liệu học sinh chưa thành niên theo pháp luật</div>
          </div>
        </div>

        <form id="form-settings">
          <div class="form-group">
            <label class="form-label">Giờ bắt đầu Sleep Shield (Không gửi thông báo & khuyến khích ngủ)</label>
            <input type="time" class="form-control" id="s-sleepstart" value="${settings.sleepStart || '23:00'}">
          </div>

          <div class="form-group">
            <label class="form-label">Giờ thức dậy</label>
            <input type="time" class="form-control" id="s-sleepend" value="${settings.sleepEnd || '06:30'}">
          </div>

          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" id="s-parentview" ${settings.allowParentView ? 'checked' : ''}>
              <span>Cho phép phụ huynh xem báo cáo tổng quan đã được chia sẻ</span>
            </label>
          </div>

          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" id="s-schoolview" ${settings.allowSchoolAggregates ? 'checked' : ''}>
              <span>Cho phép tổng hợp dữ liệu ẩn danh cho trường học</span>
            </label>
          </div>

          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" id="s-privatejournal" ${settings.sharePrivateJournal ? 'checked' : ''} disabled>
              <span>Bảo vệ nhật ký cá nhân (Mặc định không chia sẻ cho bất kỳ ai) 🔒</span>
            </label>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
            <button type="button" class="btn btn-danger" id="btn-reset-data">Đặt lại dữ liệu gốc</button>
            <button type="submit" class="btn btn-primary">Lưu Cài Đặt</button>
          </div>
        </form>
      </div>
    `;
  },

  bindSettingsEvents() {
    document.getElementById('form-settings')?.addEventListener('submit', (e) => {
      e.preventDefault();
      store.data.settings.sleepStart = document.getElementById('s-sleepstart').value;
      store.data.settings.sleepEnd = document.getElementById('s-sleepend').value;
      store.data.settings.allowParentView = document.getElementById('s-parentview').checked;
      store.data.settings.allowSchoolAggregates = document.getElementById('s-schoolview').checked;
      store.save();
      this.playChime('bell');
      this.showToast('✅ Đã lưu cài đặt bảo mật!');
    });

    document.getElementById('btn-reset-data')?.addEventListener('click', () => {
      if (confirm('Khôi phục toàn bộ dữ liệu mẫu ban đầu của EcoStudy?')) {
        store.resetAllData();
        this.showToast('Đã khôi phục dữ liệu ban đầu!');
        this.render();
      }
    });
  },

  /* =========================================================================
     MODALS
     ========================================================================= */
  openAddTaskModal() {
    const modalHtml = `
      <div class="modal-overlay active" id="modal-add-task">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Thêm Nhiệm Vụ Học Tập Mới</h3>
            <button class="modal-close-btn" onclick="document.getElementById('modal-add-task').remove()">×</button>
          </div>
          <form id="form-new-task">
            <div class="form-group">
              <label class="form-label">Tên bài học / nhiệm vụ</label>
              <input type="text" class="form-control" id="nt-title" placeholder="VD: Giải 10 câu hình không gian Oxyz..." required>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Môn học</label>
                <select class="form-control" id="nt-subject">
                  <option value="Toán">Toán</option>
                  <option value="Ngữ văn">Ngữ văn</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Vật lý">Vật lý</option>
                  <option value="Hóa học">Hóa học</option>
                  <option value="Sinh học">Sinh học</option>
                  <option value="Lịch sử">Lịch sử</option>
                  <option value="Địa lý">Địa lý</option>
                  <option value="Tin học">Tin học</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Deadline</label>
                <input type="date" class="form-control" id="nt-deadline" value="${new Date().toISOString().split('T')[0]}" required>
              </div>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Phân loại deadline</label>
                <select class="form-control" id="nt-deadlinetype">
                  <option value="hard">Deadline cứng (Không thể dời)</option>
                  <option value="soft" selected>Deadline mềm (Có thể linh hoạt)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Thời lượng dự kiến (phút)</label>
                <input type="number" class="form-control" id="nt-duration" value="45" min="15" step="5">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Độ khó & Khối lượng (1 - 10)</label>
              <input type="range" class="form-control" id="nt-diff" min="1" max="10" value="6">
            </div>
            <div class="form-group">
              <label class="form-label">Ghi chú thêm</label>
              <input type="text" class="form-control" id="nt-notes" placeholder="Mục tiêu hoặc bài tập trọng tâm">
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;">
              <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal-add-task').remove()">Hủy</button>
              <button type="submit" class="btn btn-primary">Lưu Nhiệm Vụ</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('form-new-task')?.addEventListener('submit', (e) => {
      e.preventDefault();
      store.addTask({
        title: document.getElementById('nt-title').value,
        subject: document.getElementById('nt-subject').value,
        deadline: document.getElementById('nt-deadline').value,
        deadlineType: document.getElementById('nt-deadlinetype').value,
        estimatedMinutes: parseInt(document.getElementById('nt-duration').value),
        difficultyWorkload: parseInt(document.getElementById('nt-diff').value),
        importance: 7,
        deadlineProximity: 6,
        lossConsequence: 6,
        prerequisiteRequirement: 7,
        notes: document.getElementById('nt-notes').value
      });

      document.getElementById('modal-add-task').remove();
      this.playChime('bell');
      this.showToast('✅ Đã thêm nhiệm vụ mới!');
      this.render();
    });
  },

  openDecomposeModal(taskId) {
    const task = store.data.tasks.find(t => t.id === taskId);
    if (!task) return;

    const modalHtml = `
      <div class="modal-overlay active" id="modal-decompose">
        <div class="modal-container">
          <div class="modal-header">
            <h3>🧩 AI Task Decomposition (Chia Nhỏ Nhiệm Vụ)</h3>
            <button class="modal-close-btn" onclick="document.getElementById('modal-decompose').remove()">×</button>
          </div>
          <div style="background: var(--neutral-50); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
            <strong>${task.title}</strong>
            <div style="font-size: 0.8rem; color: var(--neutral-600);">Môn: ${task.subject} | Thời lượng gốc: ${task.estimatedMinutes} phút</div>
          </div>
          <p style="font-size: 0.85rem; color: var(--neutral-600); margin-bottom: 1rem;">
            AI sẽ chuyển bài học lớn thành các bước cụ thể, có mục tiêu rõ ràng và tiêu chí hoàn thành để tránh áp lực:
          </p>
          <div class="form-group">
            <label class="form-label">Chọn trình độ hiện tại với nội dung này:</label>
            <select class="form-control" id="dec-level">
              <option value="trung bình">Trung bình (Phân bổ bước cân bằng)</option>
              <option value="yếu">Chưa tự tin (Tăng thời gian lý thuyết & làm bài cơ bản)</option>
              <option value="khá giỏi">Nắm vững (Tập trung bài tập vận dụng)</option>
            </select>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal-decompose').remove()">Đóng</button>
            <button type="button" class="btn btn-primary" id="btn-generate-subtasks">Tự Động Tạo Subtasks</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('btn-generate-subtasks')?.addEventListener('click', () => {
      const level = document.getElementById('dec-level').value;
      const subtasks = EcoAlgorithms.decomposeTask(task.title, task.subject, level);
      store.updateTask(task.id, { subtasks });
      document.getElementById('modal-decompose').remove();
      this.playChime('bell');
      this.showToast(`✨ Đã chia nhỏ nhiệm vụ thành ${subtasks.length} bước thực hiện!`);
      this.render();
    });
  },

  openCheckOutModal(taskId) {
    const task = store.data.tasks.find(t => t.id === taskId);
    if (!task) return;

    const modalHtml = `
      <div class="modal-overlay active" id="modal-checkout">
        <div class="modal-container">
          <div class="modal-header">
            <h3>✅ Check-out Sau Phiên Học: ${task.title}</h3>
            <button class="modal-close-btn" onclick="document.getElementById('modal-checkout').remove()">×</button>
          </div>
          <form id="form-do-checkout">
            <div class="form-group">
              <label class="form-label">Trạng thái hoàn thành</label>
              <select class="form-control" id="co-status">
                <option value="completed">Đã hoàn thành 100%</option>
                <option value="partially_completed">Hoàn thành một phần</option>
                <option value="needs_support">Gặp khó khăn / Chưa hoàn thành</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Thời gian thực tế bạn đã học (phút)</label>
              <input type="number" class="form-control" id="co-actual-time" value="${task.estimatedMinutes}" min="5" step="5">
            </div>
            <div class="form-group">
              <label class="form-label">Có kiến thức nào bạn cảm thấy chưa nắm vững không?</label>
              <input type="text" class="form-control" id="co-gap" placeholder="VD: Chưa hiểu điều kiện của định lý...">
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem;">
              <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal-checkout').remove()">Hủy</button>
              <button type="submit" class="btn btn-primary">Xác Nhận Check-out</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('form-do-checkout')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('co-status').value;
      const actualMinutes = parseInt(document.getElementById('co-actual-time').value);
      const gapText = document.getElementById('co-gap').value;

      store.updateTask(task.id, {
        status,
        actualMinutes
      });

      if (gapText.trim()) {
        store.addKnowledgeGap({
          subject: task.subject,
          topic: gapText.trim(),
          notes: `Ghi nhận từ Check-out bài học: ${task.title}`
        });
      }

      document.getElementById('modal-checkout').remove();
      this.playChime('bell');
      this.showToast('🎉 Đã check-out và cập nhật dữ liệu học tập!');
      this.render();
    });
  },

  openResolveBacklogModal(taskId) {
    const task = store.data.tasks.find(t => t.id === taskId);
    if (!task) return;

    const modalHtml = `
      <div class="modal-overlay active" id="modal-resolve">
        <div class="modal-container">
          <div class="modal-header">
            <h3>🔄 Giải Quyết Tồn Đọng: ${task.title}</h3>
            <button class="modal-close-btn" onclick="document.getElementById('modal-resolve').remove()">×</button>
          </div>
          <div class="form-group">
            <label class="form-label">Lý do chính khiến bài học này bị chậm trễ?</label>
            <select class="form-control" id="res-reason">
              <option value="not_enough_time">Không đủ thời gian thực tế</option>
              <option value="too_hard">Bài tập khó hơn dự kiến ban đầu</option>
              <option value="knowledge_gap">Chưa hiểu kiến thức nền tảng</option>
              <option value="distracted">Bị phân tâm / Mất tập trung</option>
              <option value="fatigued">Cảm thấy mệt mỏi, kiệt sức</option>
              <option value="unexpected_event">Có việc đột xuất từ trường/gia đình</option>
              <option value="bad_estimate">Ước tính thời gian ban đầu chưa chính xác</option>
            </select>
          </div>
          <div id="res-proposal-box" style="margin-top: 1rem; padding: 1rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md);">
            <strong style="color: #047857;">Phương án giải quyết từ AI:</strong>
            <p id="res-proposal-text" style="font-size: 0.85rem; color: #065f46; margin-top: 0.35rem;">
              AI đề xuất chia task thành 2 phiên nhỏ (30 phút mỗi phiên) vào khung giờ sáng mai khi đầu óc tỉnh táo.
            </p>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal-resolve').remove()">Đóng</button>
            <button type="button" class="btn btn-primary" id="btn-apply-reschedule">Áp Dụng Phương Án</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const selectReason = document.getElementById('res-reason');
    const proposalText = document.getElementById('res-proposal-text');

    selectReason?.addEventListener('change', () => {
      const sol = EcoAlgorithms.handleReschedulingReason(selectReason.value, task);
      proposalText.innerText = sol.proposal;
    });

    document.getElementById('btn-apply-reschedule')?.addEventListener('click', () => {
      store.updateTask(task.id, {
        status: 'scheduled',
        rescheduleCount: (task.rescheduleCount || 0) + 1,
        timeSlot: 'Ngày mai (19:30 - 20:15)'
      });
      document.getElementById('modal-resolve').remove();
      this.playChime('bell');
      this.showToast('✅ Đã điều chỉnh lịch học một cách khoa học!');
      this.render();
    });
  },

  getStatusText(status) {
    const map = {
      'pending': 'Chờ xếp lịch',
      'scheduled': 'Đã lên lịch',
      'in_progress': 'Đang học',
      'completed': 'Hoàn thành',
      'partially_completed': 'Một phần',
      'blocked': 'Bị chặn',
      'not_reported': 'Chưa báo cáo',
      'pending_review': 'Chờ rà soát',
      'needs_support': 'Cần hỗ trợ',
      'rescheduled': 'Đã dời lịch'
    };
    return map[status] || status;
  },

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>💬</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
};
