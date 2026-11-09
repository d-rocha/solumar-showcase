export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    return res.status(400).send("Código de autorização ausente.");
  }

  if (!clientId || !clientSecret) {
    return res.status(500).send("Credenciais OAuth do GitHub não configuradas na Vercel.");
  }

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error || !data.access_token) {
      const errorMsg = data.error_description || data.error || "Falha na autenticação com o GitHub.";
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Erro de Autenticação</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:40px;">
          <h2 style="color:#e11d48;">Erro de autenticação</h2>
          <p>${errorMsg}</p>
          <script>
            if (window.opener) {
              window.opener.postMessage('authorization:github:error:${JSON.stringify(data)}', '*');
            }
            setTimeout(function() { window.close(); }, 3000);
          </script>
        </body>
        </html>
      `);
    }

    const token = data.access_token;
    const content = JSON.stringify({ token, provider: "github" });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Autorização Solumar Backoffice</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:40px;">
        <h3>Autenticado com sucesso!</h3>
        <p>Conectando ao painel do Backoffice...</p>
        <script>
          (function() {
            function receiveMessage(e) {
              window.opener.postMessage(
                'authorization:github:success:${content}',
                e.origin
              );
              window.removeEventListener("message", receiveMessage, false);
              window.close();
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    return res.status(500).send("Erro interno ao comunicar com a API do GitHub.");
  }
}
