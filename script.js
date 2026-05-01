/* ═══════════════════════════════════════════════════════
   FOOTYMANAGER — Sky Sports x FM26 Design Language
   Bold, editorial, broadcast-grade sports UI
   Font: Barlow Condensed (headers) + Barlow (body)
═══════════════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

/* ─── THEME TOKENS ─────────────────────────────────── */
:root {
    --ff-head: 'Barlow Condensed', sans-serif;
    --ff-body: 'Barlow', sans-serif;
    --ff-mono: 'JetBrains Mono', monospace;
    --r-sm: 6px;
    --r-md: 10px;
    --r-lg: 16px;
    --ease: 0.15s ease;
}

[data-theme="dark"] {
    --bg:        #0a0c10;
    --bg2:       #111419;
    --bg3:       #181c23;
    --bg4:       #1e2330;
    --line:      #252b38;
    --line2:     #1a1f2a;
    --txt:       #eef0f4;
    --txt2:      #8892a4;
    --txt3:      #4a5468;
    --accent:    #00d4ff;
    --accent2:   #0099bb;
    --green:     #00e676;
    --red:       #ff4444;
    --yellow:    #ffd600;
    --orange:    #ff6d00;
    --purple:    #aa44ff;
    --pitch-a:   #0d2b1a;
    --pitch-b:   #0f3520;
    --shadow:    0 8px 40px rgba(0,0,0,0.7);
    --shadow-sm: 0 2px 12px rgba(0,0,0,0.5);
    --player-bg: rgba(0,212,255,0.08);
    --player-bd: #00d4ff;
}

[data-theme="light"] {
    --bg:        #f2f4f8;
    --bg2:       #ffffff;
    --bg3:       #eef0f5;
    --bg4:       #e4e8f0;
    --line:      #d0d6e2;
    --line2:     #e8eaf0;
    --txt:       #111827;
    --txt2:      #4b5563;
    --txt3:      #9ca3af;
    --accent:    #0077aa;
    --accent2:   #005580;
    --green:     #00a855;
    --red:       #dc2626;
    --yellow:    #ca8a04;
    --orange:    #d97706;
    --purple:    #7c3aed;
    --pitch-a:   #1a4731;
    --pitch-b:   #1f5c3d;
    --shadow:    0 4px 20px rgba(0,0,0,0.12);
    --shadow-sm: 0 1px 6px rgba(0,0,0,0.08);
    --player-bg: rgba(0,119,170,0.08);
    --player-bd: #0077aa;
}

/* ─── RESET ─────────────────────────────────────────── */
*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

body {
    font-family: var(--ff-body);
    background: var(--bg);
    color: var(--txt);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    transition: background .2s, color .2s;
    -webkit-font-smoothing: antialiased;
}

/* ─── APP SHELL ─────────────────────────────────────── */
#app {
    width: 100%;
    max-width: 1040px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* ─── NAV BAR ───────────────────────────────────────── */
.main-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg2);
    border-bottom: 1px solid var(--line);
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 24px;
    height: 52px;
}

.nav-logo {
    font-family: var(--ff-head);
    font-size: 1.6rem;
    font-weight: 900;
    color: var(--accent);
    letter-spacing: 0.05em;
    margin-right: 28px;
    flex-shrink: 0;
}

.nav-center {
    display: flex;
    gap: 2px;
    flex: 1;
}

.nav-btn {
    font-family: var(--ff-head);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--txt2);
    background: transparent;
    border: none;
    padding: 0 14px;
    height: 52px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all var(--ease);
    white-space: nowrap;
}

.nav-btn:hover { color: var(--txt); }
.nav-btn.active { color: var(--accent); border-bottom-color: var(--accent); }

.nav-team {
    font-family: var(--ff-head);
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--txt2);
    letter-spacing: 0.04em;
    margin-left: auto;
}

/* ─── SCREENS ───────────────────────────────────────── */
#screens { flex: 1; display: flex; flex-direction: column; }

.screen {
    display: none;
    flex-direction: column;
    flex: 1;
    padding: 28px 32px;
    animation: screenIn .2s ease;
}

.screen.active, .screen:not(.hidden) { display: flex; }

@keyframes screenIn {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
}

.scrollable { overflow-y:auto; }
.scrollable::-webkit-scrollbar { width:4px; }
.scrollable::-webkit-scrollbar-track { background:transparent; }
.scrollable::-webkit-scrollbar-thumb { background:var(--line); border-radius:4px; }

