// --- DATA SET & PROCEDURAL GENERATION ---
const leaguesMeta = [
    { id: 0, name: "Premier League", size: 20 },
    { id: 1, name: "Championship", size: 24 },
    { id: 2, name: "League One", size: 24 },
    { id: 3, name: "League Two", size: 24 },
    { id: 4, name: "Non-League", size: 36 } 
];

const vibrantColors = ["#ef4444","#f97316","#f59e0b","#eab308","#84cc16","#22c55e","#10b981","#14b8a6","#06b6d4","#0ea5e9","#3b82f6","#6366f1","#8b5cf6","#a855f7","#d946ef","#ec4899","#f43f5e"];

const teamDataRaw = [
    // Premier
    { name: "Man City", att: 94, mid: 92, def: 88, c: "#6CABDD", l: 0 }, { name: "Arsenal", att: 90, mid: 91, def: 92, c: "#EF0107", l: 0 },
    { name: "Liverpool", att: 92, mid: 88, def: 86, c: "#C8102E", l: 0 }, { name: "Aston Villa", att: 84, mid: 83, def: 81, c: "#95BFE5", l: 0 },
    { name: "Tottenham", att: 86, mid: 84, def: 80, c: "#132257", l: 0 }, { name: "Chelsea", att: 85, mid: 84, def: 81, c: "#034694", l: 0 },
    { name: "Newcastle", att: 83, mid: 82, def: 80, c: "#241F20", l: 0 }, { name: "Man United", att: 81, mid: 82, def: 80, c: "#DA291C", l: 0 },
    { name: "West Ham", att: 79, mid: 78, def: 77, c: "#7A263A", l: 0 }, { name: "Brighton", att: 80, mid: 81, def: 78, c: "#0057B8", l: 0 },
    { name: "Bournemouth", att: 77, mid: 75, def: 74, c: "#B50E12", l: 0 }, { name: "Crystal Palace", att: 78, mid: 76, def: 77, c: "#1B458F", l: 0 },
    { name: "Wolves", att: 75, mid: 76, def: 74, c: "#FDB913", l: 0 }, { name: "Fulham", att: 76, mid: 77, def: 75, c: "#FFFFFF", l: 0 },
    { name: "Everton", att: 72, mid: 74, def: 77, c: "#003399", l: 0 }, { name: "Brentford", att: 75, mid: 74, def: 73, c: "#E30613", l: 0 },
    { name: "Nott'm Forest", att: 74, mid: 73, def: 74, c: "#DD0000", l: 0 }, { name: "Leicester", att: 73, mid: 72, def: 71, c: "#003090", l: 0 },
    { name: "Ipswich", att: 71, mid: 70, def: 69, c: "#0000FF", l: 0 }, { name: "Southampton", att: 70, mid: 71, def: 70, c: "#D71920", l: 0 },
    // EFL Procedurals
    ...["Leeds","Burnley","Luton","Sheff Utd","West Brom","Norwich","Hull","Middlesbrough","Coventry","Preston","Bristol City","Cardiff","Millwall","Swansea","Watford","Sunderland","Stoke","QPR","Blackburn","Sheff Wed","Plymouth","Portsmouth","Derby","Oxford Utd"].map(n => ({name: n, l: 1, base: 73})),
    ...["Bolton","Peterborough","Barnsley","Lincoln","Blackpool","Stevenage","Wigan","Charlton","Reading","Bristol R","Leyton O","Wycombe","Exeter","Northampton","Burton","Cambridge","Shrewsbury","Stockport","Wrexham","Mansfield","Crawley","Rotherham","Huddersfield","Birmingham"].map(n => ({name: n, l: 2, base: 65})),
    ...["MK Dons","Doncaster","Crewe","Barrow","Bradford","Wimbledon","Walsall","Gillingham","Harrogate","Notts Co","Tranmere","Accrington","Newport","Swindon","Salford","Grimsby","Colchester","Chesterfield","Bromley","Port Vale","Fleetwood","Carlisle","Cheltenham","Morecambe"].map(n => ({name: n, l: 3, base: 58})),
    ...["Barnet","Altrincham","Solihull","Gateshead","Halifax","Aldershot","Southend","Oldham","Rochdale","York","Hartlepool","Eastleigh","Dagenham","Wealdstone","Woking","Ebbsfleet","Fylde","Kidderminster","Boreham W","Dorking","Yeovil","Scunthorpe","Torquay","Chester","Hereford","Boston","King's Lynn","Blyth","Spennymoor","Chorley","Brackley","Farsley","Curzon","Southport","Gloucester","Darlington"].map(n => ({name: n, l: 4, base: 50}))
];

