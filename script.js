// --- DATA SET & PROCEDURAL GENERATION ---
const leaguesMeta = [
    { id: 0, name: "Premier League", size: 20 },
    { id: 1, name: "Championship", size: 24 },
    { id: 2, name: "League One", size: 24 },
    { id: 3, name: "League Two", size: 24 },
    { id: 4, name: "Non-League Bank", size: 36 } // Used for Cups & Promotion
];

const teamDataRaw = [
    // Premier League (Exact stats provided)
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
    
    // EFL Procedural Names
    ...["Leeds","Burnley","Luton","Sheff Utd","West Brom","Norwich","Hull","Middlesbrough","Coventry","Preston","Bristol City","Cardiff","Millwall","Swansea","Watford","Sunderland","Stoke","QPR","Blackburn","Sheff Wed","Plymouth","Portsmouth","Derby","Oxford Utd"].map(n => ({name: n, c: "#111", l: 1, base: 73})),
    ...["Bolton","Peterborough","Barnsley","Lincoln","Blackpool","Stevenage","Wigan","Charlton","Reading","Bristol R","Leyton O","Wycombe","Exeter","Northampton","Burton","Cambridge","Shrewsbury","Stockport","Wrexham","Mansfield","Crawley","Rotherham","Huddersfield","Birmingham"].map(n => ({name: n, c: "#222", l: 2, base: 65})),
    ...["MK Dons","Doncaster","Crewe","Barrow","Bradford","Wimbledon","Walsall","Gillingham","Harrogate","Notts Co","Tranmere","Accrington","Newport","Swindon","Salford","Grimsby","Colchester","Chesterfield","Bromley","Port Vale","Fleetwood","Carlisle","Cheltenham","Morecambe"].map(n => ({name: n, c: "#333", l: 3, base: 58})),
    ...["Barnet","Altrincham","Solihull","Gateshead","Halifax","Aldershot","Southend","Oldham","Rochdale","York","Hartlepool","Eastleigh","Dagenham","Wealdstone","Woking","Ebbsfleet","Fylde","Kidderminster","Boreham W","Dorking","Yeovil","Scunthorpe","Torquay","Chester","Hereford","Boston","King's Lynn","Blyth","Spennymoor","Chorley","Brackley","Farsley","Curzon","Southport","Gloucester","Darlington"].map(n => ({name: n, c: "#444", l: 4, base: 50}))
];

let teams = [];
let playerTeamId = null;
let currentSeason = 2024;
let currentDateIndex = 0; // Steps through the master timeline

// The Master Schedule for the current season
let fixtures = []; 

// Speed Settings
let tickerSpeed = 200; // Base 5x (1x label on slider)
let tickerInterval = null;

// Match state
let isSecondHalf = false;
let currentMinute = 0;
let extraMin = 0;
let maxExtraThisHalf = 0;
let matchEvents = [];
let currentMatchObj = null;

const goalPhrases = ["Absolute screamer!", "Cool finish.", "Brilliant team goal!", "Tapped in from close range.", "What a header!"];
const penPhrases = ["Confidently dispatched from the spot!", "Sends the keeper the wrong way.", "Smashes the penalty home!"];
const fkPhrases = ["Curled beautifully into the top corner!", "What a free kick!", "Bends it around the wall!"];

function init() {
    buildTeams();
    renderLeagueSelection();
}

