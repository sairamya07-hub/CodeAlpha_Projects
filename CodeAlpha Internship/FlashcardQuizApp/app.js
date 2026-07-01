/* =====================================================
   FLASHCARD QUIZ APP — JavaScript
   Full CRUD + LocalStorage + Flip Animation
   ===================================================== */

'use strict';

// ─── State ───────────────────────────────────────────
let cards = JSON.parse(localStorage.getItem('flashcards')) || [];
let currentIndex = 0;
let isFlipped = false;
let editingId = null;

// Default starter cards if empty
if (cards.length === 0) {
  cards = [
    { id: uid(), question: 'What is the capital of France?', answer: 'Paris', category: 'Geography' },
    { id: uid(), question: 'What does HTML stand for?', answer: 'HyperText Markup Language', category: 'Technology' },
    { id: uid(), question: 'Who wrote "To Kill a Mockingbird"?', answer: 'Harper Lee', category: 'Literature' },
    { id: uid(), question: 'What is the chemical symbol for Gold?', answer: 'Au (from Latin "Aurum")', category: 'Science' },
    { id: uid(), question: 'What is 15 × 8?', answer: '120', category: 'Math' },
  ];
  save();
}

// ─── Utilities ───────────────────────────────────────
function uid() {
  return '_' + Math.random().toString(36).slice(2, 9);
}
function save() {
  localStorage.setItem('flashcards', JSON.stringify(cards));
}
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// ─── Render Flashcard Viewer ──────────────────────────
function renderCard() {
  const qEl = document.getElementById('questionText');
  const aEl = document.getElementById('answerText');
  const progressBar = document.getElementById('progressBar');
  const progressPill = document.getElementById('progressPill');
  const totalPill = document.getElementById('totalCards');
  const card = document.getElementById('flashcard');
  const showBtn = document.getElementById('showAnswerBtn');

  // Reset flip
  isFlipped = false;
  card.classList.remove('flipped');

  if (cards.length === 0) {
    qEl.textContent = 'No flashcards yet. Add some below!';
    aEl.textContent = '';
    progressBar.style.width = '0%';
    progressPill.textContent = 'Card 0/0';
    totalPill.textContent = '0 Cards';
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').disabled = true;
    showBtn.disabled = true;
    return;
  }

  showBtn.disabled = false;
  currentIndex = clamp(currentIndex, 0, cards.length - 1);
  const c = cards[currentIndex];
  qEl.textContent = c.question;
  aEl.textContent = c.answer;

  const pct = ((currentIndex + 1) / cards.length) * 100;
  progressBar.style.width = pct + '%';
  progressPill.textContent = `Card ${currentIndex + 1}/${cards.length}`;
  totalPill.textContent = `${cards.length} Card${cards.length !== 1 ? 's' : ''}`;

  document.getElementById('prevBtn').disabled = currentIndex === 0;
  document.getElementById('nextBtn').disabled = currentIndex === cards.length - 1;
}

// ─── Render Cards Grid ────────────────────────────────
function renderGrid() {
  const grid = document.getElementById('cardsGrid');
  const empty = document.getElementById('emptyState');
  grid.innerHTML = '';

  if (cards.length === 0) {
    empty.classList.add('visible');
    return;
  }
  empty.classList.remove('visible');

  cards.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'card-item';
    div.innerHTML = `
      ${c.category ? `<div class="card-item-category">${escapeHtml(c.category)}</div>` : ''}
      <div class="card-item-q">${escapeHtml(c.question)}</div>
      <div class="card-item-a">${escapeHtml(c.answer)}</div>
      <div class="card-item-actions">
        <button class="action-btn action-edit" id="edit-${c.id}" onclick="editCard('${c.id}')">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
        <button class="action-btn action-delete" id="delete-${c.id}" onclick="deleteCard('${c.id}')">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          Delete
        </button>
      </div>
    `;
    grid.appendChild(div);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ─── Navigation ───────────────────────────────────────
function prevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    renderCard();
  }
}
function nextCard() {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    renderCard();
  }
}
function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  currentIndex = 0;
  renderCard();
  showToast('🔀 Cards shuffled!');
}

