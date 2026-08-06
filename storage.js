
const CineLogStorage = (() => {
  const API_BASE = 'http://localhost:3000';
  const CHAVE_SESSAO = 'cinelog_sessao';

  function getUsuarioLogado() {
    try {
      const raw = localStorage.getItem(CHAVE_SESSAO);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setSessao(usuario) {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
  }

  function limparSessao() {
    localStorage.removeItem(CHAVE_SESSAO);
  }

  function estaLogado() {
    return !!getUsuarioLogado();
  }

  async function request(caminho, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

    let resp;
    try {
      resp = await fetch(`${API_BASE}${caminho}`, { ...options, headers });
    } catch (e) {
      throw new Error('Não foi possível conectar à API. Verifique se o json-server está rodando (npm run json-server).');
    }

    if (!resp.ok) {
      throw new Error(`Erro na comunicação com a API (status ${resp.status}).`);
    }

    return resp.status === 204 ? null : resp.json();
  }

  async function cadastrar(nome, email, senha) {
    const emailNormalizado = email.trim().toLowerCase();

    const existentes = await request(`/usuarios?email=${encodeURIComponent(emailNormalizado)}`);
    if (existentes.length > 0) {
      throw new Error('Já existe uma conta cadastrada com este e-mail.');
    }

    const usuario = await request('/usuarios', {
      method: 'POST',
      body: JSON.stringify({ nome: nome.trim(), email: emailNormalizado, senha })
    });

    setSessao(usuario);
    return usuario;
  }

  async function login(email, senha) {
    const emailNormalizado = email.trim().toLowerCase();

    const encontrados = await request(
      `/usuarios?email=${encodeURIComponent(emailNormalizado)}&senha=${encodeURIComponent(senha)}`
    );

    if (encontrados.length === 0) {
      throw new Error('E-mail ou senha incorretos.');
    }

    setSessao(encontrados[0]);
    return encontrados[0];
  }

  function logout() {
    limparSessao();
  }

  async function getMovies() {
    try {
      const filmes = await request('/filmes');
      const usuarioLogado = getUsuarioLogado();

      return filmes
        .slice()
        .sort((a, b) => b.id - a.id)
        .map(f => ({
          ...f,

          canDelete: !!usuarioLogado && usuarioLogado.id === f.addedByUserId
        }));
    } catch (e) {
      return [];
    }
  }

  async function addMovie(filme) {
    const usuario = getUsuarioLogado();
    if (!usuario) {
      throw new Error('Você precisa entrar para adicionar um filme.');
    }

    const payload = {
      ...filme,
      addedByUserId: usuario.id,
      addedByName: usuario.nome,
      addedAt: new Date().toISOString()
    };

    const criado = await request('/filmes', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return { ...criado, canDelete: true };
  }

  async function updateMovie(id, filme) {
    const usuario = getUsuarioLogado();
    const atual = await request(`/filmes/${id}`);

    if (!usuario || atual.addedByUserId !== usuario.id) {
      throw new Error('Só quem adicionou este filme pode editá-lo.');
    }

    const payload = {
      ...atual,
      ...filme,
      id: atual.id,
      addedByUserId: atual.addedByUserId,
      addedByName: atual.addedByName,
      addedAt: atual.addedAt
    };

    const atualizado = await request(`/filmes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    return { ...atualizado, canDelete: true };
  }

  async function removeMovie(id) {
    const usuario = getUsuarioLogado();
    const atual = await request(`/filmes/${id}`);

    if (!usuario || atual.addedByUserId !== usuario.id) {
      throw new Error('Só quem adicionou este filme pode excluí-lo.');
    }

    await request(`/filmes/${id}`, { method: 'DELETE' });
  }

  async function getTotalUserMinutes() {
    const filmes = await getMovies();
    return filmes.reduce((acc, filme) => acc + (parseInt(filme.duration) || 0), 0);
  }

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
    addMovie,
    updateMovie,
    removeMovie,
    getTotalUserMinutes,
    parseDuration,
    cadastrar,
    login,
    logout,
    getUsuarioLogado,
    estaLogado
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.getElementById('navLinks');
  if (!navLinks) return;

  const linkLogin = Array.from(navLinks.querySelectorAll('a')).find(
    a => a.getAttribute('href') === 'login.html'
  );
  if (!linkLogin) return;

  const usuario = CineLogStorage.getUsuarioLogado();
  if (!usuario) return;

  linkLogin.textContent = `Olá, ${usuario.nome.split(' ')[0]} · Sair`;
  linkLogin.href = '#';
  linkLogin.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Deseja sair da sua conta?')) {
      CineLogStorage.logout();
      window.location.reload();
    }
  });
});
