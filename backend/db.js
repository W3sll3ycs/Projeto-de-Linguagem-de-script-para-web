/**
 * db.js
 * ----------------
 * Conexão com o banco SQLite usando o módulo nativo `node:sqlite`
 * (embutido no próprio Node.js a partir da versão 22 — não precisa
 * instalar nem compilar nenhum pacote nativo, por isso não depende de
 * Python/Visual Studio Build Tools como o pacote "better-sqlite3").
 *
 * É normal aparecer um aviso "ExperimentalWarning: SQLite is an
 * experimental feature..." no console ao iniciar — é só um aviso do
 * Node, não é um erro.
 *
 * Tabelas:
 *  - users:  contas de usuário (login/cadastro)
 *  - filmes: filmes adicionados pelos usuários via "Adicionar Filme",
 *            cada um vinculado ao usuário que o criou (user_id)
 *
 * O arquivo do banco fica em backend/data/corte_seletivo.db e é criado
 * automaticamente na primeira execução.
 */
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, 'corte_seletivo.db'));

db.exec('PRAGMA foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS filmes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    original TEXT,
    year INTEGER,
    duration INTEGER,
    nota INTEGER,
    rating REAL,
    director TEXT,
    country TEXT,
    language TEXT,
    poster TEXT,
    synopsis TEXT,
    genres TEXT,
    assistidoEm TEXT,
    featured INTEGER DEFAULT 0,
    addedAt TEXT,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

module.exports = db;
