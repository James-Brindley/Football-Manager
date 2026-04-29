// ══════════════════════════════════════════════════════════════
//  FOOTYMANAGER — Full Game Script
//  Fixes: team colours, cup rounds, cup playability, calendar,
//         results page, post-match summary, player highlight colour
// ══════════════════════════════════════════════════════════════

// ── LEAGUE META ──────────────────────────────────────────────
const leaguesMeta = [
    { id: 0, name: "Premier League",  size: 20 },
    { id: 1, name: "Championship",    size: 24 },
    { id: 2, name: "League One",      size: 24 },
    { id: 3, name: "League Two",      size: 24 },
    { id: 4, name: "Non-League",      size: 36 }
];

// ── TEAM DATA (with proper colours for EFL too) ───────────────
const teamDataRaw = [
    // Premier League
    { name:"Man City",      att:94, mid:92, def:88, c:"#6CABDD", l:0 },
    { name:"Arsenal",       att:90, mid:91, def:92, c:"#EF0107", l:0 },
    { name:"Liverpool",     att:92, mid:88, def:86, c:"#C8102E", l:0 },
    { name:"Aston Villa",   att:84, mid:83, def:81, c:"#95BFE5", l:0 },
    { name:"Tottenham",     att:86, mid:84, def:80, c:"#132257", l:0 },
    { name:"Chelsea",       att:85, mid:84, def:81, c:"#034694", l:0 },
    { name:"Newcastle",     att:83, mid:82, def:80, c:"#241F20", l:0 },
    { name:"Man United",    att:81, mid:82, def:80, c:"#DA291C", l:0 },
    { name:"West Ham",      att:79, mid:78, def:77, c:"#7A263A", l:0 },
    { name:"Brighton",      att:80, mid:81, def:78, c:"#0057B8", l:0 },
    { name:"Bournemouth",   att:77, mid:75, def:74, c:"#B50E12", l:0 },
    { name:"Crystal Palace",att:78, mid:76, def:77, c:"#1B458F", l:0 },
    { name:"Wolves",        att:75, mid:76, def:74, c:"#FDB913", l:0 },
    { name:"Fulham",        att:76, mid:77, def:75, c:"#CC0000", l:0 },
    { name:"Everton",       att:72, mid:74, def:77, c:"#003399", l:0 },
    { name:"Brentford",     att:75, mid:74, def:73, c:"#E30613", l:0 },
    { name:"Nott'm Forest", att:74, mid:73, def:74, c:"#DD0000", l:0 },
    { name:"Leicester",     att:73, mid:72, def:71, c:"#003090", l:0 },
    { name:"Ipswich",       att:71, mid:70, def:69, c:"#3A64A3", l:0 },
    { name:"Southampton",   att:70, mid:71, def:70, c:"#D71920", l:0 },
    // Championship (proper club colours)
    { name:"Leeds",         att:79, mid:78, def:76, c:"#FFCD00", l:1 },
    { name:"Burnley",       att:76, mid:74, def:75, c:"#6C1D45", l:1 },
    { name:"Luton",         att:72, mid:71, def:70, c:"#F78F1E", l:1 },
    { name:"Sheff Utd",     att:73, mid:72, def:71, c:"#EE2737", l:1 },
    { name:"West Brom",     att:74, mid:73, def:72, c:"#122F67", l:1 },
    { name:"Norwich",       att:73, mid:72, def:70, c:"#00A650", l:1 },
    { name:"Hull",          att:71, mid:70, def:69, c:"#F5A12D", l:1 },
    { name:"Middlesbrough", att:72, mid:71, def:70, c:"#E21B23", l:1 },
    { name:"Coventry",      att:71, mid:70, def:69, c:"#59CEFF", l:1 },
    { name:"Preston",       att:70, mid:69, def:68, c:"#003092", l:1 },
    { name:"Bristol City",  att:70, mid:69, def:68, c:"#E00016", l:1 },
    { name:"Cardiff",       att:69, mid:68, def:67, c:"#0070B5", l:1 },
    { name:"Millwall",      att:70, mid:69, def:70, c:"#001D5E", l:1 },
    { name:"Swansea",       att:69, mid:68, def:67, c:"#FFFFFF", l:1 },
    { name:"Watford",       att:71, mid:70, def:68, c:"#FBEE23", l:1 },
    { name:"Sunderland",    att:72, mid:70, def:69, c:"#EB172B", l:1 },
    { name:"Stoke",         att:68, mid:67, def:68, c:"#E03A3E", l:1 },
    { name:"QPR",           att:68, mid:67, def:66, c:"#005CAB", l:1 },
    { name:"Blackburn",     att:70, mid:69, def:67, c:"#009EE0", l:1 },
    { name:"Sheff Wed",     att:68, mid:68, def:67, c:"#003082", l:1 },
    { name:"Plymouth",      att:67, mid:66, def:67, c:"#007A53", l:1 },
    { name:"Portsmouth",    att:68, mid:67, def:66, c:"#001489", l:1 },
    { name:"Derby",         att:70, mid:69, def:67, c:"#2E3192", l:1 },
    { name:"Oxford Utd",    att:67, mid:66, def:65, c:"#FFD700", l:1 },
    // League One
    { name:"Bolton",        att:68, mid:67, def:66, c:"#263B7F", l:2 },
    { name:"Peterborough",  att:67, mid:66, def:65, c:"#0063B2", l:2 },
    { name:"Barnsley",      att:67, mid:66, def:65, c:"#EE2737", l:2 },
    { name:"Lincoln",       att:66, mid:65, def:65, c:"#EE2737", l:2 },
    { name:"Blackpool",     att:66, mid:65, def:64, c:"#F5A12D", l:2 },
    { name:"Stevenage",     att:65, mid:64, def:64, c:"#DE1F27", l:2 },
    { name:"Wigan",         att:67, mid:66, def:65, c:"#1C4595", l:2 },
    { name:"Charlton",      att:66, mid:65, def:64, c:"#EE2737", l:2 },
    { name:"Reading",       att:66, mid:65, def:64, c:"#004494", l:2 },
    { name:"Bristol R",     att:65, mid:64, def:63, c:"#0E4FA3", l:2 },
    { name:"Leyton O",      att:65, mid:64, def:63, c:"#EE2737", l:2 },
    { name:"Wycombe",       att:64, mid:63, def:63, c:"#003B7C", l:2 },
    { name:"Exeter",        att:64, mid:63, def:62, c:"#E00016", l:2 },
    { name:"Northampton",   att:64, mid:63, def:62, c:"#800000", l:2 },
    { name:"Burton",        att:63, mid:62, def:62, c:"#F7B500", l:2 },
    { name:"Cambridge",     att:63, mid:62, def:61, c:"#F4A020", l:2 },
    { name:"Shrewsbury",    att:62, mid:62, def:61, c:"#005CA9", l:2 },
    { name:"Stockport",     att:65, mid:64, def:63, c:"#00396B", l:2 },
    { name:"Wrexham",       att:66, mid:65, def:64, c:"#EE2737", l:2 },
    { name:"Mansfield",     att:64, mid:63, def:62, c:"#FBEE23", l:2 },
    { name:"Crawley",       att:62, mid:61, def:61, c:"#EE2737", l:2 },
    { name:"Rotherham",     att:65, mid:64, def:63, c:"#EE2737", l:2 },
    { name:"Huddersfield",  att:66, mid:65, def:64, c:"#003399", l:2 },
    { name:"Birmingham",    att:67, mid:66, def:65, c:"#0000FF", l:2 },
    // League Two
    { name:"MK Dons",       att:60, mid:59, def:59, c:"#EE2737", l:3 },
    { name:"Doncaster",     att:60, mid:59, def:58, c:"#EE2737", l:3 },
    { name:"Crewe",         att:59, mid:58, def:58, c:"#EE2737", l:3 },
    { name:"Barrow",        att:58, mid:58, def:57, c:"#003FA3", l:3 },
    { name:"Bradford",      att:59, mid:58, def:57, c:"#B10016", l:3 },
    { name:"Wimbledon",     att:59, mid:58, def:57, c:"#0000FF", l:3 },
    { name:"Walsall",       att:58, mid:58, def:57, c:"#EE2737", l:3 },
    { name:"Gillingham",    att:58, mid:57, def:57, c:"#00408C", l:3 },
    { name:"Harrogate",     att:57, mid:57, def:56, c:"#F4A11C", l:3 },
    { name:"Notts Co",      att:59, mid:58, def:57, c:"#000000", l:3 },
    { name:"Tranmere",      att:57, mid:56, def:56, c:"#3A5BA8", l:3 },
    { name:"Accrington",    att:56, mid:56, def:55, c:"#EE2737", l:3 },
    { name:"Newport",       att:56, mid:55, def:55, c:"#F4A11C", l:3 },
    { name:"Swindon",       att:58, mid:57, def:56, c:"#EE2737", l:3 },
    { name:"Salford",       att:59, mid:58, def:57, c:"#EE2737", l:3 },
    { name:"Grimsby",       att:57, mid:56, def:56, c:"#000000", l:3 },
    { name:"Colchester",    att:56, mid:55, def:55, c:"#0057A8", l:3 },
    { name:"Chesterfield",  att:57, mid:56, def:56, c:"#003399", l:3 },
    { name:"Bromley",       att:56, mid:55, def:55, c:"#000000", l:3 },
    { name:"Port Vale",     att:57, mid:56, def:56, c:"#000000", l:3 },
    { name:"Fleetwood",     att:56, mid:55, def:55, c:"#EE2737", l:3 },
    { name:"Carlisle",      att:56, mid:55, def:55, c:"#003399", l:3 },
    { name:"Cheltenham",    att:56, mid:55, def:55, c:"#EE2737", l:3 },
    { name:"Morecambe",     att:55, mid:55, def:54, c:"#EE2737", l:3 },
    // Non-League (vibrant auto)
    ...["Barnet","Altrincham","Solihull","Gateshead","Halifax","Aldershot","Southend","Oldham","Rochdale","York","Hartlepool","Eastleigh","Dagenham","Wealdstone","Woking","Ebbsfleet","Fylde","Kidderminster","Boreham W","Dorking","Yeovil","Scunthorpe","Torquay","Chester","Hereford","Boston","King's Lynn","Blyth","Spennymoor","Chorley","Brackley","Farsley","Curzon","Southport","Gloucester","Darlington"].map(n => ({ name:n, l:4, base:50 }))
];

