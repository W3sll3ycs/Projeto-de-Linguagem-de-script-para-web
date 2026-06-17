/* add-movie.js */

// ─── Elementos ───────────────────────────────────────────────────────────────
const titleEl       = document.getElementById('title');
const originalEl    = document.getElementById('original');
const yearEl        = document.getElementById('year');
const durationEl    = document.getElementById('duration');
const ratingEl      = document.getElementById('rating');
const directorEl    = document.getElementById('director');
const countryEl     = document.getElementById('country');
const languageEl    = document.getElementById('language');
const posterEl      = document.getElementById('poster');
const synopsisEl    = document.getElementById('synopsis');
const charCountEl   = document.getElementById('charCount');
const assistidoEmEl = document.getElementById('assistidoEm');
const starPickerEl  = document.getElementById('starPicker');
const ratingHintEl  = document.getElementById('ratingHint');

const featuredToggle = document.getElementById('featuredToggle');
const featuredLabel  = document.getElementById('featuredLabel');
const previewBadge   = document.getElementById('previewBadge');

const genreGrid     = document.getElementById('genreGrid');

const previewTitle  = document.getElementById('previewTitle');
const previewYear   = document.getElementById('previewYear');
const previewRating = document.getElementById('previewRating');
const previewGenres = document.getElementById('previewGenres');
const previewImg    = document.getElementById('previewImg');
const imgPlaceholder= document.getElementById('imgPlaceholder');

const savedList     = document.getElementById('savedList');
const savedCount    = document.getElementById('savedCount');

const toast         = document.getElementById('toast');
const btnSave       = document.getElementById('btnSave');
const btnReset      = document.getElementById('btnReset');
const btnExport     = document.getElementById('btnExport');
const resetModal    = document.getElementById('resetModal');
const btnResetConfirm = document.getElementById('btnResetConfirm');
const btnResetCancel  = document.getElementById('btnResetCancel');

// ─── Estado ───────────────────────────────────────────────────────────────────
let selectedGenres = [];
let isFeatured = false;
let movies = loadMovies();

// ─── Init ─────────────────────────────────────────────────────────────────────
renderSavedList();
updateSavedCount();

// ─── Prévia ao vivo ───────────────────────────────────────────────────────────
function updatePreview() {
  previewTitle.textContent  = titleEl.value.trim() || 'Título do filme';
  previewYear.textContent   = yearEl.value.trim()   || '—';
  previewRating.textContent = ratingEl.value ? `★ ${ratingEl.value}/5` : '★ —';
  previewGenres.textContent = selectedGenres.slice(0,2).join(' · ') || '';

  const url = posterEl.value.trim();
  if (url) {
    previewImg.src = url;
    previewImg.onload  = () => { previewImg.classList.add('visible'); imgPlaceholder.style.display = 'none'; };
    previewImg.onerror = () => { previewImg.classList.remove('visible'); imgPlaceholder.style.display = 'flex'; };
  } else {
    previewImg.src = '';
    previewImg.classList.remove('visible');
    imgPlaceholder.style.display = 'flex';
  }

  previewBadge.style.display = isFeatured ? 'block' : 'none';
}

[titleEl, yearEl, posterEl, synopsisEl].forEach(el =>
  el.addEventListener('input', updatePreview)
);

// ─── Sistema de Avaliação por Estrelas ───────────────────────────────────────
let notaSelecionada = 0;

starPickerEl.querySelectorAll('.star').forEach(star => {
  // Hover: ilumina até a estrela sob o cursor
  star.addEventListener('mouseenter', () => {
    const val = parseInt(star.dataset.value);
    starPickerEl.querySelectorAll('.star').forEach(s => {
      s.classList.toggle('hover', parseInt(s.dataset.value) <= val);
    });
  });

  // Mouse sai: volta ao estado selecionado
  star.addEventListener('mouseleave', () => {
    starPickerEl.querySelectorAll('.star').forEach(s => {
      s.classList.remove('hover');
    });
  });

  // Clique: fixa a nota
  star.addEventListener('click', () => {
    notaSelecionada = parseInt(star.dataset.value);
    ratingEl.value = notaSelecionada;

    starPickerEl.querySelectorAll('.star').forEach(s => {
      s.classList.toggle('selected', parseInt(s.dataset.value) <= notaSelecionada);
    });

    const labels = ['', '1 — Fraco', '2 — Regular', '3 — Bom', '4 — Ótimo', '5 — Excelente'];
    ratingHintEl.textContent = labels[notaSelecionada];
    updatePreview();
  });
});



// ─── Contador de caracteres ───────────────────────────────────────────────────
synopsisEl.addEventListener('input', () => {
  const len = synopsisEl.value.length;
  charCountEl.textContent = len;
  if (len > 600) synopsisEl.value = synopsisEl.value.slice(0, 600);
});

// ─── Gêneros ──────────────────────────────────────────────────────────────────
genreGrid.querySelectorAll('.genre-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const genre = btn.dataset.genre;
    if (selectedGenres.includes(genre)) {
      selectedGenres = selectedGenres.filter(g => g !== genre);
      btn.classList.remove('active');
    } else {
      selectedGenres.push(genre);
      btn.classList.add('active');
    }
    updatePreview();
  });
});

