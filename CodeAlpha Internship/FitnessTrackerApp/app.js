'use strict';

// ─── Constants ────────────────────────────────────────
const EXERCISE_EMOJIS = {
  Running: '🏃', Cycling: '🚴', Swimming: '🏊',
  Gym: '🏋️', Yoga: '🧘', Walking: '🚶',
  HIIT: '⚡', Sports: '⚽',
};
// MET (Metabolic Equivalent) values per exercise type
const EXERCISE_MET = {
  Running: 9.8, Cycling: 7.5, Swimming: 8.0,
  Gym: 5.5, Yoga: 3.0, Walking: 3.5,
  HIIT: 12.0, Sports: 8.0,
};
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── State ────────────────────────────────────────────
let activities = JSON.parse(localStorage.getItem('ft_activities')) || [];
let goals = JSON.parse(localStorage.getItem('ft_goals')) || { steps: 10000, calories: 500, duration: 60 };
let selectedType = 'Running';
let selectedIntensity = 'Medium';

// ─── Utilities ────────────────────────────────────────
function uid() { return '_' + Math.random().toString(36).slice(2, 9); }
function save()  { localStorage.setItem('ft_activities', JSON.stringify(activities)); }
function saveGoals() {
  goals.steps    = parseInt(document.getElementById('goalSteps').value) || 10000;
  goals.calories = parseInt(document.getElementById('goalCalories').value) || 500;
  goals.duration = parseInt(document.getElementById('goalDuration').value) || 60;
  localStorage.setItem('ft_goals', JSON.stringify(goals));
  // Update goal labels on dashboard
  document.getElementById('stepsGoalLabel').textContent = `Goal: ${goals.steps.toLocaleString()}`;
  document.getElementById('calsGoalLabel').textContent = `Goal: ${goals.calories} kcal`;
  document.getElementById('durGoalLabel').textContent = `Goal: ${goals.duration} min`;
  showToast('🎯 Goals saved!');
  updateDashboard();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}
function todayStr() { return new Date().toISOString().split('T')[0]; }
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}
function parseDate(dateStr) { return new Date(dateStr + 'T00:00:00'); }

// ─── Navigation ───────────────────────────────────────
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page' + capitalize(page)).classList.add('active');
  document.getElementById('nav' + capitalize(page)).classList.add('active');

  if (page === 'dashboard') updateDashboard();
  if (page === 'history') renderHistory();
  if (page === 'goals') updateGoalRings();
  closeSidebar();
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ─── Mobile Sidebar ───────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarBackdrop').classList.toggle('active');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('active');
}

// ─── Date & Time Init ─────────────────────────────────
function initDates() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('todayDateLabel').textContent = dateStr;
  document.getElementById('mobileDate').textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  document.getElementById('logDate').value = todayStr();
}

