// ═══════════════════════════════════════════════════════════════
//  FOOTYMANAGER — script.js
//  Fixes: correct cup structure, quick-sim events, post-match
//  filtering, proper cup progression, player highlight colour
// ═══════════════════════════════════════════════════════════════

// ── LEAGUE META ──────────────────────────────────────────────
const leaguesMeta = [
    { id:0, name:"Premier League",  size:20 },
    { id:1, name:"Championship",    size:24 },
    { id:2, name:"League One",      size:24 },
    { id:3, name:"League Two",      size:24 },
    { id:4, name:"Non-League",      size:36 }
];

// ── TEAM DATA ────────────────────────────────────────────────
const teamDataRaw = [
    // Premier League
    {name:"Man City",      att:94,mid:92,def:88,c:"#6CABDD",l:0},
    {name:"Arsenal",       att:90,mid:91,def:92,c:"#EF0107",l:0},
    {name:"Liverpool",     att:92,mid:88,def:86,c:"#C8102E",l:0},
    {name:"Aston Villa",   att:84,mid:83,def:81,c:"#95BFE5",l:0},
    {name:"Tottenham",     att:86,mid:84,def:80,c:"#132257",l:0},
    {name:"Chelsea",       att:85,mid:84,def:81,c:"#034694",l:0},
    {name:"Newcastle",     att:83,mid:82,def:80,c:"#241F20",l:0},
    {name:"Man United",    att:81,mid:82,def:80,c:"#DA291C",l:0},
    {name:"West Ham",      att:79,mid:78,def:77,c:"#7A263A",l:0},
    {name:"Brighton",      att:80,mid:81,def:78,c:"#0057B8",l:0},
    {name:"Bournemouth",   att:77,mid:75,def:74,c:"#B50E12",l:0},
    {name:"Crystal Palace",att:78,mid:76,def:77,c:"#1B458F",l:0},
    {name:"Wolves",        att:75,mid:76,def:74,c:"#FDB913",l:0},
    {name:"Fulham",        att:76,mid:77,def:75,c:"#CC0000",l:0},
    {name:"Everton",       att:72,mid:74,def:77,c:"#003399",l:0},
    {name:"Brentford",     att:75,mid:74,def:73,c:"#E30613",l:0},
    {name:"Nott'm Forest", att:74,mid:73,def:74,c:"#DD0000",l:0},
    {name:"Leicester",     att:73,mid:72,def:71,c:"#003090",l:0},
    {name:"Ipswich",       att:71,mid:70,def:69,c:"#3A64A3",l:0},
    {name:"Southampton",   att:70,mid:71,def:70,c:"#D71920",l:0},
    // Championship
    {name:"Leeds",         att:79,mid:78,def:76,c:"#FFCD00",l:1},
    {name:"Burnley",       att:76,mid:74,def:75,c:"#6C1D45",l:1},
    {name:"Luton",         att:72,mid:71,def:70,c:"#F78F1E",l:1},
    {name:"Sheff Utd",     att:73,mid:72,def:71,c:"#EE2737",l:1},
    {name:"West Brom",     att:74,mid:73,def:72,c:"#122F67",l:1},
    {name:"Norwich",       att:73,mid:72,def:70,c:"#00A650",l:1},
    {name:"Hull",          att:71,mid:70,def:69,c:"#F5A12D",l:1},
    {name:"Middlesbrough", att:72,mid:71,def:70,c:"#E21B23",l:1},
    {name:"Coventry",      att:71,mid:70,def:69,c:"#59CEFF",l:1},
    {name:"Preston",       att:70,mid:69,def:68,c:"#003092",l:1},
    {name:"Bristol City",  att:70,mid:69,def:68,c:"#E00016",l:1},
    {name:"Cardiff",       att:69,mid:68,def:67,c:"#0070B5",l:1},
    {name:"Millwall",      att:70,mid:69,def:70,c:"#001D5E",l:1},
    {name:"Swansea",       att:69,mid:68,def:67,c:"#999999",l:1},
    {name:"Watford",       att:71,mid:70,def:68,c:"#FBEE23",l:1},
    {name:"Sunderland",    att:72,mid:70,def:69,c:"#EB172B",l:1},
    {name:"Stoke",         att:68,mid:67,def:68,c:"#E03A3E",l:1},
    {name:"QPR",           att:68,mid:67,def:66,c:"#005CAB",l:1},
    {name:"Blackburn",     att:70,mid:69,def:67,c:"#009EE0",l:1},
    {name:"Sheff Wed",     att:68,mid:68,def:67,c:"#003082",l:1},
    {name:"Plymouth",      att:67,mid:66,def:67,c:"#007A53",l:1},
    {name:"Portsmouth",    att:68,mid:67,def:66,c:"#001489",l:1},
    {name:"Derby",         att:70,mid:69,def:67,c:"#2E3192",l:1},
    {name:"Oxford Utd",    att:67,mid:66,def:65,c:"#FFD700",l:1},
    // League One
    {name:"Bolton",        att:68,mid:67,def:66,c:"#263B7F",l:2},
    {name:"Peterborough",  att:67,mid:66,def:65,c:"#0063B2",l:2},
    {name:"Barnsley",      att:67,mid:66,def:65,c:"#EE2737",l:2},
    {name:"Lincoln",       att:66,mid:65,def:65,c:"#EE2737",l:2},
    {name:"Blackpool",     att:66,mid:65,def:64,c:"#F5A12D",l:2},
    {name:"Stevenage",     att:65,mid:64,def:64,c:"#DE1F27",l:2},
    {name:"Wigan",         att:67,mid:66,def:65,c:"#1C4595",l:2},
    {name:"Charlton",      att:66,mid:65,def:64,c:"#EE2737",l:2},
    {name:"Reading",       att:66,mid:65,def:64,c:"#004494",l:2},
    {name:"Bristol R",     att:65,mid:64,def:63,c:"#0E4FA3",l:2},
    {name:"Leyton O",      att:65,mid:64,def:63,c:"#EE2737",l:2},
    {name:"Wycombe",       att:64,mid:63,def:63,c:"#003B7C",l:2},
    {name:"Exeter",        att:64,mid:63,def:62,c:"#E00016",l:2},
    {name:"Northampton",   att:64,mid:63,def:62,c:"#800000",l:2},
    {name:"Burton",        att:63,mid:62,def:62,c:"#F7B500",l:2},
    {name:"Cambridge",     att:63,mid:62,def:61,c:"#F4A020",l:2},
    {name:"Shrewsbury",    att:62,mid:62,def:61,c:"#005CA9",l:2},
    {name:"Stockport",     att:65,mid:64,def:63,c:"#00396B",l:2},
    {name:"Wrexham",       att:66,mid:65,def:64,c:"#EE2737",l:2},
    {name:"Mansfield",     att:64,mid:63,def:62,c:"#FBEE23",l:2},
    {name:"Crawley",       att:62,mid:61,def:61,c:"#EE2737",l:2},
    {name:"Rotherham",     att:65,mid:64,def:63,c:"#EE2737",l:2},
    {name:"Huddersfield",  att:66,mid:65,def:64,c:"#003399",l:2},
    {name:"Birmingham",    att:67,mid:66,def:65,c:"#0000FF",l:2},
    // League Two
    {name:"MK Dons",       att:60,mid:59,def:59,c:"#EE2737",l:3},
    {name:"Doncaster",     att:60,mid:59,def:58,c:"#EE2737",l:3},
    {name:"Crewe",         att:59,mid:58,def:58,c:"#EE2737",l:3},
    {name:"Barrow",        att:58,mid:58,def:57,c:"#003FA3",l:3},
    {name:"Bradford",      att:59,mid:58,def:57,c:"#B10016",l:3},
    {name:"Wimbledon",     att:59,mid:58,def:57,c:"#0000FF",l:3},
    {name:"Walsall",       att:58,mid:58,def:57,c:"#EE2737",l:3},
    {name:"Gillingham",    att:58,mid:57,def:57,c:"#00408C",l:3},
    {name:"Harrogate",     att:57,mid:57,def:56,c:"#F4A11C",l:3},
    {name:"Notts Co",      att:59,mid:58,def:57,c:"#000000",l:3},
    {name:"Tranmere",      att:57,mid:56,def:56,c:"#3A5BA8",l:3},
    {name:"Accrington",    att:56,mid:56,def:55,c:"#EE2737",l:3},
    {name:"Newport",       att:56,mid:55,def:55,c:"#F4A11C",l:3},
    {name:"Swindon",       att:58,mid:57,def:56,c:"#EE2737",l:3},
    {name:"Salford",       att:59,mid:58,def:57,c:"#EE2737",l:3},
    {name:"Grimsby",       att:57,mid:56,def:56,c:"#000000",l:3},
    {name:"Colchester",    att:56,mid:55,def:55,c:"#0057A8",l:3},
    {name:"Chesterfield",  att:57,mid:56,def:56,c:"#003399",l:3},
    {name:"Bromley",       att:56,mid:55,def:55,c:"#000000",l:3},
    {name:"Port Vale",     att:57,mid:56,def:56,c:"#000000",l:3},
    {name:"Fleetwood",     att:56,mid:55,def:55,c:"#EE2737",l:3},
    {name:"Carlisle",      att:56,mid:55,def:55,c:"#003399",l:3},
    {name:"Cheltenham",    att:56,mid:55,def:55,c:"#EE2737",l:3},
    {name:"Morecambe",     att:55,mid:55,def:54,c:"#EE2737",l:3},
    // Non-League
    ...[
        "Barnet","Altrincham","Solihull","Gateshead","Halifax","Aldershot",
        "Southend","Oldham","Rochdale","York","Hartlepool","Eastleigh",
        "Dagenham","Wealdstone","Woking","Ebbsfleet","Fylde","Kidderminster",
        "Boreham W","Dorking","Yeovil","Scunthorpe","Torquay","Chester",
        "Hereford","Boston","King's Lynn","Blyth","Spennymoor","Chorley",
        "Brackley","Farsley","Curzon","Southport","Gloucester","Darlington"
    ].map(n=>({name:n,l:4,base:50}))
];

