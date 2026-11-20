import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_SERVICES, INITIAL_CASES, FAQ_ITEMS } from '../src/data/agencyData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');
const OUT = path.join(DIST, 'prerender');
const LANGS = ['ru', 'en', 'kz'];

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const loc = (field, lang) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.ru || field.en || '';
};

const LABELS = {
  ru: {
    home: 'ARTX — агентство цифровых решений: сайты, брендинг, ПО, SEO',
    desc: 'Создаем высококонверсионные сайты, продающие лендинги, айдентику, презентации и кастомное ПО. Проводим SEO-аудит, упаковываем бизнес и ведем соцсети для взрывного роста продаж.',
    services: 'Услуги', cases: 'Кейсы', faq: 'Частые вопросы', contact: 'Контакты',
    challenge: 'Задача', solution: 'Решение', results: 'Результаты', stack: 'Технологии', deliverables: 'Что передаём клиенту',
    back: 'Все кейсы', homeLink: 'Главная', email: 'Почта', telegram: 'Telegram'
  },
  en: {
    home: 'ARTX — digital production & growth agency: web, branding, software, SEO',
    desc: 'Full-cycle digital production agency. We engineer high-converting web platforms, branding, software, investor pitch decks, SEO dominance, and turnkey business packaging.',
    services: 'Services', cases: 'Case studies', faq: 'FAQ', contact: 'Contact',
    challenge: 'Challenge', solution: 'Solution', results: 'Results', stack: 'Technology', deliverables: 'Deliverables',
    back: 'All cases', homeLink: 'Home', email: 'Email', telegram: 'Telegram'
  },
  kz: {
    home: 'ARTX — сандық шешімдер агенттігі: сайттар, брендинг, БҚ, SEO',
    desc: 'Конверсиясы жоғары сайттар, сатушы лендингтер, айдентика, презентациялар және жеке бағдарламалық қамтамасыз ету. Бизнесті 360° орап, SEO мен SMM арқылы сатылымды еселейміз.',
    services: 'Қызметтер', cases: 'Кейстер', faq: 'Жиі қойылатын сұрақтар', contact: 'Байланыс',
    challenge: 'Міндет', solution: 'Шешім', results: 'Нәтижелер', stack: 'Технологиялар', deliverables: 'Клиентке не береміз',
    back: 'Барлық кейстер', homeLink: 'Басты бет', email: 'Пошта', telegram: 'Telegram'
  }
};

const BASE_STYLE = `<style>
  body{background:#07080c;color:#e5e7eb;font:16px/1.6 system-ui,sans-serif;margin:0}
  .pr{max-width:860px;margin:0 auto;padding:48px 20px}
  .pr h1{font-size:34px;line-height:1.15;color:#fff}
  .pr h2{font-size:24px;color:#fff;margin-top:40px}
  .pr h3{font-size:18px;color:#fff;margin-bottom:4px}
  .pr a{color:#60a5fa}
  .pr p,.pr li{color:#d1d5db}
  .pr dt{font-weight:700;color:#fff;margin-top:16px}
  .pr dd{margin:4px 0 0 0}
</style>`;

function homeBody(lang) {
  const L = LABELS[lang];
  const services = INITIAL_SERVICES.map(s =>
    `<section><h3>${esc(loc(s.title, lang))}</h3><p>${esc(loc(s.tagline, lang))}</p></section>`).join('\n');
  const cases = INITIAL_CASES.filter(c => c.published !== false).map(c =>
    `<li><a href="/cases/${esc(c.slug)}">${esc(loc(c.title, lang))}</a> — ${esc(loc(c.summary, lang))}</li>`).join('\n');
  const faq = FAQ_ITEMS.map(f =>
    `<dt>${esc(loc(f.question, lang))}</dt><dd>${esc(loc(f.answer, lang))}</dd>`).join('\n');
  return `<div class="pr">
  <h1>${esc(L.home)}</h1>
  <p>${esc(L.desc)}</p>
  <h2>${esc(L.services)}</h2>
  ${services}
  <h2>${esc(L.cases)}</h2>
  <ul>${cases}</ul>
  <h2>${esc(L.faq)}</h2>
  <dl>${faq}</dl>
  <h2>${esc(L.contact)}</h2>
  <p>${esc(L.email)}: <a href="mailto:hello@artx.one">hello@artx.one</a> · ${esc(L.telegram)}: <a href="https://t.me/artemov_basil">@artemov_basil</a></p>
</div>`;
}

function caseBody(c, lang) {
  const L = LABELS[lang];
  const list = (items) => Array.isArray(items) && items.length
    ? `<ul>${items.map(i => `<li>${esc(typeof i === 'string' ? i : loc(i, lang))}</li>`).join('')}</ul>` : '';
  const metrics = Array.isArray(c.metrics) && c.metrics.length
    ? `<h2>${esc(L.results)}</h2><ul>${c.metrics.map(m => `<li><strong>${esc(m.value)}</strong> — ${esc(loc(m.label, lang))}</li>`).join('')}</ul>` : '';
  return `<div class="pr">
  <nav><a href="/">${esc(L.homeLink)}</a> / <a href="/#cases">${esc(L.back)}</a></nav>
  <h1>${esc(loc(c.title, lang))}</h1>
  <p>${esc(loc(c.client, lang))} · ${esc(c.year || '')}</p>
  <p>${esc(loc(c.summary, lang))}</p>
  <h2>${esc(L.challenge)}</h2>
  <p>${esc(loc(c.challenge, lang))}</p>
  <h2>${esc(L.solution)}</h2>
  <p>${esc(loc(c.solution, lang))}</p>
  ${metrics}
  ${Array.isArray(c.deliverables) && c.deliverables.length ? `<h2>${esc(L.deliverables)}</h2>${list(c.deliverables)}` : ''}
  ${Array.isArray(c.stack) && c.stack.length ? `<h2>${esc(L.stack)}</h2>${list(c.stack)}` : ''}
  <p><a href="/#cases">${esc(L.back)}</a></p>
</div>`;
}

function render(template, { lang, title, desc, canonical, body }) {
  let html = template;
  html = html.replace('<html lang="ru"', `<html lang="${lang === 'kz' ? 'kk' : lang}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${esc(canonical)}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${esc(canonical)}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = html.replace('</head>', `${BASE_STYLE}</head>`);
  html = html.replace(/<div id="root"[^>]*><\/div>/, `<div id="root" class="w-full max-w-full">${body}</div>`);
  return html;
}

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
fs.mkdirSync(OUT, { recursive: true });
let count = 0;

for (const lang of LANGS) {
  const L = LABELS[lang];
  const suffix = lang === 'ru' ? '' : `?lang=${lang}`;
  fs.writeFileSync(path.join(OUT, `home-${lang}.html`), render(template, {
    lang, title: L.home, desc: L.desc, canonical: `https://artx.one/${suffix}`, body: homeBody(lang)
  }));
  count++;
  for (const c of INITIAL_CASES.filter(c => c.published !== false)) {
    const title = `${loc(c.title, lang)} — ARTX Case Study`;
    fs.writeFileSync(path.join(OUT, `case-${c.slug}-${lang}.html`), render(template, {
      lang, title, desc: loc(c.summary, lang), canonical: `https://artx.one/cases/${c.slug}${suffix}`, body: caseBody(c, lang)
    }));
    count++;
  }
}

console.log(`✅ Prerendered ${count} static pages into dist/prerender`);