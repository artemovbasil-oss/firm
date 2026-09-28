import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// Ensure data folder exists
fs.mkdirSync(DATA_DIR, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function readLeads() {
  try {
    if (!fs.existsSync(LEADS_FILE)) return [];
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading leads:', err);
    return [];
  }
}

function saveLeads(leads) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving leads:', err);
  }
}

async function notifyTelegram(lead) {
  if (!BOT_TOKEN || !CHAT_ID) return;

  try {
    let msg = `🔥 <b>НОВАЯ ЗАЯВКА FIRM AGENCY</b>\n\n`;
    msg += `<b>Тип:</b> ${lead.type || 'Контакт'}\n`;
    if (lead.name) msg += `<b>Имя:</b> ${lead.name}\n`;
    if (lead.contact) msg += `<b>Контакт:</b> ${lead.contact}\n`;
    if (lead.service) msg += `<b>Услуга:</b> ${lead.service}\n`;
    if (lead.budget) msg += `<b>Бюджет:</b> ${lead.budget}\n`;
    if (lead.estimatedPrice) msg += `<b>Расчетная смета:</b> ${lead.estimatedPrice}\n`;
    if (lead.estimatedDays) msg += `<b>Срок:</b> ${lead.estimatedDays}\n`;
    if (lead.targetUrl) msg += `<b>Сайт/профиль для аудита:</b> ${lead.targetUrl}\n`;
    if (lead.issue) msg += `<b>Проблема:</b> ${lead.issue}\n`;
    if (lead.selectedServices && lead.selectedServices.length > 0) {
      msg += `<b>Выбранные услуги:</b>\n• ${lead.selectedServices.join('\n• ')}\n`;
    }
    if (lead.comment || lead.message) {
      msg += `\n<b>Комментарий:</b>\n${lead.comment || lead.message}\n`;
    }
    msg += `\n<i>Дата: ${new Date().toLocaleString('ru-RU')}</i>`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg,
        parse_mode: 'HTML'
      })
    });
    const data = await res.json();
    if (!data.ok) {
      console.warn('Telegram notification failed:', data);
    }
  } catch (err) {
    console.error('Telegram send error:', err);
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS & Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Healthcheck endpoint
  if (pathname === '/health' || pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'ok',
      service: 'firm-agency',
      uptime: process.uptime(),
      time: new Date().toISOString()
    }));
  }

  // API: Leads submission
  if (req.method === 'POST' && pathname === '/api/leads') {
    try {
      const data = await parseJsonBody(req);
      const leadId = crypto.randomUUID();
      const lead = {
        id: leadId,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'] || '',
        createdAt: new Date().toISOString(),
        ...data
      };

      const leads = readLeads();
      leads.unshift(lead);
      saveLeads(leads);

      // Async telegram notify
      notifyTelegram(lead).catch(console.error);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, id: leadId }));
    } catch (err) {
      console.error('Error processing lead:', err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid lead payload' }));
    }
  }

  // API: Read recent leads (protected / internal diagnostic)
  if (req.method === 'GET' && pathname === '/api/leads') {
    const leads = readLeads();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ count: leads.length, leads: leads.slice(0, 50) }));
  }

  // Static File Serving
  if (req.method === 'GET' || req.method === 'HEAD') {
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '') safePath = '/index.html';

    let filePath = path.join(DIST_DIR, safePath);

    // If file doesn't exist, fallback to index.html (SPA routing)
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // Cache headers
      if (ext === '.html') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }

      res.writeHead(200, { 'Content-Type': contentType });
      if (req.method === 'HEAD') return res.end();

      const stream = fs.createReadStream(filePath);
      return stream.pipe(res);
    }
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FIRM Agency Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving static assets from ${DIST_DIR}`);
});
