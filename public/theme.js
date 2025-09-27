// Light/Dark theme logic with required console output + callback

const THEME_KEY = 'uvu-theme';
const root = document.documentElement;

function userPref() {
  const v = localStorage.getItem(THEME_KEY);
  return (v === 'light' || v === 'dark') ? v : 'unknown';
}
function mediaPref() {
  if (typeof window.matchMedia !== 'function') {
    return { browser: 'unknown', os: 'unknown', mq: null };
  }
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const browser = mq.media ? (mq.matches ? 'dark' : 'light') : 'unknown';
  return { browser, os: browser, mq };
}
function applyTheme(t) {
  root.setAttribute('data-theme', t);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.setAttribute('aria-pressed', String(t === 'dark'));
}
function initialTheme() {
  // For Cypress: clear localStorage if running in test
  if (window.Cypress) localStorage.removeItem(THEME_KEY);
  const u = userPref();
  const { browser, os } = mediaPref();
  console.log(`User Pref: [${u}]`);
  console.log(`Browser Pref: [${browser}]`);
  console.log(`OS Pref: [${os}]`);
  // Always default to light if no preference
  if (u !== 'unknown') return u;
  if (browser !== 'unknown') return browser;
  if (os !== 'unknown') return os;
  return 'light';
}
function savePref(t) { localStorage.setItem(THEME_KEY, t); }

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(initialTheme());

  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const cur = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      savePref(next);
    });
  }

  // Extra credit: react to OS/browser changes if user has no explicit pref
  const { mq } = mediaPref();
  if (mq && typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', e => {
      if (userPref() === 'unknown') {
        applyTheme(e.matches ? 'dark' : 'light');
        console.log('Browser/OS preference changed; theme updated via callback.');
      }
    });
  }
});