.mt16 { margin-top:16px; }

/* ─── PAGE HEADER ───────────────────────────────────── */
.page-head {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    margin-bottom: 22px;
    flex-shrink: 0;
}

.page-head-text h2 {
    font-family: var(--ff-head);
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1;
}

.page-head-text span {
    font-size: 0.85rem;
    color: var(--txt2);
    font-weight: 500;
}

.back-btn {
    font-family: var(--ff-head);
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--txt2);
    background: var(--bg3);
    border: 1px solid var(--line);
    padding: 7px 14px;
    border-radius: var(--r-sm);
    cursor: pointer;
    transition: all var(--ease);
    flex-shrink: 0;
}
.back-btn:hover { color:var(--txt); border-color:var(--txt3); }

.section-label {
    font-family: var(--ff-head);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: var(--txt3);
    text-transform: uppercase;
    margin-bottom: 10px;
    flex-shrink: 0;
}

/* ─── BUTTONS ───────────────────────────────────────── */
.btn-primary {
    background: var(--accent);
    color: #000;
    font-family: var(--ff-head);
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: none;
    padding: 14px 24px;
    border-radius: var(--r-sm);
    cursor: pointer;
    width: 100%;
    transition: all var(--ease);
    flex-shrink: 0;
}
.btn-primary:hover { background: var(--accent2); color:#fff; transform:translateY(-1px); }

.btn-secondary {
    background: transparent;
    color: var(--txt);
    font-family: var(--ff-head);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 2px solid var(--line);
    padding: 12px 24px;
    border-radius: var(--r-sm);
    cursor: pointer;
    width: 100%;
    transition: all var(--ease);
    flex-shrink: 0;
}
.btn-secondary:hover { border-color:var(--txt2); background:var(--bg3); }

.btn-ghost {
    background: transparent;
    color: var(--txt3);
    font-family: var(--ff-body);
    font-size: 0.88rem;
    font-weight: 500;
    border: none;
    padding: 10px;
    cursor: pointer;
    width: 100%;
    transition: color var(--ease);
    flex-shrink: 0;
}
.btn-ghost:hover { color:var(--txt2); }

/* ─── COMPETITION TAG ───────────────────────────────── */
.comp-tag {
    display: inline-block;
    font-family: var(--ff-head);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 3px;
}
.comp-tag.league  { background:rgba(0,212,255,0.15); color:var(--accent); }
.comp-tag.carabao { background:rgba(170,68,255,0.15); color:var(--purple); }
.comp-tag.fa      { background:rgba(255,109,0,0.15);  color:var(--orange); }

/* ─── SPLASH / LEAGUE SELECT ────────────────────────── */
.splash {
    display: flex;
    gap: 0;
    min-height: calc(100vh - 0px);
    margin: -28px -32px;
}

.splash-brand {
    width: 340px;
    flex-shrink: 0;
    background: var(--bg2);
    border-right: 1px solid var(--line);
    padding: 60px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.brand-mark {
    font-family: var(--ff-head);
    font-size: 4rem;
    font-weight: 900;
    color: var(--accent);
    letter-spacing: 0.04em;
    line-height: 1;
    margin-bottom: 12px;
}

.brand-name {
    font-family: var(--ff-head);
    font-size: 3rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1;
    margin-bottom: 16px;
}

.brand-name em { color: var(--accent); font-style: normal; }

.brand-sub {
    color: var(--txt2);
    font-size: 0.95rem;
    font-weight: 400;
    line-height: 1.5;
    max-width: 220px;
}

.splash-panel {
    flex: 1;
    padding: 60px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.panel-prompt {
    font-family: var(--ff-head);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: var(--txt3);
    margin-bottom: 20px;
}

.league-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 480px;
}

.league-card {
    background: var(--bg2);
    border: 1px solid var(--line);
    border-left: 4px solid var(--line);
    border-radius: var(--r-sm);
    padding: 18px 22px;
    cursor: pointer;
    transition: all var(--ease);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.league-card:hover {
    border-left-color: var(--accent);
    background: var(--bg3);
    transform: translateX(4px);
}

.league-card h3 {
    font-family: var(--ff-head);
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.league-card span {
    font-size: 0.8rem;
    color: var(--txt3);
    font-family: var(--ff-mono);
}

/* ─── TEAM SELECT ───────────────────────────────────── */
.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
    align-content: start;
}

.team-card {
    background: var(--bg2);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    padding: 18px 12px;
    text-align: center;
    cursor: pointer;
    transition: all var(--ease);
    border-top: 3px solid transparent;
}

.team-card:hover {
    border-top-color: var(--accent);
    background: var(--bg3);
    transform: translateY(-3px);
    box-shadow: var(--shadow-sm);
}

.team-card img {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    margin-bottom: 10px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.team-card h4 {
    font-family: var(--ff-head);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.team-card .tc-stats {
    font-family: var(--ff-mono);
    font-size: 0.7rem;
    color: var(--txt3);
}

/* ─── HUB ───────────────────────────────────────────── */
.hub { display:flex; flex-direction:column; flex:1; margin:-28px -32px; }

.hub-hero {
    position: relative;
    background: linear-gradient(135deg, var(--pitch-a), var(--pitch-b) 60%, #04150d);
    min-height: 300px;
    overflow: hidden;
    flex-shrink: 0;
}

/* Subtle pitch circle overlay */
.hub-hero::before {
    content:'';
    position:absolute;
    bottom:-60px; right:-60px;
    width:300px; height:300px;
    border:1px solid rgba(255,255,255,0.04);
    border-radius:50%;
}
.hub-hero::after {
    content:'';
    position:absolute;
    bottom:-120px; right:-120px;
    width:420px; height:420px;
    border:1px solid rgba(255,255,255,0.025);
    border-radius:50%;
}

.hub-hero-tint {
    position:absolute;
    inset:0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4));
}

.hub-hero-body {
    position: relative;
    z-index: 2;
    padding: 32px 36px;
}

.hub-identity {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
}

.hub-crest {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
}

.hub-club {
    font-family: var(--ff-head);
    font-size: 2.2rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #fff;
    line-height: 1;
}

.hub-meta {
    font-family: var(--ff-mono);
    font-size: 0.75rem;
    color: rgba(255,255,255,0.5);
    margin-top: 4px;
}

.hub-season-tag {
    margin-left: auto;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.7);
    font-family: var(--ff-head);
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 5px 14px;
    border-radius: 3px;
    white-space: nowrap;
    align-self: flex-start;
}

.hub-next-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
}

.hub-next-label {
    font-family: var(--ff-head);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: rgba(255,255,255,0.4);
}

.hub-next-comp {
    font-family: var(--ff-head);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: var(--accent);
    background: rgba(0,212,255,0.12);
    padding: 2px 8px;
    border-radius: 3px;
}

.hub-fixture {
    font-family: var(--ff-head);
    font-size: 2.6rem;
    font-weight: 900;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #fff;
    line-height: 1;
    margin-bottom: 6px;
}

.hub-date {
    font-size: 0.88rem;
    color: rgba(255,255,255,0.45);
    font-weight: 400;
    margin-bottom: 24px;
}

.hub-cta-bar {
    background: var(--bg2);
    border-bottom: 1px solid var(--line);
    padding: 16px 36px;
    flex-shrink: 0;
}

.hub-cta-btn {
    background: var(--accent);
    color: #000;
    font-family: var(--ff-head);
    font-size: 1.1rem;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: none;
    padding: 16px 32px;
    border-radius: var(--r-sm);
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all var(--ease);
}
.hub-cta-btn:hover { background: var(--accent2); color: #fff; }
.hub-cta-btn span { font-size: 1.4rem; }

.hub-stat-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-bottom: 1px solid var(--line);
    flex-shrink: 0;
}

.hub-stat-block {
    padding: 16px 20px;
    border-right: 1px solid var(--line);
    text-align: center;
}
.hub-stat-block:last-child { border-right: none; }

.hsb-val {
    font-family: var(--ff-head);
    font-size: 1.8rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    line-height: 1;
    margin-bottom: 3px;
}

.hsb-lbl {
    font-family: var(--ff-head);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--txt3);
    text-transform: uppercase;
}

/* ─── DRAW SCREEN ───────────────────────────────────── */
.draw-stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 16px;
}