// Non-league colours generated procedurally
const vibrantColors = ["#ef4444","#f97316","#f59e0b","#eab308","#84cc16","#22c55e","#10b981","#14b8a6","#06b6d4","#0ea5e9","#3b82f6","#6366f1","#8b5cf6","#a855f7","#d946ef","#ec4899","#f43f5e"];

// ── GAME STATE ────────────────────────────────────────────────
let teams = [];
let playerTeamId = null;
let currentSeason = 2024;
let timeline = [];
let curDayGlobal = 0;

// Match engine state
let tickerSpeed = 200;
let tickerInterval = null;
let currentMatchObj = null;
let isSecondHalf = false;
let currentMinute = 0;
let mState = { hG:0, aG:0, hRed:0, aRed:0, hYel:0, aYel:0, hAtt:0, hDef:0, aAtt:0, aDef:0 };

const goalPhrases = ["Absolute screamer!","Cool finish.","Brilliant team move!","Tapped in from close range.","What a header!","Powerful strike!","Clinical finish.","Curled into the corner!"];

// ── INIT ─────────────────────────────────────────────────────
function init() {
    buildTeams();
    renderLeagueSelection();
    setupSpeedSliders();
}

function buildTeams() {
    teams = teamDataRaw.map((t, i) => {
        let att = t.att || Math.floor((t.base||55) + Math.random()*8);
        let mid = t.mid || Math.floor((t.base||55) + Math.random()*8);
        let def = t.def || Math.floor((t.base||55) + Math.random()*8);
        let c   = t.c   || vibrantColors[i % vibrantColors.length];
        // Ensure colour is not too light for logo generation
        let safeC = (c === "#FFFFFF" || c === "#FFCD00" || c === "#FBEE23" || c === "#F5A12D" || c === "#FDB913" || c === "#F4A11C" || c === "#F7B500" || c === "#FFD700") ? null : c;
        let logoBg = safeC ? c.replace('#','') : '555555';
        let logoFg = (c === "#FFFFFF" || c === "#FFCD00" || c === "#FBEE23") ? '000000' : 'ffffff';
        return {
            id: i, name: t.name, color: c, league: t.l, att, mid, def,
            played:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, points:0, susp:0,
            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=${logoBg}&color=${logoFg}&bold=true&length=2`
        };
    });
}

function setupSpeedSliders() {
    const s = document.getElementById('speed-slider');
    const sm = document.getElementById('speed-slider-match');
    const updateSpeed = (v) => {
        tickerSpeed = Math.max(30, 1000 / (v * 5));
        document.getElementById('speed-label').innerText = v + 'x';
        document.getElementById('speed-label-match').innerText = v + 'x';
        s.value = v;
        sm.value = v;
    };
    s.oninput = (e) => updateSpeed(e.target.value);
    sm.oninput = (e) => updateSpeed(e.target.value);
}

// ── SCREEN NAVIGATION ─────────────────────────────────────────
function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(`screen-${id}`).classList.remove('hidden');
    if (id === 'standings') renderTable();
}

// ── LEAGUE / TEAM SELECTION ───────────────────────────────────
function renderLeagueSelection() {
    const el = document.getElementById('league-list');
    el.innerHTML = '';
    leaguesMeta.slice(0, 4).forEach(l => {
        const div = document.createElement('div');
        div.className = 'league-card';
        div.innerHTML = `<h3>${l.name}</h3><p>${l.size} Teams</p>`;
        div.onclick = () => renderTeamSelection(l.id);
        el.appendChild(div);
    });
    switchScreen('league-select');
}

function renderTeamSelection(leagueId) {
    document.getElementById('sel-season-label').innerText = `${currentSeason}/${(currentSeason+1).toString().slice(-2)}`;
    const el = document.getElementById('team-list');
    el.innerHTML = '';
    teams.filter(t => t.league === leagueId).forEach(t => {
        const div = document.createElement('div');
        div.className = 'team-card';
        div.innerHTML = `<img src="${t.logo}" alt="${t.name}"><h4>${t.name}</h4><div class="team-stats">A:${t.att} M:${t.mid} D:${t.def}</div>`;
        div.onclick = () => { playerTeamId = t.id; generateTimeline(); updateHub(); switchScreen('hub'); };
        el.appendChild(div);
    });
    switchScreen('selection');
}

// ── TIMELINE GENERATOR ───────────────────────────────────────
// Cup rules (English football structure):
//   Carabao Cup: All 92 EFL clubs in R1 (Aug). Prem clubs with no Europe R2, Prem Europe clubs in R3.
//   FA Cup: Non-League R1 (Nov), League 1/2 R1, Championship R2 (Dec), Prem R3 (Jan)

function generateTimeline() {
    timeline = [];
    for (let i = 0; i < 310; i++) timeline.push({ day: i, events: [] });
    curDayGlobal = 0;

    // ── League Schedules ──
    // Prem: ~38 matchdays, spaced across Aug–May
    let premDays = [];
    let d = 10;
    for (let r = 0; r < 38; r++) { premDays.push(d); d += (r % 3 === 0) ? 7 : 5; }

    // Championship: 46 matchdays
    let champDays = [];
    d = 10;
    for (let r = 0; r < 46; r++) { champDays.push(d); d += 4; }

    // L1 + L2: 46 matchdays
    let l1Days = [], l2Days = [];
    d = 11;
    for (let r = 0; r < 46; r++) { l1Days.push(d); d += 4; }
    d = 12;
    for (let r = 0; r < 46; r++) { l2Days.push(d); d += 4; }

    const scheduleLeague = (leagueId, dayArr) => {
        let rr = buildRoundRobin(teams.filter(t => t.league === leagueId).map(t => t.id));
        rr.forEach((round, rIdx) => {
            let day = dayArr[rIdx] || dayArr[dayArr.length - 1];
            if (day >= timeline.length) day = timeline.length - 1;
            round.forEach(m => timeline[day].events.push({
                type: 'Match', comp: 'League', leagueId,
                title: `Matchday ${rIdx + 1}`, h: m.h, a: m.a, played: false
            }));
        });
    };

    scheduleLeague(0, premDays);
    scheduleLeague(1, champDays);
    scheduleLeague(2, l1Days);
    scheduleLeague(3, l2Days);

    // ── Carabao Cup ──
    // R1 (Aug ~day 14): League 1 & 2 clubs (48 teams)
    // R2 (Sep ~day 45): + Championship + Prem (no Europe) — winners of R1 + new entrants
    // R3 (Oct ~day 75): + Prem Europa clubs — winners of R2 + new entrants
    // R4 onwards from winners

    const carabaoR1Pool = teams.filter(t => t.league === 2 || t.league === 3).map(t => t.id);
    const carabaoR2Extra = teams.filter(t => t.league === 1).map(t => t.id); // Championship enters R2
    // Top 6 Prem enter R3 (simulating Europe), rest enter R2
    const premIds = teams.filter(t => t.league === 0).map(t => t.id);
    const carabaoR2PremEntrants = premIds.slice(6); // non-europe Prem
    const carabaoR3PremEntrants = premIds.slice(0, 6); // "europe" Prem

    scheduleCupRound(14, 28, 'Carabao Cup', 'Round 1', carabaoR1Pool);
    // R2: winners of R1 + Champ + some Prem (scheduled after R1 via draw)
    timeline[25].events.push({
        type: 'CupDraw',
        comp: 'Carabao Cup', title: 'Round 2',
        r1Day: 28, matchDay: 46,
        extraEntrants: [...carabaoR2Extra, ...carabaoR2PremEntrants]
    });
    timeline[56].events.push({
        type: 'CupDraw',
        comp: 'Carabao Cup', title: 'Round 3',
        prevRoundMatchDay: 46, matchDay: 76,
        extraEntrants: carabaoR3PremEntrants
    });
    // R4+ handled via post-match draw scheduling

    // ── FA Cup ──
    // R1 (Nov ~day 92): Non-League + League 1 + League 2
    // R2 (Dec ~day 122): winners of R1 + Championship
    // R3 (Jan ~day 152): winners of R2 + Premier League
    const faR1Pool = teams.filter(t => t.league === 2 || t.league === 3 || t.league === 4).map(t => t.id);
    const champFaEntrants = teams.filter(t => t.league === 1).map(t => t.id);
    const premFaEntrants  = teams.filter(t => t.league === 0).map(t => t.id);

    scheduleCupRound(92, 107, 'FA Cup', 'Round 1', faR1Pool);
    timeline[108].events.push({
        type: 'CupDraw',
        comp: 'FA Cup', title: 'Round 2',
        r1Day: 107, matchDay: 125,
        extraEntrants: champFaEntrants
    });
    timeline[126].events.push({
        type: 'CupDraw',
        comp: 'FA Cup', title: 'Round 3',
        prevRoundMatchDay: 125, matchDay: 155,
        extraEntrants: premFaEntrants
    });
}

// Schedule all fixtures for a cup round on a given day
function scheduleCupRound(drawDay, matchDay, comp, title, pool) {
    let shuffled = [...pool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffled.length - 1; i += 2) {
        timeline[Math.min(matchDay, timeline.length-1)].events.push({
            type: 'Match', comp, title,
            h: shuffled[i], a: shuffled[i+1], played: false
        });
    }
}

function buildRoundRobin(arr) {
    let a = [...arr];
    if (a.length % 2 !== 0) a.push(null);
    let n = a.length, rounds = [];
    for (let r = 0; r < n - 1; r++) {
        let m = [];
        for (let i = 0; i < n / 2; i++) {
            if (a[i] !== null && a[n-1-i] !== null) m.push({ h: a[i], a: a[n-1-i] });
        }
        rounds.push(m);
        a.splice(1, 0, a.pop());
    }
    return rounds.concat(rounds.map(r => r.map(m => ({ h: m.a, a: m.h }))));
}

function getGlobalDateStr(dayOffset) {
    let dt = new Date(currentSeason, 7, 1);
    dt.setDate(dt.getDate() + dayOffset);
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── HUB ──────────────────────────────────────────────────────
function updateHub() {
    const t = teams.find(x => x.id === playerTeamId);
    document.getElementById('hub-name').innerText  = t.name;
    document.getElementById('hub-logo').src         = t.logo;
    document.getElementById('hub-stats').innerText  = `ATT ${t.att} · MID ${t.mid} · DEF ${t.def}`;
    document.getElementById('hub-season').innerText = `${currentSeason}/${(currentSeason+1).toString().slice(-2)}`;

    const next = findNextPlayerEvent();
    if (next) {
        const { evt, day } = next;
        let compName = evt.comp || 'League';
        document.getElementById('hub-next-comp').innerText = `${compName.toUpperCase()} · ${(evt.title||'').toUpperCase()}`;
        document.getElementById('hub-next-comp').setAttribute('data-comp', compName);
        document.getElementById('hub-next-comp').className = 'comp-pill ' + compClass(compName);
        document.getElementById('hub-next-date').innerText = getGlobalDateStr(day);

        if (evt.type === 'CupDraw') {
            document.getElementById('hub-next-opp').innerText = 'Cup Draw';
            document.getElementById('hub-action-btn').innerText = 'Attend Draw ›';
        } else {
            let opp = teams.find(x => x.id === (evt.h === playerTeamId ? evt.a : evt.h));
            document.getElementById('hub-next-opp').innerText = `vs ${opp.name} (${evt.h === playerTeamId ? 'H' : 'A'})`;
            document.getElementById('hub-action-btn').innerText = 'Match Prep ›';
        }
    } else {
        document.getElementById('hub-next-comp').innerText  = 'SEASON COMPLETE';
        document.getElementById('hub-next-date').innerText  = '';
        document.getElementById('hub-next-opp').innerText   = 'End of Season';
        document.getElementById('hub-action-btn').innerText = 'Review Season ›';
    }
}

function compClass(comp) {
    if (!comp) return 'league';
    if (comp === 'Carabao Cup') return 'carabao';
    if (comp === 'FA Cup') return 'fa';
    return 'league';
}

function findNextPlayerEvent() {
    for (let d = curDayGlobal; d < timeline.length; d++) {
        for (let e of timeline[d].events) {
            if (e.played) continue;
            if (e.type === 'Match' && (e.h === playerTeamId || e.a === playerTeamId)) return { evt: e, day: d };
            if (e.type === 'CupDraw' && isPlayerInDraw(e)) return { evt: e, day: d };
        }
    }
    return null;
}

function isPlayerInDraw(drawEvt) {
    // Player is in draw if they won a previous round match in that competition
    if (drawEvt.extraEntrants && drawEvt.extraEntrants.includes(playerTeamId)) return true;
    // Or won a previous round
    if (drawEvt.r1Day !== undefined) {
        const prevMatches = timeline[drawEvt.r1Day]?.events.filter(e => e.comp === drawEvt.comp);
        return prevMatches?.some(m => m.winner === playerTeamId) || false;
    }
    if (drawEvt.prevRoundMatchDay !== undefined) {
        const prevMatches = timeline[drawEvt.prevRoundMatchDay]?.events.filter(e => e.comp === drawEvt.comp);
        return prevMatches?.some(m => m.winner === playerTeamId) || false;
    }
    return false;
}

// ── HUB ACTION ───────────────────────────────────────────────
function handleHubAction() {
    const next = findNextPlayerEvent();
    if (!next) { endSeasonSequence(); return; }

    const { evt, day } = next;

    // Simulate all days up to (but not including) the event day
    while (curDayGlobal < day) { processDay(curDayGlobal); curDayGlobal++; }

    currentMatchObj = evt;

    if (evt.type === 'CupDraw') {
        resolveCupDraw(evt);
        setupDrawScreen(evt);
    } else {
        setupPreMatch(evt, day);
    }
}

function processDay(dayIdx) {
    timeline[dayIdx].events.forEach(e => {
        if (e.played) return;
        if (e.type === 'Match') quickSimMatch(e);
        else if (e.type === 'CupDraw') resolveCupDraw(e);
        e.played = true;
    });
}

// ── CUP DRAW ─────────────────────────────────────────────────
function resolveCupDraw(drawEvt) {
    if (drawEvt._resolved) return;
    drawEvt._resolved = true;

    // Collect winners from previous round
    let winners = [];

    if (drawEvt.r1Day !== undefined) {
        const prevMatches = timeline[drawEvt.r1Day]?.events.filter(e => e.comp === drawEvt.comp && e.type === 'Match') || [];
        prevMatches.forEach(m => { if (m.winner) winners.push(m.winner); });
    } else if (drawEvt.prevRoundMatchDay !== undefined) {
        const prevMatches = timeline[drawEvt.prevRoundMatchDay]?.events.filter(e => e.comp === drawEvt.comp && e.type === 'Match') || [];
        prevMatches.forEach(m => { if (m.winner) winners.push(m.winner); });
    }

    // Add new entrants
    if (drawEvt.extraEntrants) winners.push(...drawEvt.extraEntrants);

    // Remove duplicates & shuffle
    winners = [...new Set(winners)].sort(() => Math.random() - 0.5);
    drawEvt.drawPool = winners;

    // Schedule matches
    let mDay = Math.min(drawEvt.matchDay, timeline.length - 1);
    for (let i = 0; i < winners.length - 1; i += 2) {
        timeline[mDay].events.push({
            type: 'Match', comp: drawEvt.comp, title: drawEvt.title,
            h: winners[i], a: winners[i+1], played: false
        });
    }
    drawEvt.played = true;
}

let drawRollerInterval;
function setupDrawScreen(drawEvt) {
    document.getElementById('draw-comp-title').innerText = `${drawEvt.comp} – ${drawEvt.title}`;
    document.getElementById('btn-finish-draw').classList.add('hidden');
    document.getElementById('draw-roller').style.color = 'inherit';
    switchScreen('draw');

    // Find player's match
    let mDay = Math.min(drawEvt.matchDay, timeline.length - 1);
    let pMatch = timeline[mDay].events.find(m =>
        m.comp === drawEvt.comp && m.type === 'Match' &&
        (m.h === playerTeamId || m.a === playerTeamId)
    );

    if (!pMatch) {
        // Player knocked out
        document.getElementById('draw-roller').innerText = 'Eliminated';
        document.getElementById('btn-finish-draw').classList.remove('hidden');
        return;
    }

    let oppId = pMatch.h === playerTeamId ? pMatch.a : pMatch.h;
    let opp   = teams.find(t => t.id === oppId);
    let venue = pMatch.h === playerTeamId ? '(Home)' : '(Away)';

    let count = 0;
    drawRollerInterval = setInterval(() => {
        let rand = teams[Math.floor(Math.random() * teams.length)];
        document.getElementById('draw-roller').innerText = rand.name;
        count++;
        if (count > 22) {
            clearInterval(drawRollerInterval);
            document.getElementById('draw-roller').innerText = `${opp.name} ${venue}`;
            document.getElementById('draw-roller').style.color = opp.color;
            document.getElementById('btn-finish-draw').classList.remove('hidden');
        }
    }, 90);
}

function finishDraw() {
    document.getElementById('draw-roller').style.color = 'inherit';
    curDayGlobal++; // advance past draw day
    updateHub();
    switchScreen('hub');
}

// ── PRE-MATCH ────────────────────────────────────────────────
function setupPreMatch(m, dayIdx) {
    const h = teams.find(x => x.id === m.h);
    const a = teams.find(x => x.id === m.a);
    document.getElementById('pre-comp-title').innerText  = `${m.comp} · ${m.title}`;
    document.getElementById('pre-comp-title').className  = 'comp-pill ' + compClass(m.comp);
    document.getElementById('pre-date-title').innerText  = getGlobalDateStr(dayIdx);
    document.getElementById('pre-h-logo').src  = h.logo;
    document.getElementById('pre-h-name').innerText  = h.name;
    document.getElementById('pre-h-stats').innerText = `A:${h.att} M:${h.mid} D:${h.def}`;
    document.getElementById('pre-a-logo').src  = a.logo;
    document.getElementById('pre-a-name').innerText  = a.name;
    document.getElementById('pre-a-stats').innerText = `A:${a.att} M:${a.mid} D:${a.def}`;
    const pT = teams.find(t => t.id === playerTeamId);
    document.getElementById('pre-susp-warning').innerText = pT.susp > 0
        ? `⚠ Squad weakened by suspensions (−${pT.susp} to all stats)` : '';
    switchScreen('pre-match');
}

document.getElementById('btn-start-match').onclick = () => {
    const h = teams.find(x => x.id === currentMatchObj.h);
    const a = teams.find(x => x.id === currentMatchObj.a);
    setupMatchUI(h, a);
    switchScreen('match');
    runTicker();
};

function skipMatch() {
    if (tickerInterval) clearInterval(tickerInterval);
    // Fast-sim all 90 mins without pausing
    const h = teams.find(x => x.id === currentMatchObj.h);
    const a = teams.find(x => x.id === currentMatchObj.a);
    setupMatchUI(h, a);
    switchScreen('match');
    // Run full 90 mins immediately
    while (currentMinute < 90) { simMinute(); }
    logEvent('🏁 FULL TIME');
    document.getElementById('m-score').innerText = `${mState.hG} – ${mState.aG}`;
    document.getElementById('btn-finish-match').classList.remove('hidden');
}

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
    currentMinute  = 0;
    isSecondHalf   = false;
    mState = {
        hG:0, aG:0, hRed:0, aRed:0, hYel:0, aYel:0,
        hAtt: h.att - h.susp,
        hDef: h.def - h.susp,
        aAtt: a.att - a.susp,
        aDef: a.def - a.susp
    };
}

function simMinute() {
    if (currentMinute >= 90) return null;
    currentMinute++;
    document.getElementById('m-clock').innerText = currentMinute;

    const hProb = 0.016 * (mState.hAtt / Math.max(1, mState.aDef)) * 1.05;
    const aProb = 0.016 * (mState.aAtt / Math.max(1, mState.hDef));
    const r = Math.random();

    let evt = null;
    if (r < hProb)           evt = { type:'GOAL',        isH: true  };
    else if (r > 1 - aProb)  evt = { type:'GOAL',        isH: false };
    else if (Math.random() < 0.003) evt = { type:'Red Card',   isH: Math.random() > 0.5 };
    else if (Math.random() < 0.02)  evt = { type:'Yellow Card', isH: Math.random() > 0.5 };

    if (evt) {
        evt.min  = currentMinute;
        evt.team = evt.isH ? document.getElementById('m-h-name').innerText
                           : document.getElementById('m-a-name').innerText;
        if (evt.type === 'GOAL') {
            if (evt.isH) mState.hG++; else mState.aG++;
            evt.txt = goalPhrases[Math.floor(Math.random() * goalPhrases.length)];
        }
        if (evt.type === 'Red Card') {
            evt.txt = 'Sent off!';
            if (evt.isH) { mState.hRed++; mState.hAtt = Math.max(1, mState.hAtt - 15); mState.hDef = Math.max(1, mState.hDef - 15); }
            else          { mState.aRed++; mState.aAtt = Math.max(1, mState.aAtt - 15); mState.aDef = Math.max(1, mState.aDef - 15); }
            updateLiveStats();
        }
        if (evt.type === 'Yellow Card') evt.txt = 'Late challenge.';
    }
    return evt;
}

function updateLiveStats() {
    let t = '';
    if (mState.hRed > 0) t += `${document.getElementById('m-h-name').innerText}: ${11 - mState.hRed} men. `;
    if (mState.aRed > 0) t += `${document.getElementById('m-a-name').innerText}: ${11 - mState.aRed} men.`;
    document.getElementById('m-live-stats').innerText = t;
}

function runTicker() {
    tickerInterval = setInterval(tick, tickerSpeed);
}

function tick() {
    const evt = simMinute();
    if (evt) {
        clearInterval(tickerInterval);
        const icon = evt.type === 'GOAL' ? '⚽' : (evt.type === 'Red Card' ? '🟥' : '🟨');
        const cls  = evt.type === 'GOAL' ? 'ev-goal' : (evt.type === 'Red Card' ? 'ev-red' : 'ev-yellow');
        logEvent(`${icon} <b>${evt.min}'</b> · ${evt.type} — ${evt.team}. ${evt.txt}`, cls);
        if (evt.type === 'GOAL') {
            document.getElementById('m-score').innerText = `${mState.hG} – ${mState.aG}`;
            flashAlert(`GOAL! ${evt.team}`, 'var(--goal-flash)', '#000');
        } else if (evt.type === 'Red Card') {
            flashAlert('RED CARD', 'var(--red-card)', '#fff');
        }
        setTimeout(runTicker, evt.type === 'GOAL' ? 1200 : 600);
        return;
    }

    if (currentMinute === 45 && !isSecondHalf) {
        clearInterval(tickerInterval);
        logEvent('⏱️ HALF TIME');
        setTimeout(() => { isSecondHalf = true; runTicker(); }, 2000);
    } else if (currentMinute >= 90) {
        clearInterval(tickerInterval);
        logEvent('🏁 FULL TIME');
        document.getElementById('btn-finish-match').classList.remove('hidden');
    }
}

function flashAlert(text, bg, fg) {
    const el = document.getElementById('m-alert');
    el.innerText = text;
    el.style.background = bg;
    el.style.color = fg;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 1200);
}

function logEvent(html, cls = '') {
    const li = document.createElement('li');
    li.innerHTML = html;
    if (cls) li.className = cls;
    document.getElementById('m-events').prepend(li);
}

function quickSimMatch(m) {
    let h = teams.find(t => t.id === m.h);
    let a = teams.find(t => t.id === m.a);
    let hA = h.att - h.susp, hD = h.def - h.susp;
    let aA = a.att - a.susp, aD = a.def - a.susp;
    m.hG = 0; m.aG = 0;
    for (let i = 0; i < 90; i++) {
        let hP = 0.016 * (hA / Math.max(1, aD)) * 1.05;
        let aP = 0.016 * (aA / Math.max(1, hD));
        let r  = Math.random();
        if (r < hP) m.hG++;
        else if (r > 1 - aP) m.aG++;
        if (Math.random() < 0.003) { hA = Math.max(1, hA - 15); hD = Math.max(1, hD - 15); h.susp += 3; }
        if (Math.random() < 0.003) { aA = Math.max(1, aA - 15); aD = Math.max(1, aD - 15); a.susp += 3; }
    }
    processMatchResult(m, h, a);
}

function finishPlayerMatch() {
    clearInterval(tickerInterval);
    const h = teams.find(t => t.id === currentMatchObj.h);
    const a = teams.find(t => t.id === currentMatchObj.a);
    currentMatchObj.hG = mState.hG;
    currentMatchObj.aG = mState.aG;
    if (mState.hRed > 0) h.susp += mState.hRed * 3;
    if (mState.aRed > 0) a.susp += mState.aRed * 3;
    processMatchResult(currentMatchObj, h, a);

    // Sim remaining matches on this day
    timeline[curDayGlobal].events.forEach(e => {
        if (!e.played && e.type === 'Match') { quickSimMatch(e); e.played = true; }
    });

    renderPostMatch();
    switchScreen('post-match');
}

function processMatchResult(m, h, a) {
    // Cup: no draws
    if (m.comp !== 'League' && m.hG === m.aG) {
        if (Math.random() > 0.5) m.hG++; else m.aG++;
    }
    // Decay suspensions
    if (h.susp > 0) h.susp--;
    if (a.susp > 0) a.susp--;

    const winner = m.hG > m.aG ? m.h : m.a;
    m.winner = winner;

    if (m.comp === 'League') {
        h.played++; a.played++;
        h.gf += m.hG; h.ga += m.aG; h.gd = h.gf - h.ga;
        a.gf += m.aG; a.ga += m.hG; a.gd = a.gf - a.ga;
        if (m.hG > m.aG)      { h.w++; h.points += 3; a.l++; }
        else if (m.hG < m.aG) { a.w++; a.points += 3; h.l++; }
        else                   { h.d++; a.d++; h.points++; a.points++; }
    }
    m.played = true;
}

// ── POST MATCH ───────────────────────────────────────────────
function renderPostMatch() {
    const m = currentMatchObj;
    document.getElementById('post-comp-title').innerText = `${m.comp} · ${m.title}`;
    document.getElementById('post-date-title').innerText = getGlobalDateStr(curDayGlobal);

    // Results: ONLY matches from same competition on this day
    const resultsEl = document.getElementById('post-gw-results');
    resultsEl.innerHTML = '';
    const dayMatches = timeline[curDayGlobal].events.filter(e =>
        e.type === 'Match' && e.comp === m.comp
    );
    dayMatches.forEach(mx => {
        const ht = teams.find(x => x.id === mx.h);
        const at = teams.find(x => x.id === mx.a);
        const div = document.createElement('div');
        const isPlayer = mx.h === playerTeamId || mx.a === playerTeamId;
        div.className = 'fixture-row' + (isPlayer ? ' player-fixture' : '');
        div.innerHTML = `
            <div class="fixture-teams-row">
                <span class="fixture-team-name" style="color:${ht.color}">${ht.name}</span>
                <span class="fixture-score-box">${mx.hG} – ${mx.aG}</span>
                <span class="fixture-team-name right" style="color:${at.color}">${at.name}</span>
            </div>`;
        resultsEl.appendChild(div);
    });

    // Context pane: full league table OR cup progress
    const ctx = document.getElementById('post-context-pane');
    ctx.innerHTML = '';

    if (m.comp === 'League') {
        const pT = teams.find(t => t.id === playerTeamId);
        const sorted = teams.filter(t => t.league === pT.league)
            .sort((a,b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
        ctx.innerHTML = `
            <div class="pane-label" style="text-align:center;">FULL TABLE</div>
            <div style="overflow-y:auto;flex:1;">
                <table class="mini-table">
                    <thead><tr><th>#</th><th>Club</th><th>GD</th><th>Pts</th></tr></thead>
                    <tbody id="post-table-body"></tbody>
                </table>
            </div>`;
        const tbody = document.getElementById('post-table-body');
        sorted.forEach((t, i) => {
            const tr = document.createElement('tr');
            if (t.id === playerTeamId) tr.className = 'player-row';
            tr.innerHTML = `<td>${i+1}</td><td>${t.name}</td><td>${t.gd}</td><td>${t.points}</td>`;
            tbody.appendChild(tr);
        });
    } else {
        // Cup: show who progressed
        const pIsWinner = m.winner === playerTeamId;
        ctx.innerHTML = `
            <div class="pane-label" style="text-align:center;">CUP UPDATE</div>
            <div style="text-align:center;padding:20px;">
                <div style="font-size:2.5rem;margin-bottom:10px;">${pIsWinner ? '✅' : '❌'}</div>
                <div style="font-weight:700;font-size:1.1rem;margin-bottom:6px;">${pIsWinner ? 'You Advanced!' : 'Eliminated'}</div>
                <div style="color:var(--text-sub);font-size:0.85rem;margin-bottom:16px;">${pIsWinner ? `Next: ${getNextRoundName(m.title)}` : 'Better luck next cup.'}</div>
            </div>
            <div class="pane-label" style="text-align:center;">WINNERS</div>
            <div style="overflow-y:auto;flex:1;" id="cup-winners-list"></div>`;
        const winsList = document.getElementById('cup-winners-list');
        dayMatches.forEach(mx => {
            const wt = teams.find(t => t.id === mx.winner);
            if (!wt) return;
            const d2 = document.createElement('div');
            d2.className = 'fixture-row' + (mx.winner === playerTeamId ? ' player-fixture' : '');
            d2.style.marginBottom = '4px';
            d2.innerHTML = `<span style="font-weight:700;color:${wt.color}">${wt.name}</span> <span style="color:var(--text-muted);font-size:0.78rem;margin-left:6px;">advances</span>`;
            winsList.appendChild(d2);
        });

        // Schedule next cup round draw if enough winners
        if (pIsWinner) {
            const winners = dayMatches.map(mx => mx.winner).filter(Boolean);
            const nextRound = getNextRoundName(m.title);
            if (nextRound && winners.length > 1) {
                const drawDay  = Math.min(curDayGlobal + 3, timeline.length - 2);
                const matchDay = Math.min(curDayGlobal + 20, timeline.length - 1);
                // Only add if not already scheduled
                const alreadyScheduled = timeline[drawDay].events.some(e => e.comp === m.comp && e.title === nextRound);
                if (!alreadyScheduled) {
                    timeline[drawDay].events.push({
                        type: 'CupDraw',
                        comp: m.comp, title: nextRound,
                        prevRoundMatchDay: curDayGlobal,
                        matchDay, extraEntrants: []
                    });
                }
            }
        }
    }
}

function getNextRoundName(title) {
    const order = { 'Round 1':'Round 2','Round 2':'Round 3','Round 3':'Round 4','Round 4':'Quarter-Final','Quarter-Final':'Semi-Final','Semi-Final':'Final','Final':null };
    return order[title] || null;
}

function advanceTimeline() {
    curDayGlobal++;
    let anyLeft = false;
    for (let d = curDayGlobal; d < timeline.length; d++) {
        if (timeline[d].events.some(e => !e.played)) { anyLeft = true; break; }
    }
    if (!anyLeft) endSeasonSequence();
    else { updateHub(); switchScreen('hub'); }
}

// ── STANDINGS ────────────────────────────────────────────────
function renderTable() {
    const pT = teams.find(t => t.id === playerTeamId);
    document.getElementById('standings-title').innerText = leaguesMeta.find(l => l.id === pT.league).name;
    const tbody  = document.getElementById('table-body');
    tbody.innerHTML = '';
    const sorted = teams.filter(t => t.league === pT.league)
        .sort((a,b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);

    sorted.forEach((t, i) => {
        const tr = document.createElement('tr');
        if (t.id === playerTeamId) tr.classList.add('player-row');

        // Zone coloring
        const lg = pT.league;
        if (lg === 0) {
            if (i < 4)        tr.classList.add('zone-cl');
            else if (i === 4) tr.classList.add('zone-el');
            else if (i >= 17) tr.classList.add('zone-rel');
        } else if (lg === 1 || lg === 2) {
            if (i < 2)        tr.classList.add('zone-prom');
            else if (i < 6)   tr.classList.add('zone-po');
            else if (i >= 21) tr.classList.add('zone-rel');
        } else if (lg === 3) {
            if (i < 3)        tr.classList.add('zone-prom');
            else if (i < 7)   tr.classList.add('zone-po');
            else if (i >= 21) tr.classList.add('zone-rel');
        }

        tr.innerHTML = `<td>${i+1}</td><td class="left">${t.name}</td><td>${t.played}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td><td>${t.gd}</td><td>${t.points}</td>`;
        tbody.appendChild(tr);
    });
}

// ── CALENDAR ─────────────────────────────────────────────────
let calMonthOffset = 0;

function openCalendar() { calMonthOffset = 0; renderCalendar(); switchScreen('calendar'); }
function changeCalMonth(dir) {
    calMonthOffset = Math.max(0, Math.min(9, calMonthOffset + dir));
    renderCalendar();
}

function renderCalendar() {
    const baseDate  = new Date(currentSeason, 7 + calMonthOffset, 1);
    const monthEnd  = new Date(currentSeason, 8 + calMonthOffset, 0).getDate();
    document.getElementById('cal-month-title').innerText = baseDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    const grid    = document.getElementById('cal-grid');
    const sidebar = document.getElementById('cal-sidebar-list');
    grid.innerHTML = '';
    sidebar.innerHTML = '';

    // Start offset: Monday = 0
    let firstDow = baseDate.getDay(); // 0=Sun
    let startOffset = (firstDow === 0) ? 6 : firstDow - 1; // Mon-based

    // Empty cells
    for (let i = 0; i < startOffset; i++) {
        const d = document.createElement('div');
        d.className = 'cal-cell empty';
        grid.appendChild(d);
    }

    const allFixtures = [];

    for (let day = 1; day <= monthEnd; day++) {
        const targetDt   = new Date(currentSeason, 7 + calMonthOffset, day);
        const dayOffset  = Math.floor((targetDt - new Date(currentSeason, 7, 1)) / 86400000);
        const cell       = document.createElement('div');
        cell.className   = 'cal-cell';

        const numEl = document.createElement('div');
        numEl.className = 'cal-day-num';
        numEl.innerText = day;
        cell.appendChild(numEl);

        if (dayOffset >= 0 && dayOffset < timeline.length) {
            const playerEvts = timeline[dayOffset].events.filter(e =>
                (e.type === 'Match' && (e.h === playerTeamId || e.a === playerTeamId)) ||
                (e.type === 'CupDraw' && isPlayerInDraw(e))
            );

            if (playerEvts.length > 0) {
                cell.classList.add('has-event');
                const chipsEl = document.createElement('div');
                chipsEl.className = 'cal-events';

                playerEvts.forEach(e => {
                    const chip = document.createElement('div');
                    const cls  = compClass(e.comp);
                    chip.className = `cal-event-chip ${cls}` + (e.played ? ' played' : '');

                    if (e.type === 'CupDraw') {
                        chip.innerText = `${e.comp} Draw`;
                    } else {
                        const opp = teams.find(t => t.id === (e.h === playerTeamId ? e.a : e.h));
                        const venue = e.h === playerTeamId ? 'H' : 'A';
                        chip.innerText = e.played
                            ? `${venue} ${opp?.name || '?'} ${e.hG}–${e.aG}`
                            : `${venue} ${opp?.name || '?'}`;
                    }
                    chipsEl.appendChild(chip);

                    // Sidebar entry
                    allFixtures.push({ day, dayOffset, e });
                });
                cell.appendChild(chipsEl);
            }
        }
        grid.appendChild(cell);
    }

    // Sidebar
    allFixtures.sort((a,b) => a.day - b.day).forEach(({ day, dayOffset, e }) => {
        const dt = new Date(currentSeason, 7 + calMonthOffset, day);
        const dateStr = dt.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
        const row = document.createElement('div');
        row.className = 'fixture-row';
        const cls = compClass(e.comp);
        const isPlayer = true;
        row.classList.add('player-fixture');

        if (e.type === 'CupDraw') {
            row.innerHTML = `
                <div class="fixture-meta">
                    <span class="comp-pill ${cls}" style="font-size:0.62rem;padding:2px 6px;">${e.comp}</span>
                    <span class="fixture-date-tag">${dateStr}</span>
                </div>
                <div style="font-weight:700;font-size:0.85rem;">${e.title} Draw</div>`;
        } else {
            const ht = teams.find(t => t.id === e.h);
            const at = teams.find(t => t.id === e.a);
            const scoreOrVs = e.played ? `${e.hG}–${e.aG}` : 'vs';
            row.innerHTML = `
                <div class="fixture-meta">
                    <span class="comp-pill ${cls}" style="font-size:0.62rem;padding:2px 6px;">${e.comp}</span>
                    <span class="fixture-date-tag">${dateStr}</span>
                </div>
                <div class="fixture-teams-row">
                    <span class="fixture-team-name" style="color:${ht.color};font-size:0.82rem">${ht.name}</span>
                    <span class="fixture-score-box ${e.played?'':'pending'}" style="font-size:0.8rem;padding:3px 8px;">${scoreOrVs}</span>
                    <span class="fixture-team-name right" style="color:${at.color};font-size:0.82rem">${at.name}</span>
                </div>`;
        }
        sidebar.appendChild(row);
    });

    if (allFixtures.length === 0) {
        sidebar.innerHTML = '<p style="color:var(--text-muted);font-size:0.82rem;text-align:center;padding:20px;">No fixtures this month</p>';
    }
}

// ── RESULTS PAGE ──────────────────────────────────────────────
let resultsActiveComp = 'League';

function openResults() {
    // Build list of competitions player participates in
    const comps = ['League'];
    // Check if player has any cup matches
    for (let d = 0; d < timeline.length; d++) {
        for (let e of timeline[d].events) {
            if (e.type === 'Match' && (e.h === playerTeamId || e.a === playerTeamId) && e.comp !== 'League') {
                if (!comps.includes(e.comp)) comps.push(e.comp);
            }
        }
    }
    comps.push('Carabao Cup', 'FA Cup');
    const uniqueComps = [...new Set(comps)];

    const tabs = document.getElementById('results-tabs');
    tabs.innerHTML = '';
    uniqueComps.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'results-tab' + (c === resultsActiveComp ? ' active' : '');
        btn.innerText = c === 'League' ? leaguesMeta.find(l => l.id === teams.find(t => t.id === playerTeamId).league).name : c;
        btn.onclick = () => { resultsActiveComp = c; openResults(); };
        tabs.appendChild(btn);
    });

    renderResultsList(resultsActiveComp);
    switchScreen('results');
}

function renderResultsList(comp) {
    const pT  = teams.find(t => t.id === playerTeamId);
    const list = document.getElementById('results-list');
    list.innerHTML = '';

    // Gather all matches in this competition
    let allMatches = [];
    for (let d = 0; d < timeline.length; d++) {
        for (let e of timeline[d].events) {
            if (e.type !== 'Match') continue;
            if (comp === 'League' && e.comp === 'League' && e.leagueId === pT.league) {
                allMatches.push({ e, day: d });
            } else if (comp !== 'League' && e.comp === comp) {
                allMatches.push({ e, day: d });
            }
        }
    }

    // Sort by day
    allMatches.sort((a,b) => a.day - b.day);

    if (allMatches.length === 0) {
        list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:30px;font-size:0.85rem;">No fixtures found for this competition.</p>';
        return;
    }

    let lastTitle = '';
    allMatches.forEach(({ e, day }) => {
        // Group header
        if (e.title !== lastTitle) {
            lastTitle = e.title;
            const hdr = document.createElement('div');
            hdr.style.cssText = 'font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);padding:10px 4px 4px;margin-top:4px;border-bottom:1px solid var(--border-subtle);';
            hdr.innerText = e.title;
            list.appendChild(hdr);
        }

        const ht = teams.find(t => t.id === e.h);
        const at = teams.find(t => t.id === e.a);
        const isPlayer = e.h === playerTeamId || e.a === playerTeamId;
        const row = document.createElement('div');
        row.className = 'fixture-row' + (isPlayer ? ' player-fixture' : '');
        const scoreOrVs = e.played ? `${e.hG}–${e.aG}` : getGlobalDateStr(day).split(' ').slice(0,2).join(' ');

        row.innerHTML = `
            <div class="fixture-teams-row">
                <span class="fixture-team-name" style="color:${ht.color}">${ht.name}</span>
                <span class="fixture-score-box ${e.played?'':'pending'}">${scoreOrVs}</span>
                <span class="fixture-team-name right" style="color:${at.color}">${at.name}</span>
            </div>`;
        list.appendChild(row);
    });
}

// ── SEASON END ───────────────────────────────────────────────
function endSeasonSequence() {
    let html = '';
    for (let l = 0; l <= 3; l++) {
        const sorted = teams.filter(t => t.league === l).sort((a,b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
        html += `<div class="season-block"><h3>${leaguesMeta.find(x => x.id === l).name}</h3>`;
        html += `<p>🏆 Champions: <strong>${sorted[0].name}</strong></p>`;

        if (l > 0 && l < 3) {
            html += `<p>📈 Promoted: ${sorted[0].name}, ${sorted[1].name}</p>`;
            sorted[0].league--; sorted[1].league--;
        }
        if (l === 3) {
            html += `<p>📈 Promoted: ${sorted[0].name}, ${sorted[1].name}, ${sorted[2].name}</p>`;
            sorted[0].league--; sorted[1].league--; sorted[2].league--;
        }
        if (l < 3) {
            const rel = sorted.slice(-3);
            html += `<p>📉 Relegated: ${rel.map(t=>t.name).join(', ')}</p>`;
            rel.forEach(t => t.league++);
        }
        if (l === 3) {
            const rel = sorted.slice(-2);
            html += `<p>📉 Relegated: ${rel.map(t=>t.name).join(', ')}</p>`;
            rel.forEach(t => t.league++);
            const promoted = teams.filter(t => t.league === 4).sort(() => Math.random() - 0.5).slice(0, 2);
            html += `<p>♻️ Promoted to EFL: ${promoted.map(t=>t.name).join(', ')}</p>`;
            promoted.forEach(t => t.league = 3);
        }
        html += `</div>`;
    }
    document.getElementById('season-summary-content').innerHTML = html;
    switchScreen('end-season');
    if (teams.find(t => t.id === playerTeamId).league === 4) {
        setTimeout(() => switchScreen('game-over'), 3000);
    }
}

function startNewSeason() {
    currentSeason++;
    teams.forEach(t => { t.played=0; t.w=0; t.d=0; t.l=0; t.gf=0; t.ga=0; t.gd=0; t.points=0; t.susp=0; });
    generateTimeline();
    updateHub();
    switchScreen('hub');
}

// ── THEME ────────────────────────────────────────────────────
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('theme-icon').innerText  = isDark ? '☀️' : '🌙';
    document.getElementById('theme-label').innerText = isDark ? 'Light Mode' : 'Dark Mode';
}

// ── BOOT ─────────────────────────────────────────────────────
init();