const vibrantColors = [
    "#ef4444","#f97316","#f59e0b","#eab308","#84cc16","#22c55e",
    "#10b981","#14b8a6","#06b6d4","#0ea5e9","#3b82f6","#6366f1",
    "#8b5cf6","#a855f7","#d946ef","#ec4899","#f43f5e"
];

// ── GAME STATE ────────────────────────────────────────────────
let teams = [];
let playerTeamId = null;
let currentSeason = 2024;
let timeline = []; // array of { day, events[] }
let curDayGlobal = 0;

// Match engine
let tickerSpeed = 200;
let tickerInterval = null;
let currentMatchObj = null;
let isSecondHalf = false;
let currentMinute = 0;
let mState = {};

// Quick-sim stored events (for display)
let qsEvents = [];
let qsMatchObj = null;

const goalPhrases = [
    "Absolute screamer!","Cool finish.","Brilliant team move!",
    "Tapped in from close range.","What a header!","Powerful drive!",
    "Clinical finish.","Curled into the corner!","Back of the net!"
];

// ── INIT ─────────────────────────────────────────────────────
function init() {
    buildTeams();
    renderLeagueSelect();
    setupSpeedSliders();
}

function buildTeams() {
    let nlIdx = 0;
    teams = teamDataRaw.map((t, i) => {
        const att = t.att || Math.floor((t.base||50) + Math.random()*10);
        const mid = t.mid || Math.floor((t.base||50) + Math.random()*10);
        const def = t.def || Math.floor((t.base||50) + Math.random()*10);
        const c   = t.c   || vibrantColors[(nlIdx++) % vibrantColors.length];
        const lightColors = ["#FFCD00","#FBEE23","#F5A12D","#FDB913","#F4A11C","#F7B500","#FFD700","#FFFFFF","#999999"];
        const bgHex  = c.replace('#','');
        const fgHex  = lightColors.includes(c) ? '000000' : 'ffffff';
        return {
            id:i, name:t.name, color:c, league:t.l, att, mid, def,
            played:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, points:0, susp:0,
            logo:`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name.slice(0,2))}&background=${bgHex}&color=${fgHex}&bold=true&size=80`
        };
    });
}

function setupSpeedSliders() {
    ['speed-slider','speed-slider-match'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.oninput = e => {
            const v = parseInt(e.target.value);
            tickerSpeed = Math.max(20, 1000/(v*5));
            document.getElementById('speed-label').innerText = v+'×';
            document.getElementById('speed-label-match').innerText = v+'×';
            document.getElementById('speed-slider').value = v;
            document.getElementById('speed-slider-match').value = v;
        };
    });
}

// ── NAVIGATION ───────────────────────────────────────────────
function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    const el = document.getElementById(`screen-${id}`);
    el.classList.remove('hidden');
    el.classList.add('active');
    // Update nav active state
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-s') === id);
    });
    if (id === 'standings') renderTable();
}

function showNav() {
    document.getElementById('main-nav').classList.remove('hidden');
    const t = teams.find(x => x.id === playerTeamId);
    document.getElementById('nav-team').innerText = t ? t.name : '';
}

// ── LEAGUE / TEAM SELECTION ───────────────────────────────────
function renderLeagueSelect() {
    const el = document.getElementById('league-list');
    el.innerHTML = '';
    leaguesMeta.slice(0,4).forEach(l => {
        const d = document.createElement('div');
        d.className = 'league-card';
        d.innerHTML = `<h3>${l.name}</h3><span>${l.size} clubs</span>`;
        d.onclick = () => renderTeamSelect(l.id);
        el.appendChild(d);
    });
}

function renderTeamSelect(leagueId) {
    document.getElementById('sel-season-label').innerText = `${currentSeason}/${(currentSeason+1).toString().slice(-2)}`;
    const el = document.getElementById('team-list');
    el.innerHTML = '';
    teams.filter(t => t.league === leagueId).forEach(t => {
        const d = document.createElement('div');
        d.className = 'team-card';
        d.style.borderTopColor = t.color;
        d.innerHTML = `<img src="${t.logo}" alt="${t.name}"><h4>${t.name}</h4><div class="tc-stats">A${t.att} M${t.mid} D${t.def}</div>`;
        d.onclick = () => {
            playerTeamId = t.id;
            generateTimeline();
            showNav();
            updateHub();
            switchScreen('hub');
        };
        el.appendChild(d);
    });
    switchScreen('selection');
}

