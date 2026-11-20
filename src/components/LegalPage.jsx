import React from 'react';

const LEGAL = {
  privacy: {
    ru: {
      title: 'Политика конфиденциальности',
      updated: 'Обновлено: 20 ноября 2026',
      sections: [
        ['Какие данные мы собираем', 'Только то, что вы сами отправляете через формы сайта: имя или название компании, контакт для связи (Telegram, WhatsApp, телефон или email), текст сообщения и параметры заявки (услуга, бюджет, ссылка на сайт для аудита). При отправке формы сервер также фиксирует технические данные: IP-адрес и User-Agent браузера — для защиты от спама.'],
        ['Зачем мы их используем', 'Исключительно чтобы обработать вашу заявку, связаться с вами и подготовить предложение по проекту. Мы не используем данные для рассылок без вашего согласия.'],
        ['Где хранятся данные', 'На защищённом сервере агентства (Railway, изолированное хранилище с ограниченным доступом). Уведомление о новой заявке доставляется в внутренний Telegram агентства.'],
        ['Кому мы передаём данные', 'Третьим лицам не передаём и не продаём. Единственный внешний сервис в цепочке — Telegram (доставка уведомления агентству). Аналитических трекеров и рекламных пикселей на сайте нет.'],
        ['Сколько мы храним данные', 'До завершения работы по заявке или до вашего запроса на удаление.'],
        ['Ваши права', 'Вы можете запросить копию или удаление своих данных в любой момент — напишите на hello@artx.one, мы выполним запрос в течение 30 дней.'],
        ['Cookies и localStorage', 'Сайт использует localStorage браузера только для запоминания языка, темы и сессии администратора. Сторонних cookies нет.']
      ]
    },
    en: {
      title: 'Privacy Policy',
      updated: 'Updated: November 20, 2026',
      sections: [
        ['What we collect', 'Only what you submit through the site forms: name or company, contact handle (Telegram, WhatsApp, phone or email), message and request parameters (service, budget, website URL for audit). The server also records technical data (IP address, browser User-Agent) for spam protection.'],
        ['Why we use it', 'Solely to process your request, contact you and prepare a project proposal. We do not send marketing without your consent.'],
        ['Where it is stored', 'On the agency’s protected server (Railway, isolated storage with restricted access). New-lead notifications are delivered to the agency’s internal Telegram.'],
        ['Who we share it with', 'We do not sell or share data with third parties. The only external service in the chain is Telegram (notification delivery). No analytics trackers or ad pixels are used.'],
        ['Retention', 'Until the request is fulfilled or until you ask us to delete it.'],
        ['Your rights', 'Request a copy or deletion of your data anytime at hello@artx.one — we comply within 30 days.'],
        ['Cookies & localStorage', 'Browser localStorage is used only for language, theme and admin session. No third-party cookies.']
      ]
    },
    kz: {
      title: 'Құпиялылық саясаты',
      updated: 'Жаңартылды: 2026 жылғы 20 қараша',
      sections: [
        ['Қандай деректер жинаймыз', 'Тек сайт формалары арқылы өзіңіз жіберген деректер: аты немесе компания атауы, байланыс контактысы (Telegram, WhatsApp, телефон немесе email), хабарлама және өтінім параметрлері (қызмет, бюджет, аудит үшін сайт сілтемесі). Спамнан қорғау үшін сервер IP-адрес пен браузер User-Agent деректерін де тіркейді.'],
        ['Не үшін қолданамыз', 'Тек өтінімді өңдеу, сізбен байланысу және жоба бойынша ұсыныс дайындау үшін. Келісіміңізсіз жарнамалық жіберілім жасамаймыз.'],
        ['Деректер қайда сақталады', 'Агенттіктің қорғалған серверінде (Railway, шектеулі қолжетімділігі бар оқшауланған қойма). Жаңа өтінім туралы хабарлама агенттіктің ішкі Telegram-ына жіберіледі.'],
        ['Кімге береміз', 'Үшінші тұлғаларға бермейміз және сатпаймыз. Жалғыз сыртқы сервис — Telegram (хабарлама жеткізу). Аналитикалық трекерлер мен жарнамалық пиксельдер жоқ.'],
        ['Сақтау мерзімі', 'Өтінім бойынша жұмыс аяқталғанша немесе жою туралы сұрауыңызға дейін.'],
        ['Құқықтарыңыз', 'Деректеріңіздің көшірмесін немесе жоюды кез келген уақытта hello@artx.one арқылы сұрай аласыз — 30 күн ішінде орындаймыз.'],
        ['Cookies және localStorage', 'Браузер localStorage тек тіл, тема және әкімші сессиясы үшін қолданылады. Үшінші тарап cookies жоқ.']
      ]
    }
  },
  terms: {
    ru: {
      title: 'Условия использования',
      updated: 'Обновлено: 20 ноября 2026',
      sections: [
        ['Статус сайта', 'Сайт artx.one носит информационный характер и не является публичной офертой. Состав работ, сроки и стоимость фиксируются в договоре или письменном согласовании с клиентом.'],
        ['Оценки калькулятора', 'Расчёты калькулятора и экспресс-аудита — предварительные ориентиры. Финальная смета формируется после обсуждения задачи и может отличаться от автоматической оценки.'],
        ['Кейсы и конфиденциальность', 'Проекты публикуются с согласия клиента либо в обезличенном виде. По NDA-проектам мы не раскрываем название клиента и детали без разрешения.'],
        ['Интеллектуальная собственность', 'Контент сайта принадлежит ARTX. Исходные коды и макеты, созданные для клиента, передаются клиенту в объёме, определённом договором.'],
        ['Обратная связь', 'Вопросы по условиям и обработке данных: hello@artx.one.']
      ]
    },
    en: {
      title: 'Terms of Use',
      updated: 'Updated: November 20, 2026',
      sections: [
        ['Status of the site', 'artx.one is informational and does not constitute a public offer. Scope, timelines and pricing are fixed in a contract or written agreement with the client.'],
        ['Calculator estimates', 'Calculator and express-audit figures are preliminary estimates. The final quote is prepared after discussing the task and may differ from the automated estimate.'],
        ['Case studies & confidentiality', 'Projects are published with client consent or anonymized. For NDA projects we do not disclose client names or details without permission.'],
        ['Intellectual property', 'Site content belongs to ARTX. Source code and designs created for a client are transferred to the client as defined in the contract.'],
        ['Contact', 'Questions about these terms or data handling: hello@artx.one.']
      ]
    },
    kz: {
      title: 'Пайдалану шарттары',
      updated: 'Жаңартылды: 2026 жылғы 20 қараша',
      sections: [
        ['Сайт мәртебесі', 'artx.one сайты ақпараттық сипатта және жария оферта болып табылмайды. Жұмыс құрамы, мерзімдері мен құны клиентпен шартта немесе жазбаша келісімде бекітіледі.'],
        ['Калькулятор бағалаулары', 'Калькулятор мен экспресс-аудит есептері — алдын ала бағдарлар. Нақты смета тапсырманы талқылағаннан кейін қалыптасады және автоматты бағалаудан өзгеше болуы мүмкін.'],
        ['Кейстер және құпиялылық', 'Жобалар клиент келісімімен немесе иесіздендірілген түрде жарияланады. NDA жобалары бойынша клиент атауы мен детальдарды рұқсатсыз жарияламаймыз.'],
        ['Зияткерлік меншік', 'Сайт контенті ARTX-ке тиесілі. Клиент үшін жасалған бастапқы кодтар мен макеттер шартта анықталған көлемде клиентке беріледі.'],
        ['Кері байланыс', 'Шарттар мен деректерді өңдеу бойынша сұрақтар: hello@artx.one.']
      ]
    }
  }
};

export default function LegalPage({ lang = 'ru', kind = 'privacy' }) {
  const doc = LEGAL[kind]?.[lang] || LEGAL[kind]?.ru || LEGAL.privacy.ru;
  const backLabel = lang === 'en' ? 'Back to home' : (lang === 'kz' ? 'Басты бетке оралу' : 'Вернуться на главную');

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-20">
      <a href="/" className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors mb-8">
        ← {backLabel}
      </a>
      <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-tight mb-3">
        {doc.title}
      </h1>
      <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-10">{doc.updated}</p>
      <div className="space-y-8">
        {doc.sections.map(([heading, body]) => (
          <section key={heading}>
            <h2 className="text-base sm:text-lg font-heading font-bold text-neutral-950 dark:text-white mb-2">{heading}</h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}