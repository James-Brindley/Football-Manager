// --- 1. 24/25 PREMIER LEAGUE DATA ---
const teamsData = [
    { name: "Man City", att: 94, mid: 92, def: 88, color: "#6CABDD" },
    { name: "Arsenal", att: 90, mid: 91, def: 92, color: "#EF0107" },
    { name: "Liverpool", att: 92, mid: 88, def: 86, color: "#C8102E" },
    { name: "Aston Villa", att: 84, mid: 83, def: 81, color: "#95BFE5" },
    { name: "Tottenham", att: 86, mid: 84, def: 80, color: "#132257" },
    { name: "Chelsea", att: 85, mid: 84, def: 81, color: "#034694" },
    { name: "Newcastle", att: 83, mid: 82, def: 80, color: "#241F20" },
    { name: "Man United", att: 81, mid: 82, def: 80, color: "#DA291C" },
    { name: "West Ham", att: 79, mid: 78, def: 77, color: "#7A263A" },
    { name: "Brighton", att: 80, mid: 81, def: 78, color: "#0057B8" },
    { name: "Bournemouth", att: 77, mid: 75, def: 74, color: "#B50E12" },
    { name: "Crystal Palace", att: 78, mid: 76, def: 77, color: "#1B458F" },
    { name: "Wolves", att: 75, mid: 76, def: 74, color: "#FDB913" },
    { name: "Fulham", att: 76, mid: 77, def: 75, color: "#FFFFFF" },
    { name: "Everton", att: 72, mid: 74, def: 77, color: "#003399" },
    { name: "Brentford", att: 75, mid: 74, def: 73, color: "#E30613" },
    { name: "Nott'm Forest", att: 74, mid: 73, def: 74, color: "#DD0000" },
    { name: "Leicester", att: 73, mid: 72, def: 71, color: "#003090" },
    { name: "Ipswich", att: 71, mid: 70, def: 69, color: "#0000FF" },
    { name: "Southampton", att: 70, mid: 71, def: 70, color: "#D71920" }
];