// ══════════════════════════════════════════════════════════════
//  TIMELINE GENERATOR
//  English football cup structure:
//  Carabao Cup: L1+L2 enter R1 (Aug). Championship + non-Europe
//               Prem enter R2 (Sep). Top 6 "Europe" Prem enter R3 (Oct).
//  FA Cup:      NL+L1+L2 enter R1 (Nov). Championship enters R2 (Dec).
//               Premier League enters R3 (Jan).
// ══════════════════════════════════════════════════════════════
function generateTimeline() {
    timeline = Array.from({length:310}, (_,i) => ({day:i, events:[]}));
    curDayGlobal = 0;

    // ── League Matchdays ──────────────────────────────────────
    const mkDays = (start, total, gapA, gapB) => {
        const days = [];
        let d = start;
        for (let i=0;i<total;i++) { days.push(d); d += (i%2===0)?gapA:gapB; }
        return days;
    };

    const schedLeague = (lid, days) => {
        const rr = buildRR(teams.filter(t=>t.league===lid).map(t=>t.id));
        rr.forEach((round,ri) => {
            const day = Math.min(days[ri]||days[days.length-1], 299);
            round.forEach(m => addEvent(day, {
                type:'Match', comp:'League', leagueId:lid,
                title:`Matchday ${ri+1}`, h:m.h, a:m.a, played:false
            }));
        });
    };

    schedLeague(0, mkDays(10, 38, 7, 4));   // Prem
    schedLeague(1, mkDays(10, 46, 4, 4));   // Championship
    schedLeague(2, mkDays(11, 46, 4, 4));   // League One
    schedLeague(3, mkDays(12, 46, 4, 4));   // League Two

    // ── Carabao Cup ───────────────────────────────────────────
    // R1 (mid Aug, day ~18): League One + League Two
    // R2 (early Sep, day ~48): R1 winners + Championship + non-Europe Prem
    // R3 (early Oct, day ~78): R2 winners + Europe Prem (top 7)
    // R4+ drawn from winners

    const carabaoR1Pool = teams.filter(t=>t.league===2||t.league===3).map(t=>t.id);
    const champIds      = teams.filter(t=>t.league===1).map(t=>t.id);
    const premIds       = teams.filter(t=>t.league===0).map(t=>t.id);
    const premNonEu     = premIds.slice(6);   // 14 non-European clubs
    const premEurope    = premIds.slice(0,6); // 6 European clubs

    // Schedule R1 matches directly
    _scheduleCupMatches(carabaoR1Pool, 18, 'Carabao Cup', 'Round 1');

    // Schedule R2 draw event (resolves after R1, adds Champ+premNonEu)
    addEvent(19, {
        type:'CupDraw', comp:'Carabao Cup', title:'Round 2',
        prevMatchDay:18, extraEntrants:[...champIds,...premNonEu],
        matchDay:48, _resolved:false
    });

    // Schedule R3 draw event (resolves after R2, adds premEurope)
    addEvent(49, {
        type:'CupDraw', comp:'Carabao Cup', title:'Round 3',
        prevMatchDay:48, extraEntrants:premEurope,
        matchDay:78, _resolved:false
    });

    // ── FA Cup ────────────────────────────────────────────────
    // R1 (Nov, day ~92): Non-League + League One + League Two
    // R2 (Dec, day ~122): R1 winners + Championship
    // R3 (Jan, day ~152): R2 winners + Premier League

    const faR1Pool    = teams.filter(t=>t.league>=1&&t.league<=4).map(t=>t.id); // L1+L2+NL (Championship excluded until R2)
    const fachampIds  = teams.filter(t=>t.league===1).map(t=>t.id);
    const faPremIds   = teams.filter(t=>t.league===0).map(t=>t.id);

    _scheduleCupMatches(faR1Pool, 92, 'FA Cup', 'Round 1');

    addEvent(93, {
        type:'CupDraw', comp:'FA Cup', title:'Round 2',
        prevMatchDay:92, extraEntrants:fachampIds,
        matchDay:122, _resolved:false
    });

    addEvent(123, {
        type:'CupDraw', comp:'FA Cup', title:'Round 3',
        prevMatchDay:122, extraEntrants:faPremIds,
        matchDay:152, _resolved:false
    });
}

function addEvent(day, evt) {
    if (day < 0 || day >= timeline.length) return;
    timeline[day].events.push(evt);
}

// Schedule cup matches from a pool on a given day
function _scheduleCupMatches(pool, day, comp, title) {
    const shuffled = [...pool].sort(()=>Math.random()-0.5);
    for (let i=0; i<shuffled.length-1; i+=2) {
        addEvent(day, {
            type:'Match', comp, title,
            h:shuffled[i], a:shuffled[i+1], played:false
        });
    }
}

// Build full double round-robin
function buildRR(arr) {
    const a = [...arr];
    if (a.length%2!==0) a.push(null);
    const n=a.length, rounds=[];
    for (let r=0;r<n-1;r++) {
        const ms=[];
        for (let i=0;i<n/2;i++) if(a[i]!==null&&a[n-1-i]!==null) ms.push({h:a[i],a:a[n-1-i]});
        rounds.push(ms);
        a.splice(1,0,a.pop());
    }
    return rounds.concat(rounds.map(r=>r.map(m=>({h:m.a,a:m.h}))));
}

function getDateStr(dayOff) {
    const dt = new Date(currentSeason,7,1);
    dt.setDate(dt.getDate()+dayOff);
    return dt.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
}

// ── HUB ──────────────────────────────────────────────────────
function updateHub() {
    const t = teams.find(x=>x.id===playerTeamId);
    document.getElementById('hub-name').innerText   = t.name;
    document.getElementById('hub-logo').src          = t.logo;
    document.getElementById('hub-stats').innerText   = `ATT ${t.att} · MID ${t.mid} · DEF ${t.def}`;
    document.getElementById('hub-season').innerText  = `${currentSeason}/${(currentSeason+1).toString().slice(-2)}`;

    // Tint hub with team colour
    const hero = document.getElementById('hub-hero');
    if (hero) hero.style.setProperty('--team-color', t.color);

    const next = findNextPlayerEvent();
    if (next) {
        const {evt, day} = next;
        document.getElementById('hub-next-comp').innerText = `${evt.comp}`;
        document.getElementById('hub-next-date').innerText = getDateStr(day);
        if (evt.type==='CupDraw') {
            document.getElementById('hub-next-opp').innerText = `${evt.title} Draw`;
            document.getElementById('hub-action-btn').querySelector('span').previousSibling.textContent = 'ATTEND DRAW ';
        } else {
            const opp = teams.find(x=>x.id===(evt.h===playerTeamId?evt.a:evt.h));
            const venue = evt.h===playerTeamId?'HOME':'AWAY';
            document.getElementById('hub-next-opp').innerText = `vs ${opp.name} (${venue})`;
            document.getElementById('hub-action-btn').childNodes[0].textContent = 'MATCH PREP ';
        }
    } else {
        document.getElementById('hub-next-comp').innerText = 'SEASON END';
        document.getElementById('hub-next-opp').innerText  = 'Season Complete';
        document.getElementById('hub-next-date').innerText = '';
        document.getElementById('hub-action-btn').childNodes[0].textContent = 'SEASON REVIEW ';
    }

    // Stat strip
    const strip = document.getElementById('hub-stat-strip');
    if (strip) {
        const sorted = teams.filter(x=>x.league===t.league).sort((a,b)=>b.points-a.points||b.gd-a.gd);
        const pos = sorted.findIndex(x=>x.id===t.id)+1;
        strip.innerHTML = `
            <div class="hub-stat-block"><div class="hsb-val">${pos}<sup style="font-size:1rem">${ordSup(pos)}</sup></div><div class="hsb-lbl">Position</div></div>
            <div class="hub-stat-block"><div class="hsb-val">${t.points}</div><div class="hsb-lbl">Points</div></div>
            <div class="hub-stat-block"><div class="hsb-val">${t.played}</div><div class="hsb-lbl">Played</div></div>
            <div class="hub-stat-block"><div class="hsb-val" style="color:${t.gd>=0?'var(--green)':'var(--red)'}">${t.gd>0?'+':''}${t.gd}</div><div class="hsb-lbl">Goal Diff</div></div>
        `;
    }
}