// ─── Activity Form ────────────────────────────────────
function selectType(btn) {
  document.querySelectorAll('.ex-type').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedType = btn.dataset.type;
  estimateCalories();
}
function selectIntensity(btn) {
  document.querySelectorAll('.intensity-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedIntensity = btn.dataset.level;
}

function estimateCalories() {
  const weight = parseFloat(document.getElementById('estWeight').value) || 70;
  const dur = parseFloat(document.getElementById('logDuration').value) || 0;
  const met = EXERCISE_MET[selectedType] || 5;
  if (dur <= 0) { document.getElementById('estValue').textContent = '—'; return; }
  const kcal = Math.round(met * weight * (dur / 60));
  document.getElementById('estValue').textContent = `${kcal} kcal`;
}

function applyEstimate() {
  const val = document.getElementById('estValue').textContent;
  if (val === '—') { showToast('⚠️ Enter duration first.'); return; }
  const num = parseInt(val);
  document.getElementById('logCalories').value = num;
  showToast(`✅ Estimated ${num} kcal applied!`);
}

function logActivity() {
  const date = document.getElementById('logDate').value;
  const duration = parseInt(document.getElementById('logDuration').value);
  const calories = parseInt(document.getElementById('logCalories').value);
  const steps = parseInt(document.getElementById('logSteps').value) || 0;
  const notes = document.getElementById('logNotes').value.trim();

  if (!date) { showToast('⚠️ Please select a date.'); return; }
  if (!duration || duration <= 0) { showToast('⚠️ Please enter a valid duration.'); return; }
  if (!calories && calories !== 0) { showToast('⚠️ Please enter calories burned.'); return; }

  const activity = { id: uid(), date, type: selectedType, duration, calories, steps, intensity: selectedIntensity, notes };
  activities.push(activity);
  save();

  // Reset form
  document.getElementById('logDuration').value = '';
  document.getElementById('logCalories').value = '';
  document.getElementById('logSteps').value = '';
  document.getElementById('logNotes').value = '';
  document.getElementById('estValue').textContent = '—';

  showToast(`✅ ${selectedType} logged! 🔥 ${calories} kcal`);
  updateDashboard();
}

// ─── Dashboard ────────────────────────────────────────
function updateDashboard() {
  const today = todayStr();
  const todayActs = activities.filter(a => a.date === today);

  const totalSteps = todayActs.reduce((s, a) => s + (a.steps || 0), 0);
  const totalCals  = todayActs.reduce((s, a) => s + (a.calories || 0), 0);
  const totalDur   = todayActs.reduce((s, a) => s + (a.duration || 0), 0);
  const totalWork  = todayActs.length;

  // Animate numbers
  animateNumber('todaySteps', totalSteps, v => v.toLocaleString());
  animateNumber('todayCalories', totalCals, v => v.toLocaleString());
  document.getElementById('todayDuration').textContent = totalDur + ' min';
  animateNumber('todayWorkouts', totalWork);

  // Progress bars
  const stepsGoal = goals.steps || 10000;
  const calsGoal  = goals.calories || 500;
  const durGoal   = goals.duration || 60;

  document.getElementById('stepsProgress').style.width    = Math.min(100, (totalSteps / stepsGoal) * 100) + '%';
  document.getElementById('calsProgress').style.width     = Math.min(100, (totalCals / calsGoal) * 100) + '%';
  document.getElementById('durProgress').style.width      = Math.min(100, (totalDur / durGoal) * 100) + '%';
  document.getElementById('workoutsProgress').style.width = Math.min(100, (totalWork / 2) * 100) + '%';

  // Goal labels
  document.getElementById('stepsGoalLabel').textContent = `Goal: ${stepsGoal.toLocaleString()}`;
  document.getElementById('calsGoalLabel').textContent  = `Goal: ${calsGoal} kcal`;
  document.getElementById('durGoalLabel').textContent   = `Goal: ${durGoal} min`;

  // Today's activity list
  renderTodayActivities(todayActs);

  // Weekly chart
  renderWeeklyChart();
}

function animateNumber(id, target, formatter = v => v) {
  const el = document.getElementById(id);
  const start = parseInt(el.textContent.replace(/\D/g, '')) || 0;
  const duration = 600;
  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const val = Math.round(start + (target - start) * progress);
    el.textContent = formatter(val);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderTodayActivities(todayActs) {
  const list = document.getElementById('todayActivities');
  document.getElementById('todayCount').textContent = todayActs.length;

  if (todayActs.length === 0) {
    list.innerHTML = '<div class="empty-list"><span class="empty-emoji">🌟</span><p>No activities logged today.<br>Start moving!</p></div>';
    return;
  }

  list.innerHTML = todayActs.slice().reverse().map(a => `
    <div class="activity-item" id="act-${a.id}">
      <span class="activity-emoji">${EXERCISE_EMOJIS[a.type] || '🏃'}</span>
      <div class="activity-info">
        <div class="activity-type">${a.type}</div>
        <div class="activity-meta">⏱ ${a.duration} min · ${a.intensity}${a.steps ? ` · 👣 ${a.steps.toLocaleString()}` : ''}</div>
      </div>
      <div class="activity-cals">🔥 ${a.calories}</div>
      <button class="activity-delete" onclick="deleteActivity('${a.id}')" title="Delete">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `).join('');
}

function deleteActivity(id) {
  activities = activities.filter(a => a.id !== id);
  save();
  updateDashboard();
  renderHistory();
  showToast('🗑️ Activity removed.');
}

// ─── Weekly Chart ─────────────────────────────────────
function renderWeeklyChart() {
  const chart = document.getElementById('weeklyChart');
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const maxCals = Math.max(...days.map(d => {
    const ds = d.toISOString().split('T')[0];
    return activities.filter(a => a.date === ds).reduce((s, a) => s + a.calories, 0);
  }), 1);

  const todayDs = today.toISOString().split('T')[0];

  chart.innerHTML = days.map(d => {
    const ds = d.toISOString().split('T')[0];
    const cals = activities.filter(a => a.date === ds).reduce((s, a) => s + a.calories, 0);
    const pct = (cals / maxCals) * 100;
    const isToday = ds === todayDs;
    const label = DAYS[d.getDay()];
    return `
      <div class="bar-col ${isToday ? 'bar-today' : ''}">
        <div class="bar-wrap">
          <div class="bar" style="height:${Math.max(pct, 2)}%">
            <div class="bar-tooltip">${cals} kcal</div>
          </div>
        </div>
        <div class="bar-label">${isToday ? '<b>Today</b>' : label}</div>
      </div>
    `;
  }).join('');
}

// ─── History ──────────────────────────────────────────
function renderHistory() {
  const list = document.getElementById('historyList');
  const typeFilter = document.getElementById('filterType').value;
  const periodFilter = parseInt(document.getElementById('filterPeriod').value);
  const today = new Date();

  let filtered = [...activities];
  if (typeFilter !== 'all') filtered = filtered.filter(a => a.type === typeFilter);
  if (!isNaN(periodFilter)) {
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - periodFilter);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    filtered = filtered.filter(a => a.date >= cutoffStr);
  }
  filtered.sort((a, b) => b.date.localeCompare(a.date));

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-list center"><span class="empty-emoji">📋</span><p>No activities found.</p></div>';
    return;
  }

  list.innerHTML = filtered.map(a => {
    const d = parseDate(a.date);
    return `
      <div class="history-item">
        <div class="history-date-badge">
          <div class="history-day">${d.getDate()}</div>
          <div class="history-month">${MONTHS[d.getMonth()]}</div>
        </div>
        <span class="history-icon">${EXERCISE_EMOJIS[a.type] || '🏃'}</span>
        <div class="history-details">
          <div class="history-type">${a.type}</div>
          <div class="history-meta">⏱ ${a.duration} min${a.steps ? ` · 👣 ${a.steps.toLocaleString()} steps` : ''}</div>
          ${a.notes ? `<div class="history-notes">"${escapeHtml(a.notes)}"</div>` : ''}
        </div>
        <div class="history-stats">
          <div class="history-cal">🔥 ${a.calories} kcal</div>
          <div class="intensity-pill intensity-${a.intensity.toLowerCase()}">${a.intensity}</div>
        </div>
        <button class="history-delete" onclick="deleteActivity('${a.id}')" title="Delete">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
        </button>
      </div>
    `;
  }).join('');
}