let teams = [];
let playerTeamId = null;
let currentSeason = 2024;
let timeline = []; // Replaces simple schedule. Array of daily events.
let curDayGlobal = 0; // Days passed since start of season (Aug 1)

// Engine State
let tickerSpeed = 200; 
let tickerInterval = null;
let currentMatchObj = null;
let isSecondHalf = false;
let currentMinute = 0, extraMin = 0;
let mState = { hG:0, aG:0, hRed:0, aRed:0, hYel:0, aYel:0, evs:[] };

const goalPhrases = ["Absolute screamer!", "Cool finish.", "Brilliant team goal!", "Tapped in from close range.", "What a header!"];

function init() { buildTeams(); renderLeagueSelection(); }

function buildTeams() {
    teams = teamDataRaw.map((t, i) => {
        let att = t.att || Math.floor(t.base + Math.random()*8);
        let mid = t.mid || Math.floor(t.base + Math.random()*8);
        let def = t.def || Math.floor(t.base + Math.random()*8);
        let c = t.c || vibrantColors[i % vibrantColors.length];
        return { id: i, name: t.name, color: c, league: t.l, att, mid, def, 
            played:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, points:0, susp:0,
            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=${c.replace('#','')}&color=fff&bold=true` };
    });
}

function switchScreen(id) { document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden')); document.getElementById(`screen-${id}`).classList.remove('hidden'); if(id==='standings') renderTable(); }

function renderLeagueSelection() {
    const el = document.getElementById('league-list'); el.innerHTML = "";
    leaguesMeta.slice(0, 4).forEach(l => {
        const div = document.createElement('div'); div.className = 'league-card';
        div.innerHTML = `<h3>${l.name}</h3><p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">${l.size} Teams</p>`;
        div.onclick = () => renderTeamSelection(l.id); el.appendChild(div);
    });
    switchScreen('league-select');
}

function renderTeamSelection(leagueId) {
    document.getElementById('sel-season-label').innerText = `${currentSeason}/${(currentSeason+1).toString().slice(-2)}`;
    const el = document.getElementById('team-list'); el.innerHTML = "";
    teams.filter(t => t.league === leagueId).forEach(t => {
        const div = document.createElement('div'); div.className = 'team-card';
        div.innerHTML = `<img src="${t.logo}"><h4>${t.name}</h4><div class="stats">A:${t.att} M:${t.mid} D:${t.def}</div>`;
        div.onclick = () => { playerTeamId = t.id; generateTimeline(); updateHub(); switchScreen('hub'); }; el.appendChild(div);
    });
    switchScreen('selection');
}

// --- DYNAMIC TIMELINE GENERATOR ---
// Generates roughly 280 days (Aug 1 to May 7 approx).
function generateTimeline() {
    timeline = []; curDayGlobal = 0;
    for(let i=0; i<300; i++) timeline.push({ day: i, events: [] });
    
    // Schedule Leagues (Sat/Wed patterns). Spaced out to prevent 1-day gaps.
    let eflDays = [], premDays = [];
    let d = 10; // Start Aug 10
    for(let r=0; r<46; r++) { eflDays.push(d); d += (r%3===0) ? 3 : 4; } // Mix of 3 and 4 day gaps
    d = 10; 
    for(let r=0; r<38; r++) { premDays.push(d); d += (r%2===0) ? 7 : 4; } // More spaced for Prem
    
    leaguesMeta.slice(0, 4).forEach(l => {
        let isPrem = l.id === 0; let rr = buildRoundRobin(teams.filter(t => t.league === l.id).map(t=>t.id));
        rr.forEach((round, rIdx) => {
            let day = isPrem ? premDays[rIdx] : eflDays[rIdx];
            if(day >= timeline.length) day = timeline.length-1;
            round.forEach(m => timeline[day].events.push({ type: 'Match', comp: 'League', title: `Matchday ${rIdx+1}`, h: m.h, a: m.a, played: false }));
        });
    });

    // Schedule Cup Draws
    timeline[5].events.push({ type: 'Draw', comp: 'Carabao Cup', title: 'Round 1', pool: teams.filter(t=>t.league<=3).map(t=>t.id), matchDay: 17 });
    timeline[60].events.push({ type: 'Draw', comp: 'FA Cup', title: 'Round 1', pool: teams.map(t=>t.id), matchDay: 75 });
}

function buildRoundRobin(arr) {
    let a = [...arr], rounds = [], n = a.length; if(n%2!==0) a.push(null); n = a.length;
    for(let r=0; r<n-1; r++) {
        let m = []; for(let i=0; i<n/2; i++) if(a[i]!==null && a[n-1-i]!==null) m.push({h: a[i], a: a[n-1-i]});
        rounds.push(m); a.splice(1, 0, a.pop());
    }
    return rounds.concat(rounds.map(r => r.map(m => ({h:m.a, a:m.h}))));
}

function getGlobalDateStr(dayOffset) {
    let dt = new Date(currentSeason, 7, 1); dt.setDate(dt.getDate() + dayOffset);
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// --- HUB & PROGRESSION ---

function updateHub() {
    const t = teams.find(x => x.id === playerTeamId);
    document.getElementById('hub-name').innerText = t.name; document.getElementById('hub-logo').src = t.logo;
    document.getElementById('hub-stats').innerText = `ATT: ${t.att} | MID: ${t.mid} | DEF: ${t.def}`;
    document.getElementById('hub-season').innerText = `Season ${currentSeason}/${(currentSeason+1).toString().slice(-2)}`;
    
    // Find next player event
    let nextEvtDay = -1; let nextEvt = null;
    for(let d = curDayGlobal; d < timeline.length; d++) {
        let evs = timeline[d].events;
        for(let e of evs) {
            if(!e.played && (e.type === 'Draw' && e.pool.includes(playerTeamId)) || (e.type === 'Match' && (e.h === playerTeamId || e.a === playerTeamId))) {
                nextEvtDay = d; nextEvt = e; break;
            }
        }
        if(nextEvt) break;
    }

    if(nextEvt) {
        document.getElementById('hub-next-comp').innerText = `${nextEvt.comp.toUpperCase()} - ${nextEvt.title.toUpperCase()}`;
        document.getElementById('hub-next-date').innerText = getGlobalDateStr(nextEvtDay);
        if(nextEvt.type === 'Draw') {
            document.getElementById('hub-next-opp').innerText = "Cup Draw";
            document.getElementById('hub-action-btn').innerText = "Attend Draw";
        } else {
            let opp = teams.find(x => x.id === (nextEvt.h === playerTeamId ? nextEvt.a : nextEvt.h));
            document.getElementById('hub-next-opp').innerText = `vs ${opp.name} (${nextEvt.h === playerTeamId ? 'H' : 'A'})`;
            document.getElementById('hub-action-btn').innerText = "Match Prep";
        }
    } else {
        document.getElementById('hub-next-comp').innerText = "SEASON COMPLETE";
        document.getElementById('hub-next-date').innerText = ""; document.getElementById('hub-next-opp').innerText = "End of Season";
        document.getElementById('hub-action-btn').innerText = "Review Season";
    }
}

function handleHubAction() {
    let nextEvtDay = -1, nextEvt = null;
    for(let d = curDayGlobal; d < timeline.length; d++) {
        let evs = timeline[d].events;
        for(let e of evs) {
            if(!e.played && (e.type === 'Draw' && e.pool.includes(playerTeamId)) || (e.type === 'Match' && (e.h === playerTeamId || e.a === playerTeamId))) {
                nextEvtDay = d; nextEvt = e; break;
            }
        }
        if(nextEvt) break;
    }

    if(!nextEvt) { endSeasonSequence(); return; }

    // Sim everything up to this day
    while(curDayGlobal < nextEvtDay) { processDay(curDayGlobal); curDayGlobal++; }

    currentMatchObj = nextEvt;
    
    if(nextEvt.type === 'Draw') { setupDrawScreen(nextEvt); } 
    else { setupPreMatch(nextEvt, nextEvtDay); }
}

function processDay(dayIdx) {
    let evs = timeline[dayIdx].events.filter(e => !e.played);
    evs.forEach(e => {
        if(e.type === 'Match') quickSimMatch(e);
        else if(e.type === 'Draw') performAutoDraw(e);
        e.played = true;
    });
}

// --- DRAW MINIGAME ---
let drawInterval;
function setupDrawScreen(drawEvt) {
    document.getElementById('draw-comp-title').innerText = `${drawEvt.comp} - ${drawEvt.title}`;
    document.getElementById('btn-finish-draw').classList.add('hidden');
    switchScreen('draw');
    
    // Auto complete the rest of the draw secretly
    performAutoDraw(drawEvt, playerTeamId); 
    
    // Find who player got drawn against
    let pMatch = timeline[drawEvt.matchDay].events.find(m => m.comp === drawEvt.comp && (m.h === playerTeamId || m.a === playerTeamId));
    let oppId = pMatch.h === playerTeamId ? pMatch.a : pMatch.h;
    let opp = teams.find(t=>t.id===oppId);
    
    // Roulette effect
    let count = 0; let roller = document.getElementById('draw-roller');
    drawInterval = setInterval(() => {
        roller.innerText = teams[Math.floor(Math.random()*teams.length)].name;
        count++;
        if(count > 20) {
            clearInterval(drawInterval);
            roller.innerText = opp.name + (pMatch.h === playerTeamId ? " (Home)" : " (Away)");
            roller.style.color = opp.color;
            document.getElementById('btn-finish-draw').classList.remove('hidden');
            drawEvt.played = true; // Mark done
        }
    }, 100);
}

function finishDraw() { document.getElementById('draw-roller').style.color="inherit"; updateHub(); switchScreen('hub'); }

function performAutoDraw(drawEvt, excludePlayerId = null) {
    let pool = [...drawEvt.pool].sort(()=>Math.random()-0.5);
    for(let i=0; i<pool.length; i+=2) {
        if(pool[i+1] !== undefined) {
            timeline[drawEvt.matchDay].events.push({
                type: 'Match', comp: drawEvt.comp, title: drawEvt.title,
                h: pool[i], a: pool[i+1], played: false
            });
        }
    }
}

function getNextCupRoundInfo(comp, title) {
    let r = {'Round 1':'Round 2', 'Round 2':'Round 3', 'Round 3':'Round 4', 'Round 4':'Quarter-Final', 'Quarter-Final':'Semi-Final', 'Semi-Final':'Final', 'Final':null};
    return r[title];
}

// --- MATCH PREP & ENGINE ---

function setupPreMatch(m, dayIdx) {
    const h = teams.find(x => x.id === m.h), a = teams.find(x => x.id === m.a);
    document.getElementById('pre-comp-title').innerText = `${m.comp} - ${m.title}`;
    document.getElementById('pre-date-title').innerText = getGlobalDateStr(dayIdx);
    
    document.getElementById('pre-h-logo').src = h.logo; document.getElementById('pre-h-name').innerText = h.name;
    document.getElementById('pre-h-stats').innerText = `A:${h.att} M:${h.mid} D:${h.def}`;
    document.getElementById('pre-a-logo').src = a.logo; document.getElementById('pre-a-name').innerText = a.name;
    document.getElementById('pre-a-stats').innerText = `A:${a.att} M:${a.mid} D:${a.def}`;
    
    let pT = teams.find(t=>t.id===playerTeamId);
    if(pT.susp > 0) document.getElementById('pre-susp-warning').innerText = `WARNING: Squad weakened by recent red cards (-${pT.susp} to all stats).`;
    else document.getElementById('pre-susp-warning').innerText = "";
    
    switchScreen('pre-match');
}

document.getElementById('btn-start-match').onclick = () => {
    const h = teams.find(x => x.id === currentMatchObj.h), a = teams.find(x => x.id === currentMatchObj.a);
    setupMatchUI(h, a); switchScreen('match'); runTicker();
};

function skipMatch() {
    while(currentMinute < 90) simMinute();
    logEvent(`🏁 FULL TIME (Quick Sim).`);
    document.getElementById('btn-finish-match').classList.remove('hidden');
    switchScreen('match');
}

function setupMatchUI(h, a) {
    document.getElementById('m-h-name').innerText = h.name; document.getElementById('m-a-name').innerText = a.name;
    document.getElementById('m-h-logo').src = h.logo; document.getElementById('m-a-logo').src = a.logo;
    document.getElementById('m-score').innerText = "0 - 0"; document.getElementById('m-events').innerHTML = "";
    document.getElementById('m-live-stats').innerText = "";
    document.getElementById('btn-finish-match').classList.add('hidden');
    currentMinute = 0; extraMin = 0; isSecondHalf = false; document.getElementById('m-extra').innerText = "";
    mState = { hG:0, aG:0, hRed:0, aRed:0, hYel:0, aYel:0, evs:[], hAtt: h.att-h.susp, hDef: h.def-h.susp, aAtt: a.att-a.susp, aDef: a.def-a.susp };
}

function simMinute() {
    if(currentMinute >= 90) return;
    currentMinute++; document.getElementById('m-clock').innerText = currentMinute;
    
    let hProb = 0.015 * (mState.hAtt / Math.max(1, mState.aDef)) * 1.05;
    let aProb = 0.015 * (mState.aAtt / Math.max(1, mState.hDef));
    let r = Math.random();
    
    let evt = null;
    if(r < hProb) evt = { type:'GOAL', isH:true };
    else if(r > 1 - aProb) evt = { type:'GOAL', isH:false };
    else if(Math.random() < 0.003) evt = { type:'Red Card', isH: Math.random()>0.5 };
    else if(Math.random() < 0.02) evt = { type:'Yellow Card', isH: Math.random()>0.5 };
    
    if(evt) {
        let teamName = evt.isH ? document.getElementById('m-h-name').innerText : document.getElementById('m-a-name').innerText;
        evt.team = teamName;
        if(evt.type === 'GOAL') { if(evt.isH) mState.hG++; else mState.aG++; evt.txt = goalPhrases[Math.floor(Math.random()*goalPhrases.length)]; }
        if(evt.type === 'Red Card') { 
            evt.txt = "Sent off!"; 
            if(evt.isH) { mState.hRed++; mState.hAtt-=15; mState.hDef-=15; } else { mState.aRed++; mState.aAtt-=15; mState.aDef-=15; }
            updateLiveStats();
        }
        if(evt.type === 'Yellow Card') evt.txt = "Late tackle.";
        mState.evs.push({...evt, min: currentMinute});
        return evt; // Return event to trigger pause
    }
    return null;
}

function updateLiveStats() {
    let t = "";
    if(mState.hRed>0) t += `Home down to ${11-mState.hRed} men. `;
    if(mState.aRed>0) t += `Away down to ${11-mState.aRed} men.`;
    document.getElementById('m-live-stats').innerText = t;
}

function runTicker() { tickerInterval = setInterval(tick, tickerSpeed); }

function tick() {
    let evt = simMinute();
    if(evt) {
        clearInterval(tickerInterval);
        let icon = evt.type==='GOAL' ? '⚽' : (evt.type==='Red Card' ? '🟥' : '🟨');
        logEvent(`${icon} <b>${evt.min}'</b> - ${evt.type} for ${evt.team}! ${evt.txt}`, evt.type==='GOAL', evt.type==='Red Card');
        if(evt.type==='GOAL') { document.getElementById('m-score').innerText = `${mState.hG} - ${mState.aG}`; flashEventAlert(`GOAL ${evt.team}!`, 'var(--goal-color)'); setTimeout(runTicker, 1000); }
        else if(evt.type==='Red Card') { flashEventAlert('RED CARD', 'var(--card-red)'); setTimeout(runTicker, 1000); }
        else { flashEventAlert('YELLOW CARD', 'var(--card-yellow)'); setTimeout(runTicker, 500); }
        return;
    }

    if(currentMinute === 45 && !isSecondHalf) {
        clearInterval(tickerInterval); logEvent(`⏱️ HALF TIME.`);
        setTimeout(() => { isSecondHalf = true; runTicker(); }, 2000);
    } else if(currentMinute === 90) {
        clearInterval(tickerInterval); logEvent(`🏁 FULL TIME.`);
        document.getElementById('btn-finish-match').classList.remove('hidden');
    }
}

function flashEventAlert(text, bgColor) {
    const alert = document.getElementById('m-alert');
    alert.innerText = text; alert.style.backgroundColor = bgColor; alert.classList.remove('hidden');
    setTimeout(() => alert.classList.add('hidden'), 1000);
}

function logEvent(html, isHi=false, isRed=false) {
    const li = document.createElement('li'); li.innerHTML = html;
    if(isHi) li.className = 'highlight'; if(isRed) li.classList.add('red-card');
    document.getElementById('m-events').prepend(li);
}

// Quick sim logic matching the live engine conceptually
function quickSimMatch(m) {
    let h = teams.find(t=>t.id===m.h), a = teams.find(t=>t.id===m.a);
    let hA=h.att-h.susp, hD=h.def-h.susp, aA=a.att-a.susp, aD=a.def-a.susp;
    m.hG=0; m.aG=0;
    for(let i=0; i<90; i++) {
        let hP = 0.015 * (hA/Math.max(1,aD)) * 1.05; let aP = 0.015 * (aA/Math.max(1,hD));
        let r = Math.random();
        if(r<hP) m.hG++; else if(r>1-aP) m.aG++;
        if(Math.random()<0.003) { hA-=15; hD-=15; h.susp+=3; } // Add carryover susp
        if(Math.random()<0.003) { aA-=15; aD-=15; a.susp+=3; }
    }
    processMatchResult(m, h, a);
}

function finishPlayerMatch() {
    let h = teams.find(t=>t.id===currentMatchObj.h), a = teams.find(t=>t.id===currentMatchObj.a);
    currentMatchObj.hG = mState.hG; currentMatchObj.aG = mState.aG;
    if(mState.hRed>0) h.susp += mState.hRed*3; if(mState.aRed>0) a.susp += mState.aRed*3;
    
    processMatchResult(currentMatchObj, h, a);
    
    // Sim others today
    timeline[curDayGlobal].events.filter(e => !e.played && e.type==='Match').forEach(e => { quickSimMatch(e); e.played=true; });
    
    renderPostMatch(); switchScreen('post-match');
}

function processMatchResult(m, h, a) {
    // Cup Tiebreakers
    if(m.comp !== 'League' && m.hG === m.aG) { if(Math.random()>0.5) m.hG++; else m.aG++; }
    
    // Decay Suspensions
    if(h.susp>0) h.susp--; if(a.susp>0) a.susp--;
    
    if(m.comp === 'League') {
        h.played++; a.played++; h.gf+=m.hG; h.ga+=m.aG; h.gd=h.gf-h.ga; a.gf+=m.aG; a.ga+=m.hG; a.gd=a.gf-a.ga;
        if(m.hG>m.aG){ h.w++; h.points+=3; a.l++; } else if(m.hG<m.aG){ a.w++; a.points+=3; h.l++; } else { h.d++; a.d++; h.points++; a.points++; }
    } else {
        // Handle Cup Progress
        let winner = m.hG > m.aG ? m.h : m.a;
        if(!m.winner) m.winner = winner; // Stash for post-match
    }
    m.played = true;
}

function renderPostMatch() {
    document.getElementById('post-comp-title').innerText = `${currentMatchObj.comp} Summary`;
    document.getElementById('post-date-title').innerText = getGlobalDateStr(curDayGlobal);
    
    const resEl = document.getElementById('post-gw-results'); resEl.innerHTML = "";
    timeline[curDayGlobal].events.filter(e => e.comp === currentMatchObj.comp).forEach(m => {
        const h = teams.find(x=>x.id===m.h), a = teams.find(x=>x.id===m.a);
        const div = document.createElement('div'); div.className = 'fixture-row';
        div.innerHTML = `<div class="fixture-teams"><span class="fixture-team" style="color:${h.color}">${h.name}</span><span class="fixture-score">${m.hG} - ${m.aG}</span><span class="fixture-team away" style="color:${a.color}">${a.name}</span></div>`;
        if(m.h===playerTeamId || m.a===playerTeamId) div.style.borderLeft="4px solid var(--accent)";
        resEl.appendChild(div);
    });

    const ctxPane = document.getElementById('post-context-pane'); ctxPane.innerHTML = "";
    if(currentMatchObj.comp === 'League') {
        ctxPane.innerHTML = `<p class="label" style="text-align:center;">STANDINGS</p><div class="table-container scrollable" style="padding:0;background:transparent;"><table class="mini-table"><thead><tr><th>#</th><th>Club</th><th>GD</th><th>Pts</th></tr></thead><tbody id="post-table-body"></tbody></table></div>`;
        const pTeam = teams.find(t=>t.id===playerTeamId);
        const tbody = document.getElementById('post-table-body');
        teams.filter(t=>t.league===pTeam.league).sort((a,b)=>b.points-a.points||b.gd-a.gd||b.gf-a.gf).slice(0,10).forEach((t,i) => {
            const tr = document.createElement('tr'); if(t.id===playerTeamId) tr.className="player-row";
            tr.innerHTML = `<td>${i+1}</td><td style="text-align:left;font-weight:bold;">${t.name}</td><td>${t.gd}</td><td><strong>${t.points}</strong></td>`;
            tbody.appendChild(tr);
        });
    } else {
        // Cup Draw Generation Logic inside Post Match to avoid mid-day processing overlaps
        let todaysCupGames = timeline[curDayGlobal].events.filter(e => e.comp === currentMatchObj.comp);
        let winners = todaysCupGames.map(m => m.winner);
        let nextRound = getNextCupRoundInfo(currentMatchObj.comp, currentMatchObj.title);
        
        ctxPane.innerHTML = `<p class="label" style="text-align:center;">CUP PROGRESSION</p><div style="text-align:center; padding: 20px;"><h3>Teams Advanced: ${winners.length}</h3><p style="color:var(--text-muted); margin-top:10px;">${nextRound ? `Next Stage: ${nextRound} Draw pending...` : 'Tournament Complete!'}</p></div>`;
        
        if(nextRound && winners.length > 1) {
            // Schedule the draw for 2 days from now
            let drawDay = Math.min(curDayGlobal + 2, timeline.length-1);
            timeline[drawDay].events.push({ type: 'Draw', comp: currentMatchObj.comp, title: nextRound, pool: winners, matchDay: Math.min(drawDay + 14, timeline.length-1) });
        }
    }
}

function advanceTimeline() {
    curDayGlobal++;
    // Check if season is over (no more events for anyone)
    let anyLeft = false;
    for(let d=curDayGlobal; d<timeline.length; d++) { if(timeline[d].events.length > 0) { anyLeft = true; break; } }
    if(!anyLeft) endSeasonSequence(); else { updateHub(); switchScreen('hub'); }
}

// --- CALENDAR & STANDINGS ---
let viewMonthOff = 0; // 0 = Aug, 1 = Sep
function openCalendar() { viewMonthOff = 0; renderCalendarMonth(); switchScreen('calendar'); }
function changeCalMonth(dir) { viewMonthOff += dir; if(viewMonthOff<0)viewMonthOff=0; if(viewMonthOff>9)viewMonthOff=9; renderCalendarMonth(); }

function renderCalendarMonth() {
    let baseDate = new Date(currentSeason, 7 + viewMonthOff, 1);
    document.getElementById('cal-month-title').innerText = baseDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    
    let grid = document.getElementById('cal-grid-body'); grid.innerHTML = "";
    let list = document.getElementById('cal-side-list'); list.innerHTML = "";
    
    let firstDayOfWeek = baseDate.getDay(); // 0 = Sun
    let daysInMonth = new Date(currentSeason, 8 + viewMonthOff, 0).getDate();
    
    // Blanks
    for(let i=0; i<firstDayOfWeek; i++) grid.innerHTML += `<div class="cal-day empty"></div>`;
    
    for(let d=1; d<=daysInMonth; d++) {
        let div = document.createElement('div'); div.className = 'cal-day';
        div.innerHTML = `<span class="cal-day-num">${d}</span>`;
        
        // Find events on this real date
        let targetDt = new Date(currentSeason, 7 + viewMonthOff, d);
        let diffTime = targetDt - new Date(currentSeason, 7, 1);
        let dayOffset = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if(dayOffset >= 0 && dayOffset < timeline.length) {
            let pEvents = timeline[dayOffset].events.filter(e => (e.type==='Match'&&(e.h===playerTeamId||e.a===playerTeamId)) || (e.type==='Draw'&&e.pool.includes(playerTeamId)));
            if(pEvents.length > 0) {
                div.classList.add('has-match');
                pEvents.forEach(e => {
                    let dot = document.createElement('div'); dot.className = `cal-dot ${e.comp==='League'?'league':'cup'}`; div.appendChild(dot);
                    
                    // Add to side list
                    let lDiv = document.createElement('div'); lDiv.className = 'fixture-row'; lDiv.style.marginBottom="5px";
                    let txt = e.type==='Draw' ? "Draw" : (e.played ? `${e.hG} - ${e.aG}` : "VS");
                    let hName = e.type==='Match'?teams.find(t=>t.id===e.h).name : "Cup";
                    let aName = e.type==='Match'?teams.find(t=>t.id===e.a).name : "Draw";
                    lDiv.innerHTML = `<div class="fixture-top"><span class="comp-badge">${e.comp}</span><span class="fixture-date">${d} ${targetDt.toLocaleString('en-GB',{month:'short'})}</span></div><div class="fixture-teams"><span class="fixture-team">${hName}</span><span class="fixture-score">${txt}</span><span class="fixture-team away">${aName}</span></div>`;
                    list.appendChild(lDiv);
                });
            }
        }
        grid.appendChild(div);
    }
}

function renderTable() {
    const pT = teams.find(t=>t.id===playerTeamId);
    document.getElementById('standings-title').innerText = leaguesMeta.find(l=>l.id===pT.league).name;
    const tbody = document.getElementById('table-body'); tbody.innerHTML = "";
    const sorted = teams.filter(t=>t.league===pT.league).sort((a,b)=>b.points-a.points||b.gd-a.gd||b.gf-a.gf);
    
    sorted.forEach((t, i) => {
        const tr = document.createElement('tr');
        if(t.id===playerTeamId) tr.classList.add('player-row');
        
        // Zones
        if(pT.league===0) { if(i<4) tr.classList.add('zone-cl'); else if(i===4) tr.classList.add('zone-el'); else if(i>=17) tr.classList.add('zone-rel'); }
        else if(pT.league===1 || pT.league===2) { if(i<2) tr.classList.add('zone-prom'); else if(i<6) tr.classList.add('zone-po'); else if(i>=21) tr.classList.add('zone-rel'); }
        else if(pT.league===3) { if(i<3) tr.classList.add('zone-prom'); else if(i<7) tr.classList.add('zone-po'); else if(i>=22) tr.classList.add('zone-rel'); }

        tr.innerHTML = `<td>${i+1}</td><td>${t.name}</td><td>${t.played}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td><td>${t.gd}</td><td><strong>${t.points}</strong></td>`;
        tbody.appendChild(tr);
    });
}

function endSeasonSequence() {
    let sumHtml = ``;
    for(let l=0; l<=3; l++) {
        let sorted = teams.filter(t=>t.league===l).sort((a,b)=>b.points-a.points||b.gd-a.gd||b.gf-a.gf);
        sumHtml += `<div class="season-block"><h3>${leaguesMeta.find(x=>x.id===l).name}</h3><p>🏆 Champions: <strong>${sorted[0].name}</strong></p>`;
        if(l>0 && l<3) { sumHtml += `<p>📈 Promoted: ${sorted[0].name}, ${sorted[1].name} (PO Winner Pending)</p>`; sorted[0].league--; sorted[1].league--; }
        if(l===3) { sumHtml += `<p>📈 Promoted: ${sorted[0].name}, ${sorted[1].name}, ${sorted[2].name}</p>`; sorted[0].league--; sorted[1].league--; sorted[2].league--; }
        if(l<3) { let rel = sorted.slice(-3); sumHtml += `<p>📉 Relegated: ${rel[0].name}, ${rel[1].name}, ${rel[2].name}</p>`; rel[0].league++; rel[1].league++; rel[2].league++; }
        if(l===3) { let rel = sorted.slice(-2); sumHtml += `<p>📉 Relegated to Non-League: ${rel[0].name}, ${rel[1].name}</p>`; rel[0].league++; rel[1].league++; let nl = teams.filter(t=>t.league===4).sort(()=>Math.random()-0.5).slice(0,2); sumHtml += `<p>♻️ Promoted to EFL: ${nl[0].name}, ${nl[1].name}</p>`; nl[0].league=3; nl[1].league=3; }
        sumHtml += `</div>`;
    }
    document.getElementById('season-summary-content').innerHTML = sumHtml;
    switchScreen('end-season');
    if(teams.find(t=>t.id===playerTeamId).league === 4) setTimeout(()=>switchScreen('game-over'), 3000);
}

function startNewSeason() { currentSeason++; teams.forEach(t=>{ t.played=0; t.w=0; t.d=0; t.l=0; t.gf=0; t.ga=0; t.gd=0; t.points=0; t.susp=0; }); generateTimeline(); updateHub(); switchScreen('hub'); }

document.getElementById('speed-slider').oninput = (e) => { document.getElementById('speed-label').innerText = e.target.value+"x"; tickerSpeed = 1000/(e.target.value*5); };

init();
