const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 10000;

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(express.json({ limit: '100kb' }));

app.get('/_health', (req, res) => {
  res.status(200).send('OK');
});

const distDir = path.join(__dirname, '..', 'client', 'dist');
app.use('/assets', express.static(path.join(distDir, 'assets'), { maxAge: '1y', immutable: true }));
app.use(express.static(distDir, { index: false }));

app.get('/', (req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(`<!doctype html>
<html lang="ru"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Basketball Game</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#1a1a2e;color:#fff;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif"><div><div style="opacity:.9;margin-bottom:8px;font-weight:900;font-size:24px">🏀 Basketball Game</div><div style="opacity:.6">Сервис запускается, попробуйте обновить через пару секунд…</div></div></body></html>`);
});

app.get('*', (req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.redirect('/');
});

process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err);
});
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
});

app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
  console.log(`[server] dist present: ${fs.existsSync(path.join(distDir, 'index.html'))}`);
});