function ordSup(n) { const s=['th','st','nd','rd']; const v=n%100; return s[(v-20)%10]||s[v]||s[0]; }

// ── FIND NEXT PLAYER EVENT ────────────────────────────────────
function findNextPlayerEvent() {
    for (let d=curDayGlobal; d<timeline.length; d++) {
        for (const e of timeline[d].events) {
            if (e.played) continue;
            if (e.type==='Match' && (e.h===playerTeamId||e.a===playerTeamId)) return {evt:e,day:d};
            if (e.type==='CupDraw' && playerInDraw(e)) return {evt:e,day:d};
        }
    }
    return null;
}

function playerInDraw(drawEvt) {
    // Check extra entrants
    if (drawEvt.extraEntrants && drawEvt.extraEntrants.includes(playerTeamId)) return true;
    // Check won previous round
    if (drawEvt.prevMatchDay !== undefined) {
        return (timeline[drawEvt.prevMatchDay]?.events||[])
            .some(e => e.comp===drawEvt.comp && e.type==='Match' && e.winner===playerTeamId);
    }
    return false;
}

// ── HUB ACTION ───────────────────────────────────────────────
function handleHubAction() {
    const next = findNextPlayerEvent();
    if (!next) { endSeasonSequence(); return; }
    const {evt, day} = next;

    // Sim all days up to (not including) event day
    while (curDayGlobal < day) { processDay(curDayGlobal); curDayGlobal++; }

    currentMatchObj = evt;

    if (evt.type==='CupDraw') {
        // Resolve draw first (so matches are scheduled)
        resolveCupDraw(evt);
        setupDrawScreen(evt);
    } else {
        setupPreMatch(evt, day);
    }
}

function processDay(d) {
    timeline[d].events.forEach(e => {
        if (e.played) return;
        if (e.type==='Match')   quickSimMatchSilent(e);
        if (e.type==='CupDraw') resolveCupDraw(e);
    });
}

// ── CUP DRAW RESOLUTION ──────────────────────────────────────
function resolveCupDraw(drawEvt) {
    if (drawEvt._resolved) return;
    drawEvt._resolved = true;

    // Gather winners from previous round
    let winners = [];
    if (drawEvt.prevMatchDay !== undefined) {
        (timeline[drawEvt.prevMatchDay]?.events||[])
            .filter(e=>e.comp===drawEvt.comp&&e.type==='Match'&&e.winner)
            .forEach(e=>winners.push(e.winner));
    }
    // Add new entrants
    if (drawEvt.extraEntrants) winners.push(...drawEvt.extraEntrants);

    // Deduplicate, shuffle
    winners = [...new Set(winners)].sort(()=>Math.random()-0.5);
    drawEvt.drawPool = winners;

    // Create match fixtures
    const mDay = Math.min(drawEvt.matchDay, 299);
    for (let i=0; i<winners.length-1; i+=2) {
        addEvent(mDay, {
            type:'Match', comp:drawEvt.comp, title:drawEvt.title,
            h:winners[i], a:winners[i+1], played:false
        });
    }
    drawEvt.played = true;
}

let drawRollTimer;
function setupDrawScreen(drawEvt) {
    document.getElementById('draw-comp-title').innerText = `${drawEvt.comp} – ${drawEvt.title}`;
    document.getElementById('draw-venue').innerText = '';
    document.getElementById('draw-roller').innerText = '???';
    document.getElementById('draw-roller').style.color = 'var(--txt)';
    document.getElementById('btn-finish-draw').classList.add('hidden');
    switchScreen('draw');

    // Find player's match from the draw
    const mDay = Math.min(drawEvt.matchDay, 299);
    const pMatch = (timeline[mDay]?.events||[]).find(m =>
        m.comp===drawEvt.comp && m.type==='Match' &&
        (m.h===playerTeamId || m.a===playerTeamId)
    );

    if (!pMatch) {
        document.getElementById('draw-roller').innerText = 'ELIMINATED';
        document.getElementById('btn-finish-draw').classList.remove('hidden');
        return;
    }

    const oppId = pMatch.h===playerTeamId ? pMatch.a : pMatch.h;
    const opp   = teams.find(t=>t.id===oppId);
    const venue = pMatch.h===playerTeamId ? 'HOME' : 'AWAY';

    let count=0;
    clearInterval(drawRollTimer);
    drawRollTimer = setInterval(()=>{
        const rand = teams[Math.floor(Math.random()*teams.length)];
        document.getElementById('draw-roller').innerText = rand.name.toUpperCase();
        count++;
        if (count>24) {
            clearInterval(drawRollTimer);
            document.getElementById('draw-roller').innerText = opp.name.toUpperCase();
            document.getElementById('draw-roller').style.color = opp.color;
            document.getElementById('draw-venue').innerText = venue;
            document.getElementById('btn-finish-draw').classList.remove('hidden');
        }
    }, 80);
}

function finishDraw() {
    document.getElementById('draw-roller').style.color = 'var(--txt)';
    curDayGlobal++; // past draw day
    updateHub();
    switchScreen('hub');
}

// ── PRE-MATCH ────────────────────────────────────────────────
function setupPreMatch(m, dayIdx) {
    const h = teams.find(x=>x.id===m.h);
    const a = teams.find(x=>x.id===m.a);
    document.getElementById('pre-comp-title').innerText = `${m.comp} · ${m.title}`;
    document.getElementById('pre-comp-title').className = 'comp-tag '+compCls(m.comp);
    document.getElementById('pre-date-title').innerText = getDateStr(dayIdx);
    document.getElementById('pre-h-logo').src = h.logo;
    document.getElementById('pre-h-name').innerText = h.name;
    document.getElementById('pre-h-att').innerText = `A:${h.att}`;
    document.getElementById('pre-h-mid').innerText = `M:${h.mid}`;
    document.getElementById('pre-h-def').innerText = `D:${h.def}`;
    document.getElementById('pre-a-logo').src = a.logo;
    document.getElementById('pre-a-name').innerText = a.name;
    document.getElementById('pre-a-att').innerText = `A:${a.att}`;
    document.getElementById('pre-a-mid').innerText = `M:${a.mid}`;
    document.getElementById('pre-a-def').innerText = `D:${a.def}`;
    const pT = teams.find(t=>t.id===playerTeamId);
    document.getElementById('pre-susp-warning').innerText = pT.susp>0
        ? `⚠ Suspensions active — squad weakened (−${pT.susp} to all stats)` : '';
    switchScreen('pre-match');
}

function compCls(comp) {
    if (!comp) return 'league';
    if (comp==='Carabao Cup') return 'carabao';
    if (comp==='FA Cup') return 'fa';
    return 'league';
}