// ─── Flip ─────────────────────────────────────────────
function revealAnswer() {
  const card = document.getElementById('flashcard');
  isFlipped = !isFlipped;
  card.classList.toggle('flipped', isFlipped);
}

// Allow clicking the card to flip
document.getElementById('flashcard').addEventListener('click', function (e) {
  // Don't flip if clicking a button inside
  if (e.target.closest('button')) return;
  if (cards.length === 0) return;
  revealAnswer();
});

// ─── Rating ───────────────────────────────────────────
function rateCard(level) {
  const msgs = { hard: '💪 Keep practicing!', ok: '👍 Getting there!', easy: '🎉 You nailed it!' };
  showToast(msgs[level]);
  // Auto-advance
  setTimeout(() => {
    if (currentIndex < cards.length - 1) {
      nextCard();
    } else {
      showToast('🏁 All cards reviewed! Shuffling…');
      setTimeout(() => shuffleCards(), 800);
    }
  }, 600);
}

// ─── Modal ────────────────────────────────────────────
function openModal(id = null) {
  editingId = id;
  const modal = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');
  const saveBtn = document.getElementById('saveBtn');
  const qInput = document.getElementById('questionInput');
  const aInput = document.getElementById('answerInput');
  const catInput = document.getElementById('categoryInput');

  if (id) {
    const c = cards.find(x => x.id === id);
    title.textContent = 'Edit Flashcard';
    saveBtn.textContent = 'Update Card';
    qInput.value = c.question;
    aInput.value = c.answer;
    catInput.value = c.category || '';
  } else {
    title.textContent = 'Add Flashcard';
    saveBtn.textContent = 'Save Card';
    qInput.value = '';
    aInput.value = '';
    catInput.value = '';
  }

  modal.classList.add('active');
  setTimeout(() => qInput.focus(), 300);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  editingId = null;
}

function closeModalOnOverlay(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

function saveCard() {
  const q = document.getElementById('questionInput').value.trim();
  const a = document.getElementById('answerInput').value.trim();
  const cat = document.getElementById('categoryInput').value.trim();

  if (!q || !a) {
    showToast('⚠️ Please fill in both question and answer.');
    return;
  }

  if (editingId) {
    const idx = cards.findIndex(c => c.id === editingId);
    if (idx !== -1) {
      cards[idx] = { ...cards[idx], question: q, answer: a, category: cat };
      showToast('✅ Flashcard updated!');
    }
  } else {
    cards.push({ id: uid(), question: q, answer: a, category: cat });
    currentIndex = cards.length - 1;
    showToast('✅ Flashcard added!');
  }

  save();
  renderCard();
  renderGrid();
  closeModal();
}

// ─── Edit / Delete ────────────────────────────────────
function editCard(id) {
  openModal(id);
}
function deleteCard(id) {
  const idx = cards.findIndex(c => c.id === id);
  if (idx === -1) return;
  cards.splice(idx, 1);
  if (currentIndex >= cards.length) currentIndex = Math.max(0, cards.length - 1);
  save();
  renderCard();
  renderGrid();
  showToast('🗑️ Flashcard deleted.');
}

// ─── Keyboard Shortcuts ───────────────────────────────
document.addEventListener('keydown', (e) => {
  if (document.getElementById('modalOverlay').classList.contains('active')) return;
  switch (e.key) {
    case 'ArrowLeft':  prevCard(); break;
    case 'ArrowRight': nextCard(); break;
    case ' ':
    case 'Enter':
      e.preventDefault();
      if (cards.length > 0) revealAnswer();
      break;
  }
});

// ─── Init ─────────────────────────────────────────────
renderCard();
renderGrid();
