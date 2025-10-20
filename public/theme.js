// Light/Dark theme logic with required console output + callback - jQuery version

const THEME_KEY = 'uvu-theme';
const $root = $(document.documentElement);

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
  // Set the theme attribute on root html element
  $root.attr('data-theme', t);
  $root.attr('data-bs-theme', t); // Set Bootstrap's data-bs-theme
  
  // Update body classes based on theme
  $('body').toggleClass('bg-dark', t === 'dark');
  $('body').toggleClass('bg-light', t === 'light');
  $('body').toggleClass('text-white', t === 'dark');
  
  // Update form background and border if needed
  $('#logForm').toggleClass('bg-dark', t === 'dark');
  $('#logForm').toggleClass('bg-white', t === 'light');
  $('#logForm').toggleClass('border-light', t === 'dark');
  $('#logForm').toggleClass('border-success', t === 'light');
  
  // Update header styling for dark mode
  const $header = $('header');
  if (t === 'dark') {
    $header.addClass('bg-dark border-secondary');
    $header.removeClass('bg-success bg-opacity-10 border-success');
    $header.attr('data-bs-theme', 'dark');
  } else {
    $header.addClass('bg-success bg-opacity-10 border-success');
    $header.removeClass('bg-dark border-secondary');
    $header.attr('data-bs-theme', 'light');
  }
  
  // Update the button text, state, and styling
  const $btn = $('#themeToggle');
  $btn.attr('aria-pressed', String(t === 'dark'));
  
  // UVU brand-consistent button text
  if (t === 'dark') {
    $btn.text('Switch to Light Mode');
    $btn.removeClass('btn-outline-success');
    $btn.addClass('btn-outline-light');
  } else {
    $btn.text('Switch to Dark Mode');
    $btn.removeClass('btn-outline-light');
    $btn.addClass('btn-outline-success');
  }
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

$(document).ready(function() {
  applyTheme(initialTheme());

  $('#themeToggle').on('click', function() {
    const cur = $root.attr('data-theme') === 'dark' ? 'dark' : 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    savePref(next);
  });

  // Extra credit: react to OS/browser changes if user has no explicit pref
  const { mq } = mediaPref();
  if (mq && typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', function(e) {
      if (userPref() === 'unknown') {
        applyTheme(e.matches ? 'dark' : 'light');
        console.log('Browser/OS preference changed; theme updated via callback.');
      }
    });
  }
});