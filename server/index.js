const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const helmet = require('helmet');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 10000;

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(express.json({ limit: '100kb' }));

function isTelegramUserAgent(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') return false;
  return /Telegram/i.test(userAgent);
}

app.get('/_health', (req, res) => {
  res.status(200).send('OK');
});

const distDir = path.join(__dirname, '..', 'client', 'dist');
app.use('/assets', express.static(path.join(distDir, 'assets'), { maxAge: '1y', immutable: true }));
app.use(express.static(distDir, { index: false }));

// Gating for HTML requests: only allow within Telegram webview (server hint, client still gates)
app.use((req, res, next) => {
  const acceptsHtml = (req.headers['accept'] || '').includes('text/html');
  if (!acceptsHtml) return next();

  const userAgent = req.headers['user-agent'] || '';
  const xrw = String(req.headers['x-requested-with'] || '').toLowerCase();
  const isTelegram = isTelegramUserAgent(userAgent) || xrw.includes('telegram') || xrw.includes('org.telegram.messenger');

  // Always allow root path to avoid false positives in some webviews; client will still gate
  if (req.path === '/') return next();

  if (!isTelegram && !process.env.ALLOW_BROWSER) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`<!doctype html>
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

function buildDataCheckString(params) {
  const entries = [];
  for (const [key, value] of params.entries()) {
    if (key === 'hash') continue;
    entries.push([key, value]);
  }
  entries.sort((a, b) => a[0].localeCompare(b[0]));
  return entries.map(([k, v]) => `${k}=${v}`).join('\n');
}

function verifyInitData(initDataString, botToken) {
  if (!initDataString || !botToken) {
    return { ok: false, reason: 'missing_params' };
  }
  const trimmed = initDataString.startsWith('?') ? initDataString.slice(1) : initDataString;
  const params = new URLSearchParams(trimmed);
  const hash = params.get('hash');
  if (!hash) {
    return { ok: false, reason: 'missing_hash' };
  }

  const dataCheckString = buildDataCheckString(params);
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  const computed = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  const ok = crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hash, 'hex'));
  if (!ok) {
    return { ok: false, reason: 'invalid_hash' };
  }

  let user = undefined;
  const userStr = params.get('user');
  if (userStr) {
    try { user = JSON.parse(userStr); } catch {}
  }
  return { ok: true, user };
}

app.post('/api/verify', (req, res) => {
  try {
    const botToken = process.env.BOT_TOKEN;
    const { initData } = req.body || {};
    const result = verifyInitData(initData, botToken);
    if (!result.ok) {
      return res.status(401).json({ ok: false, error: result.reason });
    }
    // Log minimal info for diagnostics (no secrets)
    if (result.user?.id) {
      // eslint-disable-next-line no-console
      console.log(`[verify] user ${result.user.id} @${result.user.username || ''}`);
    }
    return res.json({ ok: true, user: result.user || null });
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
});

app.get('/', (req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(`<!doctype html>
<html lang="ru"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>avastore</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#0b0f14;color:#fff;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif"><div><div style="opacity:.75;margin-bottom:8px">avastore</div><div style="opacity:.6">Сервис запускается, попробуйте обновить через пару секунд…</div></div></body></html>`);
});

app.get('*', (req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.redirect('/');
});

// Basic diagnostics
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error('[unhandledRejection]', err);
});
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('[uncaughtException]', err);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] Listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`[server] dist present: ${fs.existsSync(path.join(distDir, 'index.html'))}`);
  // eslint-disable-next-line no-console
  console.log(`[server] BOT_TOKEN set: ${Boolean(process.env.BOT_TOKEN)}`);
});



