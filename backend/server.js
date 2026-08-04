/**
 * server.js
 * ----------------
 * Ponto de entrada do backend. Faz duas coisas:
 *
 *  1. Serve os arquivos estáticos do site (o mesmo HTML/CSS/JS que já
 *     existia, sem precisar mover nada — a pasta servida é a raiz do
 *     projeto, um nível acima de /backend).
 *  2. Expõe a API REST em /api/auth e /api/filmes, usada pelo
 *     storage.js, login.js, adicionarfilmes.js e recomendados.js.
 *
 * Rodar com: npm install && npm start (dentro da pasta backend/)
 * Depois abrir http://localhost:3000
 */
const path = require('path');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const filmesRoutes = require('./routes/filmes.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/filmes', filmesRoutes);

// Site estático (index.html, css, js, Imagens/...) fica na raiz do projeto
const staticDir = path.join(__dirname, '..');
app.use(express.static(staticDir));

// Qualquer rota /api não encontrada cai aqui como JSON (não como HTML)
app.use('/api', (req, res) => {
  res.status(404).json({ erro: 'Rota de API não encontrada.' });
});

app.listen(PORT, () => {
  console.log(`Corte Seletivo rodando em http://localhost:${PORT}`);
});