function buildTeams() {
    teams = teamDataRaw.map((t, i) => {
        let att = t.att || Math.floor(t.base + Math.random()*8);
        let mid = t.mid || Math.floor(t.base + Math.random()*8);
        let def = t.def || Math.floor(t.base + Math.random()*8);
        return {
            id: i, name: t.name, color: t.c, league: t.l,
            att, mid, def,
            played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, points: 0,
            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=${t.c.replace('#','')}&color=fff&bold=true`
        };
    });
}

function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(`screen-${id}`).classList.remove('hidden');
    if (id === 'standings') renderTable();
    if (id === 'calendar') renderCalendar();
}

function renderLeagueSelection() {
    const el = document.getElementById('league-list');
    el.innerHTML = "";
    leaguesMeta.slice(0, 4).forEach(l => {
        const div = document.createElement('div');
        div.className = 'league-card';
        div.innerHTML = `<h3>${l.name}</h3><p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">${l.size} Teams</p>`;
        div.onclick = () => renderTeamSelection(l.id);
        el.appendChild(div);
    });
    switchScreen('league-select');
}

function renderTeamSelection(leagueId) {
    document.getElementById('sel-season-label').innerText = `${currentSeason}/${(currentSeason+1).toString().slice(-2)}`;
    const el = document.getElementById('team-list');
    el.innerHTML = "";
    teams.filter(t => t.league === leagueId).forEach(t => {
        const div = document.createElement('div');
        div.className = 'team-card';
        div.innerHTML = `<img src="${t.logo}"><h4>${t.name}</h4><div class="stats">A:${t.att} M:${t.mid} D:${t.def}</div>`;
        div.onclick = () => { 
            playerTeamId = t.id; 
            generateSeasonSchedule();
            updateHub(); 
            switchScreen('hub'); 
        };
        el.appendChild(div);
    });
    switchScreen('selection');
}

// --- CALENDAR & SCHEDULING ENGINE ---

// Generates timeline of exactly 60 blocks (0 to 59). Approx 3-4 days per block.
function generateSeasonSchedule() {
    fixtures = [];
    currentDateIndex = 0;
    
    // 1. Generate League Round Robins
    leaguesMeta.slice(0, 4).forEach(l => {
        let leagueTeams = teams.filter(t => t.league === l.id).map(t => t.id);
        let isPrem = l.id === 0;
        let rounds = isPrem ? 38 : 46;
        
        let rr = buildRoundRobin(leagueTeams);
        
        // Map rounds to chronological dates. EFL plays 46 dates, Prem skips 8 midweeks.
        let eflDates = [0,1,2,4,5,6,8,9,10,12,13,14,16,17,18,21,22,23,24,25,27,28,29,31,32,33,34,36,37,38,41,42,43,44,45,46,47,49,50,51,53,54,55,57,58,59];
        let premDates = [0,2,5,8,10,13,16,18,21,23,25,28,31,33,36,38,41,43,45,47,49,50,51,53,54,55,56,57,58,59].slice(0, 38); 
        // Note: Real logic would strictly map exactly 38. The slice ensures we only take 38 dates for Prem.
        
        rr.forEach((roundMatches, rIdx) => {
            let dIndex = isPrem ? premDates[rIdx] : eflDates[rIdx];
            if(dIndex === undefined) dIndex = 59; // Fallback
            
            roundMatches.forEach(m => {
                fixtures.push({
                    id: `L_${l.id}_${rIdx}_${m.h}_${m.a}`, comp: 'League', title: `Matchday ${rIdx+1}`,
                    dateIndex: dIndex, h: m.h, a: m.a, played: false, hG: 0, aG: 0
                });
            });
        });
    });

    // 2. Setup Cup Draws (Round 1)
    // Carabao Cup: All 92 pro teams. Round 1 Date Index: 3
    let carabaoTeams = teams.filter(t => t.league <= 3).map(t => t.id);
    generateCupFixtures(carabaoTeams, 'Carabao Cup', 'Round 1', 3);

    // FA Cup: 92 pro teams + 36 non-league = 128 teams. Round 1 Date Index: 11
    let faTeams = teams.map(t => t.id);
    generateCupFixtures(faTeams, 'FA Cup', 'Round 1', 11);
}

function buildRoundRobin(ids) {
    let arr = [...ids];
    let rounds = [];
    if (arr.length % 2 !== 0) arr.push(null);
    let n = arr.length;
    for (let r = 0; r < n - 1; r++) {
        let matches = [];
        for (let i = 0; i < n / 2; i++) {
            if (arr[i] !== null && arr[n - 1 - i] !== null) {
                matches.push({ h: arr[i], a: arr[n - 1 - i] });
            }
        }
        rounds.push(matches);
        arr.splice(1, 0, arr.pop());
    }
    // Reverse for second half of season
    let rev = rounds.map(r => r.map(m => ({ h: m.a, a: m.h })));
    return rounds.concat(rev);
}

function generateCupFixtures(teamIds, comp, roundName, dateIndex) {
    let shuffled = [...teamIds].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffled.length; i += 2) {
        if(shuffled[i+1] !== undefined) {
            fixtures.push({
                id: `C_${comp}_${roundName}_${i}`, comp: comp, title: roundName,
                dateIndex: dateIndex, h: shuffled[i], a: shuffled[i+1], played: false, hG: 0, aG: 0
            });
        }
    }
}

