/**
 * CampusFlow — script.js
 * Student Productivity Dashboard
 * Vanilla JS (ES6+) — No external libraries
 * ─────────────────────────────────────────
 * Sections:
 *  1. Dummy Data
 *  2. State
 *  3. DOM Helpers
 *  4. Navigation
 *  5. Dashboard Overview
 *  6. Class Schedule
 *  7. Assignments
 *  8. Academic Progress
 *  9. Announcements
 * 10. Events
 * 11. Modal
 * 12. Profile Panel
 * 13. Init
 */

/* ══════════════════════════════════════════════
   1. DUMMY DATA
══════════════════════════════════════════════ */

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/** Weekly study hours (Mon–Sun) */
const weeklyHours = [
  { day: 'Mon', hours: 3 },
  { day: 'Tue', hours: 5 },
  { day: 'Wed', hours: 4 },
  { day: 'Thu', hours: 6 },
  { day: 'Fri', hours: 2 },
  { day: 'Sat', hours: 4 },
  { day: 'Sun', hours: 1 },
];

/** Class schedule per day */
const scheduleData = {
  Monday: [
    { id: 's1', course: 'Algorithm & Data Structures', lecturer: 'Dr. Budi Santoso, M.Sc.', room: 'A-301', start: '07:30', end: '09:10', color: '#3b82f6', status: 'done' },
    { id: 's2', course: 'Operating Systems',           lecturer: 'Ir. Dewi Rahayu, M.T.',   room: 'B-202', start: '10:00', end: '11:40', color: '#8b5cf6', status: 'upcoming' },
    { id: 's3', course: 'Web Programming',             lecturer: 'Andi Kusuma, S.Kom, M.T.', room: 'Lab-1', start: '13:00', end: '15:30', color: '#14b8a6', status: 'upcoming' },
  ],
  Tuesday: [
    { id: 's4', course: 'Database Systems',            lecturer: 'Prof. Sri Mulyani, Ph.D.',  room: 'A-101', start: '08:00', end: '09:40', color: '#f97316', status: 'upcoming' },
    { id: 's5', course: 'Computer Networks',           lecturer: 'Dr. Hendra Wijaya, M.T.',   room: 'C-303', start: '11:00', end: '12:40', color: '#3b82f6', status: 'upcoming' },
  ],
  Wednesday: [
    { id: 's6', course: 'Software Engineering',        lecturer: 'Dr. Rini Setiawati, M.T.',  room: 'A-202', start: '07:30', end: '09:10', color: '#8b5cf6', status: 'upcoming' },
    { id: 's7', course: 'Algorithm & Data Structures', lecturer: 'Dr. Budi Santoso, M.Sc.',   room: 'Lab-2', start: '10:30', end: '12:10', color: '#3b82f6', status: 'upcoming' },
    { id: 's8', course: 'English for Technology',      lecturer: 'Linda Pratiwi, S.Pd, M.Hum',room: 'B-105', start: '13:30', end: '15:10', color: '#22c55e', status: 'upcoming' },
  ],
  Thursday: [
    { id: 's9',  course: 'Database Systems',    lecturer: 'Prof. Sri Mulyani, Ph.D.',  room: 'Lab-3', start: '09:00', end: '11:30', color: '#f97316', status: 'upcoming' },
    { id: 's10', course: 'Web Programming',     lecturer: 'Andi Kusuma, S.Kom, M.T.',  room: 'A-301', start: '13:00', end: '14:40', color: '#14b8a6', status: 'upcoming' },
  ],
  Friday: [
    { id: 's11', course: 'Computer Networks',  lecturer: 'Dr. Hendra Wijaya, M.T.',  room: 'B-201', start: '08:00', end: '09:40', color: '#3b82f6', status: 'upcoming' },
    { id: 's12', course: 'Software Engineering',lecturer: 'Dr. Rini Setiawati, M.T.', room: 'Lab-2', start: '10:00', end: '12:30', color: '#8b5cf6', status: 'upcoming' },
  ],
  Saturday: [
    { id: 's13', course: 'Operating Systems',  lecturer: 'Ir. Dewi Rahayu, M.T.',    room: 'A-101', start: '09:00', end: '10:40', color: '#8b5cf6', status: 'upcoming' },
  ],
  Sunday: [],
};