.draw-versus-label {
    font-family: var(--ff-head);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: var(--txt3);
    text-transform: uppercase;
}

.draw-roller {
    font-family: var(--ff-head);
    font-size: 3.5rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--txt);
    background: var(--bg2);
    border: 2px solid var(--line);
    border-radius: var(--r-md);
    padding: 28px 48px;
    min-width: 340px;
    text-align: center;
    transition: color .15s;
}

.draw-venue-tag {
    font-family: var(--ff-head);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--txt2);
}

/* ─── PRE-MATCH ─────────────────────────────────────── */
.prematch {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.prematch-context {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    flex-shrink: 0;
}

.prematch-date-txt {
    font-family: var(--ff-head);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--txt2);
}

.susp-warning {
    color: var(--red);
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 8px;
    min-height: 18px;
    flex-shrink: 0;
}

.prematch-matchup {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    flex: 1;
    background: var(--bg2);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: 40px 24px;
    margin-bottom: 20px;
}

.pm-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    flex: 1;
    text-align: center;
}
.pm-side.right { align-items: center; }

.pm-crest {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    filter: drop-shadow(0 6px 20px rgba(0,0,0,0.5));
}

.pm-name {
    font-family: var(--ff-head);
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1;
}

.pm-stats {
    display: flex;
    gap: 6px;
}

