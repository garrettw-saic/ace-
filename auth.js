/* ============================================================
   WildCAD-E Public Website — auth.js
   Simple password gate for preview/staging use.

   To change the password:
     1. Run this in your browser console:
          crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourNewPassword'))
            .then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
     2. Paste the output as PASSWORD_HASH below.

   Current password:  WildCAD2026!
   ============================================================ */

(function () {
  'use strict';

  // SHA-256 of "WildCAD2026!"
  const PASSWORD_HASH = '81c0e1808ccf98b762746beb5439c19ce5b94123dc70d3b9653572bdef73d32f';
  const SESSION_KEY   = 'wce_pub_auth';

  /* ------ helpers ------ */
  async function sha256(str) {
    const buf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(str)
    );
    return [...new Uint8Array(buf)]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function isAuthed() {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  }

  function unlock() {
    sessionStorage.setItem(SESSION_KEY, '1');
    const overlay = document.getElementById('wce-auth-overlay');
    if (overlay) {
      overlay.style.transition = 'opacity 0.4s ease';
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 450);
    }
  }

  /* ------ build overlay ------ */
  function buildOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'wce-auth-overlay';
    overlay.innerHTML = `
      <div class="wce-gate">
        <div class="wce-gate-logo">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C16 2 8 10 8 18a8 8 0 0016 0c0-8-8-16-8-16z" fill="url(#ag1)"/>
            <path d="M16 10c0 0-4 5-4 9a4 4 0 008 0c0-4-4-9-4-9z" fill="url(#ag2)"/>
            <defs>
              <linearGradient id="ag1" x1="16" y1="2" x2="16" y2="26" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FF6B1A"/><stop offset="1" stop-color="#FFB347"/>
              </linearGradient>
              <linearGradient id="ag2" x1="16" y1="10" x2="16" y2="23" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FFF3E0"/><stop offset="1" stop-color="#FF6B1A"/>
              </linearGradient>
            </defs>
          </svg>
          <span>WildCAD<span style="color:#ff6b1a">-E</span></span>
        </div>
        <h2 class="wce-gate-title">Preview Access</h2>
        <p class="wce-gate-sub">This site is password protected. Enter the preview password to continue.</p>
        <form class="wce-gate-form" id="wce-gate-form" autocomplete="off">
          <div class="wce-input-wrap">
            <input
              type="password"
              id="wce-pw-input"
              class="wce-pw-input"
              placeholder="Enter password"
              autocomplete="current-password"
              autofocus
              required
            />
            <button type="submit" class="wce-pw-btn">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <p class="wce-gate-error" id="wce-gate-error" aria-live="polite"></p>
        </form>
        <p class="wce-gate-contact">Need access? <a href="mailto:wildcade@saic.com">Contact the WildCAD-E team</a></p>
      </div>
    `;

    /* inline styles so we don't depend on styles.css loading first */
    const css = `
      #wce-auth-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: #0d1117;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }
      .wce-gate {
        width: 100%; max-width: 400px;
        padding: 48px 40px;
        background: #161b22;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
        box-shadow: 0 32px 80px rgba(0,0,0,0.6);
        text-align: center;
        margin: 0 16px;
      }
      .wce-gate-logo {
        display: flex; align-items: center; justify-content: center; gap: 10px;
        font-size: 1.25rem; font-weight: 800; color: #e6edf3;
        letter-spacing: -0.02em; margin-bottom: 28px;
      }
      .wce-gate-title {
        font-size: 1.375rem; font-weight: 800; color: #e6edf3;
        letter-spacing: -0.02em; margin-bottom: 10px;
      }
      .wce-gate-sub {
        font-size: 0.9rem; color: #8b949e; line-height: 1.6; margin-bottom: 32px;
      }
      .wce-gate-form { display: flex; flex-direction: column; gap: 12px; }
      .wce-input-wrap {
        display: flex; gap: 0; border-radius: 10px; overflow: hidden;
        border: 1px solid rgba(255,255,255,0.1);
        transition: border-color 0.2s;
      }
      .wce-input-wrap:focus-within { border-color: rgba(255,107,26,0.5); }
      .wce-pw-input {
        flex: 1; background: #1e2530; border: none; outline: none;
        padding: 13px 16px; font-size: 0.9375rem; color: #e6edf3;
        font-family: inherit;
      }
      .wce-pw-input::placeholder { color: #4a5568; }
      .wce-pw-btn {
        background: linear-gradient(135deg, #ff6b1a, #ffb347);
        border: none; cursor: pointer; padding: 0 18px;
        color: #0d1117; display: flex; align-items: center;
        transition: opacity 0.2s;
      }
      .wce-pw-btn:hover { opacity: 0.85; }
      .wce-gate-error {
        font-size: 0.8125rem; color: #fc8181; min-height: 20px;
        transition: opacity 0.2s;
      }
      .wce-gate-contact {
        margin-top: 28px; font-size: 0.8125rem; color: #8b949e;
      }
      .wce-gate-contact a { color: #ff6b1a; text-decoration: none; }
      .wce-gate-contact a:hover { text-decoration: underline; }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    document.body.appendChild(overlay);

    /* prevent scrolling the page behind the overlay */
    document.body.style.overflow = 'hidden';

    /* wire up the form */
    document.getElementById('wce-gate-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      const input  = document.getElementById('wce-pw-input');
      const errEl  = document.getElementById('wce-gate-error');
      const btn    = overlay.querySelector('.wce-pw-btn');

      btn.style.opacity = '0.5';
      btn.disabled = true;
      errEl.textContent = '';

      const hash = await sha256(input.value);

      if (hash === PASSWORD_HASH) {
        document.body.style.overflow = '';
        unlock();
      } else {
        errEl.textContent = 'Incorrect password. Please try again.';
        input.value = '';
        input.focus();
        btn.style.opacity = '';
        btn.disabled = false;

        /* shake animation */
        const wrap = overlay.querySelector('.wce-input-wrap');
        wrap.style.animation = 'wce-shake 0.35s ease';
        wrap.addEventListener('animationend', () => { wrap.style.animation = ''; }, { once: true });

        /* inject shake keyframe once */
        if (!document.getElementById('wce-shake-style')) {
          const s = document.createElement('style');
          s.id = 'wce-shake-style';
          s.textContent = '@keyframes wce-shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}';
          document.head.appendChild(s);
        }
      }
    });
  }

  /* ------ init ------ */
  if (isAuthed()) {
    // Already authenticated this session — show page immediately
    return;
  }

  // Hide body content until auth passes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildOverlay);
  } else {
    buildOverlay();
  }

})();