/** Assignment data */
let assignments = [
  {
    id: 'a1', title: 'Binary Search Tree Implementation',
    course: 'Algorithm & Data Structures', deadline: '2024-11-02',
    priority: 'urgent', completed: false,
    notes: 'Implement insert, delete, and search operations in C++.',
  },
  {
    id: 'a2', title: 'Process Scheduling Simulation',
    course: 'Operating Systems', deadline: '2024-11-05',
    priority: 'high', completed: false,
    notes: 'Simulate FCFS, SJF, and Round-Robin scheduling algorithms.',
  },
  {
    id: 'a3', title: 'ER Diagram & Normalization',
    course: 'Database Systems', deadline: '2024-11-08',
    priority: 'medium', completed: false,
    notes: 'Design ER diagram for library management system up to 3NF.',
  },
  {
    id: 'a4', title: 'Responsive Portfolio Website',
    course: 'Web Programming', deadline: '2024-11-12',
    priority: 'medium', completed: false,
    notes: 'Build a personal portfolio using HTML, CSS, JavaScript.',
  },
  {
    id: 'a5', title: 'Software Requirements Specification',
    course: 'Software Engineering', deadline: '2024-11-15',
    priority: 'high', completed: false,
    notes: 'Write SRS document following IEEE 830 standard.',
  },
  {
    id: 'a6', title: 'Packet Tracer Lab — OSPF Routing',
    course: 'Computer Networks', deadline: '2024-11-20',
    priority: 'low', completed: false,
    notes: 'Configure OSPF routing on a multi-area network topology.',
  },
  {
    id: 'a7', title: 'AVL Tree Presentation Slides',
    course: 'Algorithm & Data Structures', deadline: '2024-10-28',
    priority: 'urgent', completed: true,
    notes: 'Prepare 10-slide deck explaining AVL tree rotations.',
  },
  {
    id: 'a8', title: 'SQL Query Practice — Joins & Subqueries',
    course: 'Database Systems', deadline: '2024-10-25',
    priority: 'medium', completed: true,
    notes: 'Complete 20 SQL exercises on joins and subqueries.',
  },
  {
    id: 'a9', title: 'TCP/IP Model Essay',
    course: 'Computer Networks', deadline: '2024-10-22',
    priority: 'low', completed: true,
    notes: 'Write 1500-word essay comparing OSI and TCP/IP models.',
  },
];

/** Course grade data */
const courseGrades = [
  { name: 'Algorithm & Data Structures', credits: 4, grade: 'A',  gp: 4.0 },
  { name: 'Database Systems',            credits: 3, grade: 'A',  gp: 4.0 },
  { name: 'Web Programming',             credits: 3, grade: 'AB', gp: 3.5 },
  { name: 'Operating Systems',           credits: 3, grade: 'B',  gp: 3.0 },
  { name: 'Computer Networks',           credits: 3, grade: 'B',  gp: 3.0 },
  { name: 'Software Engineering',        credits: 3, grade: 'AB', gp: 3.5 },
  { name: 'English for Technology',      credits: 2, grade: 'A',  gp: 4.0 },
];

/** Campus announcements */
const announcements = [
  {
    id: 'ann1',
    title: 'Mid-Semester Exam Schedule Released',
    date: '2024-10-28',
    category: 'Academic',
    description: 'The mid-semester examination schedule for Semester 5 has been officially released. Please check the academic portal for your course exam times and room assignments.',
    unread: true,
    icon: '📋',
    iconBg: '#dbeafe',
    catColor: '#2563eb',
    catBg: '#dbeafe',
  },
  {
    id: 'ann2',
    title: 'Campus Internet Maintenance — Nov 3',
    date: '2024-10-27',
    category: 'Facility',
    description: 'Network maintenance is scheduled for Sunday, November 3 from 08:00 to 14:00 WIB. Internet services across all campus buildings will be temporarily unavailable.',
    unread: true,
    icon: '🔧',
    iconBg: '#fef9c3',
    catColor: '#92400e',
    catBg: '#fef9c3',
  },
  {
    id: 'ann3',
    title: 'Academic Advisor Consultation Week',
    date: '2024-10-25',
    category: 'Academic',
    description: 'Academic advisor consultation sessions for Semester 6 course planning are open from November 4–8. Book your slot via the student portal before October 31.',
    unread: false,
    icon: '🎓',
    iconBg: '#dbeafe',
    catColor: '#2563eb',
    catBg: '#dbeafe',
  },
  {
    id: 'ann4',
    title: 'Scholarship Application — Semester 6',
    date: '2024-10-23',
    category: 'Scholarship',
    description: 'Applications for the KIP-Kuliah and campus internal scholarships for Semester 6 are now open. Submit your documents to the student affairs office by November 10.',
    unread: false,
    icon: '💰',
    iconBg: '#dcfce7',
    catColor: '#16a34a',
    catBg: '#dcfce7',
  },
  {
    id: 'ann5',
    title: 'Updated Lab Safety Protocol',
    date: '2024-10-20',
    category: 'Facility',
    description: 'The laboratory safety guidelines have been updated. All students using computer labs must read and acknowledge the new protocols before entering.',
    unread: false,
    icon: '⚠️',
    iconBg: '#ffedd5',
    catColor: '#ea580c',
    catBg: '#ffedd5',
  },
  {
    id: 'ann6',
    title: 'Research Paper Submission Deadline Extended',
    date: '2024-10-18',
    category: 'Academic',
    description: 'The submission deadline for the end-of-semester research paper has been extended to November 25, 2024. Please ensure submissions meet the formatting guidelines.',
    unread: false,
    icon: '📄',
    iconBg: '#dbeafe',
    catColor: '#2563eb',
    catBg: '#dbeafe',
  },
];