document.getElementById('btn-start-match').onclick = () => {
    const h = teams.find(x=>x.id===currentMatchObj.h);
    const a = teams.find(x=>x.id===currentMatchObj.a);
    setupMatchUI(h,a);
    switchScreen('match');
    runTicker();
};

// ── QUICK SIM (shows events) ─────────────────────────────────
function skipMatch() {
    if (tickerInterval) clearInterval(tickerInterval);
    const h = teams.find(x=>x.id===currentMatchObj.h);
    const a = teams.find(x=>x.id===currentMatchObj.a);

    // Run simulation, collecting events
    qsEvents = [];
    const tmpState = {
        hG:0, aG:0, hRed:0, aRed:0,
        hAtt: h.att-h.susp, hDef: h.def-h.susp,
        aAtt: a.att-a.susp, aDef: a.def-a.susp
    };

    for (let min=1; min<=90; min++) {
        const hP = 0.016*(tmpState.hAtt/Math.max(1,tmpState.aDef))*1.05;
        const aP = 0.016*(tmpState.aAtt/Math.max(1,tmpState.hDef));
        const r  = Math.random();
        if (r<hP) {
            tmpState.hG++;
            qsEvents.push({min,type:'GOAL',isH:true,txt:goalPhrases[Math.floor(Math.random()*goalPhrases.length)]});
        } else if (r>1-aP) {
            tmpState.aG++;
            qsEvents.push({min,type:'GOAL',isH:false,txt:goalPhrases[Math.floor(Math.random()*goalPhrases.length)]});
        } else if (Math.random()<0.003) {
            const isH = Math.random()>0.5;
            qsEvents.push({min,type:'RED CARD',isH,txt:'Sent off!'});
            if (isH) { tmpState.hAtt=Math.max(1,tmpState.hAtt-15); tmpState.hDef=Math.max(1,tmpState.hDef-15); tmpState.hRed++; }
            else      { tmpState.aAtt=Math.max(1,tmpState.aAtt-15); tmpState.aDef=Math.max(1,tmpState.aDef-15); tmpState.aRed++; }
        } else if (Math.random()<0.018) {
            qsEvents.push({min,type:'YELLOW CARD',isH:Math.random()>0.5,txt:'Late challenge.'});
        }
        if (min===45) qsEvents.push({min:45,type:'HALF TIME',isH:null,txt:''});
    }
    qsEvents.push({min:90,type:'FULL TIME',isH:null,txt:''});

    currentMatchObj.hG = tmpState.hG;
    currentMatchObj.aG = tmpState.aG;
    if (tmpState.hRed>0) h.susp += tmpState.hRed*3;
    if (tmpState.aRed>0) a.susp += tmpState.aRed*3;

    processMatchResult(currentMatchObj, h, a);

    // Sim others today
    timeline[curDayGlobal].events.forEach(e=>{
        if (!e.played && e.type==='Match' && e!==currentMatchObj) quickSimMatchSilent(e);
    });

    qsMatchObj = currentMatchObj;
    renderQuickSim(h, a);
    switchScreen('quicksim');
}

function renderQuickSim(h, a) {
    const m = qsMatchObj;
    document.getElementById('qs-title').innerText = `${m.comp} · ${m.title}`;
    document.getElementById('qs-date').innerText  = getDateStr(curDayGlobal);

    // Scoreline hero
    const pIsH = m.h===playerTeamId;
    const outcome = m.hG===m.aG ? 'DRAW' : ((pIsH&&m.hG>m.aG)||((!pIsH)&&m.aG>m.hG)) ? 'WIN' : 'LOSS';
    const outColor = outcome==='WIN'?'var(--green)':outcome==='LOSS'?'var(--red)':'var(--txt2)';

    document.getElementById('qs-scoreline').innerHTML = `
        <div class="qs-team">
            <img src="${h.logo}" alt="${h.name}">
            <div class="qs-team-name">${h.name}</div>
        </div>
        <div class="qs-score-center">
            <span>${m.hG} – ${m.aG}</span>
            <span class="qs-outcome" style="color:${outColor}">${outcome}</span>
        </div>
        <div class="qs-team">
            <img src="${a.logo}" alt="${a.name}">
            <div class="qs-team-name">${a.name}</div>
        </div>
    `;

    // Events feed
    const ul = document.getElementById('qs-events');
    ul.innerHTML = '';
    qsEvents.forEach(ev => {
        const li = document.createElement('li');
        const teamName = ev.isH===null ? '' : (ev.isH ? h.name : a.name);
        if (ev.type==='GOAL') {
            li.className = 'ev-goal';
            li.innerHTML = `⚽ <b>${ev.min}'</b> GOAL — ${teamName}. ${ev.txt}`;
        } else if (ev.type==='RED CARD') {
            li.className = 'ev-red';
            li.innerHTML = `🟥 <b>${ev.min}'</b> RED CARD — ${teamName}. ${ev.txt}`;
        } else if (ev.type==='YELLOW CARD') {
            li.className = 'ev-yellow';
            li.innerHTML = `🟨 <b>${ev.min}'</b> YELLOW — ${teamName}.`;
        } else if (ev.type==='HALF TIME') {
            li.className = 'ev-half';
            li.innerHTML = `⏱ HALF TIME`;
        } else if (ev.type==='FULL TIME') {
            li.className = 'ev-full';
            li.innerHTML = `🏁 FULL TIME`;
        }
        ul.appendChild(li);
    });

    // Context pane
    renderPostMatchContext(document.getElementById('qs-context'), m);
}

function finishQuickSim() {
    advanceTimeline();
}

// ── MATCH SETUP ───────────────────────────────────────────────
function setupMatchUI(h, a) {
    document.getElementById('m-h-name').innerText  = h.name;
    document.getElementById('m-a-name').innerText  = a.name;
    document.getElementById('m-h-logo').src = h.logo;
    document.getElementById('m-a-logo').src = a.logo;
    document.getElementById('m-score').innerText   = '0 – 0';
    document.getElementById('m-events').innerHTML  = '';
    document.getElementById('m-live-stats').innerText = '';
    document.getElementById('btn-finish-match').classList.add('hidden');
    document.getElementById('m-alert').classList.add('hidden');
    document.getElementById('m-extra').innerText   = '';
    currentMinute = 0;
    isSecondHalf  = false;
    mState = {
        hG:0, aG:0, hRed:0, aRed:0,
        hAtt:h.att-h.susp, hDef:h.def-h.susp,
        aAtt:a.att-a.susp, aDef:a.def-a.susp
    };
}

// ── MATCH ENGINE ─────────────────────────────────────────────
function simMinute() {
    if (currentMinute>=90) return null;
    currentMinute++;
    document.getElementById('m-clock').innerText = currentMinute;
    const hP = 0.016*(mState.hAtt/Math.max(1,mState.aDef))*1.05;
    const aP = 0.016*(mState.aAtt/Math.max(1,mState.hDef));
    const r  = Math.random();
    let evt  = null;
    if (r<hP)                   evt={type:'GOAL',isH:true};
    else if (r>1-aP)            evt={type:'GOAL',isH:false};
    else if (Math.random()<.003) evt={type:'RED CARD',isH:Math.random()>.5};
    else if (Math.random()<.018) evt={type:'YELLOW CARD',isH:Math.random()>.5};
    if (evt) {
        evt.min  = currentMinute;
        evt.team = evt.isH
            ? document.getElementById('m-h-name').innerText
            : document.getElementById('m-a-name').innerText;
        if (evt.type==='GOAL') {
            if (evt.isH) mState.hG++; else mState.aG++;
            evt.txt = goalPhrases[Math.floor(Math.random()*goalPhrases.length)];
        }
        if (evt.type==='RED CARD') {
            evt.txt='Sent off!';
            if (evt.isH) { mState.hRed++; mState.hAtt=Math.max(1,mState.hAtt-15); mState.hDef=Math.max(1,mState.hDef-15); }
            else          { mState.aRed++; mState.aAtt=Math.max(1,mState.aAtt-15); mState.aDef=Math.max(1,mState.aDef-15); }
            updateLiveStat();
        }
        if (evt.type==='YELLOW CARD') evt.txt='Late challenge.';
    }
    return evt;
}

