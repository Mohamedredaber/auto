import { useState, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   STYLES (injected once)
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

  :root {
    --bg:         #0C0C0E;
    --bg2:        #141418;
    --bg3:        #1A1A20;
    --bg4:        #1E1E26;
    --border:     #2A2A35;
    --border2:    #1F1F28;
    --blue:       #2563EB;
    --blue2:      #3B82F6;
    --blue-glow:  rgba(37,99,235,.35);
    --blue-faint: rgba(37,99,235,.08);
    --red:        #DC2626;
    --red2:       #EF4444;
    --green:      #10B981;
    --text:       #FFFFFF;
    --text2:      #CBD5E1;
    --muted:      #64748B;
    --fd: 'Barlow Condensed', sans-serif;
    --fh: 'Sora', sans-serif;
    --fb: 'DM Sans', sans-serif;
    --fm: 'JetBrains Mono', monospace;
  }

  .rp-root { font-family: var(--fb); color: var(--text); background: var(--bg); min-height: 100vh; display: flex; flex-direction: column; }
  .rp-root *, .rp-root *::before, .rp-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .rp-root button { cursor: pointer; border: none; background: none; font: inherit; color: inherit; }
  .rp-root a { color: inherit; text-decoration: none; }
  .rp-root input, .rp-root select { font: inherit; color: inherit; }
  .rp-root ::-webkit-scrollbar { width: 4px; }
  .rp-root ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  /* NAVBAR */
  .rp-nav { display:flex; align-items:center; justify-content:space-between; padding:0 48px; height:60px; background:rgba(12,12,14,.9); backdrop-filter:blur(12px); border-bottom:1px solid var(--border2); position:sticky; top:0; z-index:100; }
  .rp-nav-logo { font-family:var(--fd); font-size:20px; font-weight:900; text-transform:uppercase; letter-spacing:-.02em; display:flex; align-items:center; gap:8px; }
  .rp-nav-dot { width:7px; height:7px; border-radius:50%; background:var(--blue); animation:rp-pulse 2.4s ease-in-out infinite; }
  .rp-nav-links { display:flex; align-items:center; gap:4px; }
  .rp-nav-link { padding:6px 12px; font-size:13px; font-weight:500; color:var(--muted); border-radius:8px; transition:all .2s; }
  .rp-nav-link:hover { color:var(--text); background:rgba(255,255,255,.05); }
  .rp-nav-btn { padding:7px 18px; font-size:13px; font-weight:600; border-radius:8px; border:1px solid var(--blue); color:var(--blue2); background:var(--blue-faint); transition:all .2s; }
  .rp-nav-btn:hover { background:rgba(37,99,235,.18); }

  /* PAGE LAYOUT */
  .rp-page { display:grid; grid-template-columns:1fr 1fr; flex:1; }

  /* LEFT PANEL */
  .rp-left { position:relative; overflow:hidden; background:#08080A; display:flex; flex-direction:column; justify-content:space-between; padding:52px; }
  .rp-left-bg { position:absolute; inset:0; background: radial-gradient(ellipse 70% 60% at 30% 40%, rgba(37,99,235,.1) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(220,38,38,.07) 0%, transparent 50%); pointer-events:none; }
  .rp-left-grid { position:absolute; inset:0; background-image: linear-gradient(var(--border2) 1px, transparent 1px), linear-gradient(90deg, var(--border2) 1px, transparent 1px); background-size:64px 64px; opacity:.4; pointer-events:none; }
  .rp-left-logo { position:relative; z-index:1; display:flex; align-items:center; gap:10px; font-family:var(--fd); font-size:20px; font-weight:900; text-transform:uppercase; letter-spacing:-.02em; }
  .rp-left-logodot { width:8px; height:8px; border-radius:50%; background:var(--blue); animation:rp-pulse 2.4s ease-in-out infinite; }
  .rp-left-center { position:relative; z-index:1; }
  .rp-left-tag { display:inline-flex; align-items:center; gap:8px; padding:4px 14px; border:1px solid rgba(37,99,235,.3); background:rgba(37,99,235,.08); border-radius:99px; font-size:11px; font-weight:600; color:var(--blue2); letter-spacing:.12em; text-transform:uppercase; margin-bottom:28px; }
  .rp-left-title { font-family:var(--fd); font-size:clamp(48px,5vw,70px); font-weight:900; line-height:.95; letter-spacing:-.03em; text-transform:uppercase; margin-bottom:22px; }
  .rp-left-title-accent { background:linear-gradient(135deg,var(--blue2),#60A5FA); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .rp-left-desc { font-size:15px; color:var(--muted); line-height:1.7; max-width:380px; margin-bottom:40px; }
  .rp-stats { display:flex; gap:36px; }
  .rp-stat-val { font-family:var(--fm); font-size:28px; font-weight:500; line-height:1; }
  .rp-stat-val span { color:var(--blue2); }
  .rp-stat-lbl { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:.1em; margin-top:4px; }
  .rp-left-footer { position:relative; z-index:1; font-size:12px; color:var(--muted); }

  /* RIGHT PANEL */
  .rp-right { background:var(--bg2); display:flex; flex-direction:column; border-left:1px solid var(--border); overflow-y:auto; max-height:calc(100vh - 60px); }
  .rp-form-wrap { flex:1; display:flex; flex-direction:column; justify-content:center; padding:44px 56px; max-width:560px; width:100%; margin:0 auto; }

  /* STEP INDICATOR */
  .rp-steps { display:flex; align-items:center; gap:8px; margin-bottom:28px; opacity:0; pointer-events:none; transition:opacity .3s; }
  .rp-steps.visible { opacity:1; pointer-events:all; }
  .rp-step-dot { width:32px; height:4px; border-radius:99px; background:var(--border); transition:all .3s; }
  .rp-step-dot.active { background:var(--blue); box-shadow:0 0 8px var(--blue-glow); }
  .rp-step-dot.done { background:var(--green); }
  .rp-step-lbl { font-size:12px; color:var(--muted); margin-left:4px; }
  .rp-step-lbl b { color:var(--blue2); }

  /* FORM HEADER */
  .rp-fheader { margin-bottom:32px; }
  .rp-back { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:var(--muted); margin-bottom:18px; padding:6px 12px; border:1px solid var(--border); border-radius:8px; background:var(--bg3); transition:all .2s; }
  .rp-back:hover { color:var(--text); border-color:var(--blue); background:var(--blue-faint); }
  .rp-ftitle { font-family:var(--fh); font-size:28px; font-weight:800; line-height:1.1; margin-bottom:8px; }
  .rp-ftitle-accent { color:var(--blue2); }
  .rp-fsub { font-size:14px; color:var(--muted); line-height:1.6; }

  /* TYPE CARDS */
  .rp-type-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:32px; }
  .rp-type-card { position:relative; padding:24px 20px; background:var(--bg3); border:1px solid var(--border); border-radius:16px; cursor:pointer; transition:all .25s cubic-bezier(.34,1.56,.64,1); text-align:center; overflow:hidden; }
  .rp-type-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(37,99,235,.08),transparent); opacity:0; transition:opacity .25s; }
  .rp-type-card:hover { border-color:var(--blue); transform:translateY(-2px); }
  .rp-type-card:hover::before { opacity:1; }
  .rp-type-card.sel { border-color:var(--blue); background:rgba(37,99,235,.1); box-shadow:0 0 0 3px rgba(37,99,235,.15),0 8px 24px rgba(37,99,235,.2); transform:translateY(-2px); }
  .rp-type-card.sel::before { opacity:1; }
  .rp-type-check { position:absolute; top:12px; right:12px; width:20px; height:20px; border-radius:50%; background:var(--blue); display:flex; align-items:center; justify-content:center; opacity:0; transform:scale(0); transition:all .25s cubic-bezier(.34,1.56,.64,1); }
  .rp-type-card.sel .rp-type-check { opacity:1; transform:scale(1); }
  .rp-type-icon { width:52px; height:52px; border-radius:14px; background:var(--bg4); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; transition:all .25s; color:var(--muted); }
  .rp-type-card.sel .rp-type-icon { background:rgba(37,99,235,.15); border-color:rgba(37,99,235,.4); color:var(--blue2); }
  .rp-type-title { font-family:var(--fh); font-size:15px; font-weight:700; margin-bottom:4px; }
  .rp-type-desc { font-size:12px; color:var(--muted); line-height:1.4; }

  /* FORM FIELDS */
  .rp-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .rp-group { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
  .rp-label { font-size:11px; font-weight:700; color:var(--text2); letter-spacing:.08em; text-transform:uppercase; }
  .rp-input-wrap { position:relative; }
  .rp-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; display:flex; align-items:center; }
  .rp-icon-r { left:auto; right:13px; cursor:pointer; pointer-events:all; transition:color .2s; }
  .rp-icon-r:hover { color:var(--text2); }
  .rp-input { width:100%; padding:12px 13px 12px 40px; background:var(--bg3); border:1px solid var(--border); border-radius:10px; font-size:14px; color:var(--text); outline:none; transition:all .2s; }
  .rp-input.no-icon { padding-left:13px; }
  .rp-input::placeholder { color:var(--muted); }
  .rp-input:hover { border-color:#3A3A48; }
  .rp-input:focus { border-color:var(--blue); background:rgba(37,99,235,.04); box-shadow:0 0 0 3px rgba(37,99,235,.12); }
  .rp-input.err { border-color:var(--red); box-shadow:0 0 0 3px rgba(220,38,38,.12); }
  .rp-errmsg { font-size:11px; color:var(--red2); display:none; align-items:center; gap:4px; }
  .rp-errmsg.show { display:flex; }
  .rp-select { width:100%; padding:12px 36px 12px 40px; background:var(--bg3); border:1px solid var(--border); border-radius:10px; font-size:14px; color:var(--text); outline:none; appearance:none; cursor:pointer; transition:all .2s; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; background-color:var(--bg3); }
  .rp-select:focus { border-color:var(--blue); box-shadow:0 0 0 3px rgba(37,99,235,.12); }
  .rp-select option { background:#1A1A20; }

  /* PASSWORD STRENGTH */
  .rp-strength { display:flex; gap:4px; margin-top:5px; }
  .rp-strength-seg { flex:1; height:3px; border-radius:99px; background:var(--border); transition:background .3s; }
  .rp-strength-lbl { font-size:11px; margin-top:3px; }

  /* UPLOAD */
  .rp-upload { border:2px dashed var(--border); border-radius:14px; padding:24px; text-align:center; cursor:pointer; transition:all .25s; position:relative; overflow:hidden; }
  .rp-upload:hover { border-color:var(--blue); background:rgba(37,99,235,.03); }
  .rp-upload.has-file { border-color:var(--green); background:rgba(16,185,129,.04); }
  .rp-upload input { position:absolute; inset:0; opacity:0; cursor:pointer; }
  .rp-upload-icon { width:44px; height:44px; border-radius:10px; background:var(--bg3); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin:0 auto 10px; color:var(--muted); }
  .rp-upload-title { font-size:13px; font-weight:600; color:var(--text2); margin-bottom:3px; }
  .rp-upload-title span { color:var(--blue2); }
  .rp-upload-sub { font-size:12px; color:var(--muted); }
  .rp-upload-preview { display:flex; align-items:center; justify-content:center; gap:12px; }
  .rp-upload-preview img { width:48px; height:48px; border-radius:8px; object-fit:cover; border:1px solid var(--border); }
  .rp-upload-preview-name { font-size:13px; font-weight:600; color:var(--green); }

  /* SOCIAL */
  .rp-social-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }

  /* BUTTONS */
  .rp-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 22px; border-radius:10px; font-size:14px; font-weight:600; transition:all .2s; width:100%; letter-spacing:.02em; }
  .rp-btn-primary { background:linear-gradient(135deg,var(--blue),var(--blue2)); color:#fff; box-shadow:0 4px 16px var(--blue-glow); }
  .rp-btn-primary:hover { box-shadow:0 6px 24px rgba(37,99,235,.5); transform:translateY(-1px); }
  .rp-btn-primary:active { transform:translateY(0); }
  .rp-btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }
  .rp-btn-google { background:var(--bg3); color:var(--text2); border:1px solid var(--border); }
  .rp-btn-google:hover { background:var(--bg4); border-color:#3A3A48; color:var(--text); }
  .rp-btn-actions { display:flex; flex-direction:column; gap:10px; margin-top:6px; }
  .rp-or { display:flex; align-items:center; gap:12px; }
  .rp-or::before,.rp-or::after { content:''; flex:1; height:1px; background:var(--border); }
  .rp-or span { font-size:12px; color:var(--muted); }
  .rp-login-link { text-align:center; font-size:13px; color:var(--muted); margin-top:18px; }
  .rp-login-link a { color:var(--blue2); font-weight:600; }
  .rp-login-link a:hover { color:var(--blue); }

  /* SUCCESS */
  .rp-success { text-align:center; padding:16px 0; }
  .rp-success-icon { width:68px; height:68px; border-radius:50%; background:rgba(16,185,129,.1); border:2px solid rgba(16,185,129,.3); display:flex; align-items:center; justify-content:center; margin:0 auto 22px; animation:rp-scale .5s cubic-bezier(.34,1.56,.64,1); }
  .rp-success-title { font-family:var(--fh); font-size:24px; font-weight:800; margin-bottom:10px; }
  .rp-success-desc { font-size:14px; color:var(--muted); line-height:1.6; margin-bottom:28px; }

  /* FOOTER BAR */
  .rp-footer { padding:18px 56px; border-top:1px solid var(--border2); display:flex; align-items:center; justify-content:space-between; }
  .rp-footer-logo { font-family:var(--fd); font-size:14px; font-weight:900; text-transform:uppercase; color:var(--muted); }
  .rp-footer-links { display:flex; gap:16px; }
  .rp-footer-links a { font-size:12px; color:var(--muted); transition:color .2s; }
  .rp-footer-links a:hover { color:var(--text); }

  /* VIEW ANIMATION */
  .rp-view { animation:rp-fadeup .35s ease both; }
  @keyframes rp-fadeup { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rp-pulse { 0%,100%{box-shadow:0 0 8px rgba(37,99,235,.4)} 50%{box-shadow:0 0 20px rgba(37,99,235,.7)} }
  @keyframes rp-scale { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }

  /* TIME ROW */
  .rp-time-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

  /* RESPONSIVE */
  @media(max-width:900px){
    .rp-page{grid-template-columns:1fr}
    .rp-left{display:none}
    .rp-form-wrap{padding:28px 22px}
    .rp-footer{padding:14px 22px}
    .rp-nav{padding:0 22px}
  }
  @media(max-width:480px){
    .rp-row{grid-template-columns:1fr}
    .rp-type-grid{grid-template-columns:1fr}
    .rp-social-grid{grid-template-columns:1fr}
    .rp-time-row{grid-template-columns:1fr}
  }

  /* spinner */
  .rp-spin { width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:rp-spinr .6s linear infinite;flex-shrink:0 }
  @keyframes rp-spinr{to{transform:rotate(360deg)}}
`;

/* ─────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────── */
const Icon = {
  User: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Agency: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a4 4 0 0 1 8 0v2" /><path d="M12 12v4m-2-2h4" />
    </svg>
  ),
  Mail: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
    </svg>
  ),
  Phone: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
    </svg>
  ),
  Lock: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Eye: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Check: () => (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Upload: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Building: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a4 4 0 0 1 8 0v2" />
    </svg>
  ),
  MapPin: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  ),
  Home: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Clock: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Link: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Error: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r=".5" fill="currentColor" />
    </svg>
  ),
  Success: () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Login: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
  Google: () => (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function InputField({ label, id, type = "text", placeholder, icon, value, onChange, error, optional }) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  const actualType = isPass ? (show ? "text" : "password") : type;

  return (
    <div className="rp-group">
      <label className="rp-label" htmlFor={id}>
        {label}{optional && <span style={{ color: "var(--muted)", fontWeight: 400, textTransform: "none", marginLeft: 4 }}>(optionnel)</span>}
      </label>
      <div className="rp-input-wrap">
        {icon && <span className="rp-icon">{icon}</span>}
        <input
          id={id}
          type={actualType}
          className={`rp-input${!icon ? " no-icon" : ""}${error ? " err" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete="off"
        />
        {isPass && (
          <span className="rp-icon rp-icon-r" onClick={() => setShow(s => !s)}>
            {show ? <Icon.EyeOff /> : <Icon.Eye />}
          </span>
        )}
      </div>
      {error && (
        <span className="rp-errmsg show">
          <Icon.Error /> {error}
        </span>
      )}
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const colors = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
  const labels = ["Très faible", "Moyen", "Fort", "Très fort"];
  return (
    <div style={{ marginTop: 6 }}>
      <div className="rp-strength">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rp-strength-seg" style={{ background: i <= score ? colors[score - 1] : "var(--border)" }} />
        ))}
      </div>
      <div className="rp-strength-lbl" style={{ color: colors[score - 1] || "var(--muted)" }}>
        {labels[score - 1] || ""}
      </div>
    </div>
  );
}