/** Campus events */
const events = [
  {
    id: 'ev1',
    name: 'Tech Talk: AI in Software Development',
    date: '2024-11-05',
    location: 'Auditorium Utama, Gedung Rektorat',
    category: 'Seminar',
    emoji: '🤖',
    bannerBg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)',
    catColor: '#2563eb',
    catBg: '#dbeafe',
    registerBg: '#2563eb',
    registerColor: '#fff',
    seats: '240 seats available',
  },
  {
    id: 'ev2',
    name: 'Hackathon Campus 2024',
    date: '2024-11-09',
    location: 'Gedung Informatika, Lantai 3',
    category: 'Competition',
    emoji: '💻',
    bannerBg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
    catColor: '#7c3aed',
    catBg: '#ede9fe',
    registerBg: '#7c3aed',
    registerColor: '#fff',
    seats: '50 teams (max 3 members)',
  },
  {
    id: 'ev3',
    name: 'Career Fair — IT & Engineering 2024',
    date: '2024-11-14',
    location: 'Hall Serbaguna, Gedung Student Center',
    category: 'Career',
    emoji: '🏢',
    bannerBg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
    catColor: '#16a34a',
    catBg: '#dcfce7',
    registerBg: '#16a34a',
    registerColor: '#fff',
    seats: 'Free entry — bring CV',
  },
  {
    id: 'ev4',
    name: 'UI/UX Design Workshop',
    date: '2024-11-16',
    location: 'Lab Komputer 3, Gedung D',
    category: 'Workshop',
    emoji: '🎨',
    bannerBg: 'linear-gradient(135deg,#ffedd5,#fed7aa)',
    catColor: '#ea580c',
    catBg: '#ffedd5',
    registerBg: '#ea580c',
    registerColor: '#fff',
    seats: '30 seats available',
  },
  {
    id: 'ev5',
    name: 'Campus Student Olympiad — CS Track',
    date: '2024-11-22',
    location: 'Gedung Informatika',
    category: 'Competition',
    emoji: '🏆',
    bannerBg: 'linear-gradient(135deg,#ede9fe,#c4b5fd)',
    catColor: '#7c3aed',
    catBg: '#ede9fe',
    registerBg: '#7c3aed',
    registerColor: '#fff',
    seats: 'Open for all students',
  },
  {
    id: 'ev6',
    name: 'Cybersecurity Awareness Seminar',
    date: '2024-11-28',
    location: 'Aula Gedung A, Lantai 2',
    category: 'Seminar',
    emoji: '🔐',
    bannerBg: 'linear-gradient(135deg,#dbeafe,#93c5fd)',
    catColor: '#2563eb',
    catBg: '#dbeafe',
    registerBg: '#2563eb',
    registerColor: '#fff',
    seats: '180 seats available',
  },
];

/* Attendance data — 16 weeks × 7 courses */
function generateAttendance() {
  const states = ['present','present','present','present','present','present','absent','alpha'];
  const cells = [];
  for (let w = 1; w <= 16; w++) {
    const s = w > 10 ? 'future' : states[Math.floor(Math.random() * states.length)];
    cells.push({ week: w, status: s });
  }
  return cells;
}

/* ══════════════════════════════════════════════
   2. STATE
══════════════════════════════════════════════ */

const state = {
  currentSection: 'dashboard',
  scheduleDay: null,            // set during init to today
  assignmentFilter: 'all',
  annCategory: 'All',
  eventCategory: 'All',
};

/* ══════════════════════════════════════════════
   3. DOM HELPERS
══════════════════════════════════════════════ */

/** Shorthand querySelector */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/**
 * Format a date string "YYYY-MM-DD" to "Day, DD Month YYYY"
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Calculate days remaining from today to a deadline date string.
 * @param {string} deadlineStr
 * @returns {number} positive = future, 0 = today, negative = past
 */
function daysUntil(deadlineStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dl = new Date(deadlineStr + 'T00:00:00');
  return Math.round((dl - today) / (1000 * 60 * 60 * 24));
}

/**
 * Returns a human-readable deadline string.
 * @param {string} deadlineStr
 * @returns {{ text: string, urgent: boolean }}
 */
function deadlineLabel(deadlineStr) {
  const d = daysUntil(deadlineStr);
  if (d < 0)  return { text: `${Math.abs(d)}d overdue`, urgent: true };
  if (d === 0) return { text: 'Due today', urgent: true };
  if (d === 1) return { text: 'Due tomorrow', urgent: true };
  if (d <= 3)  return { text: `${d} days left`, urgent: true };
  return { text: `${d} days left`, urgent: false };
}

/**
 * Returns days chip class based on number of days remaining.
 */
function daysChipClass(days) {
  if (days <= 1)  return 'deadline-mini-days--urgent';
  if (days <= 3)  return 'deadline-mini-days--warning';
  return 'deadline-mini-days--ok';
}

/** Escape HTML to prevent XSS */
function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ══════════════════════════════════════════════
   4. NAVIGATION
══════════════════════════════════════════════ */

const sectionMap = {
  dashboard:     'sec-dashboard',
  schedule:      'sec-schedule',
  assignments:   'sec-assignments',
  progress:      'sec-progress',
  announcements: 'sec-announcements',
  events:        'sec-events',
};

const sectionTitles = {
  dashboard:     'Dashboard',
  schedule:      'Class Schedule',
  assignments:   'Assignment Tracker',
  progress:      'Academic Progress',
  announcements: 'Campus Announcements',
  events:        'Campus Events',
};

