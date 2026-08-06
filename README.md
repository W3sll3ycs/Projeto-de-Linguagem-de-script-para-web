# 🎬 Corte Seletivo

> Catálogo cinematográfico curado — o cinema que merece ser visto.

Projeto desenvolvido para a disciplina de **Linguagem de Script para Web** do curso de **Análise e Desenvolvimento de Sistemas** no IFPB.

---

## 📋 Sobre o Projeto

**Corte Seletivo** é uma aplicação web de catálogo de filmes com tema escuro, que permite ao usuário explorar um acervo curado de títulos, filtrar por gênero, buscar por nome, visualizar detalhes em modal, adicionar/editar/remover filmes e receber recomendações baseadas em gênero.

O front-end foi construído com **HTML semântico, CSS puro e JavaScript Vanilla**, sem dependência de frameworks. A partir do Miniprojeto 2, o projeto consome uma **API REST simulada com json-server**, substituindo a leitura de dados locais por chamadas assíncronas (`fetch` + `async/await`).

---

## 🗂️ Estrutura de Pastas

```
corte-seletivo/
├── index.html                # Página principal — catálogo de filmes
├── javascript.js             # Lógica de filtros, busca e modal da home
├── style.css                 # Estilos globais
│
├── adicionarfilmes.html      # Formulário de cadastro/edição de filmes
├── adicionarfilmes.js        # Lógica do formulário, validação e chamadas GET/POST/PUT/DELETE
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
├── storage.js                 # Camada de acesso à API (fetch + async/await)
├── db.json                    # Base de dados usada pelo json-server (Etapa 0)
├── package.json                # Dependência e script do json-server
│
└── Imagens/                   # Capas dos filmes do catálogo
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
- Persistência via **API (json-server)**, com chamadas `fetch` assíncronas (`GET`/`POST`/`PUT`/`DELETE`)
- Lista dos filmes salvos com opção de **edição** (PUT) e **remoção** (DELETE) individual — somente para quem adicionou o filme
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
- Sessão do usuário guardada no `localStorage` (chave `cinelog_sessao`); cadastro e login feitos via API (json-server)
- Animação de carregamento (loader) e mensagem de sucesso antes do redirecionamento
- Ticker animado com títulos de filmes clássicos

### 🎯 Recomendados (`filtro.html`)
- Filtro de filmes por gênero em **tempo real** com `Array.filter()`
- Exibe apenas filmes com nota ≥ 4.0
- Busca textual que percorre todos os gêneros do filme com `Array.some()`
- Estado vazio personalizado quando nenhum resultado é encontrado
- Base de dados com os mesmos 30 títulos do catálogo principal, mais os filmes adicionados por usuários (com selo "Adicionado por")

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 semântico | Estrutura e marcação de conteúdo |
| CSS3 | Estilização, tema escuro, animações |
| JavaScript ES6+ | Filtros, validações, DOM, eventos |
| [Lucide Icons](https://lucide.dev/) | Ícones via CDN (`unpkg`) |
| Google Fonts | Tipografias Playfair Display, DM Mono e Inter |
| `localStorage` | Persistência da sessão de usuário |
| [json-server](https://github.com/typicode/json-server) | API REST simulada (GET/POST/PUT/DELETE) a partir do `db.json` |
| Fetch API + async/await | Consumo assíncrono da API (`storage.js`) |

---

## 🚀 Como Executar (Miniprojeto 2 — json-server)

Seguindo a Etapa 0 do Miniprojeto 2, a "API" do projeto é simulada com **json-server** a partir do `db.json` — sem backend próprio.

```bash
# 1. Instale as dependências (json-server)
npm install

# 2. Suba a API simulada (fica em http://localhost:3000)
npm run json-server
```

Isso expõe automaticamente os endpoints REST para os dois recursos definidos em `db.json`: `/filmes` e `/usuarios`.

Como o json-server só serve a API (não os arquivos estáticos do site), abra o `index.html` com um servidor local à parte — por exemplo a extensão **Live Server** do VS Code, ou `npx serve` em outra porta. O json-server já vem com CORS liberado por padrão, então não há problema em consumi-lo de outra porta.

### 🔌 API (`db.json` via json-server)

| Rota | Método | Descrição |
|---|---|---|
| `/filmes` | GET | Lista todos os filmes adicionados por usuários |
| `/filmes` | POST | Adiciona um filme (fica associado ao usuário logado) |
| `/filmes/:id` | PUT | Edita um filme existente (só quem adicionou pode editar) |
| `/filmes/:id` | DELETE | Remove um filme (só quem adicionou pode excluir) |
| `/usuarios` | POST | Cria uma conta (`nome`, `email`, `senha`) |
| `/usuarios?email=&senha=` | GET | Usado para simular o login (filtra por e-mail/senha) |

> **Nota:** os 30 títulos curados originais do catálogo continuam fixos no HTML/JS (`index.html`, `recomendados.js`) — só os filmes adicionados via formulário (POST/PUT/DELETE) vivem no `db.json`.
>
> **Sobre segurança:** o json-server é um mock de API para fins didáticos — ele não faz hash de senha nem emite token real. A "sessão" de login aqui é só o objeto do usuário salvo no `localStorage`, e a regra de "só o dono edita/exclui" é aplicada no `storage.js` (lado do cliente), não no servidor. Isso é aceitável para o escopo do Miniprojeto 2, mas **não deve ser usado como está em um backend de produção**.

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

## 📌 Conceitos de JavaScript Aplicados

- Manipulação de DOM com `querySelector`, `querySelectorAll`, `createElement`
- Eventos: `addEventListener`, `input`, `click`, `keydown`, `submit`
- `e.preventDefault()` para controle de submissão de formulários
- `Array.filter()` para filtragem de recomendações
- `Array.some()` para verificação de gêneros
- `fetch` com `async/await` e `try/catch` para consumo da API REST (`GET`, `POST`, `PUT`, `DELETE`)
- `JSON.stringify` / `JSON.parse` para montar/ler os corpos das requisições e a sessão no `localStorage`
- Regex para validação de e-mail e critérios de senha
- `setTimeout` para animações de feedback
- `URL.createObjectURL` para exportação de arquivo JSON
- Fechamento de modal com `Escape` via evento global de teclado

---

## 👥 Colaboradores

Desenvolvido por estudantes de ADS do IFPB:

- **Weslley Casimiro**
- **Pedro Henrique**
- **Kaique Neres**
- **Arley Felix**