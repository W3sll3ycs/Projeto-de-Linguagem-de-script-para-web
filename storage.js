/**
 * CineLogStorage
 * ----------------
 * Módulo único responsável por toda a leitura/escrita dos filmes do
 * usuário no localStorage (chave "cinelog_movies") e por utilitários
 * relacionados (parse de duração, etc).
 *
 * Antes essa lógica estava duplicada em javascript.js, recomendados.js
 * e adicionarfilmes.js — cada arquivo lia/gravava o localStorage do seu
 * próprio jeito, o que já causou bugs de sincronização (ex.: minutos que
 * não atualizavam depois de excluir um filme).
 *
 * Este script deve ser incluído ANTES dos demais (javascript.js,
 * recomendados.js, adicionarfilmes.js) em cada página HTML:
 *
 *   <script src="storage.js"></script>
 *   <script src="javascript.js"></script>
 */
const CineLogStorage = (() => {
  const CHAVE = "cinelog_movies";

  const FILMES_INICIAIS = [
    {
      id: 1,
      title: "Interestelar",
      original: "Interstellar",
      year: 2014,
      duration: 169,
      nota: 5,
      rating: 5,
      director: "Christopher Nolan",
      country: "Estados Unidos",
      language: "Inglês",
      poster: "",
      synopsis: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço em uma tentativa de garantir a sobrevivência da humanidade.",
      genres: ["Ficção Científica", "Drama"],
      assistidoEm: "2025-04-10",
      featured: true,
      addedAt: "2025-04-10T00:00:00.000Z"
    },
    {
      id: 2,
      title: "Oppenheimer",
      original: "Oppenheimer",
      year: 2023,
      duration: 180,
      nota: 4,
      rating: 4,
      director: "Christopher Nolan",
      country: "Estados Unidos",
      language: "Inglês",
      poster: "",
      synopsis: "A história do físico J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica durante a Segunda Guerra Mundial.",
      genres: ["Drama", "Histórico"],
      assistidoEm: "2025-05-01",
      featured: false,
      addedAt: "2025-05-01T00:00:00.000Z"
    },
    {
      id: 3,
      title: "Super Mario Bros: O Filme",
      original: "The Super Mario Bros. Movie",
      year: 2023,
      duration: 92,
      nota: 3,
      rating: 3,
      director: "Aaron Horvath, Michael Jelenic",
      country: "Estados Unidos",
      language: "Inglês",
      poster: "",
      synopsis: "Os irmãos encanadores Mario e Luigi são transportados para um mundo mágico onde precisam salvar o Reino dos Cogumelos.",
      genres: ["Animação", "Aventura"],
      assistidoEm: "2025-05-15",
      featured: false,
      addedAt: "2025-05-15T00:00:00.000Z"
    }
  ];

  /** Lê a lista de filmes do usuário. Faz a semeadura inicial se ainda não existir. */
  function getMovies() {
    try {
      const raw = localStorage.getItem(CHAVE);
      if (raw) return JSON.parse(raw);
      localStorage.setItem(CHAVE, JSON.stringify(FILMES_INICIAIS));
      return [...FILMES_INICIAIS];
    } catch (e) {
      return [...FILMES_INICIAIS];
    }
  }

  /** Sobrescreve a lista inteira de filmes do usuário. */
  function saveMovies(lista) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(lista));
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Adiciona um novo filme no topo da lista. Retorna a lista atualizada. */
  function addMovie(filme) {
    const lista = getMovies();
    lista.unshift(filme);
    saveMovies(lista);
    return lista;
  }

  /** Remove um filme pelo id. Retorna a lista atualizada. */
  function removeMovie(id) {
    const lista = getMovies().filter(m => m.id !== id);
    saveMovies(lista);
    return lista;
  }

  /** Soma a duração (em minutos) de todos os filmes do usuário. */
  function getTotalUserMinutes() {
    return getMovies().reduce((acc, filme) => acc + (parseInt(filme.duration) || 0), 0);
  }

  /** Converte strings como "2h 55min" para minutos totais (número). */
  function parseDuration(str) {
    if (!str) return 0;
    const hMatch = str.match(/(\d+)h/);
    const mMatch = str.match(/(\d+)min/);
    const horas = hMatch ? parseInt(hMatch[1]) : 0;
    const mins  = mMatch ? parseInt(mMatch[1]) : 0;
    return horas * 60 + mins;
  }

  return {
    getMovies,
    saveMovies,
    addMovie,
    removeMovie,
    getTotalUserMinutes,
    parseDuration
  };
})();
