// --- 1. DATA SETUP ---
const teamNames = [
    "London Red", "Manchester Blue", "Liverpool FC", "North London White", 
    "Manchester Red", "Newcastle FC", "Birmingham Villa", "Brighton FC", 
    "West Ham Utd", "Fulham FC", "Crystal Palace", "Wolverhampton", 
    "Nottingham F", "Bournemouth", "Everton FC", "Brentford", 
    "Leeds United", "Leicester City", "Southampton", "Ipswich Town"
];

// Generate 20 teams with random stats between 60 and 90
let teams = teamNames.map((name, index) => ({
    id: index,
    name: name,
    att: Math.floor(Math.random() * 30) + 60,
    mid: Math.floor(Math.random() * 30) + 60,
    def: Math.floor(Math.random() * 30) + 60,
    played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, points: 0
}));

// --- 2. GAME STATE ---
let playerTeamId = null;
let currentWeek = 0;
let schedule = []; 
let currentWeekResults = [];
let playerMatchData = null;

// Ticker variables
let currentMinute = 0;
let tickerSpeed = 1000; // 1 second per game minute
let tickerInterval = null;

// --- 3. DOM ELEMENTS ---
const screens = {
    selection: document.getElementById('screen-selection'),
    preMatch: document.getElementById('screen-pre-match'),
    match: document.getElementById('screen-match'),
    postMatch: document.getElementById('screen-post-match')
};

// --- 4. INITIALIZATION & SCHEDULING ---
function init() {
    generateSchedule();
    renderTeamSelection();
}

// Generate a full 38-game round robin schedule
function generateSchedule() {
    let ids = teams.map(t => t.id);
    let fixtures = [];
    
    for (let round = 0; round < 19; round++) {
        let roundMatches = [];
        for (let i = 0; i < 10; i++) {
            roundMatches.push({ home: ids[i], away: ids[19 - i] });
        }
        fixtures.push(roundMatches);
        // Rotate all elements except the first one
        ids.splice(1, 0, ids.pop());
    }
    
    // Create second half of the season (reverse fixtures)
    let reverseFixtures = fixtures.map(round => 
        round.map(match => ({ home: match.away, away: match.home }))
    );
    schedule = fixtures.concat(reverseFixtures);
}

// --- 5. UI: TEAM SELECTION ---
function renderTeamSelection() {
    const list = document.getElementById('team-list');
    teams.forEach(team => {
        const div = document.createElement('div');
        div.className = 'team-card';
        div.innerHTML = `
            <strong>${team.name}</strong>
            <div class="team-stats">ATT: ${team.att} | MID: ${team.mid} | DEF: ${team.def}</div>
        `;
        div.onclick = () => selectTeam(team.id);
        list.appendChild(div);
    });
}

function selectTeam(id) {
    playerTeamId = id;
    document.getElementById('gameweek-header').classList.remove('hidden');
    switchScreen('preMatch');
    setupPreMatch();
}

// --- 6. CORE SIMULATION ENGINE ---
// Simulates a single match based on stats
function simulateMatch(homeId, awayId) {
    let home = teams.find(t => t.id === homeId);
    let away = teams.find(t => t.id === awayId);
    
    let events = [];
    let homeGoals = 0, awayGoals = 0;

    // Base probability formulas adjusted by team stats + home advantage
    let homeGoalProb = 0.015 * (home.att / away.def) * (home.mid / away.mid) * 1.1; 
    let awayGoalProb = 0.015 * (away.att / home.def) * (away.mid / home.mid);

    for (let min = 1; min <= 90; min++) {
        let rand = Math.random();
        if (rand < homeGoalProb) {
            homeGoals++;
            events.push({ min: min, type: 'Goal', teamName: home.name, isHome: true });
        } else if (rand > 1 - awayGoalProb) {
            awayGoals++;
            events.push({ min: min, type: 'Goal', teamName: away.name, isHome: false });
        } else if (Math.random() < 0.015) { // 1.5% chance per minute for a card
            let cardTeam = Math.random() > 0.5 ? home.name : away.name;
            events.push({ min: min, type: 'Yellow Card', teamName: cardTeam });
        }
    }

    return { 
        homeId, awayId, homeName: home.name, awayName: away.name, 
        homeGoals, awayGoals, events 
    };
}

// --- 7. GAME LOOP & MATCH UI ---
function setupPreMatch() {
    document.getElementById('gw-number').innerText = currentWeek + 1;
    
    // Find player's match
    const myMatch = schedule[currentWeek].find(m => m.home === playerTeamId || m.away === playerTeamId);
    const homeTeam = teams.find(t => t.id === myMatch.home).name;
    const awayTeam = teams.find(t => t.id === myMatch.away).name;
    
    document.getElementById('next-fixture').innerText = `${homeTeam} vs ${awayTeam}`;
}

