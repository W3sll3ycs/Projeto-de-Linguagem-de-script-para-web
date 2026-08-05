# 🎬 Corte Seletivo

> Catálogo cinematográfico curado — o cinema que merece ser visto.

Projeto desenvolvido para a disciplina de **Linguagem de Script para Web** do curso de **Análise e Desenvolvimento de Sistemas** no IFPB.

---

## 📋 Sobre o Projeto

**Corte Seletivo** é uma aplicação web de catálogo de filmes com tema escuro, que permite ao usuário explorar um acervo curado de títulos, filtrar por gênero, buscar por nome, visualizar detalhes em modal, adicionar novos filmes e receber recomendações baseadas em gênero.

Todo o projeto foi construído com **HTML semântico, CSS puro e JavaScript Vanilla**, sem dependência de frameworks.

---

## 🗂️ Estrutura de Pastas

```
Corte-Seletivo/
├── home.html                        # Página principal — catálogo de filmes
├── javascript.js                    # Lógica de filtros, busca e modal da home
├── style.css                        # Estilos globais
│
├── Adicionar_filmes/
│   ├── adicionarfilmes.html         # Formulário de cadastro de filmes
│   ├── adicionarfilmes.js           # Lógica do formulário, validação e persistência
│   └── adicionarfilmes.css          # Estilos da página de adição
│
├── Login/
│   ├── index.html                   # Página de login
│   ├── cadastro.html                # Página de cadastro de usuário
│   ├── login.js                     # Validação de formulários e autenticação local
│   └── login.css                    # Estilos das páginas de autenticação
│
├── Recomendados/
│   ├── filtro.html                  # Página de filmes recomendados
│   ├── recomendados.js              # Lógica de filtragem por gênero
│   └── recomendados.css             # Estilos da página de recomendados
│
└── Imagens/                         # Capas dos filmes do catálogo
```

---

## ✨ Funcionalidades

### 🏠 Página Principal (`home.html`)
- Exibição do catálogo com **30 filmes curados**, organizados por seções de gênero e destaques
- **Filtro por gênero** via botões/pills (Ação, Drama, Terror, Animação, etc.)
- **Busca em tempo real** por título com botão de limpar
- **Modal de detalhes** ao clicar no card: exibe título, título original, diretor, ano, duração, nota IMDb, sinopse e gêneros
- Botões de **scroll horizontal** nas seções de gênero
- Estatísticas no topo: total de títulos e média de avaliação IMDb
- Estado vazio com botão de reset quando nenhum resultado é encontrado

### ➕ Adicionar Filmes (`Adicionar_filmes/`)
- Formulário com campos: título, título original, ano, duração, nota, diretor, país, idioma, URL do pôster e sinopse
- **Prévia ao vivo** do card do filme enquanto os dados são preenchidos
- **Seleção de gêneros** via botões interativos (múltipla seleção)
- Toggle para marcar o filme como **Destaque**
- **Validação de campos obrigatórios** (título, ano, nota, ao menos um gênero)
- Contador de caracteres na sinopse (limite: 600 caracteres)
- Persistência via **`localStorage`** com `JSON.stringify` / `JSON.parse`
- Lista dos filmes salvos com opção de remoção individual
- **Exportação em JSON** do catálogo adicionado
- Modal de confirmação para reset do formulário
- Notificações **toast** de sucesso e erro
- Fechamento de modal via tecla `Escape`

### 🔐 Autenticação (`Login/`)
- Páginas de **login** e **cadastro** de usuário
- Validação com **regex** de e-mail e senha
- Indicador visual de **força da senha** em 4 níveis (Fraca → Forte) com barras coloridas
- Toggle de **mostrar/ocultar senha**
- Feedback inline de erros por campo (`.has-error` / `.is-valid`)
- Persistência do usuário no `localStorage` (chave `usuario_corte_seletivo`)
- Animação de carregamento (loader) e mensagem de sucesso antes do redirecionamento
- Ticker animado com títulos de filmes clássicos

### 🎯 Recomendados (`Recomendados/`)
- Filtro de filmes por gênero em **tempo real** com `Array.filter()`
- Exibe apenas filmes com nota ≥ 4.0
- Busca textual que percorre todos os gêneros do filme com `Array.some()`
- Estado vazio personalizado quando nenhum resultado é encontrado
- Base de dados com os mesmos 30 títulos do catálogo principal

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 semântico | Estrutura e marcação de conteúdo |
| CSS3 | Estilização, tema escuro, animações |
| JavaScript ES6+ | Filtros, validações, DOM, eventos |
| [Lucide Icons](https://lucide.dev/) | Ícones via CDN (`unpkg`) |
| Google Fonts | Tipografias Playfair Display, DM Mono e Inter |
| `localStorage` | Persistência de filmes e sessão de usuário |

---

## 🚀 Como Executar

Por ser um projeto puramente estático (sem backend), basta abrir o arquivo HTML no navegador:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/Projeto-de-Linguagem-de-script-para-web.git

# Abra a página principal no navegador
# Abra o arquivo home.html diretamente, ou use uma extensão como Live Server no VS Code
```

> **Recomendado:** use a extensão **Live Server** do VS Code para evitar restrições de CORS ao carregar imagens e recursos locais.

---

## 🗺️ Navegação entre Páginas

```
home.html  ──────────────────────────────────────────────────┐
   │                                                          │
   ├──► Adicionar_filmes/adicionarfilmes.html                 │
   ├──► Recomendados/filtro.html                              │
   └──► Login/index.html ──► Login/cadastro.html ──► home.html
```

---

## 📌 Conceitos de JavaScript Aplicados

- Manipulação de DOM com `querySelector`, `querySelectorAll`, `createElement`
- Eventos: `addEventListener`, `input`, `click`, `keydown`, `submit`
- `e.preventDefault()` para controle de submissão de formulários
- `Array.filter()` para filtragem de recomendações
- `Array.some()` para verificação de gêneros
- `JSON.stringify` / `JSON.parse` para persistência em `localStorage`
- Regex para validação de e-mail e critérios de senha
- `setTimeout` para animações de feedback
- `URL.createObjectURL` para exportação de arquivo JSON
- Fechamento de modal com `Escape` via evento global de teclado

---

## 👥 Colaboradores

Desenvolvido por estudantes de ADS no IFPB:

- **Weslley Casimiro**
- **Pedro Henrique**
- **Kaique Neres**
- **Arley Felix**