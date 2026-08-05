/**
 * middleware/auth.js
 * ----------------
 * Autenticação via JWT enviado no header "Authorization: Bearer <token>".
 *
 * - requireAuth: bloqueia a rota (401) se não houver um token válido.
 *   Usado em rotas que criam/excluem dados (ex.: adicionar ou remover filme).
 * - optionalAuth: segue em frente mesmo sem token, mas anexa req.user
 *   quando um token válido é enviado. Usado na listagem de filmes, para
 *   sabermos se o usuário logado é o dono de cada filme (campo canDelete).
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'corte-seletivo-dev-secret-troque-em-producao';

function getTokenFromHeader(req) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');
  return tipo === 'Bearer' && token ? token : null;
}

function requireAuth(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ erro: 'É necessário estar logado para fazer isso.' });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ erro: 'Sessão inválida ou expirada. Faça login novamente.' });
  }
}

function optionalAuth(req, res, next) {
  const token = getTokenFromHeader(req);
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      // token inválido/expirado: apenas ignora, segue como visitante anônimo
    }
  }
  next();
}

module.exports = { requireAuth, optionalAuth, JWT_SECRET };