document.getElementById('btn-start-match').onclick = () => {
    // 1. Simulate entire gameweek silently behind the scenes
    currentWeekResults = schedule[currentWeek].map(match => simulateMatch(match.home, match.away));
    
    // 2. Extract the player's match to display in the ticker
    playerMatchData = currentWeekResults.find(m => m.homeId === playerTeamId || m.awayId === playerTeamId);
    
    // 3. Setup match UI
    document.getElementById('match-home-team').innerText = playerMatchData.homeName;
    document.getElementById('match-away-team').innerText = playerMatchData.awayName;
    document.getElementById('match-score').innerText = `0 - 0`;
    document.getElementById('event-log').innerHTML = '';
    document.getElementById('btn-continue-post').classList.add('hidden');
    currentMinute = 0;
    
    switchScreen('match');
    runTicker();
};

function runTicker() {
    tickerInterval = setInterval(tickMinute, tickerSpeed);
}

function tickMinute() {
    currentMinute++;
    document.getElementById('match-clock').innerText = currentMinute;

    // Check if an event happened this minute in the player's match
    let eventsThisMinute = playerMatchData.events.filter(e => e.min === currentMinute);
    
    if (eventsThisMinute.length > 0) {
        clearInterval(tickerInterval); // Pause game
        
        eventsThisMinute.forEach(event => {
            logEvent(`⚽ ${event.min}': ${event.type} for ${event.teamName}!`);
            
            if (event.type === 'Goal') {
                showEventAlert(`GOAL! ${event.teamName}`, '#10b981');
                // Calculate current score at this minute
                let hG = playerMatchData.events.filter(e => e.min <= currentMinute && e.type === 'Goal' && e.isHome).length;
                let aG = playerMatchData.events.filter(e => e.min <= currentMinute && e.type === 'Goal' && !e.isHome).length;
                document.getElementById('match-score').innerText = `${hG} - ${aG}`;
            } else {
                showEventAlert(`Yellow Card: ${event.teamName}`, '#eab308');
            }
        });

        // Resume after 2 seconds
        setTimeout(() => {
            document.getElementById('match-event-alert').classList.add('hidden');
            if (currentMinute < 90) runTicker();
            else finishMatchScreen();
        }, 2000);
    } else if (currentMinute >= 90) {
        clearInterval(tickerInterval);
        finishMatchScreen();
    }
}

function showEventAlert(text, color) {
    const alert = document.getElementById('match-event-alert');
    alert.innerText = text;
    alert.style.backgroundColor = color;
    alert.classList.remove('hidden');
}

function logEvent(text) {
    const log = document.getElementById('event-log');
    const li = document.createElement('li');
    li.innerText = text;
    log.prepend(li); // Put newest event at top
}

function finishMatchScreen() {
    logEvent("🏁 90': Full Time.");
    document.getElementById('btn-continue-post').classList.remove('hidden');
}

// Speed Control Buttons
document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.onclick = (e) => {
        document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        tickerSpeed = parseInt(e.target.dataset.speed);
        
        // If match is currently ticking, restart interval with new speed
        if (currentMinute > 0 && currentMinute < 90 && document.getElementById('match-event-alert').classList.contains('hidden')) {
            clearInterval(tickerInterval);
            runTicker();
        }
    };
});

// --- 8. POST MATCH & LEAGUE TABLE ---
document.getElementById('btn-continue-post').onclick = () => {
    processGameweekData();
    renderPostMatch();
    switchScreen('postMatch');
};

function processGameweekData() {
    currentWeekResults.forEach(res => {
        let home = teams.find(t => t.id === res.homeId);
        let away = teams.find(t => t.id === res.awayId);
        
        home.played++; away.played++;
        home.gf += res.homeGoals; home.ga += res.awayGoals;
        away.gf += res.awayGoals; away.ga += res.homeGoals;
        home.gd = home.gf - home.ga; away.gd = away.gf - away.ga;

        if (res.homeGoals > res.awayGoals) {
            home.w++; home.points += 3;
            away.l++;
        } else if (res.awayGoals > res.homeGoals) {
            away.w++; away.points += 3;
            home.l++;
        } else {
            home.d++; away.d++;
            home.points += 1; away.points += 1;
        }
    });

    // Sort table: Points > Goal Difference > Goals For
    teams.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
}

function renderPostMatch() {
    // Render Results List
    const resultsList = document.getElementById('gw-results');
    resultsList.innerHTML = '';
    currentWeekResults.forEach(res => {
        let li = document.createElement('li');
        li.innerText = `${res.homeName} ${res.homeGoals} - ${res.awayGoals} ${res.awayName}`;
        if (res.homeId === playerTeamId || res.awayId === playerTeamId) {
            li.style.fontWeight = 'bold';
            li.style.color = '#3b82f6';
        }
        resultsList.appendChild(li);
    });

    // Render Table
    const tbody = document.getElementById('league-table-body');
    tbody.innerHTML = '';
    teams.forEach((team, index) => {
        let tr = document.createElement('tr');
        if (team.id === playerTeamId) tr.className = 'player-team';
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${team.name}</td>
            <td>${team.played}</td>
            <td>${team.w}</td>
            <td>${team.d}</td>
            <td>${team.l}</td>
            <td>${team.gd}</td>
            <td><strong>${team.points}</strong></td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('btn-next-week').onclick = () => {
    currentWeek++;
    if (currentWeek >= 38) {
        alert("Season Finished! Refresh to play again.");
        return;
    }
    setupPreMatch();
    switchScreen('preMatch');
};

// --- UTILS ---
function switchScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
}

// Start app
init();