.pm-stats span {
    font-family: var(--ff-mono);
    font-size: 0.72rem;
    color: var(--txt2);
    background: var(--bg3);
    border: 1px solid var(--line);
    padding: 3px 8px;
    border-radius: 4px;
}

.pm-vs {
    font-family: var(--ff-head);
    font-size: 1.4rem;
    font-weight: 900;
    color: var(--txt3);
    background: var(--bg3);
    border: 1px solid var(--line);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    letter-spacing: 0.04em;
}

.prematch-btns {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
}

/* ─── MATCH LIVE ────────────────────────────────────── */
.match-wrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.match-pitch {
    background: linear-gradient(160deg, var(--pitch-a) 0%, var(--pitch-b) 60%, #040e08 100%);
    border-radius: var(--r-lg);
    padding: 20px 24px 16px;
    margin-bottom: 12px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
}

/* Pitch centre circle */
.match-pitch::before {
    content:'';
    position:absolute;
    top:50%; left:50%;
    transform:translate(-50%,-50%);
    width:90px; height:90px;
    border:1px solid rgba(255,255,255,0.06);
    border-radius:50%;
}

.match-hud {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    position: relative;
}

.hud-team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    width: 120px;
    text-align: center;
}
.hud-team.right { align-items: center; }

.hud-crest {
    width: 48px;
    height: 48px;
    border-radius: 50%;
}

.hud-name {
    font-family: var(--ff-head);
    font-size: 0.85rem;
    font-weight: 700;
    color: rgba(255,255,255,0.85);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 110px;
}

.hud-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.hud-score {
    font-family: var(--ff-head);
    font-size: 3.5rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    color: #fff;
    line-height: 1;
    text-shadow: 0 2px 12px rgba(0,0,0,0.5);
}

.hud-clock-row {
    font-family: var(--ff-mono);
    font-size: 0.95rem;
    font-weight: 600;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.04em;
}

.hud-bar {
    text-align: center;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.4);
    margin-top: 10px;
    min-height: 14px;
    font-family: var(--ff-mono);
}

/* Match event flash */
.match-flash {
    text-align: center;
    font-family: var(--ff-head);
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    padding: 12px 24px;
    margin-bottom: 8px;
    border-radius: var(--r-sm);
    animation: flashIn .3s cubic-bezier(0.175,0.885,0.32,1.275);
    flex-shrink: 0;
}
@keyframes flashIn {
    from { opacity:0; transform:scale(0.6); }
    to   { opacity:1; transform:scale(1); }
}
.match-flash.goal-flash { background:var(--yellow); color:#000; }
.match-flash.red-flash  { background:var(--red);    color:#fff; }

.match-feed-area {
    flex: 1;
    background: var(--bg2);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    padding: 10px 14px;
    margin-bottom: 12px;
    min-height: 0;
}

.match-feed {
    display: flex;
    flex-direction: column;
    gap: 0;
    list-style: none;
}

.match-feed li {
    padding: 8px 10px;
    font-size: 0.9rem;
    color: var(--txt2);
    border-bottom: 1px solid var(--line2);
    animation: eventIn .2s ease;
    line-height: 1.4;
}

.match-feed li:last-child { border-bottom: none; }

.match-feed li.ev-goal {
    background: rgba(255,214,0,0.08);
    color: var(--yellow);
    font-weight: 600;
    border-left: 3px solid var(--yellow);
    padding-left: 10px;
    border-bottom-color: rgba(255,214,0,0.1);
}

.match-feed li.ev-red {
    background: rgba(255,68,68,0.08);
    color: var(--red);
    font-weight: 600;
    border-left: 3px solid var(--red);
    padding-left: 10px;
}

.match-feed li.ev-yellow {
    border-left: 3px solid var(--yellow);
    padding-left: 10px;
    color: rgba(255,214,0,0.7);
}

.match-feed li.ev-half, .match-feed li.ev-full {
    color: var(--accent);
    font-weight: 600;
    font-family: var(--ff-head);
    font-size: 0.85rem;
    letter-spacing: 0.06em;
}

.match-feed.qs-mode li { font-size: 0.85rem; }

@keyframes eventIn {
    from { opacity:0; transform:translateX(-6px); }
    to   { opacity:1; transform:translateX(0); }
}

.match-footer {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-shrink: 0;
}

.speed-ctrl {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--bg2);
    border: 1px solid var(--line);
    border-radius: var(--r-sm);
    padding: 10px 16px;
}

.speed-tag {
    font-family: var(--ff-head);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--txt3);
}

