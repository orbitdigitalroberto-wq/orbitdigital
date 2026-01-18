/* Orbit Digital — script leve para UX (menu, ano, CTA) */

const qs = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];

// Ano no rodapé
const yearEl = qs('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Numero do WhatsApp (troque aqui)
const WHATSAPP_NUMBER = '5521981549928'; // exemplo: 5511999999999

function waLink() {
  const num = WHATSAPP_NUMBER.replace(/\D/g, '');
  return num ? `https://wa.me/${num}` : '#contato';
}

// Atualiza os links de CTA para WhatsApp
qsa('[data-wa]').forEach(a => {
  a.setAttribute('href', waLink());
});

// Menu mobile
const menuBtn = qs('.menu');
const sheet = qs('.sheet');

function setExpanded(on){
  if (!menuBtn || !sheet) return;
  menuBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
  sheet.setAttribute('aria-hidden', on ? 'false' : 'true');
}

if (menuBtn && sheet) {
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    setExpanded(!open);
  });

  sheet.addEventListener('click', (e) => {
    if (e.target === sheet) setExpanded(false);
  });

  qsa('a', sheet).forEach(a => a.addEventListener('click', () => setExpanded(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setExpanded(false);
  });
}

// Copiar texto pronto de abordagem
const copyBtn = qs('[data-copy]');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const text = copyBtn.getAttribute('data-copy') || '';
    try {
      await navigator.clipboard.writeText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = 'Copiado';
      setTimeout(() => (copyBtn.textContent = old), 1200);
    } catch (_) {
      // fallback: nada
    }
  });
}

// Envio do formulario para WhatsApp (mensagem editavel)
const form = qs('#leadForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const nome = (fd.get('nome') || '').toString().trim();
    const cidade = (fd.get('cidade') || '').toString().trim();
    const objetivo = (fd.get('objetivo') || '').toString().trim();

    const linhas = [
      'Ola, Roberto. Quero solicitar uma analise.',
      nome ? `Empresa/Nome: ${nome}` : null,
      cidade ? `Cidade: ${cidade}` : null,
      objetivo ? `Objetivo: ${objetivo}` : null,
      'Pode me orientar com os proximos passos?'
    ].filter(Boolean);

    const text = encodeURIComponent(linhas.join('\n'));
    const base = waLink();
    const url = base.includes('wa.me') ? `${base}?text=${text}` : '#contato';
    window.open(url, '_blank');
  });
}
