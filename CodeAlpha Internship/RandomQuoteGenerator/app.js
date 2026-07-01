'use strict';

// ─── Quote Database ───────────────────────────────────
const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Motivation" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "Life" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West", category: "Life" },
  { text: "Get busy living or get busy dying.", author: "Stephen King", category: "Life" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "Success" },
  { text: "Success is not final; failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill", category: "Success" },
  { text: "The secret of success is to do the common thing uncommonly well.", author: "John D. Rockefeller", category: "Success" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson", category: "Success" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser", category: "Success" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "Wisdom" },
  { text: "Wonder is the beginning of wisdom.", author: "Socrates", category: "Wisdom" },
  { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi", category: "Wisdom" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", category: "Wisdom" },
  { text: "The measure of intelligence is the ability to change.", author: "Albert Einstein", category: "Wisdom" },
  { text: "Imagination is more important than knowledge.", author: "Albert Einstein", category: "Science" },
  { text: "The important thing is not to stop questioning.", author: "Albert Einstein", category: "Science" },
  { text: "Science is a way of thinking much more than it is a body of knowledge.", author: "Carl Sagan", category: "Science" },
  { text: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson", category: "Science" },
  { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan", category: "Science" },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein", category: "Creativity" },
  { text: "Every child is an artist. The problem is how to remain an artist once we grow up.", author: "Pablo Picasso", category: "Creativity" },
  { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou", category: "Creativity" },
  { text: "An idea that is not dangerous is unworthy of being called an idea at all.", author: "Oscar Wilde", category: "Creativity" },
  { text: "The desire to create is one of the deepest yearnings of the human soul.", author: "Dieter F. Uchtdorf", category: "Creativity" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson", category: "Motivation" },
  { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa", category: "Life" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt", category: "Motivation" },
];

// ─── State ────────────────────────────────────────────
let filteredQuotes = [...QUOTES];
let currentQuoteIndex = 0;
let favorites = JSON.parse(localStorage.getItem('rqg_favorites')) || [];
let isLightMode = localStorage.getItem('rqg_theme') === 'light';

// Apply saved theme
if (isLightMode) document.body.classList.add('light');

// ─── Utilities ────────────────────────────────────────
function saveFavorites() {
  localStorage.setItem('rqg_favorites', JSON.stringify(favorites));
}
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2600);
}
function getInitials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function hashColor(str) {
  const colors = [
    'linear-gradient(135deg,#c084fc,#f472b6)',
    'linear-gradient(135deg,#38bdf8,#818cf8)',
    'linear-gradient(135deg,#fb923c,#f43f5e)',
    'linear-gradient(135deg,#34d399,#06b6d4)',
    'linear-gradient(135deg,#fbbf24,#f97316)',
    'linear-gradient(135deg,#a78bfa,#ec4899)',
  ];
  let h = 0;
  for (let c of str) h = (h * 31 + c.charCodeAt(0)) % colors.length;
  return colors[h];
}

// ─── Render Quote ─────────────────────────────────────
function renderQuote(quote, index) {
  const textEl = document.getElementById('quoteText');
  const authorEl = document.getElementById('authorName');
  const catEl = document.getElementById('quoteCategory');
  const avatarEl = document.getElementById('authorAvatar');
  const numEl = document.getElementById('quoteNumber');
  const counterEl = document.getElementById('quoteCounter');

  // Fade out
  textEl.classList.add('fade');
  setTimeout(() => {
    textEl.textContent = quote.text;
    authorEl.textContent = quote.author;
    catEl.textContent = quote.category;
    avatarEl.textContent = getInitials(quote.author);
    avatarEl.style.background = hashColor(quote.author);
    numEl.textContent = `#${index + 1}`;
    counterEl.textContent = `Quote ${index + 1} of ${filteredQuotes.length}`;

    // Update like button
    const isLiked = favorites.some(f => f.text === quote.text && f.author === quote.author);
    updateLikeBtn(isLiked);

    textEl.classList.remove('fade');
  }, 200);

  // Replay card animation
  const card = document.getElementById('quoteCard');
  card.style.animation = 'none';
  requestAnimationFrame(() => { card.style.animation = ''; });
}

function updateLikeBtn(liked) {
  const btn = document.getElementById('likeBtn');
  const icon = document.getElementById('heartIcon');
  const label = document.getElementById('likeLabel');
  if (liked) {
    btn.classList.add('liked');
    icon.classList.add('liked');
    label.textContent = 'Saved';
  } else {
    btn.classList.remove('liked');
    icon.classList.remove('liked');
    label.textContent = 'Save';
  }
}