.speed-range {
    flex: 1;
    accent-color: var(--accent);
    cursor: pointer;
}

.speed-num {
    font-family: var(--ff-mono);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--accent);
    width: 28px;
    text-align: right;
}

/* ─── QUICK SIM SCREEN ──────────────────────────────── */
.qs-scoreline {
    background: var(--bg2);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: 28px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-bottom: 4px;
    flex-shrink: 0;
}

.qs-team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    flex: 1;
}

.qs-team img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
}

.qs-team-name {
    font-family: var(--ff-head);
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.qs-score-center {
    font-family: var(--ff-head);
    font-size: 3.5rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    color: var(--txt);
    text-align: center;
    flex-shrink: 0;
}

.qs-score-center .qs-outcome {
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: var(--txt3);
    text-align: center;
    margin-top: 2px;
}

.qs-feed-wrap {
    flex: 1;
    min-height: 0;
    background: var(--bg2);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    padding: 10px 14px;
    max-height: 200px;
}

/* ─── POST MATCH ────────────────────────────────────── */
.split-layout {
    display: flex;
    gap: 14px;
    flex: 1;
    min-height: 0;
}

.split-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--bg2);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    padding: 14px;
    min-height: 0;
    overflow: hidden;
}

/* ─── FIXTURES ──────────────────────────────────────── */
.fixture-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.fx-row {
    background: var(--bg3);
    border: 1px solid var(--line2);
    border-radius: var(--r-sm);
    padding: 9px 12px;
    transition: background var(--ease);
}

.fx-row:hover { background: var(--bg4); }

.fx-row.fx-player {
    border-left: 3px solid var(--player-bd);
    background: var(--player-bg);
}

.fx-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.fx-date {
    font-size: 0.7rem;
    color: var(--txt3);
    font-family: var(--ff-mono);
}

.fx-teams {
    display: flex;
    align-items: center;
    gap: 8px;
}

.fx-name {
    font-family: var(--ff-head);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.fx-name.right { text-align: right; }

.fx-score {
    font-family: var(--ff-mono);
    font-size: 0.88rem;
    font-weight: 600;
    background: var(--bg);
    border: 1px solid var(--line);
    padding: 3px 10px;
    border-radius: 4px;
    text-align: center;
    min-width: 52px;
    flex-shrink: 0;
}

.fx-score.pending { color: var(--txt3); }

.fx-group-hdr {
    font-family: var(--ff-head);
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    color: var(--txt3);
    text-transform: uppercase;
    padding: 12px 4px 4px;
    border-bottom: 1px solid var(--line2);
    margin-bottom: 2px;
    margin-top: 8px;
}

/* ─── STANDINGS ─────────────────────────────────────── */
.table-wrap { flex:1; }

.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
}

.data-table thead tr {
    border-bottom: 2px solid var(--line);
}

.data-table th {
    font-family: var(--ff-head);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--txt3);
    text-transform: uppercase;
    padding: 10px 8px;
    text-align: center;
}

.data-table th.tl { text-align: left; }
.data-table th.tc { text-align: center; }

.data-table td {
    padding: 9px 8px;
    text-align: center;
    border-bottom: 1px solid var(--line2);
    font-variant-numeric: tabular-nums;
}

