// serve.mjs: a tiny local web server for the studio (no dependencies).
//   node serve.mjs [port] [--open]      → http://localhost:5173/ (index.html: movies, comics, or games) · --open opens studio.html
// Opening studio.html straight from disk works too, but over http:// the in-browser exporter can also load scene audio
// and local-only /api/illustrate-comic can invoke Gemini Nano Banana 2.1 when GEMINI_API_KEY is configured.
import http from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { REGISTRY } from './scripts/registry.mjs';

const host = process.env.HOST || '127.0.0.1';
const root = resolve('.'), port = +(process.argv.find(a => /^\d+$/.test(a)) || process.env.PORT || 5173);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.md': 'text/markdown; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };

// Load local .env without overriding already-set process environment variables
const envPath = join(root, '.env');
if (existsSync(envPath)) {
  for (const raw of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
    if (k && process.env[k] == null && v) process.env[k] = v;
  }
}

const isLoopbackHost = ['127.0.0.1', 'localhost', '::1'].includes(host);
const activeRefinements = new Set();

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body), 'Cache-Control': 'no-store' });
  res.end(body);
}

function isSameOriginLoopback(req) {
  if (!isLoopbackHost) return false;
  const reqHost = String(req.headers.host || '');
  const origin = req.headers.origin;
  if (origin) {
    try {
      const u = new URL(origin);
      if (!['localhost', '127.0.0.1', '[::1]'].includes(u.hostname)) return false;
      if (reqHost && u.host !== reqHost) return false;
    } catch { return false; }
  }
  return true;
}

function readJsonBody(req, limitBytes = 16384) {
  return new Promise((resolveBody, rejectBody) => {
    const chunks = [];
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limitBytes) { rejectBody(new Error('Request body too large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try { resolveBody(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch { rejectBody(new Error('Invalid JSON body')); }
    });
    req.on('error', rejectBody);
  });
}

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://127.0.0.1');

  // Local-only Studio API endpoints
  if (req.method === 'GET' && u.pathname === '/api/capabilities') {
    sendJson(res, 200, { local: isLoopbackHost, geminiConfigured: Boolean(process.env.GEMINI_API_KEY) });
    return;
  }

  if (req.method === 'POST' && u.pathname === '/api/illustrate-comic') {
    if (!isSameOriginLoopback(req)) {
      sendJson(res, 403, { ok: false, error: 'Forbidden: local same-origin loopback requests only.' });
      return;
    }
    if (!process.env.GEMINI_API_KEY) {
      sendJson(res, 400, { ok: false, error: 'GEMINI_API_KEY is not configured in environment or .env.' });
      return;
    }
    let body;
    try { body = await readJsonBody(req); }
    catch (e) { sendJson(res, 400, { ok: false, error: e.message }); return; }

    const comicId = typeof body.comicId === 'string' ? body.comicId : '';
    if (!REGISTRY.comics?.includes(comicId)) {
      sendJson(res, 400, { ok: false, error: `Unknown comic "${comicId}".` });
      return;
    }
    if (activeRefinements.has(comicId)) {
      sendJson(res, 409, { ok: false, error: `Refinement already in progress for "${comicId}".` });
      return;
    }

    const args = [join(root, 'scripts', 'illustrate_comic.mjs'), comicId];
    if (body.page != null) {
      const pg = Number(body.page);
      if (!Number.isInteger(pg) || pg < 1 || pg > 999) { sendJson(res, 400, { ok: false, error: 'Invalid page number.' }); return; }
      args.push(`--page=${pg}`);
    }
    if (body.panel != null) {
      const pn = Number(body.panel);
      if (!Number.isInteger(pn) || pn < 1 || pn > 99) { sendJson(res, 400, { ok: false, error: 'Invalid panel number.' }); return; }
      args.push(`--panel=${pn}`);
    }
    if (body.mode != null) {
      if (body.mode !== 'page' && body.mode !== 'panel') { sendJson(res, 400, { ok: false, error: 'Invalid mode.' }); return; }
      args.push(`--mode=${body.mode}`);
    }
    if (body.force === true) args.push('--force');

    activeRefinements.add(comicId);
    try {
      const out = await new Promise(done => {
        const child = spawn(process.execPath, args, { cwd: root, env: process.env });
        let stdout = '', stderr = '';
        child.stdout.on('data', d => { stdout += d.toString(); });
        child.stderr.on('data', d => { stderr += d.toString(); });
        child.on('error', err => done({ code: 1, stdout, stderr: err.message }));
        child.on('close', code => done({ code, stdout, stderr }));
      });
      if (out.code !== 0) {
        sendJson(res, 500, { ok: false, error: (out.stderr || out.stdout || 'Refinement failed').trim(), log: out.stdout });
        return;
      }
      const genMatch = out.stdout.match(/generated:\s*(\d+),\s*cached:\s*(\d+)/);
      sendJson(res, 200, {
        ok: true,
        generated: genMatch ? Number(genMatch[1]) : 0,
        cached: genMatch ? Number(genMatch[2]) : 0,
        log: out.stdout.trim(),
      });
    } finally {
      activeRefinements.delete(comicId);
    }
    return;
  }

  let p = decodeURIComponent(u.pathname);
  let f = normalize(join(root, p));
  if (f !== root && !f.startsWith(root + sep)) { res.writeHead(403).end('forbidden'); return; }
  let st; try {
    st = statSync(f);
    if (st.isDirectory()) {
      if (!p.endsWith('/')) {
        res.writeHead(301, { Location: u.pathname + '/' + u.search }).end();
        return;
      }
      f = join(f, 'index.html');
      st = statSync(f);
    }
    if (!st.isFile()) throw 0;
  } catch { res.writeHead(404).end('not found: ' + p); return; }
  const type = MIME[extname(f).toLowerCase()] || 'application/octet-stream', range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (range) {                                                   // partial content, so audio can seek
    const a = range[1] ? +range[1] : 0, b = range[2] ? +range[2] : st.size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${a}-${b}/${st.size}`, 'Content-Length': b - a + 1, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' });
    createReadStream(f, { start: a, end: b }).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' });
    createReadStream(f).pipe(res);
  }
}).listen(port, host, () => {
  const url = `http://localhost:${port}/`, studio = url + 'studio.html';
  console.log(`Safadi Animation Studio → ${url} (movies, comics, or games) · ${studio}   (Ctrl+C to stop)`);
  if (process.argv.includes('--open')) {
    const [cmd, args] = process.platform === 'darwin' ? ['open', [studio]] : process.platform === 'win32' ? ['cmd', ['/c', 'start', '', studio]] : ['xdg-open', [studio]];
    spawn(cmd, args, { stdio: 'ignore', detached: true }).on('error', () => {}).unref();
  }
});
