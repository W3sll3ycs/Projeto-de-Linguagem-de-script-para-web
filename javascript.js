document.addEventListener("DOMContentLoaded", () => {
  // Inicializa os ícones do Lucide nos elementos reais do HTML
  lucide.createIcons();

  // Seleção de elementos estáticos do DOM
  const movieCards = document.querySelectorAll(".movie-card");
  const genreSections = document.querySelectorAll(".genre-section-block");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  const genrePills = document.querySelectorAll("#genrePills .pill");
  const emptyState = document.getElementById("emptyState");
  const clearFiltersBtn = document.getElementById("clearFilters");

  // Elementos do Modal
  const modal = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");

  let activeGenre = "Todos";
  let searchQuery = "";

  // =========================================================================
  // LOGICA DE COMPORTAMENTO: FILTROS E BUSCA VISUAL
  // =========================================================================
  function aplicarFiltros() {
    let totalVisiveis = 0;
    const query = searchQuery.toLowerCase().trim();

    movieCards.forEach(card => {
      const title = card.getAttribute("data-title").toLowerCase();
      const genres = card.getAttribute("data-genres").split(",");
      
      const pertenceAoGenero = (activeGenre === "Todos" || genres.includes(activeGenre));
      const correspondeBusca = (query === "" || title.includes(query));

      if (pertenceAoGenero && correspondeBusca) {
        card.style.display = "block"; // ou o display original correspondente
        totalVisiveis++;
      } else {
        card.style.display = "none";
      }
    });

    // Controla a visibilidade das seções de gênero inteiras para não ficarem vazias
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

    // Esconde ou mostra a seção de destaques dependendo do filtro de gênero
    const secaoDestaques = document.getElementById("destaques");
    if (secaoDestaques) {
      const possuiDestaqueVisivel = Array.from(secaoDestaques.querySelectorAll(".movie-card"))
                                         .some(card => card.style.display !== "none");
      secaoDestaques.style.display = possuiDestaqueVisivel ? "block" : "none";
    }

    // Exibe o Estado Vazio se nenhum filme sobrou na tela
    emptyState.style.display = totalVisiveis === 0 ? "flex" : "none";
  }

  // Evento de Digitação na Busca
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    clearSearchBtn.style.display = searchQuery ? "flex" : "none";
    aplicarFiltros();
  });

  // Limpar Busca
  clearSearchBtn.addEventListener("click", () => {
    searchQuery = "";
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    aplicarFiltros();
  });

  // Cliques nos Botões de Gênero (Pills)
  genrePills.forEach(pill => {
    pill.addEventListener("click", () => {
      genrePills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeGenre = pill.getAttribute("data-genre");
      aplicarFiltros();
    });
  });

  // Botão do Estado Vazio para restaurar os filtros
  clearFiltersBtn.addEventListener("click", () => {
    searchQuery = "";
    activeGenre = "Todos";
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    genrePills.forEach(p => p.classList.remove("active"));
    document.querySelector('[data-genre="Todos"]').classList.add("active");
    aplicarFiltros();
  });

  // =========================================================================
  // LOGICA DE COMPORTAMENTO: ABERTURA DO MODAL DINÂMICO
  // =========================================================================
  movieCards.forEach(card => {
    card.addEventListener("click", () => {
      // Captura os dados embutidos no próprio HTML do card clicado
      document.getElementById("modalTitle").textContent = card.getAttribute("data-title");
      document.getElementById("modalOriginal").textContent = card.getAttribute("data-original");
      document.getElementById("modalDirector").textContent = card.getAttribute("data-director");
      document.getElementById("modalYear").textContent = card.getAttribute("data-year");
      document.getElementById("modalDuration").textContent = card.getAttribute("data-duration");
      document.getElementById("modalRating").textContent = card.getAttribute("data-rating");
      document.getElementById("modalSynopsis").textContent = card.getAttribute("data-synopsis");
      document.getElementById("modalImg").src = card.querySelector(".card-img").src;

      // Trata as tags de gênero dentro do modal
      const badgesContainer = document.getElementById("modalBadges");
      badgesContainer.innerHTML = "";
      card.getAttribute("data-genres").split(",").forEach(g => {
        const span = document.createElement("span");
        span.className = "modal-badge";
        span.textContent = g;
        badgesContainer.appendChild(span);
      });

      // Abre visualmente o modal aplicando display flex e trava o scroll de fundo
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

  // =========================================================================
  // LOGICA DE COMPORTAMENTO: BOTÕES DE SCROLL HORIZONTAL
  // =========================================================================
  document.querySelectorAll(".scroll-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetElement = document.getElementById(btn.dataset.target);
      const direction = btn.classList.contains("scroll-left") ? -320 : 320;
      targetElement.scrollBy({ left: direction, behavior: "smooth" });
    });
  });
});