const http = require('http');
const fs = require('fs');
const path = require('path');

const root = 'C:/AizyntProposalSuite';
const port = Number(process.argv[2] || 4175);
const host = '127.0.0.1';
const downloadsDir = path.join(process.env.USERPROFILE || 'C:/Users/user', 'Downloads');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${host}`);

  if (req.method === 'POST' && url.pathname === '/save-pdf') {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        const safeName = String(payload.filename || 'Aizynt_Proposal.pdf')
          .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
          .replace(/\.pdf$/i, '') + '.pdf';
        const base = path.basename(safeName, '.pdf');
        let filePath = path.join(downloadsDir, safeName);
        let index = 1;
        while (fs.existsSync(filePath)) {
          filePath = path.join(downloadsDir, `${base} (${index}).pdf`);
          index += 1;
        }
        const data = Buffer.from(String(payload.data || ''), 'base64');
        if (!data.length) throw new Error('Empty PDF data.');
        fs.writeFileSync(filePath, data);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({ ok: true, path: filePath, bytes: data.length }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({ ok: false, error: String(error.message || error) }));
      }
    });
    return;
  }

  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';

  const filePath = path.resolve(root, `.${pathname.replace(/\\/g, '/')}`);
  if (!filePath.startsWith(path.resolve(root))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 500);
      res.end(error.code === 'ENOENT' ? 'Not found' : String(error));
      return;
    }

    res.writeHead(200, {
      'Content-Type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  });
}).listen(port, host, () => {
  console.log(`Aizynt combined app running at http://${host}:${port}/`);
});