function clearHistory() {
  if (!confirm('Are you sure you want to delete all activity history? This cannot be undone.')) return;
  activities = [];
  save();
  updateDashboard();
  renderHistory();
  showToast('🗑️ All history cleared.');
}

// ─── Goals Rings ──────────────────────────────────────
function updateGoalRings() {
  document.getElementById('goalSteps').value    = goals.steps;
  document.getElementById('goalCalories').value = goals.calories;
  document.getElementById('goalDuration').value = goals.duration;

  const today = todayStr();
  const todayActs = activities.filter(a => a.date === today);
  const totalSteps = todayActs.reduce((s,a) => s+(a.steps||0), 0);
  const totalCals  = todayActs.reduce((s,a) => s+a.calories, 0);
  const totalDur   = todayActs.reduce((s,a) => s+a.duration, 0);

  setRing('ringSteps', totalSteps, goals.steps, 'ringStepsPct');
  setRing('ringCals',  totalCals,  goals.calories, 'ringCalsPct');
  setRing('ringDur',   totalDur,   goals.duration, 'ringDurPct');
}
function setRing(ringId, current, goal, pctId) {
  const pct = Math.min(1, current / goal);
  const circumference = 251.3;
  document.getElementById(ringId).style.strokeDashoffset = circumference * (1 - pct);
  document.getElementById(pctId).textContent = Math.round(pct * 100) + '%';
}

// ─── Escape HTML ──────────────────────────────────────
function escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

// ─── Keyboard Shortcuts ───────────────────────────────
document.addEventListener('keydown', e => {
  if (e.altKey) {
    if (e.key === '1') showPage('dashboard');
    if (e.key === '2') showPage('log');
    if (e.key === '3') showPage('history');
    if (e.key === '4') showPage('goals');
  }
});

// ─── Listen to form inputs for estimate ───────────────
document.getElementById('logDuration').addEventListener('input', estimateCalories);

// ─── Init ─────────────────────────────────────────────
initDates();
updateDashboard();

// Add some sample data if empty
if (activities.length === 0) {
  const sampleData = [
    { id: uid(), date: todayStr(), type: 'Running', duration: 30, calories: 280, steps: 3800, intensity: 'Medium', notes: 'Morning run!' },
    { id: uid(), date: todayStr(), type: 'Yoga', duration: 20, calories: 80, steps: 0, intensity: 'Low', notes: '' },
  ];
  // Yesterday
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yd = yesterday.toISOString().split('T')[0];
  sampleData.push({ id: uid(), date: yd, type: 'Cycling', duration: 45, calories: 400, steps: 0, intensity: 'High', notes: 'Hill training' });
  sampleData.push({ id: uid(), date: yd, type: 'Gym', duration: 60, calories: 320, steps: 2000, intensity: 'High', notes: '' });

  // More past days
  for (let i = 2; i <= 5; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const types = ['Running', 'Walking', 'Swimming', 'HIIT', 'Sports'];
    const t = types[i % types.length];
    sampleData.push({ id: uid(), date: ds, type: t, duration: 30 + i*5, calories: 150 + i*40, steps: i*1200, intensity: ['Low','Medium','High'][i%3], notes: '' });
  }

  activities = sampleData;
  save();
  updateDashboard();
}
