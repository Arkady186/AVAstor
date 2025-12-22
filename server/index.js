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

const TELEGRAM_ONLY = process.env.TELEGRAM_ONLY === '1';

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

// Serve mirrored FEELDAY site directly from public (so it works even if Vite doesn't copy it to dist)
const feeldayPublicDir = path.join(__dirname, '..', 'client', 'public', 'feelday');
if (fs.existsSync(feeldayPublicDir)) {
  app.use('/feelday', express.static(feeldayPublicDir));
}

// Disable server-side block page entirely
app.use((req, res, next) => next());

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
<html lang="ru"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>INK&ARTstudio</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#1a1a1a;color:#fff;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif"><div><div style="opacity:.9;margin-bottom:8px;font-weight:900;font-size:24px;letter-spacing:1px">INK&ART<span style="color:#6a2bbb">studio</span></div><div style="opacity:.6">Сервис запускается, попробуйте обновить через пару секунд…</div></div></body></html>`);
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