// ─── New Quote ────────────────────────────────────────
function newQuote() {
  if (filteredQuotes.length === 0) { showToast('No quotes in this category.'); return; }
  let next;
  do {
    next = Math.floor(Math.random() * filteredQuotes.length);
  } while (next === currentQuoteIndex && filteredQuotes.length > 1);
  currentQuoteIndex = next;
  renderQuote(filteredQuotes[currentQuoteIndex], currentQuoteIndex);
}

// ─── Category Filter ──────────────────────────────────
function filterCategory(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filteredQuotes = cat === 'all' ? [...QUOTES] : QUOTES.filter(q => q.category === cat);
  currentQuoteIndex = 0;
  if (filteredQuotes.length > 0) {
    renderQuote(filteredQuotes[0], 0);
  } else {
    document.getElementById('quoteText').textContent = 'No quotes in this category.';
  }
}

// ─── Favorites ────────────────────────────────────────
function toggleFavorite() {
  const q = filteredQuotes[currentQuoteIndex];
  if (!q) return;
  const existIdx = favorites.findIndex(f => f.text === q.text && f.author === q.author);
  if (existIdx !== -1) {
    favorites.splice(existIdx, 1);
    updateLikeBtn(false);
    showToast('💔 Removed from favorites');
  } else {
    favorites.push(q);
    updateLikeBtn(true);
    showToast('❤️ Saved to favorites!');
  }
  saveFavorites();
  updateFavCount();
  renderFavList();
}

function updateFavCount() {
  const el = document.getElementById('favCount');
  el.textContent = favorites.length;
  el.style.display = favorites.length === 0 ? 'none' : 'flex';
}

function renderFavList() {
  const list = document.getElementById('favList');
  if (favorites.length === 0) {
    list.innerHTML = '<div class="fav-empty">No saved quotes yet.<br/>Tap the heart to save!</div>';
    return;
  }
  list.innerHTML = favorites.map((q, i) => `
    <div class="fav-item">
      <button class="fav-remove" onclick="removeFav(${i})" title="Remove">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="fav-item-text">"${escapeHtml(q.text)}"</div>
      <div class="fav-item-author">— ${escapeHtml(q.author)}</div>
    </div>
  `).join('');
}

function removeFav(index) {
  favorites.splice(index, 1);
  saveFavorites();
  updateFavCount();
  renderFavList();
  // Update like button if current quote is affected
  const q = filteredQuotes[currentQuoteIndex];
  if (q) updateLikeBtn(favorites.some(f => f.text === q.text && f.author === q.author));
  showToast('💔 Removed from favorites');
}

function toggleFavoritesPanel() {
  const panel = document.getElementById('favoritesPanel');
  const backdrop = document.getElementById('panelBackdrop');
  panel.classList.toggle('open');
  backdrop.classList.toggle('active');
}

// ─── Copy & Share ─────────────────────────────────────
function copyQuote() {
  const q = filteredQuotes[currentQuoteIndex];
  if (!q) return;
  const text = `"${q.text}" — ${q.author}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      document.getElementById('copyLabel').textContent = 'Copied!';
      setTimeout(() => { document.getElementById('copyLabel').textContent = 'Copy'; }, 2000);
      showToast('📋 Quote copied to clipboard!');
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('📋 Quote copied!');
  }
}

function shareQuote() {
  const q = filteredQuotes[currentQuoteIndex];
  if (!q) return;
  const text = `"${q.text}" — ${q.author}`;
  if (navigator.share) {
    navigator.share({ title: 'QuoteVerse', text }).catch(() => {});
  } else {
    copyQuote();
    showToast('🔗 Link copied! Share it anywhere.');
  }
}

// ─── Dark / Light Toggle ──────────────────────────────
function toggleDark() {
  isLightMode = !isLightMode;
  document.body.classList.toggle('light', isLightMode);
  localStorage.setItem('rqg_theme', isLightMode ? 'light' : 'dark');
  const icon = document.getElementById('themeIcon');
  icon.innerHTML = isLightMode
    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
    : '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

// ─── Keyboard Shortcuts ───────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); newQuote(); }
  if (e.key === 'f' || e.key === 'F') toggleFavorite();
  if (e.key === 'c' || e.key === 'C') copyQuote();
  if (e.key === 'Escape') {
    const panel = document.getElementById('favoritesPanel');
    if (panel.classList.contains('open')) toggleFavoritesPanel();
  }
});

// ─── Init ─────────────────────────────────────────────
// Pick a random starting quote
currentQuoteIndex = Math.floor(Math.random() * filteredQuotes.length);
renderQuote(filteredQuotes[currentQuoteIndex], currentQuoteIndex);
updateFavCount();
renderFavList();
// Hide fav count if 0
document.getElementById('favCount').style.display = favorites.length === 0 ? 'none' : 'flex';
