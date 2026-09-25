// serve.mjs: a tiny local web server for the studio (no dependencies).
//   node serve.mjs [port] [--open]      → http://localhost:5173/
// Opening studio.html straight from disk works too, but over http:// the in-browser exporter can also load scene audio.
import http from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { spawn } from 'node:child_process';

const root = resolve('.'), port = +(process.argv.find(a => /^\d+$/.test(a)) || process.env.PORT || 5173);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.md': 'text/markdown; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/studio.html';
  const f = normalize(join(root, p));
  if (f !== root && !f.startsWith(root + sep)) { res.writeHead(403).end('forbidden'); return; }
  let st; try { st = statSync(f); if (!st.isFile()) throw 0; } catch { res.writeHead(404).end('not found: ' + p); return; }
  const type = MIME[extname(f).toLowerCase()] || 'application/octet-stream', range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (range) {                                                   // partial content, so audio can seek
    const a = range[1] ? +range[1] : 0, b = range[2] ? +range[2] : st.size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${a}-${b}/${st.size}`, 'Content-Length': b - a + 1, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' });
    createReadStream(f, { start: a, end: b }).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' });
    createReadStream(f).pipe(res);
  }
}).listen(port, '127.0.0.1', () => {
  const url = `http://localhost:${port}/`;
  console.log(`Jester Fester studio → ${url}   (Ctrl+C to stop)`);
  if (process.argv.includes('--open')) {
    const [cmd, args] = process.platform === 'darwin' ? ['open', [url]] : process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] : ['xdg-open', [url]];
    spawn(cmd, args, { stdio: 'ignore', detached: true }).on('error', () => {}).unref();
  }
});