function updateLiveStat() {
    let t='';
    if (mState.hRed>0) t+=`${document.getElementById('m-h-name').innerText}: ${11-mState.hRed} men.  `;
    if (mState.aRed>0) t+=`${document.getElementById('m-a-name').innerText}: ${11-mState.aRed} men.`;
    document.getElementById('m-live-stats').innerText=t;
}

function runTicker() {
    tickerInterval = setInterval(tick, tickerSpeed);
}

function tick() {
    const evt = simMinute();
    if (evt) {
        clearInterval(tickerInterval);
        if (evt.type==='GOAL') {
            logEvent(`⚽ <b>${evt.min}'</b> GOAL — ${evt.team}. ${evt.txt}`, 'ev-goal');
            document.getElementById('m-score').innerText=`${mState.hG} – ${mState.aG}`;
            flashMatch(`GOAL! ${evt.team}`,'goal-flash');
            setTimeout(runTicker, 1200);
        } else if (evt.type==='RED CARD') {
            logEvent(`🟥 <b>${evt.min}'</b> RED CARD — ${evt.team}.`, 'ev-red');
            flashMatch('RED CARD','red-flash');
            setTimeout(runTicker, 800);
        } else {
            logEvent(`🟨 <b>${evt.min}'</b> YELLOW — ${evt.team}.`,'ev-yellow');
            setTimeout(runTicker, 400);
        }
        return;
    }
    if (currentMinute===45&&!isSecondHalf) {
        clearInterval(tickerInterval);
        logEvent('⏱ HALF TIME','ev-half');
        setTimeout(()=>{ isSecondHalf=true; runTicker(); },1800);
    } else if (currentMinute>=90) {
        clearInterval(tickerInterval);
        logEvent('🏁 FULL TIME','ev-full');
        document.getElementById('btn-finish-match').classList.remove('hidden');
    }
}

function flashMatch(txt, cls) {
    const el = document.getElementById('m-alert');
    el.className = `match-flash ${cls}`;
    el.innerText = txt;
    el.classList.remove('hidden');
    setTimeout(()=>el.classList.add('hidden'),1400);
}

function logEvent(html, cls='') {
    const li = document.createElement('li');
    li.innerHTML = html;
    if (cls) li.className = cls;
    document.getElementById('m-events').prepend(li);
}

// ── QUICK-SIM SILENT (background) ────────────────────────────
function quickSimMatchSilent(m) {
    const h = teams.find(t=>t.id===m.h);
    const a = teams.find(t=>t.id===m.a);
    let hA=h.att-h.susp, hD=h.def-h.susp, aA=a.att-a.susp, aD=a.def-a.susp;
    m.hG=0; m.aG=0;
    for (let i=0;i<90;i++) {
        const hP=0.016*(hA/Math.max(1,aD))*1.05;
        const aP=0.016*(aA/Math.max(1,hD));
        const r=Math.random();
        if (r<hP) m.hG++;
        else if (r>1-aP) m.aG++;
        if (Math.random()<.003) { hA=Math.max(1,hA-15); hD=Math.max(1,hD-15); h.susp+=3; }
        if (Math.random()<.003) { aA=Math.max(1,aA-15); aD=Math.max(1,aD-15); a.susp+=3; }
    }
    processMatchResult(m,h,a);
}

// ── FINISH LIVE MATCH ────────────────────────────────────────
function finishPlayerMatch() {
    clearInterval(tickerInterval);
    const h = teams.find(t=>t.id===currentMatchObj.h);
    const a = teams.find(t=>t.id===currentMatchObj.a);
    currentMatchObj.hG = mState.hG;
    currentMatchObj.aG = mState.aG;
    if (mState.hRed>0) h.susp+=mState.hRed*3;
    if (mState.aRed>0) a.susp+=mState.aRed*3;
    processMatchResult(currentMatchObj,h,a);
    // Sim rest of day
    timeline[curDayGlobal].events.forEach(e=>{
        if (!e.played&&e.type==='Match'&&e!==currentMatchObj) quickSimMatchSilent(e);
    });
    renderPostMatch();
    switchScreen('post-match');
}

// ── PROCESS RESULT ────────────────────────────────────────────
function processMatchResult(m, h, a) {
    if (m.comp!=='League' && m.hG===m.aG) { // Cup: no draws
        Math.random()>.5 ? m.hG++ : m.aG++;
    }
    if (h.susp>0) h.susp--;
    if (a.susp>0) a.susp--;
    m.winner = m.hG>m.aG ? m.h : m.a;
    if (m.comp==='League') {
        h.played++; a.played++;
        h.gf+=m.hG; h.ga+=m.aG; h.gd=h.gf-h.ga;
        a.gf+=m.aG; a.ga+=m.hG; a.gd=a.gf-a.ga;
        if (m.hG>m.aG)      { h.w++; h.points+=3; a.l++; }
        else if (m.hG<m.aG) { a.w++; a.points+=3; h.l++; }
        else                 { h.d++; a.d++; h.points++; a.points++; }
    }
    m.played=true;
}

// ── POST MATCH ────────────────────────────────────────────────
function renderPostMatch() {
    const m = currentMatchObj;
    document.getElementById('post-comp-title').innerText = `${m.comp} · ${m.title}`;
    document.getElementById('post-date-title').innerText = getDateStr(curDayGlobal);

    // Results: ONLY same comp + same day
    const resEl = document.getElementById('post-gw-results');
    resEl.innerHTML='';
    timeline[curDayGlobal].events
        .filter(e=>e.type==='Match' && e.comp===m.comp &&
            (m.comp!=='League' || e.leagueId===m.leagueId))
        .forEach(mx=>{
            const ht=teams.find(x=>x.id===mx.h);
            const at=teams.find(x=>x.id===mx.a);
            const isP=mx.h===playerTeamId||mx.a===playerTeamId;
            const row=document.createElement('div');
            row.className='fx-row'+(isP?' fx-player':'');
            row.innerHTML=`
                <div class="fx-teams">
                    <span class="fx-name" style="color:${ht.color}">${ht.name}</span>
                    <span class="fx-score">${mx.hG} – ${mx.aG}</span>
                    <span class="fx-name right" style="color:${at.color}">${at.name}</span>
                </div>`;
            resEl.appendChild(row);
        });

    renderPostMatchContext(document.getElementById('post-context-pane'), m);
}

