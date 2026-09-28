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
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'firm2026';
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
  '.ttf': 'font/ttf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
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

function readContent() {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading dynamic content:', err);
  }
  return null;
}

function saveContent(content) {
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving dynamic content:', err);
    return false;
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
    if (lead.estimatedPrice) msg += `<b>Смета:</b> ${lead.estimatedPrice}\n`;
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
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.error('Telegram send error:', err);
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

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

  // Admin Auth endpoint
  if (req.method === 'POST' && pathname === '/api/admin/login') {
    try {
      const { password } = await parseJsonBody(req);
      if (password === ADMIN_PASSWORD) {
        const token = crypto.createHmac('sha256', ADMIN_PASSWORD).update('firm-admin-session').digest('hex');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, token }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Неверный пароль' }));
      }
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid request' }));
    }
  }

  // API: Leads submission (Public)
  if (req.method === 'POST' && pathname === '/api/leads') {
    try {
      const data = await parseJsonBody(req);
      const leadId = crypto.randomUUID();
      const lead = {
        id: leadId,
        status: 'new', // new | in_progress | proposal_sent | deal | archived
        notes: [],
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

  // API: Get leads (Admin / CRM)
  if (req.method === 'GET' && pathname === '/api/leads') {
    const leads = readLeads();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ count: leads.length, leads }));
  }

  // API: Update lead (PATCH /api/leads/:id)
  if (req.method === 'PATCH' && pathname.startsWith('/api/leads/')) {
    const leadId = pathname.replace('/api/leads/', '');
    try {
      const updates = await parseJsonBody(req);
      const leads = readLeads();
      const index = leads.findIndex(l => l.id === leadId);

      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Lead not found' }));
      }

      leads[index] = {
        ...leads[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      saveLeads(leads);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, lead: leads[index] }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Update failed' }));
    }
  }

  // API: Delete lead (DELETE /api/leads/:id)
  if (req.method === 'DELETE' && pathname.startsWith('/api/leads/')) {
    const leadId = pathname.replace('/api/leads/', '');
    let leads = readLeads();
    const prevLen = leads.length;
    leads = leads.filter(l => l.id !== leadId);

    if (leads.length === prevLen) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Lead not found' }));
    }

    saveLeads(leads);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true }));
  }

  // API: Get dynamic content (cases, services, settings)
  if (req.method === 'GET' && pathname === '/api/content') {
    const content = readContent();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(content || {}));
  }

  // API: Save dynamic content (cases, services, settings)
  if (req.method === 'PUT' && pathname === '/api/content') {
    try {
      const data = await parseJsonBody(req);
      saveContent(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Failed to save content' }));
    }
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
      if (ext === '.html' || ext === '.xml' || ext === '.txt') {
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
