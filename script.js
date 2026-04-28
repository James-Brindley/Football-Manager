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

let playerTeamId = null;
let currentWeek = 0;
let schedule = [];
let tickerSpeed = 1000;
let tickerInterval = null;
let isSecondHalf = false;
let currentMinute = 0;
let extraMin = 0;
let matchEvents = [];
let viewCalendarWeek = 0;

function init() {
    generateSchedule();
    renderSelection();
    setupSettings();
}

function generateSchedule() {
    let ids = teams.map(t => t.id);
    for (let r = 0; r < 19; r++) {
        let matches = [];
        for (let i = 0; i < 10; i++) { matches.push({ h: ids[i], a: ids[19-i], played: false, hG: 0, aG: 0 }); }
        schedule.push(matches);
        ids.splice(1, 0, ids.pop());
    }
    let rev = schedule.map(r => r.map(m => ({ h: m.a, a: m.h, played: false, hG: 0, aG: 0 })));
    schedule = schedule.concat(rev);
}

function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(`screen-${id}`).classList.remove('hidden');
    if (id === 'standings') renderTable('table-body');
}

function renderSelection() {
    const el = document.getElementById('team-list');
    teams.forEach(t => {
        const div = document.createElement('div');
        div.className = 'team-card';
        div.innerHTML = `<img src="${t.logo}"><h4>${t.name}</h4><div class="stats">ATT:${t.att} MID:${t.mid} DEF:${t.def}</div>`;
        div.onclick = () => { playerTeamId = t.id; updateHub(); switchScreen('hub'); };
        el.appendChild(div);
    });
}

function updateHub() {
    const t = teams.find(x => x.id === playerTeamId);
    document.getElementById('hub-name').innerText = t.name;
    document.getElementById('hub-logo').src = t.logo;
    document.getElementById('hub-gw').innerText = `GW ${currentWeek + 1}`;
    const m = schedule[currentWeek].find(x => x.h === playerTeamId || x.a === playerTeamId);
    const opp = teams.find(x => x.id === (m.h === playerTeamId ? m.a : m.h));
    document.getElementById('hub-next-opp').innerText = `vs ${opp.name}`;
}

function goToPreMatch() {
    const m = schedule[currentWeek].find(x => x.h === playerTeamId || x.a === playerTeamId);
    const h = teams.find(x => x.id === m.h), a = teams.find(x => x.id === m.a);
    document.getElementById('pre-h-logo').src = h.logo;
    document.getElementById('pre-h-name').innerText = h.name;
    document.getElementById('pre-a-logo').src = a.logo;
    document.getElementById('pre-a-name').innerText = a.name;
    switchScreen('pre-match');
}

document.getElementById('btn-start-match').onclick = () => {
    const m = schedule[currentWeek].find(x => x.h === playerTeamId || x.a === playerTeamId);
    const h = teams.find(x => x.id === m.h), a = teams.find(x => x.id === m.a);
    document.getElementById('m-h-name').innerText = h.name;
    document.getElementById('m-a-name').innerText = a.name;
    document.getElementById('m-h-logo').src = h.logo;
    document.getElementById('m-a-logo').src = a.logo;
    document.getElementById('m-score').innerText = "0 - 0";
    document.getElementById('m-events').innerHTML = "";
    document.getElementById('btn-to-results').classList.add('hidden');
    
    currentMinute = 0; extraMin = 0; isSecondHalf = false;
    document.getElementById('m-extra').innerText = "";
    matchEvents = generateMatchEvents(h, a);
    switchScreen('match');
    runTicker();
};

function generateMatchEvents(h, a) {
    let events = [];
    for (let i = 1; i <= 90; i++) {
        let hP = 0.015 * (h.att/a.def); let aP = 0.015 * (a.att/h.def);
        if (Math.random() < hP) events.push({min: i, type: 'GOAL', team: h.name, isHome: true});
        else if (Math.random() > 1 - aP) events.push({min: i, type: 'GOAL', team: a.name, isHome: false});
    }
    return events;
}

function runTicker() { tickerInterval = setInterval(tick, tickerSpeed); }

function tick() {
    let limit = isSecondHalf ? 90 : 45;
    if (currentMinute < limit) { currentMinute++; }
    else if (extraMin < 3) { extraMin++; document.getElementById('m-extra').innerText = `+${extraMin}`; }
    else {
        clearInterval(tickerInterval);
        if (!isSecondHalf) {
            logEvent("⏸️ HALF TIME...");
            setTimeout(() => { isSecondHalf = true; extraMin = 0; document.getElementById('m-extra').innerText = ""; runTicker(); }, 2000);
        } else {
            logEvent("🏁 FULL TIME.");
            document.getElementById('btn-to-results').classList.remove('hidden');
        }
        return;
    }
    document.getElementById('m-clock').innerText = currentMinute;
    let ev = matchEvents.find(x => x.min === currentMinute && extraMin === 0);
    if (ev) {
        logEvent(`${ev.min}': GOAL! ${ev.team}`);
        updateScore();
    }
}

