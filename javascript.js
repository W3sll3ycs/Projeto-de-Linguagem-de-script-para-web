document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const todosOsCards = document.querySelectorAll(".movie-card");

  function parseDuration(str) {
    if (!str) return 0;
    const hMatch = str.match(/(\d+)h/);
    const mMatch = str.match(/(\d+)min/);
    const horas = hMatch ? parseInt(hMatch[1]) : 0;
    const mins  = mMatch ? parseInt(mMatch[1]) : 0;
    return horas * 60 + mins;
  }

  const dadosCards = Array.from(todosOsCards).map(card => ({
    rating:   parseFloat(card.getAttribute("data-rating")) || 0,
    duracao:  parseDuration(card.getAttribute("data-duration"))
  }));

  const somaNotas = dadosCards.reduce((acc, filme) => acc + filme.rating, 0);
  const mediaNota = dadosCards.length > 0 ? somaNotas / dadosCards.length : 0;

  const totalMinutos = dadosCards.reduce((acc, filme) => acc + filme.duracao, 0);
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  const statRatingEl = document.getElementById("statRating");
  const statTempoEl  = document.getElementById("statTempo");

  if (statRatingEl) statRatingEl.textContent = mediaNota.toFixed(1);
  if (statTempoEl)  statTempoEl.textContent  = horas + "h " + minutos + "min";

  const statCountEl = document.getElementById("statCount");
  if (statCountEl) statCountEl.textContent = dadosCards.length;


  const movieCards = document.querySelectorAll(".movie-card");
  const genreSections = document.querySelectorAll(".genre-section-block");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  const genrePills = document.querySelectorAll("#genrePills .pill");
  const emptyState = document.getElementById("emptyState");
  const clearFiltersBtn = document.getElementById("clearFilters");

  const modal = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");

  let activeGenre = "Todos";
  let searchQuery = "";

  function aplicarFiltros() {
    let totalVisiveis = 0;
    const query = searchQuery.toLowerCase().trim();

    movieCards.forEach(card => {
      const title = card.getAttribute("data-title").toLowerCase();
      const genres = card.getAttribute("data-genres").split(",");
      
      const pertenceAoGenero = (activeGenre === "Todos" || genres.includes(activeGenre));
      const correspondeBusca = (query === "" || title.includes(query));

      if (pertenceAoGenero && correspondeBusca) {
        card.style.display = "block"; 
        totalVisiveis++;
      } else {
        card.style.display = "none";
      }
    });

    genreSections.forEach(section => {
      const secaoGenero = section.getAttribute("data-section-genre");
      const possuiFilmeVisivel = Array.from(section.querySelectorAll(".movie-card"))
                                      .some(card => card.style.display !== "none");
      
      if (possuiFilmeVisivel && (activeGenre === "Todos" || activeGenre === secaoGenero)) {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    });

    const secaoDestaques = document.getElementById("destaques");
    if (secaoDestaques) {
      const possuiDestaqueVisivel = Array.from(secaoDestaques.querySelectorAll(".movie-card"))
                                         .some(card => card.style.display !== "none");
      secaoDestaques.style.display = possuiDestaqueVisivel ? "block" : "none";
    }

    emptyState.style.display = totalVisiveis === 0 ? "flex" : "none";
  }

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    clearSearchBtn.style.display = searchQuery ? "flex" : "none";
    aplicarFiltros();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchQuery = "";
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    aplicarFiltros();
  });

  genrePills.forEach(pill => {
    pill.addEventListener("click", () => {
      genrePills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeGenre = pill.getAttribute("data-genre");
      aplicarFiltros();
    });
  });

  clearFiltersBtn.addEventListener("click", () => {
    searchQuery = "";
    activeGenre = "Todos";
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    genrePills.forEach(p => p.classList.remove("active"));
    document.querySelector('[data-genre="Todos"]').classList.add("active");
    aplicarFiltros();
  });

  movieCards.forEach(card => {
    card.addEventListener("click", () => {
      document.getElementById("modalTitle").textContent = card.getAttribute("data-title");
      document.getElementById("modalOriginal").textContent = card.getAttribute("data-original");
      document.getElementById("modalDirector").textContent = card.getAttribute("data-director");
      document.getElementById("modalYear").textContent = card.getAttribute("data-year");
      document.getElementById("modalDuration").textContent = card.getAttribute("data-duration");
      document.getElementById("modalRating").textContent = card.getAttribute("data-rating");
      document.getElementById("modalSynopsis").textContent = card.getAttribute("data-synopsis");
      document.getElementById("modalImg").src = card.querySelector(".card-img").src;

      const badgesContainer = document.getElementById("modalBadges");
      badgesContainer.innerHTML = "";
      card.getAttribute("data-genres").split(",").forEach(g => {
        const span = document.createElement("span");
        span.className = "modal-badge";
        span.textContent = g;
        badgesContainer.appendChild(span);
      });
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  function fecharModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", fecharModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharModal();
  });

  document.querySelectorAll(".scroll-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetElement = document.getElementById(btn.dataset.target);
      const direction = btn.classList.contains("scroll-left") ? -320 : 320;
      targetElement.scrollBy({ left: direction, behavior: "smooth" });
    });
  });
});