let teams = teamsData.map((t, i) => ({
    ...t, id: i, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, points: 0,
    logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=${t.color.replace('#','')}&color=fff&bold=true`
}));

// --- 2. STATE ---
let playerTeamId = null;
let currentWeek = 0;
let schedule = [];
let currentWeekResults = [];
let playerMatchData = null;
let currentMinute = 0;
let tickerSpeed = 1000;
let tickerInterval = null;

function init() {
    generateSchedule();
    renderTeamSelection();
}

function generateSchedule() {
    let ids = teams.map(t => t.id);
    for (let round = 0; round < 19; round++) {
        let roundMatches = [];
        for (let i = 0; i < 10; i++) { roundMatches.push({ home: ids[i], away: ids[19 - i] }); }
        schedule.push(roundMatches);
        ids.splice(1, 0, ids.pop());
    }
    let reverse = schedule.map(r => r.map(m => ({ home: m.away, away: m.home })));
    schedule = schedule.concat(reverse);
}

function renderTeamSelection() {
    const list = document.getElementById('team-list');
    teams.forEach(t => {
        const div = document.createElement('div');
        div.className = 'team-card';
        div.innerHTML = `<img src="${t.logo}" style="width:40px; margin-bottom:5px;"><br><strong>${t.name}</strong><br><small>A:${t.att} M:${t.mid} D:${t.def}</small>`;
        div.onclick = () => { playerTeamId = t.id; switchScreen('preMatch'); setupPreMatch(); };
        list.appendChild(div);
    });
}

// --- 3. SIMULATION LOGIC ---
function simulateMatch(hId, aId) {
    let h = {...teams.find(t => t.id === hId)};
    let a = {...teams.find(t => t.id === aId)};
    let events = [];
    let hG = 0, aG = 0;

    for (let min = 1; min <= 90; min++) {
        // Dynamic Probabilities (re-calculated every minute based on current stats)
        let hProb = 0.015 * (h.att / a.def) * (h.mid / a.mid) * 1.1;
        let aProb = 0.015 * (a.att / h.def) * (a.mid / h.mid);

        let roll = Math.random();
        
        // 1. Check for Goals
        if (roll < hProb) { hG++; events.push({ min, type: 'Goal', teamName: h.name, isHome: true }); }
        else if (roll > 1 - aProb) { aG++; events.push({ min, type: 'Goal', teamName: a.name, isHome: false }); }
        
        // 2. Check for Cards
        else if (Math.random() < 0.018) {
            let isHome = Math.random() > 0.5;
            let target = isHome ? h : a;
            let isRed = Math.random() < 0.15; // 15% of cards are red

            if (isRed) {
                target.att -= 12; target.mid -= 12; target.def -= 12;
                events.push({ min, type: 'Red Card', teamName: target.name, isHome });
                // Penalty Chance after a Red Card
                if (Math.random() < 0.4) {
                    let scoringTeam = isHome ? a : h;
                    let isHomeScoring = !isHome;
                    if (isHomeScoring) hG++; else aG++;
                    events.push({ min, type: 'Penalty Goal', teamName: scoringTeam.name, isHome: isHomeScoring });
                }
            } else {
                // Yellow Card: Reduce one random stat by 2
                let stats = ['att', 'mid', 'def'];
                let chosen = stats[Math.floor(Math.random() * 3)];
                target[chosen] -= 2;
                events.push({ min, type: 'Yellow Card', teamName: target.name, isHome });
                // Freekick Chance after a Yellow
                if (Math.random() < 0.1) {
                    let scoringTeam = isHome ? a : h;
                    let isHomeScoring = !isHome;
                    if (isHomeScoring) hG++; else aG++;
                    events.push({ min, type: 'Freekick Goal', teamName: scoringTeam.name, isHome: isHomeScoring });
                }
            }
        }
    }
    return { hId, aId, hName: h.name, aName: a.name, hG, aG, events };
}

// --- 4. UI HANDLERS ---
function setupPreMatch() {
    document.getElementById('gameweek-header').classList.remove('hidden');
    document.getElementById('gw-number').innerText = currentWeek + 1;
    const match = schedule[currentWeek].find(m => m.home === playerTeamId || m.away === playerTeamId);
    const h = teams.find(t => t.id === match.home);
    const a = teams.find(t => t.id === match.away);
    
    document.getElementById('intro-home-name').innerText = h.name;
    document.getElementById('intro-home-logo').src = h.logo;
    document.getElementById('intro-away-name').innerText = a.name;
    document.getElementById('intro-away-logo').src = a.logo;
}

document.getElementById('btn-start-match').onclick = () => {
    currentWeekResults = schedule[currentWeek].map(m => simulateMatch(m.home, m.away));
    playerMatchData = currentWeekResults.find(m => m.hId === playerTeamId || m.aId === playerTeamId);
    
    document.getElementById('match-home-team').innerText = playerMatchData.hName;
    document.getElementById('match-home-logo').src = teams.find(t => t.name === playerMatchData.hName).logo;
    document.getElementById('match-away-team').innerText = playerMatchData.aName;
    document.getElementById('match-away-logo').src = teams.find(t => t.name === playerMatchData.aName).logo;
    
    document.getElementById('match-score').innerText = "0 - 0";
    document.getElementById('event-log').innerHTML = '';
    document.getElementById('btn-continue-post').classList.add('hidden');
    currentMinute = 0;
    switchScreen('match');
    runTicker();
};

function runTicker() { tickerInterval = setInterval(tick, tickerSpeed); }

function tick() {
    currentMinute++;
    document.getElementById('match-clock').innerText = currentMinute;
    let evts = playerMatchData.events.filter(e => e.min === currentMinute);

    if (evts.length > 0) {
        clearInterval(tickerInterval);
        evts.forEach(e => {
            let icon = e.type.includes('Goal') ? '⚽' : (e.type === 'Red Card' ? '🟥' : '🟨');
            logEvent(`${icon} ${e.min}': ${e.type} - ${e.teamName}`);
            
            if (e.type.includes('Goal')) {
                showEventAlert(`${e.type.toUpperCase()}! ${e.teamName}`, '#10b981');
                updateScore();
            } else {
                showEventAlert(e.type, e.type === 'Red Card' ? '#ef4444' : '#eab308');
            }
        });
        setTimeout(() => {
            document.getElementById('match-event-alert').classList.add('hidden');
            if (currentMinute < 90) runTicker(); else finishMatch();
        }, 1500);
    } else if (currentMinute >= 90) {
        clearInterval(tickerInterval);
        finishMatch();
    }
}