function updateScore() {
    let hG = matchEvents.filter(x => x.min <= currentMinute && x.type === 'GOAL' && x.isHome).length;
    let aG = matchEvents.filter(x => x.min <= currentMinute && x.type === 'GOAL' && !x.isHome).length;
    document.getElementById('m-score').innerText = `${hG} - ${aG}`;
}

function logEvent(txt) {
    const li = document.createElement('li'); li.innerText = txt;
    document.getElementById('m-events').prepend(li);
}

function finalizeWeek() {
    schedule[currentWeek].forEach(m => {
        const h = teams.find(x => x.id === m.h), a = teams.find(x => x.id === m.a);
        let hG, aG;
        if (m.h === playerTeamId || m.a === playerTeamId) {
            hG = matchEvents.filter(x => x.type === 'GOAL' && x.isHome).length;
            aG = matchEvents.filter(x => x.type === 'GOAL' && !x.isHome).length;
        } else {
            const evs = generateMatchEvents(h, a);
            hG = evs.filter(x => x.isHome).length; aG = evs.filter(x => !x.isHome).length;
        }
        m.played = true; m.hG = hG; m.aG = aG;
        updateStats(h, a, hG, aG);
    });
    renderPostMatch();
    currentWeek++;
    updateHub();
    switchScreen('post-match');
}

function updateStats(h, a, hG, aG) {
    h.played++; a.played++; h.gf += hG; h.ga += aG; a.gf += aG; a.ga += hG; h.gd = h.gf - h.ga; a.gd = a.gf - a.ga;
    if (hG > aG) { h.w++; h.points += 3; a.l++; }
    else if (aG > hG) { a.w++; a.points += 3; h.l++; }
    else { h.d++; a.d++; h.points++; a.points++; }
}

function renderPostMatch() {
    document.getElementById('post-match-title').innerText = `Gameweek ${currentWeek + 1} Results`;
    const resList = document.getElementById('post-gw-results');
    resList.innerHTML = "";
    schedule[currentWeek].forEach(m => {
        const h = teams.find(x => x.id === m.h), a = teams.find(x => x.id === m.a);
        const div = document.createElement('div'); div.className = 'fixture-row';
        div.innerHTML = `<span>${h.name}</span><span class="fixture-score">${m.hG} - ${m.aG}</span><span>${a.name}</span>`;
        if (h.id === playerTeamId || a.id === playerTeamId) div.style.borderLeft = "4px solid var(--accent)";
        resList.appendChild(div);
    });
    renderTable('post-table-body');
}

function renderTable(targetId) {
    const tbody = document.getElementById(targetId);
    tbody.innerHTML = "";
    const sorted = [...teams].sort((a,b) => b.points - a.points || b.gd - a.gd);
    sorted.forEach((t, i) => {
        const tr = document.createElement('tr');
        if (t.id === playerTeamId) tr.className = "player-row";
        tr.innerHTML = `<td>${i+1}</td><td>${t.name}</td><td>${t.played}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td><td>${t.gd}</td><td>${t.points}</td>`;
        tbody.appendChild(tr);
    });
}

function openCalendar() { viewCalendarWeek = currentWeek; renderCalendar(); switchScreen('calendar'); }

function changeCalendarWeek(dir) {
    viewCalendarWeek = Math.max(0, Math.min(37, viewCalendarWeek + dir));
    renderCalendar();
}

function renderCalendar() {
    document.getElementById('cal-gw-title').innerText = `Gameweek ${viewCalendarWeek + 1}`;
    const el = document.getElementById('calendar-list');
    el.innerHTML = "";
    schedule[viewCalendarWeek].forEach(m => {
        const h = teams.find(x => x.id === m.h), a = teams.find(x => x.id === m.a);
        const div = document.createElement('div'); div.className = 'fixture-row';
        let score = m.played ? `${m.hG} - ${m.aG}` : "VS";
        div.innerHTML = `<span>${h.name}</span><span class="fixture-score">${score}</span><span>${a.name}</span>`;
        el.appendChild(div);
    });
}

function setupSettings() {
    const slider = document.getElementById('speed-slider');
    slider.oninput = (e) => {
        tickerSpeed = 1000 / e.target.value;
        document.getElementById('speed-label').innerText = e.target.value + "x";
    };
}

init();
