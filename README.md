# 🎬 Corte Seletivo

> Catálogo cinematográfico curado — o cinema que merece ser visto.

Projeto desenvolvido para a disciplina de **Linguagem de Script para Web** do curso de **Análise e Desenvolvimento de Sistemas** no IFPB.

---

## 📋 Sobre o Projeto

**Corte Seletivo** é uma aplicação web de catálogo de filmes com tema escuro, que permite ao usuário explorar um acervo curado de títulos, filtrar por gênero, buscar por nome, visualizar detalhes em modal, adicionar novos filmes e receber recomendações baseadas em gênero.

O front-end foi construído com **HTML semântico, CSS puro e JavaScript Vanilla**, sem dependência de frameworks. O projeto também conta com um **back-end em Node.js/Express + SQLite**, responsável pela API de autenticação e pelo catálogo de filmes compartilhado entre usuários.

---

## 🗂️ Estrutura de Pastas

```
Projeto-de-Linguagem-de-script-para-web/
├── index.html                # Página principal — catálogo de filmes
├── javascript.js             # Lógica de filtros, busca e modal da home
├── style.css                 # Estilos globais
├── storage.js                # Módulo único de persistência no localStorage (chave "cinelog_movies")
│
├── adicionarfilmes.html      # Formulário de cadastro de filmes
├── adicionarfilmes.js        # Lógica do formulário, validação e persistência
├── adicionarfilmes.css       # Estilos da página de adição
│
├── login.html                # Página de login
├── cadastro.html             # Página de cadastro de usuário
├── login.js                  # Validação de formulários e autenticação
├── login.css                 # Estilos das páginas de autenticação
│
├── filtro.html                # Página de filmes recomendados
├── recomendados.js            # Lógica de filtragem por gênero
├── recomendados.css           # Estilos da página de recomendados
│
├── Imagens/                   # Capas dos filmes do catálogo
│
└── backend/                   # API REST (Node.js + Express + SQLite)
    ├── server.js               # Ponto de entrada: serve o site estático e expõe /api
    ├── db.js                   # Conexão e schema do banco (tabelas users e filmes)
    ├── package.json             # Dependências e scripts do back-end
    ├── middleware/
    │   └── auth.js              # Middleware de autenticação via JWT (requireAuth / optionalAuth)
    └── routes/
        ├── auth.routes.js       # Rotas POST /api/auth/cadastro e /api/auth/login
        └── filmes.routes.js     # Rotas GET/POST/DELETE /api/filmes
```

---

## ✨ Funcionalidades

### 🏠 Página Principal (`index.html`)
- Exibição do catálogo com **30 filmes curados**, organizados por seções de gênero e destaques
- **Filtro por gênero** via botões/pills (Ação, Drama, Terror, Animação, etc.)
- **Busca em tempo real** por título com botão de limpar
- **Modal de detalhes** ao clicar no card: exibe título, título original, diretor, ano, duração, nota IMDb, sinopse e gêneros
- Botões de **scroll horizontal** nas seções de gênero
- Estatísticas no topo: total de títulos e tempo total assistido pelo usuário
- Estado vazio com botão de reset quando nenhum resultado é encontrado

### ➕ Adicionar Filmes (`adicionarfilmes.html`)
- Formulário com campos: título, título original, ano, duração, nota, diretor, país, idioma, URL do pôster e sinopse
- **Prévia ao vivo** do card do filme enquanto os dados são preenchidos
- **Seleção de gêneros** via botões interativos (múltipla seleção)
- Toggle para marcar o filme como **Destaque**
- **Validação de campos obrigatórios** (título, ano, nota, ao menos um gênero)
- Contador de caracteres na sinopse (limite: 600 caracteres)
- Persistência via **`localStorage`** com `JSON.stringify` / `JSON.parse` (módulo `storage.js`)
- Lista dos filmes salvos com opção de **remoção individual**
- **Exportação em JSON** do catálogo adicionado
- Modal de confirmação para reset do formulário
- Notificações **toast** de sucesso e erro
- Fechamento de modal via tecla `Escape`

### 🔐 Autenticação (`login.html` / `cadastro.html`)
- Páginas de **login** e **cadastro** de usuário
- Validação com **regex** de e-mail e critérios de senha
- Indicador visual de **força da senha** em 4 níveis (Fraca → Forte) com barras coloridas
- Toggle de **mostrar/ocultar senha**
- Feedback inline de erros por campo (`.has-error` / `.is-valid`)
- Persistência do usuário no `localStorage` (chave `usuario_corte_seletivo`)
- Animação de carregamento (loader) e mensagem de sucesso antes do redirecionamento
- Ticker animado com títulos de filmes clássicos

