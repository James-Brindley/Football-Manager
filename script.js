// --- DATA SET ---
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

// --- STATE ---
let playerTeamId = null;
let currentWeek = 0;
let schedule = [];
let currentWeekResults = [];
let playerMatchData = null;
let tickerSpeed = 1000;
let tickerInterval = null;
let currentMinute = 0;
let currentExtraMinute = 0;
let isSecondHalf = false;

// --- INITIALIZATION ---
function init() {
    generateSchedule();
    renderTeamSelection();
    setupSettings();
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
        div.innerHTML = `
            <img src="${t.logo}" style="width:50px; margin-bottom:10px;">
            <div style="font-weight:800">${t.name}</div>
            <div class="stat-bar">ATT: ${t.att} MID: ${t.mid} DEF: ${t.def}</div>
        `;
        div.onclick = () => { playerTeamId = t.id; updateHub(); switchScreen('hub'); };
        list.appendChild(div);
    });
}

function setupSettings() {
    const slider = document.getElementById('speed-slider');
    const valLabel = document.getElementById('speed-val');
    slider.oninput = (e) => {
        let val = parseInt(e.target.value);
        valLabel.innerText = val + "x";
        tickerSpeed = 1000 / val;
        if (tickerInterval) { clearInterval(tickerInterval); runTicker(); }
    };
}

// --- HUB LOGIC ---
function updateHub() {
    const pTeam = teams.find(t => t.id === playerTeamId);
    document.getElementById('hub-my-team-name').innerText = pTeam.name;
    document.getElementById('hub-my-logo').src = pTeam.logo;
    document.getElementById('hub-gw-status').innerText = `Gameweek ${currentWeek + 1} of 38`;

    // Next Match
    const match = schedule[currentWeek].find(m => m.home === playerTeamId || m.away === playerTeamId);
    const h = teams.find(t => t.id === match.home);
    const a = teams.find(t => t.id === match.away);
    document.getElementById('hub-home-name').innerText = h.name;
    document.getElementById('hub-home-logo').src = h.logo;
    document.getElementById('hub-away-name').innerText = a.name;
    document.getElementById('hub-away-logo').src = a.logo;
}

// --- MATCH ENGINE ---
function simulateMatch(hId, aId) {
    let h = {...teams.find(t => t.id === hId)}, a = {...teams.find(t => t.id === aId)};
    let events = [], hG = 0, aG = 0, e1 = 0, e2 = 0;

    for (let min = 1; min <= 90; min++) {
        let hProb = 0.015 * (h.att / a.def) * (h.mid / a.mid) * 1.1;
        let aProb = 0.015 * (a.att / h.def) * (a.mid / h.mid);
        let roll = Math.random();

        if (roll < hProb) { 
            hG++; events.push({ min, type: 'Goal', teamName: h.name, isHome: true }); 
            if (min <= 45) e1++; else e2++;
        } else if (roll > 1 - aProb) { 
            aG++; events.push({ min, type: 'Goal', teamName: a.name, isHome: false }); 
            if (min <= 45) e1++; else e2++;
        } else if (Math.random() < 0.02) {
            let isHome = Math.random() > 0.5;
            events.push({ min, type: 'Yellow Card', teamName: isHome ? h.name : a.name, isHome });
            if (min <= 45) e1++; else e2++;
        }
    }
    return { hId, aId, hName: h.name, aName: a.name, hG, aG, events, h1Extra: Math.max(1, e1), h2Extra: Math.max(1, e2) };
}

function runTicker() { tickerInterval = setInterval(tick, tickerSpeed); }

function tick() {
    let limit = isSecondHalf ? 90 : 45;
    let extraLimit = isSecondHalf ? playerMatchData.h2Extra : playerMatchData.h1Extra;

    if (currentMinute < limit) {
        currentMinute++;
    } else if (currentExtraMinute < extraLimit) {
        currentExtraMinute++;
        document.getElementById('extra-time-display').innerText = `+${currentExtraMinute}`;
    } else {
        clearInterval(tickerInterval);
        if (!isSecondHalf) {
            logEvent("⏸️ HALF TIME. Returning in 3s...");
            setTimeout(() => {
                isSecondHalf = true; currentExtraMinute = 0;
                document.getElementById('extra-time-display').innerText = '';
                runTicker();
            }, 3000);
        } else {
            logEvent("🏁 FULL TIME.");
            document.getElementById('btn-return-hub').classList.add('hidden'); // Logic to force user to see report
            finishMatch();
        }
        return;
    }

    document.getElementById('match-clock').innerText = currentMinute;
    let dispMin = currentExtraMinute > 0 ? limit : currentMinute;
    let evts = playerMatchData.events.filter(e => e.min === dispMin && currentExtraMinute === 0);
    if (evts.length > 0) handleEvents(evts);
}