.data-table td.tl { text-align: left; font-weight: 700; font-family: var(--ff-head); font-size: 0.95rem; letter-spacing: 0.02em; }
.bold-col { font-weight: 800 !important; }

.data-table tbody tr:hover { background: var(--bg3); }

/* Player row — distinct cyan highlight, NOT green (avoids promotion confusion) */
.data-table tbody tr.player-row td {
    background: var(--player-bg);
    border-top: 1px solid var(--player-bd);
    border-bottom: 1px solid var(--player-bd);
}
.data-table tbody tr.player-row td:first-child { border-left: 3px solid var(--player-bd); }

/* Zones — left bar only */
.data-table tbody tr.zone-cl td:first-child  { border-left: 3px solid #0ea5e9; }
.data-table tbody tr.zone-el td:first-child  { border-left: 3px solid var(--yellow); }
.data-table tbody tr.zone-prom td:first-child { border-left: 3px solid var(--green); }
.data-table tbody tr.zone-po td:first-child  { border-left: 3px solid var(--purple); }
.data-table tbody tr.zone-rel td:first-child { border-left: 3px solid var(--red); }

.data-table tbody tr.zone-cl  { background: rgba(14,165,233,0.04); }
.data-table tbody tr.zone-el  { background: rgba(255,214,0,0.04); }
.data-table tbody tr.zone-prom { background: rgba(0,230,118,0.04); }
.data-table tbody tr.zone-po  { background: rgba(170,68,255,0.04); }
.data-table tbody tr.zone-rel { background: rgba(255,68,68,0.04); }

.table-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 14px 8px 8px;
    font-size: 0.75rem;
    color: var(--txt2);
    font-weight: 500;
    border-top: 1px solid var(--line);
    margin-top: 6px;
    flex-shrink: 0;
}
.zd { display:inline-block; width:10px; height:10px; border-radius:2px; margin-right:5px; vertical-align:middle; }
.zd.cl  { background:#0ea5e9; }
.zd.el  { background:var(--yellow); }
.zd.prom { background:var(--green); }
.zd.po  { background:var(--purple); }
.zd.rel { background:var(--red); }

/* Mini table inside post-match */
.mini-tbl { width:100%; border-collapse:collapse; font-size:0.8rem; }
.mini-tbl th { font-family:var(--ff-head); font-size:0.66rem; font-weight:700; letter-spacing:0.1em; color:var(--txt3); padding:6px; border-bottom:1px solid var(--line); text-align:center; }
.mini-tbl th.tl { text-align:left; }
.mini-tbl td { padding:7px 6px; text-align:center; border-bottom:1px solid var(--line2); color:var(--txt2); font-variant-numeric:tabular-nums; }
.mini-tbl td.tl { text-align:left; font-weight:700; color:var(--txt); }
.mini-tbl tr.player-row td { background:var(--player-bg); border-top:1px solid var(--player-bd); border-bottom:1px solid var(--player-bd); color:var(--txt); }

/* ─── CALENDAR ──────────────────────────────────────── */
.cal-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 18px;
    flex-shrink: 0;
}

.page-title-cal {
    font-family: var(--ff-head);
    font-size: 1.8rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    flex: 1;
    text-align: center;
}

.cal-arrow {
    font-size: 1.6rem;
    font-weight: 300;
    color: var(--txt2);
    background: var(--bg2);
    border: 1px solid var(--line);
    border-radius: var(--r-sm);
    width: 40px; height: 40px;
    cursor: pointer;
    transition: all var(--ease);
    display: flex; align-items: center; justify-content: center;
}
.cal-arrow:hover { border-color:var(--accent); color:var(--accent); }

.cal-main {
    display: flex;
    gap: 14px;
    flex: 1;
    min-height: 0;
}

.cal-grid-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--bg2);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    padding: 14px;
    overflow: hidden;
}

.dow-row {
    display: grid;
    grid-template-columns: repeat(7,1fr);
    text-align: center;
    font-family: var(--ff-head);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--txt3);
    margin-bottom: 8px;
    flex-shrink: 0;
}

.cal-grid {
    display: grid;
    grid-template-columns: repeat(7,1fr);
    gap: 3px;
    flex: 1;
    align-content: start;
}

