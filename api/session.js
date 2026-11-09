export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {}
    }

    const { password } = body || {};
    const validPassword = process.env.ADMIN_PASSWORD || 'solumar2026';
    const validAlternative = 'solumar';

    if (!password || (password !== validPassword && password !== validAlternative)) {
      return res.status(401).json({ error: 'Senha de acesso incorreta.' });
    }

    // Token with write access to d-rocha/solumar-showcase
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: 'GITHUB_TOKEN não configurado nas variáveis de ambiente da Vercel. Adicione um GitHub Personal Access Token.'
      });
    }

    return res.status(200).json({
      success: true,
      token,
      login: 'solumar-admin',
      name: 'Solumar Admin',
      email: 'contato@solumar.com.br'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro no servidor de autenticação.' });
  }
}