// ─── Toggle destaque ─────────────────────────────────────────────────────────
featuredToggle.addEventListener('click', () => {
  isFeatured = !isFeatured;
  featuredToggle.setAttribute('aria-pressed', String(isFeatured));
  featuredLabel.textContent = isFeatured ? 'Destacado' : 'Não destacado';
  updatePreview();
});

// ─── Validação ────────────────────────────────────────────────────────────────
function validate() {
  let ok = true;

  [titleEl, yearEl].forEach(el => el.classList.remove('error'));

  if (!titleEl.value.trim()) {
    titleEl.classList.add('error');
    ok = false;
  }
  if (!yearEl.value.trim()) {
    yearEl.classList.add('error');
    ok = false;
  }
  if (!ratingEl.value || notaSelecionada === 0) {
    showToast('Selecione uma avaliação de 1 a 5 estrelas.', 'error');
    ok = false;
  }
  if (selectedGenres.length === 0) {
    showToast('Selecione ao menos um gênero.', 'error');
    ok = false;
  }

  return ok;
}

// ─── Salvar ───────────────────────────────────────────────────────────────────
btnSave.addEventListener('click', () => {
  if (!validate()) {
    showToast('Preencha os campos obrigatórios.', 'error');
    return;
  }

  const movie = {
    id:        Date.now(),
    title:     titleEl.value.trim(),
    original:  originalEl.value.trim(),
    year:      parseInt(yearEl.value),
    duration:  durationEl.value ? parseInt(durationEl.value) : null,
    nota:      notaSelecionada,
    rating:    parseFloat(ratingEl.value),
    director:  directorEl.value.trim(),
    country:   countryEl.value.trim(),
    language:  languageEl.value.trim(),
    poster:    posterEl.value.trim(),
    synopsis:  synopsisEl.value.trim(),
    genres:    [...selectedGenres],
    assistidoEm: assistidoEmEl.value || null,
    featured:  isFeatured,
    addedAt:   new Date().toISOString(),
  };

  movies.unshift(movie);
  saveMovies(movies);
  renderSavedList();
  updateSavedCount();
  showToast(`"${movie.title}" adicionado com sucesso!`, 'success');
  resetForm();
});

// ─── Reset ────────────────────────────────────────────────────────────────────
btnReset.addEventListener('click', () => resetModal.classList.remove('hidden'));
btnResetCancel.addEventListener('click', () => resetModal.classList.add('hidden'));
btnResetConfirm.addEventListener('click', () => {
  resetModal.classList.add('hidden');
  resetForm();
  showToast('Formulário limpo.', 'success');
});

function resetForm() {
  [titleEl, originalEl, yearEl, durationEl, ratingEl,
   directorEl, countryEl, languageEl, posterEl, synopsisEl].forEach(el => {
    el.value = '';
    el.classList.remove('error');
  });

  selectedGenres = [];
  genreGrid.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));

  isFeatured = false;
  featuredToggle.setAttribute('aria-pressed', 'false');
  featuredLabel.textContent = 'Não destacado';

  charCountEl.textContent = '0';
  notaSelecionada = 0;
  ratingEl.value = '';
  starPickerEl.querySelectorAll('.star').forEach(s => s.classList.remove('selected', 'hover'));
  ratingHintEl.textContent = 'Clique para avaliar';
  updatePreview();
}

// ─── Lista de salvos ──────────────────────────────────────────────────────────
function renderSavedList() {
  if (movies.length === 0) {
    savedList.innerHTML = '<p class="saved-empty">Nenhum filme adicionado ainda.</p>';
    return;
  }
  savedList.innerHTML = movies.map(m => `
    <div class="saved-item" data-id="${m.id}">
      <div class="saved-item-info">
        <div class="saved-item-title">${m.title}</div>
        <div class="saved-item-meta">${m.year} · ${'★'.repeat(m.nota || 0)}${'&#9734;'.repeat(5 - (m.nota || 0))} (${m.nota || '?'}/5)</div>
      </div>
      <button class="saved-item-remove" data-remove="${m.id}" title="Remover">×</button>
    </div>
  `).join('');

  savedList.querySelectorAll('.saved-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.remove);
      const removed = movies.find(m => m.id === id);
      movies = movies.filter(m => m.id !== id);
      saveMovies(movies);
      renderSavedList();
      updateSavedCount();
      if (removed) showToast(`"${removed.title}" removido.`, 'success');
    });
  });
}

function updateSavedCount() {
  savedCount.textContent = movies.length;
}

// ─── Exportar JSON ────────────────────────────────────────────────────────────
btnExport.addEventListener('click', () => {
  if (movies.length === 0) {
    showToast('Nenhum filme para exportar.', 'error');
    return;
  }
  const blob = new Blob([JSON.stringify(movies, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `cinelog_filmes_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('JSON exportado com sucesso!', 'success');
});

// ─── Persistência (localStorage) ──────────────────────────────────────────────
function saveMovies(list) {
  try { localStorage.setItem('cinelog_movies', JSON.stringify(list)); } catch {}
}

function loadMovies() {
  try {
    const raw = localStorage.getItem('cinelog_movies');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className   = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// ─── Fechar modal com ESC ─────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !resetModal.classList.contains('hidden')) {
    resetModal.classList.add('hidden');
  }
});