function updateScore() {
    let hG = playerMatchData.events.filter(e => e.min <= currentMinute && e.type.includes('Goal') && e.isHome).length;
    let aG = playerMatchData.events.filter(e => e.min <= currentMinute && e.type.includes('Goal') && !e.isHome).length;
    document.getElementById('match-score').innerText = `${hG} - ${aG}`;
}

function finishMatch() {
    logEvent("🏁 90': Full Time.");
    document.getElementById('btn-continue-post').classList.remove('hidden');
}

// --- 5. WRAPPING UP ---
function processWeek() {
    currentWeekResults.forEach(res => {
        let h = teams.find(t => t.id === res.hId), a = teams.find(t => t.id === res.aId);
        h.played++; a.played++; h.gf += res.hG; h.ga += res.aG; a.gf += res.aG; a.ga += res.hG;
        h.gd = h.gf - h.ga; a.gd = a.gf - a.ga;
        if (res.hG > res.aG) { h.w++; h.points += 3; a.l++; }
        else if (res.aG > res.hG) { a.w++; a.points += 3; h.l++; }
        else { h.d++; a.d++; h.points++; a.points++; }
    });
    teams.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
}

function renderPostMatch() {
    const resList = document.getElementById('gw-results');
    resList.innerHTML = '';
    currentWeekResults.forEach(r => {
        let li = document.createElement('li');
        li.innerHTML = `<small>${r.hName}</small> <strong>${r.hG} - ${r.aG}</strong> <small>${r.aName}</small>`;
        if (r.hId === playerTeamId || r.aId === playerTeamId) li.style.color = '#3b82f6';
        resList.appendChild(li);
    });

    const tbody = document.getElementById('league-table-body');
    tbody.innerHTML = '';
    teams.forEach((t, i) => {
        let tr = document.createElement('tr');
        if (t.id === playerTeamId) tr.className = 'player-team';
        tr.innerHTML = `<td>${i+1}</td><td>${t.name}</td><td>${t.played}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td><td>${t.gd}</td><td>${t.points}</td>`;
        tbody.appendChild(tr);
    });
}

document.getElementById('btn-continue-post').onclick = () => { processWeek(); renderPostMatch(); switchScreen('postMatch'); };
document.getElementById('btn-next-week').onclick = () => { currentWeek++; setupPreMatch(); switchScreen('preMatch'); };

function logEvent(txt) { 
    const li = document.createElement('li'); li.innerText = txt; 
    const log = document.getElementById('event-log'); log.prepend(li); 
}
function showEventAlert(txt, col) { 
    const a = document.getElementById('match-event-alert'); 
    a.innerText = txt; a.style.backgroundColor = col; a.classList.remove('hidden'); 
}
function switchScreen(n) { 
    const s = { selection: 'screen-selection', preMatch: 'screen-pre-match', match: 'screen-match', postMatch: 'screen-post-match' };
    Object.values(s).forEach(id => document.getElementById(id).classList.add('hidden'));
    document.getElementById(s[n]).classList.remove('hidden');
}

document.querySelectorAll('.speed-btn').forEach(b => {
    b.onclick = (e) => {
        document.querySelectorAll('.speed-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        tickerSpeed = parseInt(e.target.dataset.speed);
        if (tickerInterval) { clearInterval(tickerInterval); runTicker(); }
    };
});

init();