function SelectField({ label, id, icon, value, onChange, options, error }) {
  return (
    <div className="rp-group">
      <label className="rp-label" htmlFor={id}>{label}</label>
      <div className="rp-input-wrap">
        {icon && <span className="rp-icon">{icon}</span>}
        <select
          id={id}
          className={`rp-select${error ? " err" : ""}`}
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">Sélectionner</option>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      {error && <span className="rp-errmsg show"><Icon.Error /> {error}</span>}
    </div>
  );
}

function UploadLogo({ file, onChange }) {
  const ref = useRef();
  const [preview, setPreview] = useState(null);

  const handleChange = e => {
    const f = e.target.files[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    onChange(f);
  };

  return (
    <div className={`rp-upload${file ? " has-file" : ""}`} onClick={() => ref.current.click()}>
      <input ref={ref} type="file" accept="image/*" onChange={handleChange} onClick={e => e.stopPropagation()} />
      {!preview ? (
        <>
          <div className="rp-upload-icon"><Icon.Upload /></div>
          <div className="rp-upload-title"><span>Cliquez</span> ou glissez votre logo</div>
          <div className="rp-upload-sub">PNG, JPG, SVG · Max 2MB</div>
        </>
      ) : (
        <div className="rp-upload-preview">
          <img src={preview} alt="logo" />
          <div>
            <div className="rp-upload-preview-name">{file?.name}</div>
            <div className="rp-upload-sub" style={{ color: "var(--green)" }}>Logo chargé ✓</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   VIEWS
───────────────────────────────────────────── */
function ViewType({ onSelect }) {
  const [hov, setHov] = useState(null);
  return (
    <div className="rp-view">
      <div className="rp-fheader">
        <h1 className="rp-ftitle">
          Bienvenue sur <span className="rp-ftitle-accent">AutoConnect</span>
        </h1>
        <p className="rp-fsub">Choisissez le type de compte que vous souhaitez créer pour commencer l'aventure.</p>
      </div>

      <div className="rp-type-grid">
        {[
          { key: "client", icon: <Icon.User />, title: "Client", desc: "Réservez facilement votre voiture idéale au Maroc" },
          { key: "agence", icon: <Icon.Agency />, title: "Agence", desc: "Publiez et gérez votre flotte de véhicules" },
        ].map(card => (
          <div
            key={card.key}
            className={`rp-type-card${hov === card.key ? " sel" : ""}`}
            onMouseEnter={() => setHov(card.key)}
            onMouseLeave={() => setHov(null)}
            onClick={() => onSelect(card.key)}
          >
            <div className="rp-type-check"><Icon.Check /></div>
            <div className="rp-type-icon">{card.icon}</div>
            <div className="rp-type-title">{card.title}</div>
            <div className="rp-type-desc">{card.desc}</div>
          </div>
        ))}
      </div>

      <div className="rp-login-link">
        Déjà un compte ? <a href="#">Se connecter</a>
      </div>
    </div>
  );
}

function ViewClient({ onBack, onSuccess }) {
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", tel: "", pass: "", passConfirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = "Champ requis";
    if (!form.nom.trim()) e.nom = "Champ requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (form.pass.length < 8) e.pass = "8 caractères minimum";
    if (form.pass !== form.passConfirm) e.passConfirm = "Les mots de passe ne correspondent pas";
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    onSuccess("client");
  };

  return (
    <div className="rp-view">
      <div className="rp-fheader">
        <button className="rp-back" onClick={onBack}><Icon.ArrowLeft /> Retour</button>
        <h1 className="rp-ftitle">Créer un compte <span className="rp-ftitle-accent">Client</span></h1>
        <p className="rp-fsub">Remplissez vos informations pour commencer à réserver.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="rp-row">
          <InputField label="Prénom" id="cPrenom" placeholder="Mohammed" icon={<Icon.User />} value={form.prenom} onChange={set("prenom")} error={errors.prenom} />
          <InputField label="Nom" id="cNom" placeholder="El Fassi" icon={<Icon.User />} value={form.nom} onChange={set("nom")} error={errors.nom} />
        </div>
        <InputField label="Email" id="cEmail" type="email" placeholder="contact@exemple.ma" icon={<Icon.Mail />} value={form.email} onChange={set("email")} error={errors.email} />
        <InputField label="Téléphone" id="cTel" type="tel" placeholder="+212 06 00 00 00" icon={<Icon.Phone />} value={form.tel} onChange={set("tel")} />

        <div className="rp-group">
          <label className="rp-label" htmlFor="cPass">Mot de passe</label>
          <div className="rp-input-wrap">
            <span className="rp-icon"><Icon.Lock /></span>
            <PasswordInputInternal id="cPass" value={form.pass} onChange={set("pass")} error={errors.pass} />
          </div>
          <PasswordStrength password={form.pass} />
          {errors.pass && <span className="rp-errmsg show"><Icon.Error /> {errors.pass}</span>}
        </div>

        <InputField label="Confirmer le mot de passe" id="cPassC" type="password" placeholder="••••••••" icon={<Icon.Lock />} value={form.passConfirm} onChange={set("passConfirm")} error={errors.passConfirm} />

        <div className="rp-btn-actions">
          <button type="submit" className="rp-btn rp-btn-primary" disabled={loading}>
            {loading ? <><div className="rp-spin" /> Création en cours…</> : <><Icon.Login /> Créer mon compte</>}
          </button>
          <div className="rp-or"><span>ou continuer avec</span></div>
          <button type="button" className="rp-btn rp-btn-google">
            <Icon.Google /> S'inscrire avec Google
          </button>
        </div>
      </form>

      <div className="rp-login-link">
        Déjà un compte ? <a href="#">Se connecter</a>
      </div>
    </div>
  );
}

// Internal password input (without label wrapper) for use with custom strength bar
function PasswordInputInternal({ id, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <input
        id={id}
        type={show ? "text" : "password"}
        className={`rp-input${error ? " err" : ""}`}
        placeholder="••••••••"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <span className="rp-icon rp-icon-r" onClick={() => setShow(s => !s)}>
        {show ? <Icon.EyeOff /> : <Icon.Eye />}
      </span>
    </>
  );
}

const VILLES = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda", "Tétouan", "Essaouira", "El Jadida", "Dakhla", "Laâyoune", "Béni Mellal"];

function ViewAgence1({ onBack, onNext }) {
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", tel: "", pass: "", passConfirm: "" });
  const [errors, setErrors] = useState({});
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = "Champ requis";
    if (!form.nom.trim()) e.nom = "Champ requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (form.pass.length < 8) e.pass = "8 caractères minimum";
    if (form.pass !== form.passConfirm) e.passConfirm = "Les mots de passe ne correspondent pas";
    return e;
  };

  const handleNext = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext(form);
  };

  return (
    <div className="rp-view">
      <div className="rp-fheader">
        <button className="rp-back" onClick={onBack}><Icon.ArrowLeft /> Retour</button>
        <h1 className="rp-ftitle">Informations <span className="rp-ftitle-accent">personnelles</span></h1>
        <p className="rp-fsub">Vos informations de connexion pour le compte agence.</p>
      </div>

      <form onSubmit={handleNext} noValidate>
        <div className="rp-row">
          <InputField label="Prénom" id="aPrenom" placeholder="Mohammed" icon={<Icon.User />} value={form.prenom} onChange={set("prenom")} error={errors.prenom} />
          <InputField label="Nom" id="aNom" placeholder="El Fassi" icon={<Icon.User />} value={form.nom} onChange={set("nom")} error={errors.nom} />
        </div>
        <InputField label="Email" id="aEmail" type="email" placeholder="contact@agence.ma" icon={<Icon.Mail />} value={form.email} onChange={set("email")} error={errors.email} />
        <InputField label="Téléphone" id="aTel" type="tel" placeholder="+212 06 00 00 00" icon={<Icon.Phone />} value={form.tel} onChange={set("tel")} />

        <div className="rp-group">
          <label className="rp-label">Mot de passe</label>
          <div className="rp-input-wrap">
            <span className="rp-icon"><Icon.Lock /></span>
            <PasswordInputInternal id="aPass" value={form.pass} onChange={set("pass")} error={errors.pass} />
          </div>
          <PasswordStrength password={form.pass} />
          {errors.pass && <span className="rp-errmsg show"><Icon.Error /> {errors.pass}</span>}
        </div>

        <InputField label="Confirmer le mot de passe" id="aPassC" type="password" placeholder="••••••••" icon={<Icon.Lock />} value={form.passConfirm} onChange={set("passConfirm")} error={errors.passConfirm} />

        <div className="rp-btn-actions">
          <button type="submit" className="rp-btn rp-btn-primary">
            Suivant <Icon.ArrowRight />
          </button>
        </div>
      </form>

      <div className="rp-login-link">Déjà un compte ? <a href="#">Se connecter</a></div>
    </div>
  );
}

function ViewAgence2({ onBack, onSuccess }) {
  const [form, setForm] = useState({ nom: "", ville: "", adresse: "", open: "08:00", close: "20:00", fb: "", ig: "", wa: "", web: "" });
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = "Champ requis";
    if (!form.ville) e.ville = "Sélectionnez une ville";
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    onSuccess("agence");
  };

  return (
    <div className="rp-view">
      <div className="rp-fheader">
        <button className="rp-back" onClick={onBack}><Icon.ArrowLeft /> Étape précédente</button>
        <h1 className="rp-ftitle">Informations <span className="rp-ftitle-accent">agence</span></h1>
        <p className="rp-fsub">Présentez votre agence aux clients sur la plateforme.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <InputField label="Nom de l'agence" id="agNom" placeholder="Ex: AutoConnect Marrakech" icon={<Icon.Building />} value={form.nom} onChange={set("nom")} error={errors.nom} />

        <div className="rp-row">
          <SelectField label="Ville" id="agVille" icon={<Icon.MapPin />} value={form.ville} onChange={set("ville")} options={VILLES} error={errors.ville} />
          <InputField label="Code postal" id="agCP" placeholder="20000" icon={<Icon.MapPin />} value={form.cp} onChange={set("cp")} />
        </div>

        <InputField label="Adresse complète" id="agAddr" placeholder="12 Rue Mohammed V, Casablanca" icon={<Icon.Home />} value={form.adresse} onChange={set("adresse")} />

        <div className="rp-group">
          <label className="rp-label">Horaires d'ouverture</label>
          <div className="rp-time-row">
            <div className="rp-input-wrap">
              <span className="rp-icon"><Icon.Clock /></span>
              <input type="time" className="rp-input" value={form.open} onChange={e => set("open")(e.target.value)} />
            </div>
            <div className="rp-input-wrap">
              <span className="rp-icon"><Icon.Clock /></span>
              <input type="time" className="rp-input" value={form.close} onChange={e => set("close")(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="rp-group">
          <label className="rp-label">Logo de l'agence</label>
          <UploadLogo file={logo} onChange={setLogo} />
        </div>

        <div className="rp-group">
          <label className="rp-label">
            Réseaux sociaux
            <span style={{ color: "var(--muted)", fontWeight: 400, textTransform: "none", marginLeft: 6 }}>(optionnel)</span>
          </label>
          <div className="rp-social-grid">
            {[
              { k: "fb", ph: "facebook.com/agence", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="#4285F4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> },
              { k: "ig", ph: "instagram.com/agence", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 10.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg> },
              { k: "wa", ph: "wa.me/212600000000", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" /></svg> },
              { k: "web", ph: "www.monagence.ma", icon: <Icon.Link /> },
            ].map(s => (
              <div className="rp-input-wrap" key={s.k}>
                <span className="rp-icon">{s.icon}</span>
                <input type="url" className="rp-input" placeholder={s.ph} value={form[s.k]} onChange={e => set(s.k)(e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div className="rp-btn-actions">
          <button type="submit" className="rp-btn rp-btn-primary" disabled={loading}>
            {loading ? <><div className="rp-spin" /> Création du compte…</> : <><Icon.Building /> Créer le compte agence</>}
          </button>
        </div>
      </form>
    </div>
  );
}

function ViewSuccess({ type }) {
  return (
    <div className="rp-view rp-success">
      <div className="rp-success-icon"><Icon.Success /></div>
      <h2 className="rp-success-title">Compte créé avec succès !</h2>
      <p className="rp-success-desc">
        {type === "client"
          ? "Bienvenue sur AutoConnect ! Votre compte client est prêt. Commencez à explorer les voitures disponibles au Maroc."
          : "Votre compte agence est en cours de vérification. Nous vous contacterons dans les 24h pour finaliser votre inscription."}
      </p>
      <a href="#" className="rp-btn rp-btn-primary" style={{ maxWidth: 260, margin: "0 auto" }}>
        <Icon.Login /> Se connecter
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Register() {
  // views: 'type' | 'client' | 'agence1' | 'agence2' | 'success'
  const [view, setView] = useState("type");
  const [successType, setSuccessType] = useState(null);
  const [agenceStep, setAgenceStep] = useState(1);

  const handleSuccess = type => {
    setSuccessType(type);
    setView("success");
  };

  const stepsVisible = view === "agence1" || view === "agence2";

  return (
    <>
      <style>{CSS}</style>
      <div className="rp-root">
        {/* NAVBAR */}
        <nav className="rp-nav">
          <div className="rp-nav-logo">
            <div className="rp-nav-dot" />
            AutoConnect
          </div>
          <div className="rp-nav-links">
            <a href="#" className="rp-nav-link">Home</a>
            <a href="#" className="rp-nav-link">Cars</a>
            <a href="#" className="rp-nav-link">Contact</a>
            <button className="rp-nav-btn">Login</button>
          </div>
        </nav>

        {/* PAGE */}
        <div className="rp-page">
          {/* LEFT */}
          <div className="rp-left">
            <div className="rp-left-bg" />
            <div className="rp-left-grid" />
            <div className="rp-left-logo">
              <div className="rp-left-logodot" />
              AutoConnect
            </div>
            <div className="rp-left-center">
              <div className="rp-left-tag">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6" /></svg>
                Plateforme #1 au Maroc
              </div>
              <h1 className="rp-left-title">
                Trouvez<br />la voiture<br />
                <span className="rp-left-title-accent">parfaite</span>
              </h1>
              <p className="rp-left-desc">
                Connectez-vous avec les meilleures agences de location à travers tout le Maroc. Simple, rapide et fiable.
              </p>
              <div className="rp-stats">
                {[
                  { val: "200", suf: "+", lbl: "Agences" },
                  { val: "50", suf: "k", lbl: "Clients" },
                  { val: "15", suf: "+", lbl: "Villes" },
                ].map(s => (
                  <div key={s.lbl}>
                    <div className="rp-stat-val">{s.val}<span>{s.suf}</span></div>
                    <div className="rp-stat-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rp-left-footer">© 2025 AutoConnect. Tous droits réservés.</div>
          </div>

          {/* RIGHT */}
          <div className="rp-right">
            <div className="rp-form-wrap">
              {/* STEP INDICATOR */}
              <div className={`rp-steps${stepsVisible ? " visible" : ""}`}>
                <div className={`rp-step-dot${view === "agence1" ? " active" : view === "agence2" ? " done" : ""}`} />
                <div className={`rp-step-dot${view === "agence2" ? " active" : ""}`} />
                <span className="rp-step-lbl">
                  Étape <b>{view === "agence2" ? 2 : 1}</b> sur 2
                </span>
              </div>

              {view === "type" && <ViewType onSelect={t => setView(t === "client" ? "client" : "agence1")} />}
              {view === "client" && <ViewClient onBack={() => setView("type")} onSuccess={handleSuccess} />}
              {view === "agence1" && <ViewAgence1 onBack={() => setView("type")} onNext={() => setView("agence2")} />}
              {view === "agence2" && <ViewAgence2 onBack={() => setView("agence1")} onSuccess={handleSuccess} />}
              {view === "success" && <ViewSuccess type={successType} />}
            </div>

            <div className="rp-footer">
              <div className="rp-footer-logo">AutoConnect</div>
              <div className="rp-footer-links">
                <a href="#">Conditions</a>
                <a href="#">Confidentialité</a>
                <a href="#">Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}