### 🎯 Recomendados (`filtro.html`)
- Filtro de filmes por gênero em **tempo real** com `Array.filter()`
- Exibe apenas filmes com nota ≥ 4.0
- Busca textual que percorre todos os gêneros do filme com `Array.some()`
- Estado vazio personalizado quando nenhum resultado é encontrado
- Base de dados com os mesmos 30 títulos do catálogo principal

### 🖥️ Back-end (`backend/`)
- API REST construída com **Express**, rodando sobre o mesmo diretório do site (serve os arquivos estáticos e a API na mesma porta)
- Banco de dados **SQLite** (via `node:sqlite`, nativo do Node 22+), com tabelas `users` e `filmes`
- **Cadastro e login** de usuários (`POST /api/auth/cadastro`, `POST /api/auth/login`), com senha criptografada via `bcryptjs` e sessão via **token JWT**
- **Listagem, criação e exclusão de filmes** (`GET`, `POST`, `DELETE /api/filmes`), com regra de que **apenas quem cadastrou um filme pode excluí-lo**
- Middleware de autenticação (`requireAuth` / `optionalAuth`) para proteger rotas sensíveis
- > **Nota:** o back-end já está implementado e funcional, mas as páginas HTML/JS ainda operam com **`localStorage`** para os filmes e a sessão do usuário — a integração do front-end com a API (`fetch`) é o próximo passo do projeto.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 semântico | Estrutura e marcação de conteúdo |
| CSS3 | Estilização, tema escuro, animações |
| JavaScript ES6+ | Filtros, validações, DOM, eventos |
| [Lucide Icons](https://lucide.dev/) | Ícones via CDN (`unpkg`) |
| Google Fonts | Tipografias Playfair Display, DM Mono e Inter |
| `localStorage` | Persistência de filmes e sessão de usuário no front-end |
| Node.js + Express | Servidor de arquivos estáticos e API REST |
| SQLite (`node:sqlite`) | Banco de dados do back-end (usuários e filmes) |
| `bcryptjs` | Hash de senhas |
| `jsonwebtoken` (JWT) | Autenticação por token nas rotas da API |

---

## 🚀 Como Executar

### Opção 1 — Somente front-end (sem back-end)

Como o front-end funciona de forma independente usando `localStorage`, basta abrir o arquivo HTML no navegador:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/Projeto-de-Linguagem-de-script-para-web.git

# Abra a página principal no navegador
# Abra o arquivo index.html diretamente, ou use uma extensão como Live Server no VS Code
```

> **Recomendado:** use a extensão **Live Server** do VS Code para evitar restrições de CORS ao carregar imagens e recursos locais.

### Opção 2 — Com o back-end (API + banco de dados)

Requer **Node.js 22.5 ou superior** (usa o módulo nativo `node:sqlite`).

```bash
# Entre na pasta do back-end
cd backend

# Instale as dependências
npm install

# Inicie o servidor
npm start
```

Depois é só abrir **http://localhost:3000** — o próprio servidor Express serve o site estático (`index.html`, CSS, JS, `Imagens/`) e expõe a API em `/api/auth` e `/api/filmes`. O banco SQLite é criado automaticamente em `backend/data/corte_seletivo.db` na primeira execução.

---

## 🗺️ Navegação entre Páginas

```
index.html  ─────────────────────────────────────────┐
   │                                                  │
   ├──► adicionarfilmes.html                          │
   ├──► filtro.html                                   │
   └──► login.html ──► cadastro.html ──► index.html
```

---

## 📌 Conceitos Aplicados

**Front-end**
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

**Back-end**
- API REST com **Express** (rotas, middlewares, `express.json()`, `cors`)
- Modelagem de banco relacional em **SQLite** (chave estrangeira `user_id` com `ON DELETE CASCADE`)
- Autenticação **stateless** com **JWT** (`jsonwebtoken`) e hash de senha com **bcrypt**
- Middlewares de autorização (`requireAuth` obrigatório vs. `optionalAuth` opcional)
- Separação de responsabilidades em rotas (`routes/`), middleware (`middleware/`) e acesso a dados (`db.js`)

---

## 👥 Colaboradores

Desenvolvido por estudantes de ADS no IFPB:

- **Weslley Casimiro**
- **Pedro Henrique**
- **Kaique Neres**
- **Arley Felix**