function handleEvents(evts) {
    clearInterval(tickerInterval);
    evts.forEach(e => {
        logEvent(`${e.min}': ${e.type} - ${e.teamName}`);
        showEventAlert(e.type, e.type === 'Goal' ? '#10b981' : '#fbbf24');
        updateLiveScore();
    });
    setTimeout(() => {
        document.getElementById('match-event-alert').classList.add('hidden');
        runTicker();
    }, 1500);
}

function finishMatch() {
    setTimeout(() => {
        processWeek();
        renderPostMatch();
        switchScreen('postMatch');
    }, 2000);
}

// --- UTILS ---
function switchScreen(n) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(`screen-${n}`).classList.remove('hidden');
}

function logEvent(t) {
    const li = document.createElement('li'); li.innerText = t;
    document.getElementById('event-log').prepend(li);
}

function showEventAlert(t, c) {
    const a = document.getElementById('match-event-alert');
    a.innerText = t; a.style.backgroundColor = c; a.classList.remove('hidden');
}

function updateLiveScore() {
    let hG = playerMatchData.events.filter(e => e.min <= currentMinute && e.type === 'Goal' && e.isHome).length;
    let aG = playerMatchData.events.filter(e => e.min <= currentMinute && e.type === 'Goal' && !e.isHome).length;
    document.getElementById('match-score').innerText = `${hG} - ${aG}`;
}

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
    const tbody = document.getElementById('league-table-body');
    tbody.innerHTML = '';
    teams.forEach((t, i) => {
        let tr = document.createElement('tr');
        if (t.id === playerTeamId) tr.className = 'player-team';
        tr.innerHTML = `<td>${i+1}</td><td>${t.name}</td><td>${t.played}</td><td>${t.gd}</td><td><strong>${t.points}</strong></td>`;
        tbody.appendChild(tr);
    });

    const resList = document.getElementById('gw-results');
    resList.innerHTML = '';
    currentWeekResults.forEach(r => {
        let li = document.createElement('li');
        li.innerHTML = `${r.hName} <b>${r.hG} - ${r.aG}</b> ${r.aName}`;
        resList.appendChild(li);
    });
}

// Navigation triggers
document.getElementById('btn-go-to-prematch').onclick = () => {
    const match = schedule[currentWeek].find(m => m.home === playerTeamId || m.away === playerTeamId);
    const h = teams.find(t => t.id === match.home), a = teams.find(t => t.id === match.away);
    document.getElementById('i-h-logo').src = h.logo;
    document.getElementById('i-a-logo').src = a.logo;
    document.querySelector('#screen-pre-match h3').innerText = `${h.name} vs ${a.name}`;
    switchScreen('preMatch');
};

document.getElementById('btn-start-match').onclick = () => {
    currentWeekResults = schedule[currentWeek].map(m => simulateMatch(m.home, m.away));
    playerMatchData = currentWeekResults.find(m => m.hId === playerTeamId || m.aId === playerTeamId);
    document.getElementById('m-h-name').innerText = playerMatchData.hName;
    document.getElementById('m-a-name').innerText = playerMatchData.aName;
    document.getElementById('m-h-logo').src = teams.find(t => t.name === playerMatchData.hName).logo;
    document.getElementById('m-a-logo').src = teams.find(t => t.name === playerMatchData.aName).logo;
    currentMinute = 0; currentExtraMinute = 0; isSecondHalf = false;
    document.getElementById('event-log').innerHTML = '';
    switchScreen('match');
    runTicker();
};

document.getElementById('btn-return-hub').onclick = () => {
    currentWeek++;
    updateHub();
    switchScreen('hub');
};

// Calendar Logic
document.getElementById('btn-view-calendar').onclick = () => document.getElementById('calendar-overlay').classList.remove('hidden');
function closeCalendar() { document.getElementById('calendar-overlay').classList.add('hidden'); }

init();