/**
 * Activate a page section and update nav UI.
 * @param {string} sectionKey
 * @param {string|null} filter — optional filter to apply after navigation
 */
function navigateTo(sectionKey, filter = null) {
  if (!sectionMap[sectionKey]) return;
  state.currentSection = sectionKey;

  // Hide all sections
  $$('.page-section').forEach(s => s.classList.remove('active'));
  // Show target
  const target = $(`#${sectionMap[sectionKey]}`);
  if (target) target.classList.add('active');

  // Update nav items
  $$('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.section === sectionKey);
  });

  // Update topbar title
  const titleEl = $('#topbarTitle');
  if (titleEl) titleEl.textContent = sectionTitles[sectionKey] || sectionKey;

  // Close sidebar on mobile
  closeSidebar();

  // Apply filter if provided
  if (sectionKey === 'assignments' && filter) {
    setAssignmentFilter(filter);
  }
  if (sectionKey === 'assignments' && !filter) {
    renderAssignments();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Sidebar open/close (mobile) */
function openSidebar() {
  $('#sidebar').classList.add('open');
  $('#sidebarOverlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  $('#sidebar').classList.remove('open');
  $('#sidebarOverlay').classList.remove('visible');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════
   5. DASHBOARD OVERVIEW
══════════════════════════════════════════════ */

function initDashboard() {
  // Greeting
  const hour = new Date().getHours();
  const greetings = ['Good evening,', 'Good morning,', 'Good afternoon,', 'Good evening,'];
  const greetIdx = hour < 5 ? 0 : hour < 12 ? 1 : hour < 17 ? 2 : 3;
  const greetEl = $('#greetingText');
  if (greetEl) greetEl.textContent = greetings[greetIdx];

  // Today's date
  const today = new Date();
  const dateEl = $('#todayDate');
  if (dateEl) {
    dateEl.textContent = today.toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  // Stats
  const pending = assignments.filter(a => !a.completed);
  const urgent  = pending.filter(a => daysUntil(a.deadline) <= 3).length;
  const statTasksEl = $('#statTasksDue');
  if (statTasksEl) statTasksEl.textContent = urgent;

  // Mini progress counts
  const completedCount = assignments.filter(a => a.completed).length;
  const pendingCount   = assignments.filter(a => !a.completed).length;
  const miniC = $('#miniCompleted'); if (miniC) miniC.textContent = completedCount;
  const miniP = $('#miniPending');   if (miniP) miniP.textContent = pendingCount;

  // Today's classes mini
  renderDashSchedule();
  // Upcoming deadlines mini
  renderDashDeadlines();
  // Weekly chart mini
  renderBarChart('#weeklyChart', weeklyHours, 100);
}

/** Render today's classes mini list on dashboard */
function renderDashSchedule() {
  const container = $('#dashScheduleList');
  if (!container) return;

  const todayName = DAYS[new Date().getDay()];
  const classes   = scheduleData[todayName] || [];

  if (classes.length === 0) {
    container.innerHTML = `<p class="empty-state-text" style="color:var(--gray-400);font-size:var(--font-sm);padding:var(--space-4) 0;text-align:center">No classes today 🎉</p>`;
    const statEl = $('#statClasses');
    if (statEl) statEl.textContent = 0;
    return;
  }

  const statEl = $('#statClasses');
  if (statEl) statEl.textContent = classes.length;

  container.innerHTML = classes.map(cls => `
    <div class="schedule-mini-item">
      <span class="schedule-mini-time">${cls.start}–${cls.end.slice(0,5)}</span>
      <div class="schedule-mini-info">
        <div class="schedule-mini-course">${esc(cls.course)}</div>
        <div class="schedule-mini-room">${esc(cls.room)} · ${esc(cls.lecturer.split(',')[0])}</div>
      </div>
      <span class="schedule-dot" style="background:${cls.color}"></span>
    </div>
  `).join('');
}

/** Render upcoming deadlines mini list on dashboard */
function renderDashDeadlines() {
  const container = $('#dashDeadlineList');
  if (!container) return;

  const pending = assignments
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 4);

  if (pending.length === 0) {
    container.innerHTML = `<p style="color:var(--gray-400);font-size:var(--font-sm);padding:var(--space-4) 0;text-align:center">No pending deadlines 🎉</p>`;
    return;
  }

  container.innerHTML = pending.map(a => {
    const days   = daysUntil(a.deadline);
    const urgent = days <= 3;
    const chipCls = daysChipClass(days);
    const chipText = days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d`;
    return `
      <div class="deadline-mini-item${urgent ? ' deadline-mini-item--urgent' : ''}">
        <div class="deadline-mini-info">
          <div class="deadline-mini-title">${esc(a.title)}</div>
          <div class="deadline-mini-course">${esc(a.course)}</div>
        </div>
        <span class="deadline-mini-days ${chipCls}">${chipText}</span>
      </div>
    `;
  }).join('');
}

/* ══════════════════════════════════════════════
   6. CLASS SCHEDULE
══════════════════════════════════════════════ */

/** Render the day-tab buttons */
function renderDayTabs() {
  const container = $('#dayTabs');
  if (!container) return;

  const dayOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  container.innerHTML = dayOrder.map(day => `
    <button class="day-tab${state.scheduleDay === day ? ' active' : ''}" data-day="${day}">
      ${day.slice(0, 3)}
    </button>
  `).join('');

  container.querySelectorAll('.day-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.scheduleDay = btn.dataset.day;
      renderDayTabs();
      renderScheduleForDay(state.scheduleDay);
    });
  });
}

/** Render classes for a given day */
function renderScheduleForDay(day) {
  const container = $('#scheduleContent');
  if (!container) return;

  const classes = scheduleData[day] || [];
  if (classes.length === 0) {
    container.innerHTML = `
      <div class="no-class-state">
        <div style="font-size:2rem;margin-bottom:.5rem">😌</div>
        <p>No classes on ${day}. Rest well!</p>
      </div>`;
    return;
  }

  container.innerHTML = classes.map((cls, i) => {
    const badgeMap = { done: 'done', live: 'live', upcoming: 'upcoming' };
    const badgeText = { done: 'Completed', live: '● Live', upcoming: 'Upcoming' };
    const s = cls.status;
    return `
      <article class="schedule-card${s === 'live' ? ' schedule-card--current' : ''}">
        <div class="schedule-time-col">
          <div class="schedule-time">${cls.start}</div>
          <div class="schedule-duration">– ${cls.end}</div>
        </div>
        <div class="schedule-info">
          <div class="schedule-course">${esc(cls.course)}</div>
          <div class="schedule-meta">
            <span class="schedule-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              ${esc(cls.lecturer)}
            </span>
            <span class="schedule-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              ${esc(cls.room)}
            </span>
          </div>
        </div>
        <span class="schedule-badge schedule-badge--${badgeMap[s] || 'upcoming'}">${badgeText[s] || 'Upcoming'}</span>
      </article>
    `;
  }).join('');
}

/* ══════════════════════════════════════════════
   7. ASSIGNMENTS
══════════════════════════════════════════════ */

/** Set assignment filter and re-render */
function setAssignmentFilter(filter) {
  state.assignmentFilter = filter;
  $$('.filter-tab').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.filter === filter)
  );
  renderAssignments();
}

/** Return filtered assignment list */
function getFilteredAssignments() {
  switch (state.assignmentFilter) {
    case 'pending':   return assignments.filter(a => !a.completed);
    case 'completed': return assignments.filter(a =>  a.completed);
    case 'urgent':    return assignments.filter(a => !a.completed && daysUntil(a.deadline) <= 3);
    default:          return assignments;
  }
}

/** Render the assignment list */
function renderAssignments() {
  const container = $('#assignmentList');
  if (!container) return;

  const filtered = getFilteredAssignments();

  // Update badge
  const badge = $('#assignmentBadge');
  const pendingCount = assignments.filter(a => !a.completed).length;
  if (badge) badge.textContent = pendingCount;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">✅</div>
        <div class="empty-state-text">No assignments here. Great job!</div>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(a => {
    const { text: dlText, urgent: dlUrgent } = deadlineLabel(a.deadline);
    return `
      <article class="assignment-card assignment-card--${a.priority}${a.completed ? ' assignment-card--completed' : ''}" data-id="${a.id}">
        <input type="checkbox" class="assignment-check" ${a.completed ? 'checked' : ''} aria-label="Mark as completed" data-action="toggle" data-id="${a.id}" />
        <div class="assignment-info">
          <div class="assignment-title">${esc(a.title)}</div>
          <div class="assignment-meta">
            <span class="assignment-course">${esc(a.course)}</span>
            <span class="assignment-deadline${dlUrgent && !a.completed ? '--urgent' : ''} assignment-deadline">📅 ${esc(dlText)} · ${formatDate(a.deadline)}</span>
            <span class="priority-badge priority-badge--${a.priority}">${a.priority}</span>
          </div>
        </div>
        <div class="assignment-actions">
          <button class="btn-icon-sm" data-action="delete" data-id="${a.id}" aria-label="Delete assignment" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </article>
    `;
  }).join('');
}

/* ══════════════════════════════════════════════
   8. ACADEMIC PROGRESS
══════════════════════════════════════════════ */

function renderProgress() {
  renderKPIs();
  renderSemesterDetail();
  renderCourseGrades();
  renderBarChart('#weeklyChartFull', weeklyHours, 160);
  renderAttendance();
}

/** Render KPI cards */
function renderKPIs() {
  const container = $('#kpiGrid');
  if (!container) return;

  const completed = assignments.filter(a => a.completed).length;
  const total     = assignments.length;
  const pending   = total - completed;

  const kpis = [
    { icon: '✅', label: 'Assignments Done', val: completed, delta: '+2 this week', up: true, bg: '#dcfce7', color: '#16a34a' },
    { icon: '📋', label: 'Pending Tasks',    val: pending,   delta: `${pending} remaining`,  up: false, bg: '#ffedd5', color: '#ea580c' },
    { icon: '🎓', label: 'Current GPA',      val: '3.62',    delta: '+0.12 vs last sem', up: true,  bg: '#dbeafe', color: '#2563eb' },
    { icon: '📅', label: 'Attendance',       val: '78%',     delta: '14/18 meetings',    up: true,  bg: '#ede9fe', color: '#7c3aed' },
  ];

  container.innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-icon" style="background:${k.bg};color:${k.color};font-size:1.25rem">${k.icon}</div>
      <div>
        <div class="kpi-val">${k.val}</div>
        <div class="kpi-lbl">${k.label}</div>
        <div class="kpi-delta kpi-delta--${k.up ? 'up' : 'down'}">${k.delta}</div>
      </div>
    </div>
  `).join('');
}

/** Render semester progress detail */
function renderSemesterDetail() {
  const container = $('#semesterDetail');
  if (!container) return;

  const items = [
    { label: 'Semester Progress',    pct: 62, cls: '' },
    { label: 'Assignment Completion', pct: Math.round((assignments.filter(a=>a.completed).length / assignments.length) * 100), cls: '--green' },
    { label: 'Attendance Rate',      pct: 78, cls: '--orange' },
    { label: 'Study Goal (20h/wk)',  pct: 75, cls: '' },
  ];

  container.innerHTML = items.map(it => `
    <div class="sem-prog-row">
      <div class="sem-prog-header">
        <span class="sem-prog-label">${it.label}</span>
        <span class="sem-prog-pct">${it.pct}%</span>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill${it.cls}" style="width:${it.pct}%"></div>
      </div>
    </div>
  `).join('');
}

/** Render course grade rows */
function renderCourseGrades() {
  const container = $('#courseGrades');
  if (!container) return;

  container.innerHTML = courseGrades.map(cg => `
    <div class="course-grade-row">
      <span class="course-grade-name">${esc(cg.name)}</span>
      <span class="course-grade-credit">${cg.credits} SKS</span>
      <span class="grade-pill grade-pill--${cg.grade.replace('/', '')}">${cg.grade}</span>
    </div>
  `).join('');
}

/** Render attendance heatmap */
function renderAttendance() {
  const container = $('#attendanceGrid');
  if (!container) return;

  const cells = generateAttendance();
  const labels = { present: '✓', absent: '✗', alpha: '!', future: '' };
  const tooltips = { present: 'Present', absent: 'Absent', alpha: 'Excused', future: 'Upcoming' };

  const cellsHTML = cells.map(c => `
    <div class="att-cell att-cell--${c.status}" title="Week ${c.week}: ${tooltips[c.status]}">
      ${labels[c.status]}
    </div>
  `).join('');

  const legendHTML = `
    <div class="att-legend">
      <div class="att-legend-item"><div class="att-legend-dot" style="background:var(--green-500)"></div>Present</div>
      <div class="att-legend-item"><div class="att-legend-dot" style="background:var(--red-400)"></div>Absent</div>
      <div class="att-legend-item"><div class="att-legend-dot" style="background:var(--orange-400)"></div>Excused</div>
      <div class="att-legend-item"><div class="att-legend-dot" style="background:var(--gray-100);border:1px solid var(--gray-200)"></div>Upcoming</div>
    </div>
  `;

  container.innerHTML = cellsHTML;
  container.insertAdjacentHTML('afterend', legendHTML);
}

/* ══════════════════════════════════════════════
   BAR CHART (reusable)
══════════════════════════════════════════════ */

/**
 * Render a bar chart into a container selector.
 * @param {string} selector - CSS selector for the container
 * @param {{ day: string, hours: number }[]} data
 * @param {number} maxHeight - container height in px
 */
function renderBarChart(selector, data, maxHeight) {
  const container = $(selector);
  if (!container) return;

  const todayShort = DAYS_SHORT[new Date().getDay()];
  const maxVal = Math.max(...data.map(d => d.hours));

  container.innerHTML = data.map(d => {
    const ratio  = maxVal > 0 ? d.hours / maxVal : 0;
    const barH   = Math.round(ratio * (maxHeight - 40));
    const isToday = d.day === todayShort;
    return `
      <div class="bar-col">
        <span class="bar-val">${d.hours}h</span>
        <div class="bar-fill-wrap">
          <div class="bar-fill${isToday ? ' bar-fill--highlight' : ''}"
               style="height:${barH}px" title="${d.day}: ${d.hours} hours"></div>
        </div>
        <span class="bar-label">${d.day}</span>
      </div>
    `;
  }).join('');
}

/* ══════════════════════════════════════════════
   9. ANNOUNCEMENTS
══════════════════════════════════════════════ */

function initAnnouncements() {
  renderAnnCategoryTabs();
  renderAnnouncements();

  // Search
  const searchEl = $('#annSearch');
  if (searchEl) {
    searchEl.addEventListener('input', () => renderAnnouncements(searchEl.value.trim().toLowerCase()));
  }

  // Update announcement badge
  const unread = announcements.filter(a => a.unread).length;
  const badge  = $('#annBadge');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'inline-block' : 'none';
  }
}

function renderAnnCategoryTabs() {
  const container = $('#annCatTabs');
  if (!container) return;

  const cats = ['All', ...new Set(announcements.map(a => a.category))];
  container.innerHTML = cats.map(cat => `
    <button class="ann-cat-btn${state.annCategory === cat ? ' active' : ''}" data-cat="${cat}">${cat}</button>
  `).join('');

  container.querySelectorAll('.ann-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.annCategory = btn.dataset.cat;
      $$('.ann-cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === state.annCategory));
      renderAnnouncements($('#annSearch')?.value.trim().toLowerCase() || '');
    });
  });
}

/**
 * Render announcements filtered by category and search query.
 * @param {string} query - search string
 */
function renderAnnouncements(query = '') {
  const container = $('#announcementList');
  if (!container) return;

  let filtered = announcements;
  if (state.annCategory !== 'All') filtered = filtered.filter(a => a.category === state.annCategory);
  if (query) filtered = filtered.filter(a =>
    a.title.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-text">No announcements match your search.</div></div>`;
    return;
  }

  container.innerHTML = filtered.map(ann => `
    <article class="ann-card${ann.unread ? ' ann-card--unread' : ''}" data-id="${ann.id}" tabindex="0" role="button" aria-label="${esc(ann.title)}">
      <div class="ann-icon" style="background:${ann.iconBg};font-size:1.1rem">${ann.icon}</div>
      <div class="ann-body">
        <div class="ann-top">
          <h3 class="ann-title">${esc(ann.title)}</h3>
          <span class="ann-date">${formatDate(ann.date)}</span>
        </div>
        <p class="ann-desc">${esc(ann.description)}</p>
        <span class="ann-cat-badge" style="background:${ann.catBg};color:${ann.catColor}">${ann.category}</span>
        ${ann.unread ? '<span style="float:right;font-size:.65rem;font-weight:700;color:var(--blue-600);background:var(--blue-100);padding:2px 8px;border-radius:99px;margin-top:6px;display:inline-block">NEW</span>' : ''}
      </div>
    </article>
  `).join('');

  // Mark as read on click
  container.querySelectorAll('.ann-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const ann = announcements.find(a => a.id === id);
      if (ann && ann.unread) {
        ann.unread = false;
        card.classList.remove('ann-card--unread');
        const newTag = card.querySelector('[style*="float:right"]');
        if (newTag) newTag.remove();
        // Update badge
        const unread = announcements.filter(a => a.unread).length;
        const badge = $('#annBadge');
        if (badge) {
          badge.textContent = unread;
          if (unread === 0) badge.style.display = 'none';
        }
      }
    });
  });
}