function getDateString(dIndex) {
    let start = new Date(currentSeason, 7, 10); // Aug 10
    start.setDate(start.getDate() + (dIndex * 4)); // Approx 4 days per index
    return start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// --- GAME LOOP ---

function updateHub() {
    const t = teams.find(x => x.id === playerTeamId);
    document.getElementById('hub-name').innerText = t.name;
    document.getElementById('hub-logo').src = t.logo;
    document.getElementById('hub-stats').innerText = `ATT: ${t.att} | MID: ${t.mid} | DEF: ${t.def}`;
    document.getElementById('hub-season').innerText = `Season ${currentSeason}/${(currentSeason+1).toString().slice(-2)}`;
    
    let next = fixtures.find(f => !f.played && (f.h === playerTeamId || f.a === playerTeamId));
    if (next) {
        let oppId = next.h === playerTeamId ? next.a : next.h;
        let opp = teams.find(x => x.id === oppId);
        document.getElementById('hub-next-comp').innerText = `${next.comp.toUpperCase()} - ${next.title.toUpperCase()}`;
        document.getElementById('hub-next-date').innerText = getDateString(next.dateIndex);
        document.getElementById('hub-next-opp').innerText = `vs ${opp.name} (${next.h === playerTeamId ? 'H' : 'A'})`;
    } else {
        document.getElementById('hub-next-comp').innerText = "SEASON COMPLETE";
        document.getElementById('hub-next-date').innerText = "";
        document.getElementById('hub-next-opp').innerText = "Pending Transition";
    }
}

function goToPreMatch() {
    // 1. Sim all matches that happen BEFORE the player's next match date
    let nextMatch = fixtures.find(f => !f.played && (f.h === playerTeamId || f.a === playerTeamId));
    
    if (!nextMatch) {
        endSeasonSequence();
        return;
    }

    while (currentDateIndex < nextMatch.dateIndex) {
        processDate(currentDateIndex);
        currentDateIndex++;
    }

    // 2. Setup Player Match UI
    currentMatchObj = nextMatch;
    const h = teams.find(x => x.id === nextMatch.h), a = teams.find(x => x.id === nextMatch.a);
    
    document.getElementById('pre-comp-title').innerText = `${nextMatch.comp} - ${nextMatch.title}`;
    document.getElementById('pre-date-title').innerText = getDateString(nextMatch.dateIndex);
    
    document.getElementById('pre-h-logo').src = h.logo;
    document.getElementById('pre-h-name').innerText = h.name;
    document.getElementById('pre-h-stats').innerText = `A:${h.att} M:${h.mid} D:${h.def}`;
    
    document.getElementById('pre-a-logo').src = a.logo;
    document.getElementById('pre-a-name').innerText = a.name;
    document.getElementById('pre-a-stats').innerText = `A:${a.att} M:${a.mid} D:${a.def}`;
    
    switchScreen('pre-match');
}

function processDate(dIndex) {
    let todaysMatches = fixtures.filter(f => f.dateIndex === dIndex && !f.played);
    todaysMatches.forEach(quickSimMatch);
    
    // Cup Progressions: If today was a cup date, draw the next round
    if (todaysMatches.length > 0) {
        let sample = todaysMatches[0];
        if (sample.comp === 'Carabao Cup' || sample.comp === 'FA Cup') {
            let winners = todaysMatches.map(m => m.hG > m.aG ? m.h : m.a);
            
            // Determine next round info
            let nextRounds = { 'Round 1': 'Round 2', 'Round 2': 'Round 3', 'Round 3': 'Round 4', 'Round 4': 'Quarter-Final', 'Quarter-Final': 'Semi-Final', 'Semi-Final': 'Final', 'Final': null };
            let nextName = nextRounds[sample.title];
            let nextDate = dIndex + 7; // Approx next cup date
            
            if (nextName && winners.length > 1) {
                generateCupFixtures(winners, sample.comp, nextName, nextDate);
            }
        }
    }
}

function quickSimMatch(m) {
    let h = teams.find(t => t.id === m.h);
    let a = teams.find(t => t.id === m.a);
    let evs = generateMatchEvents(h, a);
    
    m.hG = evs.filter(x => x.type.includes('GOAL') && x.isHome).length;
    m.aG = evs.filter(x => x.type.includes('GOAL') && !x.isHome).length;
    
    // Cup tiebreaker (Simple Pen Shootout abstraction)
    if(m.comp !== 'League' && m.hG === m.aG) {
        if(Math.random() > 0.5) m.hG++; else m.aG++;
    }
    
    m.played = true;
    updateLeagueTable(m);
}

function updateLeagueTable(m) {
    if (m.comp !== 'League') return;
    let h = teams.find(t => t.id === m.h);
    let a = teams.find(t => t.id === m.a);
    h.played++; a.played++;
    h.gf += m.hG; h.ga += m.aG; h.gd = h.gf - h.ga;
    a.gf += m.aG; a.ga += m.hG; a.gd = a.gf - a.ga;
    if(m.hG > m.aG) { h.w++; h.points += 3; a.l++; }
    else if(m.hG < m.aG) { a.w++; a.points += 3; h.l++; }
    else { h.d++; a.d++; h.points++; a.points++; }
}

// --- PLAYER MATCH ENGINE ---

document.getElementById('btn-start-match').onclick = () => {
    const h = teams.find(x => x.id === currentMatchObj.h), a = teams.find(x => x.id === currentMatchObj.a);
    setupMatchUI(h, a);
    matchEvents = generateMatchEvents(h, a);
    switchScreen('match');
    runTicker();
};

function skipMatch() {
    const h = teams.find(x => x.id === currentMatchObj.h), a = teams.find(x => x.id === currentMatchObj.a);
    setupMatchUI(h, a);
    matchEvents = generateMatchEvents(h, a);
    
    let hG = 0, aG = 0;
    matchEvents.forEach(ev => {
        let icon = ev.type.includes('GOAL') ? '⚽' : (ev.type === 'Red Card' ? '🟥' : '🟨');
        let logTxt = `${icon} <b>${ev.min}'</b> - ${ev.type} for ${ev.team}! ${ev.txt}`;
        logEvent(logTxt, ev.type.includes('GOAL'), ev.type === 'Red Card');
        if (ev.type.includes('GOAL')) { if (ev.isHome) hG++; else aG++; }
    });

    logEvent(`🏁 FULL TIME (Quick Sim).`);
    document.getElementById('m-score').innerText = `${hG} - ${aG}`;
    document.getElementById('m-clock').innerText = "90";
    document.getElementById('btn-finish-match').classList.remove('hidden');
    currentMinute = 90; isSecondHalf = true;
    switchScreen('match');
}

function setupMatchUI(h, a) {
    document.getElementById('m-h-name').innerText = h.name; document.getElementById('m-a-name').innerText = a.name;
    document.getElementById('m-h-logo').src = h.logo; document.getElementById('m-a-logo').src = a.logo;
    document.getElementById('m-score').innerText = "0 - 0"; document.getElementById('m-events').innerHTML = "";
    document.getElementById('btn-finish-match').classList.add('hidden');
    currentMinute = 0; extraMin = 0; isSecondHalf = false;
    document.getElementById('m-extra').innerText = "";
}

function generateMatchEvents(h, a) {
    let events = [];
    let h1Events = 0, h2Events = 0;

    for (let i = 1; i <= 90; i++) {
        let hProb = 0.015 * (h.att/a.def) * 1.05; 
        let aProb = 0.015 * (a.att/h.def);
        let r = Math.random();
        
        let evt = null;
        if (r < hProb) {
            let type = 'GOAL'; let txt = goalPhrases[Math.floor(Math.random()*goalPhrases.length)];
            if(Math.random()<0.1) { type = 'Penalty GOAL'; txt = penPhrases[Math.floor(Math.random()*penPhrases.length)]; }
            else if(Math.random()<0.05) { type = 'Free Kick GOAL'; txt = fkPhrases[Math.floor(Math.random()*fkPhrases.length)]; }
            evt = { min: i, type, team: h.name, isHome: true, txt };
        }
        else if (r > 1 - aProb) {
            let type = 'GOAL'; let txt = goalPhrases[Math.floor(Math.random()*goalPhrases.length)];
            if(Math.random()<0.1) { type = 'Penalty GOAL'; txt = penPhrases[Math.floor(Math.random()*penPhrases.length)]; }
            else if(Math.random()<0.05) { type = 'Free Kick GOAL'; txt = fkPhrases[Math.floor(Math.random()*fkPhrases.length)]; }
            evt = { min: i, type, team: a.name, isHome: false, txt };
        }
        else if (Math.random() < 0.003) evt = { min: i, type: 'Red Card', team: Math.random() > 0.5 ? h.name : a.name, txt: 'Sent off! Down to 10 men.' };
        else if (Math.random() < 0.02) evt = { min: i, type: 'Yellow Card', team: Math.random() > 0.5 ? h.name : a.name, txt: 'Late challenge.' };
        
        if (evt) { events.push(evt); if (i <= 45) h1Events++; else h2Events++; }
    }
    events.h1Extra = Math.max(1, Math.ceil(h1Events * 0.5));
    events.h2Extra = Math.max(2, Math.ceil(h2Events * 0.5));
    return events;
}

function runTicker() { 
    maxExtraThisHalf = isSecondHalf ? matchEvents.h2Extra : matchEvents.h1Extra;
    tickerInterval = setInterval(tick, tickerSpeed); 
}

function tick() {
    let limit = isSecondHalf ? 90 : 45;
    if (currentMinute < limit) currentMinute++;
    else if (extraMin < maxExtraThisHalf) { 
        extraMin++; document.getElementById('m-extra').innerText = `+${extraMin}`;
    } else {
        clearInterval(tickerInterval);
        if (!isSecondHalf) {
            logEvent(`⏱️ HALF TIME.`);
            setTimeout(() => { isSecondHalf = true; extraMin = 0; document.getElementById('m-extra').innerText = ""; runTicker(); }, 1500);
        } else {
            logEvent(`🏁 FULL TIME.`);
            document.getElementById('btn-finish-match').classList.remove('hidden');
        }
        return;
    }

    document.getElementById('m-clock').innerText = currentMinute;
    let ev = matchEvents.find(x => x.min === currentMinute && extraMin === 0);
    if (ev) {
        clearInterval(tickerInterval);
        let icon = ev.type.includes('GOAL') ? '⚽' : (ev.type === 'Red Card' ? '🟥' : '🟨');
        let logTxt = `${icon} <b>${ev.min}'</b> - ${ev.type} for ${ev.team}! ${ev.txt}`;
        logEvent(logTxt, ev.type.includes('GOAL'), ev.type === 'Red Card');
        
        if (ev.type.includes('GOAL')) { updateScore(); flashEventAlert(`GOAL ${ev.team}!`, 'var(--goal-color)'); } 
        else if (ev.type === 'Red Card') flashEventAlert('RED CARD', 'var(--card-red)');
        else flashEventAlert('YELLOW CARD', 'var(--card-yellow)');
        
        setTimeout(runTicker, tickerSpeed * 2); 
    }
}

function updateScore() {
    let hG = matchEvents.filter(x => x.min <= currentMinute && x.type.includes('GOAL') && x.isHome).length;
    let aG = matchEvents.filter(x => x.min <= currentMinute && x.type.includes('GOAL') && !x.isHome).length;
    document.getElementById('m-score').innerText = `${hG} - ${aG}`;
}

function flashEventAlert(text, bgColor) {
    const alert = document.getElementById('m-alert');
    alert.innerText = text; alert.style.backgroundColor = bgColor; alert.classList.remove('hidden');
    setTimeout(() => alert.classList.add('hidden'), 1200);
}

function logEvent(html, isHighlight=false, isRed=false) {
    const li = document.createElement('li'); 
    li.innerHTML = html;
    if(isHighlight) li.className = 'highlight';
    if(isRed) li.classList.add('red-card');
    document.getElementById('m-events').prepend(li);
}

function finishPlayerMatch() {
    currentMatchObj.hG = matchEvents.filter(x => x.type.includes('GOAL') && x.isHome).length;
    currentMatchObj.aG = matchEvents.filter(x => x.type.includes('GOAL') && !x.isHome).length;
    
    if(currentMatchObj.comp !== 'League' && currentMatchObj.hG === currentMatchObj.aG) {
        if(Math.random() > 0.5) currentMatchObj.hG++; else currentMatchObj.aG++;
        alert(`Match went to Penalties! Won by ${currentMatchObj.hG > currentMatchObj.aG ? "Home Team" : "Away Team"}`);
    }
    
    currentMatchObj.played = true;
    updateLeagueTable(currentMatchObj);
    
    // Also sim the rest of the matches that happened on this exact Date Index
    let othersToday = fixtures.filter(f => f.dateIndex === currentMatchObj.dateIndex && !f.played);
    othersToday.forEach(quickSimMatch);
    
    // Process cup progression if needed
    processDate(currentMatchObj.dateIndex); // Re-run to handle draws if any
    
    renderPostMatch();
    switchScreen('post-match');
}

function renderPostMatch() {
    document.getElementById('post-date-title').innerText = getDateString(currentMatchObj.dateIndex);
    
    // Show results from this specific date
    const resultsEl = document.getElementById('post-gw-results');
    resultsEl.innerHTML = "";
    fixtures.filter(f => f.dateIndex === currentMatchObj.dateIndex).forEach(m => {
        const h = teams.find(x => x.id === m.h), a = teams.find(x => x.id === m.a);
        const div = document.createElement('div');
        div.className = 'fixture-row';
        div.innerHTML = `
            <div class="fixture-top"><span class="comp-badge">${m.comp}</span></div>
            <div class="fixture-teams">
                <span class="fixture-team">${h.name}</span>
                <span class="fixture-score">${m.hG} - ${m.aG}</span>
                <span class="fixture-team away">${a.name}</span>
            </div>
        `;
        if (m.h === playerTeamId || m.a === playerTeamId) div.style.borderLeft = "4px solid var(--accent)";
        resultsEl.appendChild(div);
    });

    // Render Mini Table for player's league
    const pTeam = teams.find(t => t.id === playerTeamId);
    const tbody = document.getElementById('post-table-body');
    tbody.innerHTML = "";
    const sorted = teams.filter(t => t.league === pTeam.league).sort((a,b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
    sorted.slice(0, 10).forEach((t, i) => { // Top 10 for mini table
        const tr = document.createElement('tr');
        if(t.id === playerTeamId) tr.className = "player-row";
        tr.innerHTML = `<td>${i+1}</td><td style="text-align: left; font-weight: bold;">${t.name}</td><td>${t.gd}</td><td><strong>${t.points}</strong></td>`;
        tbody.appendChild(tr);
    });
}

function advanceTimeline() {
    currentDateIndex++;
    let nextMatch = fixtures.find(f => !f.played && (f.h === playerTeamId || f.a === playerTeamId));
    if(!nextMatch && currentDateIndex > 60) {
        endSeasonSequence();
    } else {
        updateHub();
        switchScreen('hub');
    }
}

// --- STANDINGS & CALENDAR UI ---

function renderTable() {
    const pTeam = teams.find(t => t.id === playerTeamId);
    document.getElementById('standings-title').innerText = leaguesMeta.find(l => l.id === pTeam.league).name;
    
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = "";
    const sorted = teams.filter(t => t.league === pTeam.league).sort((a,b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
    
    sorted.forEach((t, i) => {
        const tr = document.createElement('tr');
        if(t.id === playerTeamId) tr.className = "player-row";
        tr.innerHTML = `
            <td>${i+1}</td><td>${t.name}</td><td>${t.played}</td>
            <td>${t.w}</td><td>${t.d}</td><td>${t.l}</td>
            <td>${t.gd}</td><td><strong>${t.points}</strong></td>
        `;
        tbody.appendChild(tr);
    });
}

function openCalendar() {
    document.getElementById('cal-filter').value = "All";
    renderCalendar();
    switchScreen('calendar');
}

function renderCalendar() {
    const filter = document.getElementById('cal-filter').value;
    const el = document.getElementById('calendar-list');
    el.innerHTML = "";
    
    // Get all fixtures involving player
    let playerFixtures = fixtures.filter(f => f.h === playerTeamId || f.a === playerTeamId);
    
    if(filter !== "All") playerFixtures = playerFixtures.filter(f => f.comp === filter);
    
    playerFixtures.sort((a,b) => a.dateIndex - b.dateIndex).forEach(m => {
        const h = teams.find(x => x.id === m.h), a = teams.find(x => x.id === m.a);
        const div = document.createElement('div');
        div.className = 'fixture-row';
        let scoreText = m.played ? `${m.hG} - ${m.aG}` : "VS";
        div.innerHTML = `
            <div class="fixture-top">
                <span class="comp-badge">${m.comp} - ${m.title}</span>
                <span class="fixture-date">${getDateString(m.dateIndex)}</span>
            </div>
            <div class="fixture-teams">
                <span class="fixture-team">${h.name}</span>
                <span class="fixture-score">${scoreText}</span>
                <span class="fixture-team away">${a.name}</span>
            </div>
        `;
        el.appendChild(div);
    });
}

// --- SEASON TRANSITION ---

function endSeasonSequence() {
    // Sim any remaining fixtures just in case
    fixtures.filter(f => !f.played).forEach(quickSimMatch);
    
    let pTeam = teams.find(t => t.id === playerTeamId);
    let summaryHtml = `<h3>${pTeam.name} - ${currentSeason}/${(currentSeason+1).toString().slice(-2)} Season</h3>`;
    
    // Process Leagues 0 to 3
    for (let l = 0; l <= 3; l++) {
        let sorted = teams.filter(t => t.league === l).sort((a,b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
        let leagueName = leaguesMeta.find(x => x.id === l).name;
        
        summaryHtml += `<div class="season-block"><h3>${leagueName}</h3>`;
        summaryHtml += `<p>🏆 Champions: <strong>${sorted[0].name}</strong></p>`;
        
        if (l > 0) { // Promoted
            summaryHtml += `<p>📈 Promoted: ${sorted[0].name}, ${sorted[1].name}, ${sorted[2].name}</p>`;
            sorted[0].league--; sorted[1].league--; sorted[2].league--;
        }
        if (l < 3) { // Relegated
            let rel = sorted.slice(-3);
            summaryHtml += `<p>📉 Relegated: ${rel[0].name}, ${rel[1].name}, ${rel[2].name}</p>`;
            rel[0].league++; rel[1].league++; rel[2].league++;
        } else { // League 2 Relegation
            let rel = sorted.slice(-2);
            summaryHtml += `<p>📉 Relegated to Non-League: ${rel[0].name}, ${rel[1].name}</p>`;
            rel[0].league++; rel[1].league++;
            
            // Promote 2 from Non-League
            let nl = teams.filter(t => t.league === 4).sort(() => Math.random() - 0.5).slice(0, 2);
            summaryHtml += `<p>📈 Promoted to EFL: ${nl[0].name}, ${nl[1].name}</p>`;
            nl[0].league = 3; nl[1].league = 3;
        }
        summaryHtml += `</div>`;
    }

    document.getElementById('season-summary-content').innerHTML = summaryHtml;
    switchScreen('end-season');
    
    // Check Game Over
    if (pTeam.league === 4) {
        setTimeout(() => switchScreen('game-over'), 3000); // Give them 3 seconds to read the bad news
    }
}

function startNewSeason() {
    currentSeason++;
    teams.forEach(t => { t.played = 0; t.w = 0; t.d = 0; t.l = 0; t.gf = 0; t.ga = 0; t.gd = 0; t.points = 0; });
    generateSeasonSchedule();
    updateHub();
    switchScreen('hub');
}

// Settings
const slider = document.getElementById('speed-slider');
slider.oninput = (e) => {
    let val = parseInt(e.target.value); // 1 to 10
    document.getElementById('speed-label').innerText = val + "x";
    tickerSpeed = 1000 / (val * 5); // Math logic remains unchanged (5x to 50x)
};

init();
