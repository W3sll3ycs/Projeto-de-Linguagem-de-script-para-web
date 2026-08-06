
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

let selectedGenres = [];
let isFeatured = false;
let notaSelecionada = 0;
let movies = [];
let editingId = null;

function mostrarAvisoLogin() {
  const header = document.querySelector('.page-header');
  if (!header || document.querySelector('.login-required-banner')) return;

  const aviso = document.createElement('div');
  aviso.className = 'login-required-banner';
  aviso.innerHTML = 'Você precisa <a href="login.html">entrar</a> para adicionar filmes ao catálogo. ' +
    'Pode preencher o formulário livremente, mas salvar exige estar logado.';
  header.appendChild(aviso);
}

if (!CineLogStorage.estaLogado()) {
  mostrarAvisoLogin();
}

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

starPickerEl.querySelectorAll('.star').forEach(star => {
  star.addEventListener('mouseenter', () => {
    const val = parseInt(star.dataset.value);
    starPickerEl.querySelectorAll('.star').forEach(s => {
      s.classList.toggle('hover', parseInt(s.dataset.value) <= val);
    });
  });
  star.addEventListener('mouseleave', () => {
    starPickerEl.querySelectorAll('.star').forEach(s => {
      s.classList.remove('hover');
    });
  });
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

synopsisEl.addEventListener('input', () => {
  const len = synopsisEl.value.length;
  charCountEl.textContent = len;
  if (len > 600) synopsisEl.value = synopsisEl.value.slice(0, 600);
});

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

featuredToggle.addEventListener('click', () => {
  isFeatured = !isFeatured;
  featuredToggle.setAttribute('aria-pressed', String(isFeatured));
  featuredLabel.textContent = isFeatured ? 'Destacado' : 'Não destacado';
  updatePreview();
});

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

btnSave.addEventListener('click', async () => {
  if (!CineLogStorage.estaLogado()) {
    showToast('Você precisa entrar para adicionar um filme.', 'error');
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    return;
  }

  if (!validate()) return;

  const movie = {
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
    featured:  isFeatured
  };

  btnSave.disabled = true;
  try {
    if (editingId != null) {
      const filmeAtualizado = await CineLogStorage.updateMovie(editingId, movie);
      const idx = movies.findIndex(m => m.id === editingId);
      if (idx !== -1) movies[idx] = filmeAtualizado;
      renderSavedList();
      updateSavedCount();
      showToast(`"${filmeAtualizado.title}" atualizado com sucesso!`, 'success');
      cancelarEdicao();
    } else {
      const novoFilme = await CineLogStorage.addMovie(movie);
      movies.unshift(novoFilme);
      renderSavedList();
      updateSavedCount();
      showToast(`"${novoFilme.title}" adicionado com sucesso!`, 'success');
      resetForm();
    }
  } catch (err) {
    showToast(err.message || 'Não foi possível salvar o filme.', 'error');
  } finally {
    btnSave.disabled = false;
  }
});

function iniciarEdicao(id) {
  const filme = movies.find(m => m.id === id);
  if (!filme) return;

  editingId = id;

  titleEl.value      = filme.title || '';
  originalEl.value   = filme.original || '';
  yearEl.value       = filme.year || '';
  durationEl.value   = filme.duration || '';
  directorEl.value   = filme.director || '';
  countryEl.value    = filme.country || '';
  languageEl.value   = filme.language || '';
  posterEl.value     = filme.poster || '';
  synopsisEl.value   = filme.synopsis || '';
  assistidoEmEl.value = filme.assistidoEm || '';

  charCountEl.textContent = synopsisEl.value.length;

  notaSelecionada = filme.nota || 0;
  ratingEl.value  = notaSelecionada || '';
  starPickerEl.querySelectorAll('.star').forEach(s => {
    s.classList.toggle('selected', parseInt(s.dataset.value) <= notaSelecionada);
  });
  const labels = ['', '1 — Fraco', '2 — Regular', '3 — Bom', '4 — Ótimo', '5 — Excelente'];
  ratingHintEl.textContent = notaSelecionada ? labels[notaSelecionada] : 'Clique para avaliar';

  selectedGenres = [...(filme.genres || [])];
  genreGrid.querySelectorAll('.genre-btn').forEach(btn => {
    btn.classList.toggle('active', selectedGenres.includes(btn.dataset.genre));
  });

  isFeatured = !!filme.featured;
  featuredToggle.setAttribute('aria-pressed', String(isFeatured));
  featuredLabel.textContent = isFeatured ? 'Destacado' : 'Não destacado';

  updatePreview();
  btnSave.textContent = 'Salvar edição';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('Editando filme — altere os campos e salve.', 'success');
}

function cancelarEdicao() {
  editingId = null;
  btnSave.textContent = 'Salvar filme';
  resetForm();
}

btnReset.addEventListener('click', () => resetModal.classList.remove('hidden'));
btnResetCancel.addEventListener('click', () => resetModal.classList.add('hidden'));
btnResetConfirm.addEventListener('click', () => {
  resetModal.classList.add('hidden');
  editingId = null;
  btnSave.textContent = 'Salvar filme';
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

function renderSavedList() {
  if (movies.length === 0) {
    savedList.innerHTML = '<p class="saved-empty">Nenhum filme adicionado ainda.</p>';
    return;
  }
  savedList.innerHTML = movies.map(m => `
    <div class="saved-item" data-id="${m.id}">
      <div class="saved-item-info">
        <div class="saved-item-title">${m.title}</div>
        <div class="saved-item-meta">${m.year} · ${'★'.repeat(m.nota || 0)}${'&#9734;'.repeat(5 - (m.nota || 0))} (${m.nota || '?'}/5) · por ${m.addedByName || '—'}</div>
      </div>
      ${m.canDelete ? `
        <div class="saved-item-actions">
          <button class="saved-item-edit" data-edit="${m.id}" title="Editar">✎</button>
          <button class="saved-item-remove" data-remove="${m.id}" title="Remover">×</button>
        </div>
      ` : ''}
    </div>
  `).join('');

  savedList.querySelectorAll('.saved-item-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      iniciarEdicao(parseInt(btn.dataset.edit));
    });
  });

  savedList.querySelectorAll('.saved-item-remove').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.remove);
      const removed = movies.find(m => m.id === id);
      try {
        await CineLogStorage.removeMovie(id);
        movies = movies.filter(m => m.id !== id);
        if (editingId === id) cancelarEdicao();
        renderSavedList();
        updateSavedCount();
        if (removed) showToast(`"${removed.title}" removido.`, 'success');
      } catch (err) {
        showToast(err.message || 'Não foi possível remover o filme.', 'error');
      }
    });
  });
}

function updateSavedCount() {
  savedCount.textContent = movies.length;
}

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

let toastTimer;
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className   = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !resetModal.classList.contains('hidden')) {
    resetModal.classList.add('hidden');
  }
});

(async function init() {
  try {
    movies = await CineLogStorage.getMovies();
  } catch (e) {
    movies = [];
  }
  renderSavedList();
  updateSavedCount();
})();