/* ══════════════════════════════════════════════
   10. EVENTS
══════════════════════════════════════════════ */

function initEvents() {
  renderEventCategoryTabs();
  renderEvents();
}

function renderEventCategoryTabs() {
  const container = $('#eventCatTabs');
  if (!container) return;

  const cats = ['All', ...new Set(events.map(e => e.category))];
  container.innerHTML = cats.map(cat => `
    <button class="event-cat-btn${state.eventCategory === cat ? ' active' : ''}" data-cat="${cat}">${cat}</button>
  `).join('');

  container.querySelectorAll('.event-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.eventCategory = btn.dataset.cat;
      $$('.event-cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === state.eventCategory));
      renderEvents();
    });
  });
}

function renderEvents() {
  const container = $('#eventList');
  if (!container) return;

  let filtered = events;
  if (state.eventCategory !== 'All') filtered = filtered.filter(e => e.category === state.eventCategory);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📅</div><div class="empty-state-text">No events in this category.</div></div>`;
    return;
  }

  container.innerHTML = filtered.map(ev => `
    <div class="event-card">
      <div class="event-card-banner" style="background:${ev.bannerBg}">
        <span style="font-size:2.25rem">${ev.emoji}</span>
      </div>
      <div class="event-card-body">
        <div class="event-card-cat" style="color:${ev.catColor}">${ev.category}</div>
        <h3 class="event-card-name">${esc(ev.name)}</h3>
        <div class="event-card-meta">
          <div class="event-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${formatDate(ev.date)}
          </div>
          <div class="event-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${esc(ev.location)}
          </div>
          <div class="event-meta-item" style="color:var(--gray-400)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            ${esc(ev.seats)}
          </div>
        </div>
      </div>
      <div class="event-card-footer">
        <button class="event-register-btn" style="background:${ev.registerBg};color:${ev.registerColor}" data-event-id="${ev.id}">Register Now</button>
      </div>
    </div>
  `).join('');

  // Register button handler
  container.querySelectorAll('.event-register-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ev = events.find(e => e.id === btn.dataset.eventId);
      if (ev) {
        btn.textContent = '✓ Registered!';
        btn.style.background = 'var(--green-500)';
        btn.disabled = true;
      }
    });
  });
}

/* ══════════════════════════════════════════════
   11. ADD ASSIGNMENT MODAL
══════════════════════════════════════════════ */

function openAddModal() {
  const modal = $('#addModal');
  if (!modal) return;
  modal.removeAttribute('hidden');
  // Set min date to today
  const dateInput = $('#inp-deadline');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
  requestAnimationFrame(() => $('#inp-title')?.focus());
}

function closeAddModal() {
  const modal = $('#addModal');
  if (!modal) return;
  modal.setAttribute('hidden', '');
  $('#addAssignmentForm')?.reset();
  // Hide errors
  $$('.form-error').forEach(el => el.classList.add('hidden'));
}

function handleAddAssignment(e) {
  e.preventDefault();

  const title    = $('#inp-title').value.trim();
  const course   = $('#inp-course').value;
  const priority = $('#inp-priority').value;
  const deadline = $('#inp-deadline').value;

  // Validate
  let valid = true;
  if (!title)    { $('#err-title').classList.remove('hidden'); valid = false; } else { $('#err-title').classList.add('hidden'); }
  if (!course)   { $('#err-course').classList.remove('hidden'); valid = false; } else { $('#err-course').classList.add('hidden'); }
  if (!deadline) { $('#err-deadline').classList.remove('hidden'); valid = false; } else { $('#err-deadline').classList.add('hidden'); }
  if (!valid) return;

  // Create assignment
  const newAssignment = {
    id:        `a${Date.now()}`,
    title,
    course,
    priority:  priority || 'medium',
    deadline,
    completed: false,
    notes:     $('#inp-notes').value.trim(),
  };

  assignments.unshift(newAssignment);
  closeAddModal();
  renderAssignments();
  renderDashDeadlines();
  renderKPIs();

  // Navigate to assignments if not there
  navigateTo('assignments');
}

/* ══════════════════════════════════════════════
   12. PROFILE PANEL
══════════════════════════════════════════════ */

function openProfile() {
  const panel   = $('#profilePanel');
  const overlay = $('#profileOverlay');
  if (panel)   panel.removeAttribute('hidden');
  if (overlay) { overlay.removeAttribute('hidden'); overlay.classList.add('visible'); }
  document.body.style.overflow = 'hidden';
}

function closeProfile() {
  const panel   = $('#profilePanel');
  const overlay = $('#profileOverlay');
  if (panel)   panel.setAttribute('hidden', '');
  if (overlay) { overlay.setAttribute('hidden', ''); overlay.classList.remove('visible'); }
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════
   13. EVENT WIRING
══════════════════════════════════════════════ */

function wireEvents() {
  // ── Sidebar nav links ──
  $$('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(item.dataset.section);
    });
  });

  // ── Menu toggle (mobile) ──
  $('#menuToggle')?.addEventListener('click', openSidebar);
  $('#sidebarOverlay')?.addEventListener('click', closeSidebar);

  // ── Quick action buttons ──
  $$('.qa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      const filter  = btn.dataset.filter || null;
      if (section) navigateTo(section, filter);
      if (btn.dataset.action === 'add-assignment') openAddModal();
    });
  });

  // ── Card "See all" / "Details" links ──
  document.addEventListener('click', e => {
    const link = e.target.closest('.card-link[data-section]');
    if (link) navigateTo(link.dataset.section);
  });

  // ── Assignment filter tabs ──
  $$('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => setAssignmentFilter(btn.dataset.filter));
  });

  // ── Assignment list — delegation (toggle / delete) ──
  $('#assignmentList')?.addEventListener('click', e => {
    const action = e.target.dataset.action;
    const id     = e.target.dataset.id;
    if (!action || !id) return;

    if (action === 'toggle') {
      const a = assignments.find(x => x.id === id);
      if (a) {
        a.completed = !a.completed;
        renderAssignments();
        renderDashDeadlines();
        renderKPIs();
      }
    }
    if (action === 'delete') {
      if (confirm('Delete this assignment?')) {
        assignments = assignments.filter(x => x.id !== id);
        renderAssignments();
        renderDashDeadlines();
        renderKPIs();
      }
    }
  });

  // ── Add assignment modal ──
  $('#openAddModal')?.addEventListener('click', openAddModal);
  $('#closeModal')?.addEventListener('click', closeAddModal);
  $('#cancelModal')?.addEventListener('click', closeAddModal);
  $('#addAssignmentForm')?.addEventListener('submit', handleAddAssignment);
  $('#addModal')?.addEventListener('click', e => { if (e.target === $('#addModal')) closeAddModal(); });

  // ── Profile ──
  $('#topbarAvatar')?.addEventListener('click', openProfile);
  $('#closeProfile')?.addEventListener('click', closeProfile);
  $('#profileOverlay')?.addEventListener('click', closeProfile);

  // ── Notification button ──
  $('#notifBtn')?.addEventListener('click', () => navigateTo('announcements'));

  // ── Keyboard: Escape closes modals/panels ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeAddModal();
      closeProfile();
    }
  });
}

/* ══════════════════════════════════════════════
   14. INIT
══════════════════════════════════════════════ */

(function init() {
  // Determine today's day for schedule default
  const todayName = DAYS[new Date().getDay()];
  // Default to Monday if today is Sunday and has no classes, else use today
  state.scheduleDay = scheduleData[todayName]?.length > 0 ? todayName : 'Monday';

  // Initialise each section
  initDashboard();

  // Schedule
  renderDayTabs();
  renderScheduleForDay(state.scheduleDay);

  // Assignments
  renderAssignments();

  // Progress
  renderProgress();

  // Announcements
  initAnnouncements();

  // Events
  initEvents();

  // Wire all interactions
  wireEvents();

  // Default active section: dashboard
  navigateTo('dashboard');

  console.info('CampusFlow initialised ✓');
})();
