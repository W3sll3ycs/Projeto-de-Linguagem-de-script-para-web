document.addEventListener("DOMContentLoaded", () => {
  // Inicializa os ícones Lucide
  lucide.createIcons();

  // Mock Database - Lista de Filmes para o Filtro
  const listaFilmes = [
  {
    id: 1,
    title: "O Cavaleiro das Trevas",
    original: "The Dark Knight",
    genres: ["Ação", "Drama", "Policial"],
    year: "2008",
    rating: 9.0,
    img: "../Imagens/Batman_Cavaleiro_das_Trevas.jpg"
  },
  {
    id: 2,
    title: "Mad Max: Estrada da Fúria",
    original: "Mad Max: Fury Road",
    genres: ["Ação", "Ficção Científica"],
    year: "2015",
    rating: 8.1,
    img: "../Imagens/Madmax.jpg"
  },
  {
    id: 3,
    title: "Os Infiltrados",
    original: "The Departed",
    genres: ["Crime", "Drama", "Suspense"],
    year: "2006",
    rating: 8.5,
    img: "../Imagens/Os_Infiltrados.jpg"
  },
  {
    id: 4,
    title: "Interestelar",
    original: "Interstellar",
    genres: ["Ficção Científica", "Drama", "Aventura"],
    year: "2014",
    rating: 8.7,
    img: "../Imagens/Interestelar.jpg"
  },
  {
   id: 5,
   title: "Trovão Tropical",
   original: "Tropic Thunder",
   genres: ["Ação", "Comédia"],
   year: "2008",
   rating: 7.0,
   img: "../Imagens/Trovao_tropical.jpg"
},
  {
    id: 6,
    title: "O Poderoso Chefão",
    original: "The Godfather",
    genres: ["Crime", "Drama"],
    year: "1972",
    rating: 9.2,
    img: "../Imagens/Poderoso_Chefao.jpg"
  },
  {
    id: 7,
    title: "Parasita",
    original: "Gisaengchung",
    genres: ["Drama", "Suspense"],
    year: "2019",
    rating: 8.5,
    img: "../Imagens/Parasita.jpg"
  },
  {
    id: 8,
    title: "A Lista de Schindler",
    original: "Schindler's List",
    genres: ["Drama", "Histórico"],
    year: "1993",
    rating: 9.0,
    img: "../Imagens/Lista_de_Schindler.jpg"
  },
  {
    id: 9,
    title: "Duna",
    original: "Dune: Part One",
    genres: ["Ficção Científica", "Aventura"],
    year: "2021",
    rating: 8.0,
    img: "../Imagens/Duna.jpg"
  },
  {
    id: 10,
    title: "A Viagem de Chihiro",
    original: "Sen to Chihiro no Kamikakushi",
    genres: ["Animação", "Fantasia"],
    year: "2001",
    rating: 8.6,
    img: "../Imagens/A_Viagem_de_Chihiro.jpg"
  },
  {
    id: 11,
    title: "Corra!",
    original: "Get Out",
    genres: ["Terror", "Suspense"],
    year: "2017",
    rating: 7.8,
    img: "../Imagens/Corra!.jpg"
  },
  {
    id: 12,
    title: "Blade Runner 2049",
    original: "Blade Runner 2049",
    genres: ["Ficção Científica", "Ação"],
    year: "2017",
    rating: 8.0,
    img: "../Imagens/Blade_Runner.jpg"
  },
  {
    id: 13,
    title: "John Wick",
    original: "John Wick",
    genres: ["Ação", "Crime"],
    year: "2014",
    rating: 7.4,
    img: "../Imagens/John_Wick.jpg"
  },
  {
    id: 14,
    title: "Ford vs Ferrari",
    original: "Ford v Ferrari",
    genres: ["Ação", "Drama"],
    year: "2019",
    rating: 8.1,
    img: "../Imagens/Ford_vs_Ferrari.jpg"
  },
  {
    id: 15,
    title: "Exterminador do Futuro 3",
    original: "Terminator 3: Rise of the Machines",
    genres: ["Ação", "Ficção Científica"],
    year: "2003",
    rating: 6.3,
    img: "../Imagens/Exterminador_do_Futuro_3.jpg"
  },
  {
    id: 16,
    title: "Alien, o 8º Passageiro",
    original: "Alien",
    genres: ["Ficção Científica", "Terror"],
    year: "1979",
    rating: 8.5,
    img: "../Imagens/Alien_o_8_Passageiro.jpg"
  },
  {
    id: 17,
    title: "Devoradores de Estrelas",
    original: "Project Hail Mary",
    genres: ["Ficção Científica", "Suspense"],
    year: "2026",
    rating: 8.0,
    img: "../Imagens/Devoradores_Estrelas.jpg"
  },
  {
    id: 18,
    title: "Star Wars V: O Império Contra-Ataca",
    original: "Star Wars: Episode V - The Empire Strikes Back",
    genres: ["Ficção Científica", "Aventura"],
    year: "1980",
    rating: 8.7,
    img: "../Imagens/Star_Wars_V.jpg"
  },
  {
    id: 19,
    title: "Diário de uma Paixão",
    original: "The Notebook",
    genres: ["Romance", "Drama"],
    year: "2004",
    rating: 7.8,
    img: "../Imagens/Diario_de_uma_Paixao.jpg"
  },
  {
    id: 20,
    title: "Hereditário",
    original: "Hereditary",
    genres: ["Terror", "Mistério"],
    year: "2018",
    rating: 7.3,
    img: "../Imagens/Hereditario.jpg"
  },
  {
    id: 21,
    title: "O Iluminado",
    original: "The Shining",
    genres: ["Terror", "Drama"],
    year: "1980",
    rating: 8.4,
    img: "../Imagens/O_Iluminado.jpg"
  },
  {
    id: 22,
    title: "Midsommar",
    original: "Midsommar",
    genres: ["Terror", "Drama"],
    year: "2019",
    rating: 7.1,
    img: "../Imagens/Midsommar.jpg"
  },
  {
    id: 23,
    title: "Jogos Mortais 1",
    original: "Saw",
    genres: ["Terror", "Suspense"],
    year: "2004",
    rating: 7.6,
    img: "../Imagens/Jogos_Mortais.jpg"
  },
  {
    id: 24,
    title: "Entre Facas e Segredos",
    original: "Knives Out",
    genres: ["Mistério", "Comédia"],
    year: "2019",
    rating: 7.9,
    img: "../Imagens/Entre_Facas_e_Segredos.jpg"
  },
  {
    id: 25,
    title: "Jojo Rabbit",
    original: "Jojo Rabbit",
    genres: ["Comédia", "Drama"],
    year: "2019",
    rating: 7.9,
    img: "../Imagens/Jojo_Rabbit.jpg"
  },
  {
    id: 26,
    title: "O Que Fazemos nas Sombras",
    original: "What We Do in the Shadows",
    genres: ["Comédia", "Fantasia"],
    year: "2014",
    rating: 7.6,
    img: "../Imagens/O_Que_Fazemos_nas_Sombras.jpg"
  },
  {
    id: 29,
    title: "Homem-Aranha no Aranhaverso",
    original: "Spider-Man: Into the Spider-Verse",
    genres: ["Animação", "Ação"],
    year: "2018",
    rating: 8.4,
    img: "../Imagens/Homem_Aranha.jpg"
  },
  {
    id: 30,
    title: "Toy Story",
    original: "Toy Story",
    genres: ["Animação", "Comédia"],
    year: "1995",
    rating: 8.3,
    img: "../Imagens/Toy_Story.jpg"
  },
  {
    id: 31,
    title: "Wolfwalkers",
    original: "Wolfwalkers",
    genres: ["Animação", "Aventura"],
    year: "2020",
    rating: 8.0,
    img: "../Imagens/Wolfwalkers.jpg"
  },
  {
    id: 32,
    title: "Questão de Tempo",
    original: "About Time",
    genres: ["Romance", "Drama", "Ficção Científica"],
    year: "2013",
    rating: 7.8,
    img: "../Imagens/Questao_de_Tempo.jpg"
  }
];

  const genreInput = document.getElementById("genreFilterInput");
  const recommendationsGrid = document.getElementById("recommendationsGrid");
  const emptyState = document.getElementById("filterEmptyState");

  // Função responsável por renderizar os cards no Grid HTML
  function renderizarFilmes(filmes) {
    recommendationsGrid.innerHTML = "";

    if (filmes.length === 0) {
      emptyState.style.display = "flex";
      return;
    }

    emptyState.style.display = "none";

    filmes.forEach(filme => {
      const card = document.createElement("article");
      card.className = "movie-card";
      
      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${filme.img}" alt="${filme.title}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=900&fit=crop'"/>
        </div>
        <div class="card-info">
          <div class="card-meta">
            <span class="card-year">${filme.year}</span>
            <span class="card-rating">★ ${filme.rating.toFixed(1)}</span>
          </div>
          <h3 class="card-title">${filme.title}</h3>
        </div>
      `;
      
      recommendationsGrid.appendChild(card);
    });
  }

  // Lógica usando filter() baseada na digitação do usuário
  function filtrarRecomendacoes() {
    const termoBusca = genreInput.value.toLowerCase().trim();

    const filmesFiltrados = listaFilmes.filter(filme => {
      // Regra 1: A nota deve ser maior ou igual a 4.0
      const notaValida = filme.rating >= 4.0;
      
      // Regra 2: Verifica se algum dos gêneros do filme inclui o termo digitado
      // Se o input estiver vazio, ele passa todos que têm nota válida
      const correspondeAoGenero = termoBusca === "" || filme.genres.some(genero => 
        genero.toLowerCase().includes(termoBusca)
      );

      return notaValida && correspondeAoGenero;
    });

    renderizarFilmes(filmesFiltrados);
  }

  // Escuta o evento de input (tempo real) para rodar o filtro
  genreInput.addEventListener("input", filtrarRecomendacoes);

  // Inicializa a página mostrando todos os filmes recomendados (nota >= 4)
  filtrarRecomendacoes();
});