.cal-cell {
    min-height: 60px;
    background: var(--bg3);
    border: 1px solid transparent;
    border-radius: 5px;
    padding: 4px 5px;
    display: flex;
    flex-direction: column;
    transition: all var(--ease);
    position: relative;
}

.cal-cell.empty { background:transparent; border-color:transparent; }

.cal-cell.has-event {
    border-color: var(--line);
    cursor: default;
}

.cal-day-n {
    font-family: var(--ff-mono);
    font-size: 0.68rem;
    color: var(--txt3);
    margin-bottom: 3px;
    line-height: 1;
}

.cal-chips { display:flex; flex-direction:column; gap:2px; }

.cal-chip {
    font-family: var(--ff-head);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    padding: 2px 5px;
    border-radius: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
}

.cal-chip.league  { background:rgba(0,212,255,0.18); color:var(--accent); }
.cal-chip.carabao { background:rgba(170,68,255,0.18); color:var(--purple); }
.cal-chip.fa      { background:rgba(255,109,0,0.18);  color:var(--orange); }
.cal-chip.played  { opacity:0.5; }

.cal-panel {
    width: 260px;
    flex-shrink: 0;
    background: var(--bg2);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    padding: 14px;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

/* ─── RESULTS PAGE ──────────────────────────────────── */
.comp-tabs {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
    flex-wrap: wrap;
}

.comp-tab {
    font-family: var(--ff-head);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 7px 18px;
    border-radius: 3px;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--txt2);
    cursor: pointer;
    transition: all var(--ease);
}

.comp-tab:hover { border-color:var(--txt2); color:var(--txt); }

.comp-tab.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #000;
}

/* ─── SETTINGS ──────────────────────────────────────── */
.settings-list {
    background: var(--bg2);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    overflow: hidden;
    flex-shrink: 0;
}

.settings-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--line2);
    gap: 24px;
}

.settings-item:last-child { border-bottom: none; }

.si-title {
    font-family: var(--ff-head);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 3px;
}

.si-sub {
    font-size: 0.82rem;
    color: var(--txt2);
}

.si-ctrl {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.theme-pill {
    background: var(--bg3);
    border: 1px solid var(--line);
    color: var(--txt);
    font-family: var(--ff-head);
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 9px 20px;
    border-radius: var(--r-sm);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all var(--ease);
    white-space: nowrap;
}
.theme-pill:hover { border-color:var(--accent); color:var(--accent); }

/* ─── SEASON CARDS ──────────────────────────────────── */
.season-cards { flex:1; }

.season-card {
    background: var(--bg2);
    border: 1px solid var(--line);
    border-left: 4px solid var(--accent);
    border-radius: var(--r-md);
    padding: 16px 20px;
    margin-bottom: 12px;
}

.season-card h3 {
    font-family: var(--ff-head);
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
}

.season-card p {
    font-size: 0.88rem;
    color: var(--txt2);
    padding: 5px 0;
    border-bottom: 1px solid var(--line2);
    line-height: 1.4;
}
.season-card p:last-child { border-bottom: none; }

/* ─── GAME OVER ─────────────────────────────────────── */
.gameover {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    text-align: center;
    padding: 60px 40px;
}

.go-word {
    font-family: var(--ff-head);
    font-size: 7rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    color: var(--red);
    line-height: 1;
    margin-bottom: 20px;
    animation: goIn .5s cubic-bezier(0.175,0.885,0.32,1.275);
}

@keyframes goIn {
    from { transform:scale(0.4) rotate(-8deg); opacity:0; }
    to   { transform:scale(1) rotate(0deg); opacity:1; }
}

.go-msg {
    font-size: 1rem;
    color: var(--txt2);
    margin-bottom: 8px;
    max-width: 360px;
}

/* ─── RESPONSIVE ────────────────────────────────────── */
@media (max-width: 700px) {
    .screen { padding: 16px 18px; }
    .splash { flex-direction: column; }
    .splash-brand { width:100%; padding:32px 24px; }
    .splash-panel { padding:24px; }
    .hub-hero-body { padding:24px 20px; }
    .hub-cta-bar { padding:12px 20px; }
    .hub-stat-strip { grid-template-columns: repeat(2,1fr); }
    .cal-main { flex-direction:column; }
    .cal-panel { width:100%; }
    .split-layout { flex-direction:column; }
    .nav-center { gap:0; }
    .nav-btn { padding:0 8px; font-size:0.75rem; }
}