function renderPostMatchContext(el, m) {
    el.innerHTML='';
    if (m.comp==='League') {
        const pT   = teams.find(t=>t.id===playerTeamId);
        const sorted = teams.filter(t=>t.league===pT.league)
            .sort((a,b)=>b.points-a.points||b.gd-a.gd||b.gf-a.gf);
        el.innerHTML=`
            <div class="section-label" style="text-align:center">FULL TABLE</div>
            <div style="overflow-y:auto;flex:1;">
                <table class="mini-tbl">
                    <thead><tr><th class="tc">#</th><th class="tl">Club</th><th>GD</th><th>PTS</th></tr></thead>
                    <tbody id="pm-tbody"></tbody>
                </table>
            </div>`;
        const tbody=el.querySelector('#pm-tbody');
        sorted.forEach((t,i)=>{
            const tr=document.createElement('tr');
            if (t.id===playerTeamId) tr.className='player-row';
            tr.innerHTML=`<td class="tc">${i+1}</td><td class="tl">${t.name}</td><td>${t.gd>0?'+':''}${t.gd}</td><td><b>${t.points}</b></td>`;
            tbody.appendChild(tr);
        });
    } else {
        const dayMatches = timeline[curDayGlobal].events
            .filter(e=>e.type==='Match'&&e.comp===m.comp);
        const winners = dayMatches.map(e=>e.winner).filter(Boolean);
        const pWon = winners.includes(playerTeamId);
        const nextR = nextRoundName(m.title);
        el.innerHTML=`
            <div class="section-label" style="text-align:center">CUP RESULT</div>
            <div style="text-align:center;padding:16px 8px;">
                <div style="font-size:2.5rem;margin-bottom:8px">${pWon?'✅':'❌'}</div>
                <div style="font-family:var(--ff-head);font-size:1.3rem;font-weight:800;letter-spacing:.04em">${pWon?'ADVANCED':'ELIMINATED'}</div>
                <div style="font-size:.82rem;color:var(--txt2);margin-top:4px">${pWon&&nextR?`Next: ${nextR}`:''}</div>
            </div>
            <div class="section-label" style="text-align:center;margin-top:8px">WINNERS</div>
            <div style="overflow-y:auto;flex:1;" id="cup-w-list"></div>`;
        const wl=el.querySelector('#cup-w-list');
        dayMatches.forEach(mx=>{
            const wt=teams.find(t=>t.id===mx.winner);
            if (!wt) return;
            const row=document.createElement('div');
            row.className='fx-row'+(mx.winner===playerTeamId?' fx-player':'');
            row.style.marginBottom='3px';
            row.innerHTML=`<span class="fx-name" style="color:${wt.color}">${wt.name}</span><span style="font-size:.75rem;color:var(--txt3);margin-left:8px">advanced</span>`;
            wl.appendChild(row);
        });

        // Schedule next round draw if enough winners and player still in
        if (pWon && nextR && winners.length>1) {
            const dDay = Math.min(curDayGlobal+3, 299);
            const mDay = Math.min(curDayGlobal+21, 299);
            const already = timeline[dDay].events.some(e=>e.comp===m.comp&&e.title===nextR);
            if (!already) {
                addEvent(dDay, {
                    type:'CupDraw', comp:m.comp, title:nextR,
                    prevMatchDay:curDayGlobal,
                    matchDay:mDay,
                    extraEntrants:[], _resolved:false
                });
            }
        }
    }
}

function nextRoundName(t) {
    const r={'Round 1':'Round 2','Round 2':'Round 3','Round 3':'Round 4','Round 4':'Quarter-Final','Quarter-Final':'Semi-Final','Semi-Final':'Final','Final':null};
    return r[t]||null;
}

function advanceTimeline() {
    curDayGlobal++;
    let anyLeft=false;
    for (let d=curDayGlobal;d<timeline.length;d++) {
        if (timeline[d].events.some(e=>!e.played)) { anyLeft=true; break; }
    }
    if (!anyLeft) endSeasonSequence();
    else { updateHub(); switchScreen('hub'); }
}

// ── STANDINGS ─────────────────────────────────────────────────
function renderTable() {
    const pT = teams.find(t=>t.id===playerTeamId);
    document.getElementById('standings-title').innerText = leaguesMeta.find(l=>l.id===pT.league).name;
    const tbody  = document.getElementById('table-body');
    tbody.innerHTML='';
    const sorted = teams.filter(t=>t.league===pT.league)
        .sort((a,b)=>b.points-a.points||b.gd-a.gd||b.gf-a.gf);
    sorted.forEach((t,i)=>{
        const tr=document.createElement('tr');
        if (t.id===playerTeamId) tr.classList.add('player-row');
        const lg=pT.league;
        if (lg===0) {
            if (i<4) tr.classList.add('zone-cl');
            else if (i===4) tr.classList.add('zone-el');
            else if (i>=17) tr.classList.add('zone-rel');
        } else if (lg===1||lg===2) {
            if (i<2) tr.classList.add('zone-prom');
            else if (i<6) tr.classList.add('zone-po');
            else if (i>=21) tr.classList.add('zone-rel');
        } else if (lg===3) {
            if (i<3) tr.classList.add('zone-prom');
            else if (i<7) tr.classList.add('zone-po');
            else if (i>=21) tr.classList.add('zone-rel');
        }
        tr.innerHTML=`<td class="tc">${i+1}</td><td class="tl">${t.name}</td><td>${t.played}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td><td>${t.gd>0?'+':''}${t.gd}</td><td class="bold-col">${t.points}</td>`;
        tbody.appendChild(tr);
    });
}

// ── CALENDAR ─────────────────────────────────────────────────
let calMO=0;
function openCalendar() { calMO=0; renderCalendar(); switchScreen('calendar'); }
function changeCalMonth(d) { calMO=Math.max(0,Math.min(9,calMO+d)); renderCalendar(); }

