const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 10000;

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(compression());

function isTelegramUserAgent(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') return false;
  return /Telegram/i.test(userAgent);
}

app.get('/_health', (req, res) => {
  res.status(200).send('OK');
});

const distDir = path.join(__dirname, '..', 'client', 'dist');
app.use('/assets', express.static(path.join(distDir, 'assets'), { maxAge: '1y', immutable: true }));

// Gating for HTML requests: only allow within Telegram webview
app.use((req, res, next) => {
  const acceptsHtml = (req.headers['accept'] || '').includes('text/html');
  if (!acceptsHtml) return next();

  const userAgent = req.headers['user-agent'] || '';
  const isTelegram = isTelegramUserAgent(userAgent);

  if (!isTelegram && !process.env.ALLOW_BROWSER) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(403).send(`<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Откройте в Telegram</title>
    <style>
      body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#0b0f14;color:#fff;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
      .card{padding:32px 28px;background:linear-gradient(145deg,#0e1319,#091017);border:1px solid rgba(255,255,255,0.08);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05);max-width:520px;text-align:center}
      .title{font-size:22px;margin:0 0 8px}
      .subtitle{opacity:.75;margin:0 0 20px}
      .btn{display:inline-block;padding:12px 16px;border-radius:12px;background:#2aabee;color:#fff;text-decoration:none;font-weight:600}
      .hint{margin-top:14px;opacity:.65;font-size:12px}
    </style>
  </head>
  <body>
    <div class="card">
      <h1 class="title">Это мини‑приложение доступно только в Telegram</h1>
      <p class="subtitle">Откройте бота и запустите Web App из Telegram.</p>
      <a class="btn" href="#" onclick="alert('Откройте этого бота в Telegram и запустите мини‑приложение'); return false;">Открыть в Telegram</a>
      <div class="hint">Если вы разработчик: установите переменную окружения ALLOW_BROWSER=1 для локальной отладки.</div>
    </div>
  </body>
</html>`);
  }

  next();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] Listening on http://localhost:${PORT}`);
});


