const express = require('express');
const db = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/** Converte uma linha do banco (join com users) no formato usado pelo front-end. */
function paraFilmeApi(linha, usuarioLogadoId) {
  return {
    id: linha.id,
    title: linha.title,
    original: linha.original,
    year: linha.year,
    duration: linha.duration,
    nota: linha.nota,
    rating: linha.rating,
    director: linha.director,
    country: linha.country,
    language: linha.language,
    poster: linha.poster,
    synopsis: linha.synopsis,
    genres: linha.genres ? JSON.parse(linha.genres) : [],
    assistidoEm: linha.assistidoEm,
    featured: !!linha.featured,
    addedAt: linha.addedAt,
    addedByUserId: linha.user_id,
    addedByName: linha.nome,
    // só é true quando o usuário logado é o mesmo que adicionou o filme
    canDelete: usuarioLogadoId != null && usuarioLogadoId === linha.user_id
  };
}

// GET /api/filmes — lista pública (todo mundo vê todos os filmes adicionados)
router.get('/', optionalAuth, (req, res) => {
  const linhas = db
    .prepare(
      `SELECT f.*, u.nome
       FROM filmes f
       JOIN users u ON u.id = f.user_id
       ORDER BY f.id DESC`
    )
    .all();

  const usuarioLogadoId = req.user ? req.user.id : null;
  res.json(linhas.map(l => paraFilmeApi(l, usuarioLogadoId)));
});

// POST /api/filmes — cria um filme (precisa estar logado)
router.post('/', requireAuth, (req, res) => {
  const b = req.body || {};

  if (!b.title || !String(b.title).trim()) {
    return res.status(400).json({ erro: 'O título é obrigatório.' });
  }
  if (!b.year) {
    return res.status(400).json({ erro: 'O ano é obrigatório.' });
  }
  if (!b.nota || b.nota < 1 || b.nota > 5) {
    return res.status(400).json({ erro: 'Selecione uma avaliação de 1 a 5 estrelas.' });
  }
  if (!Array.isArray(b.genres) || b.genres.length === 0) {
    return res.status(400).json({ erro: 'Selecione ao menos um gênero.' });
  }

  const info = db
    .prepare(
      `INSERT INTO filmes
        (title, original, year, duration, nota, rating, director, country, language,
         poster, synopsis, genres, assistidoEm, featured, addedAt, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      String(b.title).trim(),
      b.original || '',
      parseInt(b.year, 10),
      b.duration ? parseInt(b.duration, 10) : null,
      parseInt(b.nota, 10),
      b.rating ? parseFloat(b.rating) : parseInt(b.nota, 10),
      b.director || '',
      b.country || '',
      b.language || '',
      b.poster || '',
      b.synopsis || '',
      JSON.stringify(b.genres),
      b.assistidoEm || null,
      b.featured ? 1 : 0,
      new Date().toISOString(),
      req.user.id
    );

  const linha = db
    .prepare(`SELECT f.*, u.nome FROM filmes f JOIN users u ON u.id = f.user_id WHERE f.id = ?`)
    .get(Number(info.lastInsertRowid));

  res.status(201).json(paraFilmeApi(linha, req.user.id));
});

// DELETE /api/filmes/:id — só quem adicionou pode excluir
router.delete('/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const linha = db.prepare('SELECT * FROM filmes WHERE id = ?').get(id);

  if (!linha) {
    return res.status(404).json({ erro: 'Filme não encontrado.' });
  }
  if (linha.user_id !== req.user.id) {
    return res.status(403).json({ erro: 'Só quem adicionou este filme pode excluí-lo.' });
  }

  db.prepare('DELETE FROM filmes WHERE id = ?').run(id);
  res.json({ ok: true });
});

module.exports = router;