function renderCalendar() {
    const base     = new Date(currentSeason,7+calMO,1);
    const daysInM  = new Date(currentSeason,8+calMO,0).getDate();
    document.getElementById('cal-month-title').innerText =
        base.toLocaleDateString('en-GB',{month:'long',year:'numeric'}).toUpperCase();

    const grid    = document.getElementById('cal-grid');
    const sidebar = document.getElementById('cal-sidebar');
    grid.innerHTML=''; sidebar.innerHTML='';

    const dow = base.getDay();
    const off = dow===0 ? 6 : dow-1;
    for (let i=0;i<off;i++) {
        const c=document.createElement('div');
        c.className='cal-cell empty'; grid.appendChild(c);
    }

    const allFix=[];
    for (let day=1;day<=daysInM;day++) {
        const dt  = new Date(currentSeason,7+calMO,day);
        const dOff= Math.floor((dt-new Date(currentSeason,7,1))/86400000);
        const cell= document.createElement('div');
        cell.className='cal-cell';
        const nEl = document.createElement('div');
        nEl.className='cal-day-n'; nEl.innerText=day;
        cell.appendChild(nEl);

        if (dOff>=0&&dOff<timeline.length) {
            const pevts=timeline[dOff].events.filter(e=>
                (e.type==='Match'&&(e.h===playerTeamId||e.a===playerTeamId))||
                (e.type==='CupDraw'&&playerInDraw(e))
            );
            if (pevts.length>0) {
                cell.classList.add('has-event');
                const chips=document.createElement('div');
                chips.className='cal-chips';
                pevts.forEach(e=>{
                    const chip=document.createElement('div');
                    const cls=compCls(e.comp);
                    chip.className=`cal-chip ${cls}`+(e.played?' played':'');
                    if (e.type==='CupDraw') {
                        chip.innerText=`${e.comp} Draw`;
                    } else {
                        const opp=teams.find(t=>t.id===(e.h===playerTeamId?e.a:e.h));
                        const v=e.h===playerTeamId?'H':'A';
                        chip.innerText=e.played?`${v} ${opp?.name||'?'} ${e.hG}-${e.aG}`:`${v} ${opp?.name||'?'}`;
                    }
                    chips.appendChild(chip);
                    allFix.push({day,dOff,e});
                });
                cell.appendChild(chips);
            }
        }
        grid.appendChild(cell);
    }

    // Sidebar fixtures
    allFix.sort((a,b)=>a.day-b.day).forEach(({day,dOff,e})=>{
        const dt=new Date(currentSeason,7+calMO,day);
        const ds=dt.toLocaleDateString('en-GB',{day:'numeric',month:'short'});
        const row=document.createElement('div');
        row.className='fx-row fx-player';
        const cls=compCls(e.comp);
        if (e.type==='CupDraw') {
            row.innerHTML=`
                <div class="fx-meta"><span class="comp-tag ${cls}" style="font-size:.65rem;padding:2px 7px">${e.comp}</span><span class="fx-date">${ds}</span></div>
                <div style="font-family:var(--ff-head);font-size:.9rem;font-weight:700;letter-spacing:.03em">${e.title} Draw</div>`;
        } else {
            const ht=teams.find(t=>t.id===e.h);
            const at=teams.find(t=>t.id===e.a);
            const sc=e.played?`${e.hG}–${e.aG}`:'vs';
            row.innerHTML=`
                <div class="fx-meta"><span class="comp-tag ${cls}" style="font-size:.65rem;padding:2px 7px">${e.comp}</span><span class="fx-date">${ds}</span></div>
                <div class="fx-teams">
                    <span class="fx-name" style="color:${ht.color};font-size:.85rem">${ht.name}</span>
                    <span class="fx-score ${e.played?'':'pending'}" style="font-size:.82rem;padding:2px 8px">${sc}</span>
                    <span class="fx-name right" style="color:${at.color};font-size:.85rem">${at.name}</span>
                </div>`;
        }
        sidebar.appendChild(row);
    });
    if (!allFix.length) sidebar.innerHTML=`<p style="color:var(--txt3);font-size:.82rem;padding:20px;text-align:center">No fixtures this month</p>`;
}

// ── RESULTS PAGE ──────────────────────────────────────────────
let resultsComp='League';
function openResults() {
    // Build competition list
    const comps=['League','Carabao Cup','FA Cup'];
    const tabs=document.getElementById('results-tabs');
    tabs.innerHTML='';
    comps.forEach(c=>{
        const btn=document.createElement('button');
        btn.className='comp-tab'+(c===resultsComp?' active':'');
        const pT=teams.find(t=>t.id===playerTeamId);
        btn.innerText = c==='League' ? leaguesMeta.find(l=>l.id===pT.league).name : c;
        btn.onclick=()=>{ resultsComp=c; openResults(); };
        tabs.appendChild(btn);
    });
    renderResultsList();
    switchScreen('results');
}

function renderResultsList() {
    const pT=teams.find(t=>t.id===playerTeamId);
    const list=document.getElementById('results-list');
    list.innerHTML='';
    let all=[];
    for (let d=0;d<timeline.length;d++) {
        timeline[d].events.forEach(e=>{
            if (e.type!=='Match') return;
            if (resultsComp==='League' && e.comp==='League' && e.leagueId===pT.league) all.push({e,day:d});
            else if (resultsComp!=='League' && e.comp===resultsComp) all.push({e,day:d});
        });
    }
    all.sort((a,b)=>a.day-b.day);
    if (!all.length) { list.innerHTML=`<p style="color:var(--txt3);text-align:center;padding:32px;font-size:.85rem">No fixtures found.</p>`; return; }
    let lastTitle='';
    all.forEach(({e,day})=>{
        if (e.title!==lastTitle) {
            lastTitle=e.title;
            const h=document.createElement('div');
            h.className='fx-group-hdr';
            h.innerText=e.title;
            list.appendChild(h);
        }
        const ht=teams.find(t=>t.id===e.h);
        const at=teams.find(t=>t.id===e.a);
        const isP=e.h===playerTeamId||e.a===playerTeamId;
        const row=document.createElement('div');
        row.className='fx-row'+(isP?' fx-player':'');
        const sc=e.played?`${e.hG}–${e.aG}`:getDateStr(day).replace(/\s\d{4}/,'');
        row.innerHTML=`
            <div class="fx-teams">
                <span class="fx-name" style="color:${ht.color}">${ht.name}</span>
                <span class="fx-score ${e.played?'':'pending'}">${sc}</span>
                <span class="fx-name right" style="color:${at.color}">${at.name}</span>
            </div>`;
        list.appendChild(row);
    });
}

// ── SEASON END ────────────────────────────────────────────────
function endSeasonSequence() {
    let html='';
    for (let lg=0;lg<=3;lg++) {
        const sorted=teams.filter(t=>t.league===lg).sort((a,b)=>b.points-a.points||b.gd-a.gd||b.gf-a.gf);
        html+=`<div class="season-card"><h3>${leaguesMeta.find(x=>x.id===lg).name}</h3>`;
        html+=`<p>🏆 Champions: <strong>${sorted[0].name}</strong></p>`;
        if (lg>0&&lg<3) {
            html+=`<p>📈 Promoted: ${sorted[0].name}, ${sorted[1].name}</p>`;
            sorted[0].league--; sorted[1].league--;
        }
        if (lg===3) {
            html+=`<p>📈 Promoted: ${sorted[0].name}, ${sorted[1].name}, ${sorted[2].name}</p>`;
            sorted[0].league--; sorted[1].league--; sorted[2].league--;
        }
        if (lg<3) {
            const rel=sorted.slice(-3);
            html+=`<p>📉 Relegated: ${rel.map(t=>t.name).join(', ')}</p>`;
            rel.forEach(t=>t.league++);
        }
        if (lg===3) {
            const rel=sorted.slice(-2);
            html+=`<p>📉 Relegated: ${rel.map(t=>t.name).join(', ')}</p>`;
            rel.forEach(t=>t.league++);
            const np=teams.filter(t=>t.league===4).sort(()=>Math.random()-.5).slice(0,2);
            html+=`<p>♻️ Promoted to EFL: ${np.map(t=>t.name).join(', ')}</p>`;
            np.forEach(t=>t.league=3);
        }
        html+=`</div>`;
    }
    document.getElementById('season-summary-content').innerHTML=html;
    switchScreen('end-season');
    if (teams.find(t=>t.id===playerTeamId).league===4) setTimeout(()=>switchScreen('game-over'),3000);
}

function startNewSeason() {
    currentSeason++;
    teams.forEach(t=>{ t.played=0;t.w=0;t.d=0;t.l=0;t.gf=0;t.ga=0;t.gd=0;t.points=0;t.susp=0; });
    generateTimeline();
    updateHub();
    switchScreen('hub');
}

// ── THEME ─────────────────────────────────────────────────────
function toggleTheme() {
    const isDark=document.documentElement.getAttribute('data-theme')==='dark';
    document.documentElement.setAttribute('data-theme',isDark?'light':'dark');
    document.getElementById('theme-icon').innerText=isDark?'☀️':'🌙';
    document.getElementById('theme-txt').innerText=isDark?'Light':'Dark';
}

// ── BOOT ──────────────────────────────────────────────────────
init();
