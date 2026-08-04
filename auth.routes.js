const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/cadastro
router.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body || {};

  if (!nome || !nome.trim()) {
    return res.status(400).json({ erro: 'O nome é obrigatório.' });
  }
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ erro: 'Insira um e-mail válido.' });
  }
  if (!senha || senha.length < 8) {
    return res.status(400).json({ erro: 'A senha deve ter no mínimo 8 caracteres.' });
  }

  const emailNormalizado = email.trim().toLowerCase();
  const existente = db.prepare('SELECT id FROM users WHERE email = ?').get(emailNormalizado);
  if (existente) {
    return res.status(409).json({ erro: 'Já existe uma conta cadastrada com este e-mail.' });
  }

  const senhaHash = bcrypt.hashSync(senha, 10);
  const info = db
    .prepare('INSERT INTO users (nome, email, senha_hash) VALUES (?, ?, ?)')
    .run(nome.trim(), emailNormalizado, senhaHash);

  const usuario = { id: info.lastInsertRowid, nome: nome.trim(), email: emailNormalizado };
  res.status(201).json({ token: gerarToken(usuario), usuario });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
  }

  const linha = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
  if (!linha || !bcrypt.compareSync(senha, linha.senha_hash)) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  }

  const usuario = { id: linha.id, nome: linha.nome, email: linha.email };
  res.json({ token: gerarToken(usuario), usuario });
});

module.exports = router;
