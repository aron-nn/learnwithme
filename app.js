/* LearnWithMe - Core Frontend Application Logic */

// ==========================================
// DATA CATALOGS & PRESETS
// ==========================================
// ============================================
// SUPABASE CONFIGURATION
// ============================================

const SUPABASE_URL =
    'https://vruexufgamfckicfsexa.supabase.co';

const SUPABASE_KEY =
    'sb_publishable_oUAddz5n5gzhywqrYS3PwA_h9eKgCnI';

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
const GRADES = [
    { id: 'lkg', emoji: '🎒', label: 'LKG', age: '4-5 years', desc: 'Early visual learning & phonics' },
    { id: 'ukg', emoji: '🎒', label: 'UKG', age: '5-6 years', desc: 'Pre-math & word matching' },
    { id: '1', emoji: '1️⃣', label: 'Class 1', age: '6-7 years', desc: 'Addition, reading & shapes' },
    { id: '2', emoji: '2️⃣', label: 'Class 2', age: '7-8 years', desc: 'Multiplication & nature science' },
    { id: '3', emoji: '3️⃣', label: 'Class 3', age: '8-9 years', desc: 'Fractions & Science basics' }
];

const PRESET_INTERESTS = [
    '🏏 Cricket', '⚽ Football', '🏀 Basketball', '🦕 Dinosaurs',
    '🚗 Cars', '🚀 Space & Rockets', '🐶 Animals', '🦋 Butterflies & Insects',
    '🎮 Video Games', '🎨 Art & Drawing', '📚 Reading Books', '🎵 Music',
    '🌊 Ocean & Sea Life', '🦖 Prehistoric Creatures', '🤖 Robots & Technology',
    '🏰 Fairy Tales & Princesses', '🦸 Superheroes', '🌍 Nature & Plants'
];

const STICKER_DATABASE = [
    // Cricket Champions Set
    { id: 'stk_cricket_1', name: 'Cricket Star', emoji: '🏏', rarity: 'rare', theme: 'Cricket Champions', desc: 'Awarded for mastering fractions with cricket problems!', hint: 'Complete 10 cricket questions' },
    { id: 'stk_cricket_2', name: 'World Cup Winner', emoji: '🏆', rarity: 'epic', theme: 'Cricket Champions', desc: 'Champion solver of multi-step multiplication!', hint: 'Reach a 7-day streak' },
    { id: 'stk_cricket_3', name: 'Fast Bowler', emoji: '⚡', rarity: 'common', theme: 'Cricket Champions', desc: 'Lightning speed math calculations!', hint: 'Answer 5 questions under 10s' },
    { id: 'stk_cricket_4', name: 'Hat-Trick Hero', emoji: '🎩', rarity: 'legendary', theme: 'Cricket Champions', desc: 'Legendary triple perfect score solver!', hint: 'Complete 100 cricket-themed questions' },

    // Space Explorers Set
    { id: 'stk_space_1', name: 'Galaxy Explorer', emoji: '🚀', rarity: 'legendary', theme: 'Space Explorers', desc: 'Navigated the stellar solar system quiz!', hint: 'Master all Space curriculum topics' },
    { id: 'stk_space_2', name: 'Rocket Pilot', emoji: '👨‍🚀', rarity: 'rare', theme: 'Space Explorers', desc: 'Orbited gravity and velocity concepts!', hint: 'Complete 10 space questions' },
    { id: 'stk_space_3', name: 'Alien Friend', emoji: '👾', rarity: 'common', theme: 'Space Explorers', desc: 'Discovered cosmic patterns and sequences!', hint: 'Complete daily quota' },
    { id: 'stk_space_4', name: 'Moon Walker', emoji: '🌕', rarity: 'epic', theme: 'Space Explorers', desc: 'Landed safely on lunar math challenges!', hint: 'Earn 500 total stars' },

    // Dinosaur Discovery Set
    { id: 'stk_dino_1', name: 'T-Rex King', emoji: '🦖', rarity: 'epic', theme: 'Dinosaur Discovery', desc: 'Roared through prehistoric geometry!', hint: 'Solve 20 shape questions' },
    { id: 'stk_dino_2', name: 'Raptor Runner', emoji: '🦕', rarity: 'common', theme: 'Dinosaur Discovery', desc: 'Quick fossil finder in science history!', hint: 'Complete daily goal' },
    { id: 'stk_dino_3', name: 'Fossil Finder', emoji: '🦴', rarity: 'rare', theme: 'Dinosaur Discovery', desc: 'Unearthed ancient math secrets!', hint: 'Complete Jurassic topic' },

    // Animals & Nature Set
    { id: 'stk_anim_1', name: 'Jungle Explorer', emoji: '🦁', rarity: 'rare', theme: 'Animals & Nature', desc: 'Braved the safari word problems!', hint: 'Complete safari quiz' },
    { id: 'stk_anim_2', name: 'Ocean Champion', emoji: '🐬', rarity: 'epic', theme: 'Animals & Nature', desc: 'Dived deep into aquatic measurements!', hint: 'Answer 30 sea life questions' },
    { id: 'stk_anim_3', name: 'Butterfly Fairy', emoji: '🦋', rarity: 'common', theme: 'Animals & Nature', desc: 'Fluttered through symmetry & patterns!', hint: 'Complete daily goal' }
];

const STICKER_SETS = [
    { id: 'set_cricket', name: 'Cricket Champions', theme: '🏏', reward: 'Cricket Bat Badge 🏏', total: 4 },
    { id: 'set_space', name: 'Space Explorers', theme: '🚀', reward: 'Cosmic Helmet Badge 👨‍🚀', total: 4 },
    { id: 'set_dino', name: 'Dinosaur Discovery', theme: '🦕', reward: 'T-Rex Crown Badge 👑', total: 3 },
    { id: 'set_anim', name: 'Animals & Nature', theme: '🦁', reward: 'Safari Master Badge 🎖️', total: 3 }
];

// Initial Seed Data for Multi-child Support
// ==========================================
// INITIAL APPLICATION STATE
// ==========================================

const INITIAL_STATE = {

    // No demo child accounts.
    // Children will come from Supabase.

    activeChildId: null,

    parentVerified: false,

    screenTimeTimerActive: true,

    children: {}

};

// Application Global State Object
let state = loadState();
let selectedSignupInterests = [];
let screenTimeInterval = null;
let currentQuestionIndex = 0;
let currentQuizQuestion = null;
let coverageChartInstance = null;
let subjectChartInstance = null;

// ==========================================
// STATE PERSISTENCE HELPERS
// ==========================================
function loadState() {
    try {
        const saved = localStorage.getItem('learnwithme_state_v2');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Could not load saved state, using default.', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
}

function saveState() {
    try {
        localStorage.setItem('learnwithme_state_v2', JSON.stringify(state));
    } catch (e) {
        console.warn('Could not save state.', e);
    }
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener(
    'DOMContentLoaded',
    async () => {

        initInterestSelector();

        lucide.createIcons();

        initCharts();


        // Check Supabase session

        const {
            data: {
                session
            }
        } =
            await supabaseClient
                .auth
                .getSession();


        if (session) {

            state.parentVerified = true;


            await loadChildrenFromSupabase();


            const role =
                sessionStorage.getItem(
                    'learnwithme_portal_role'
                );


            document
                .getElementById(
                    'auth-container'
                )
                .classList.add(
                    'hidden'
                );


            if (role === 'kid') {

                switchPortal(
                    'kid'
                );

            } else {

                switchPortal(
                    'parent'
                );

            }


            updatePortalButtons();

            updateUI();

            initScreenTimeTracker();

        } else {

            // No login

            state.parentVerified = false;

            showAuthStep(
                'login-select'
            );

        }

    }
);

function getActiveChild() {
    return state.children[state.activeChildId] || Object.values(state.children)[0];
}

// ==========================================
// UI UPDATE DISTRIBUTOR
// ==========================================
function updateUI() {
    const child = getActiveChild();
    if (!child) return;

    // Header Stars & Metadata
    document.getElementById('global-star-count').textContent = `${child.stars.toLocaleString()} Stars`;
    document.getElementById('active-student-code').textContent = child.code;
    document.getElementById('display-child-name').textContent = child.name;
    document.getElementById('display-child-meta').textContent = `${child.grade} • ${child.board}`;

    // Kid Banner Hero
    document.getElementById('kid-hero-title').innerHTML = `Hi ${child.name.split(' ')[0]}! Let's Play & Learn! 🦁`;
    document.getElementById('kid-hero-subtitle').innerHTML = `Kiko prepared a new <strong>${child.interests[0] || 'Learning'} Quest</strong> from your <strong>${child.grade} Syllabus</strong>!`;
    document.getElementById('kid-interests-pill').textContent = child.interests.join(' • ');

    // Render Streak Badges & Tooltips
    updateStreakUI(child);

    // Render Daily Quota Tracker
    updateDailyQuotaUI(child);

    // Render Screen Time Header Widget
    updateScreenTimeUI(child);

    // Render Multi-Child Tabs in Parent Portal
    renderParentChildTabs();

    // Render Curriculum Section
    renderCurriculumSection(child);

    // Render Sticker Collection Page
    renderStickerCollection(child);

    // Update Quiz Card if active
    if (!currentQuizQuestion) {
        generateNewQuestion();
    }
}

// ==========================================
// FEATURE 1: SCREEN TIME LIMIT SYSTEM
// ==========================================
function initScreenTimeTracker() {
    if (screenTimeInterval) clearInterval(screenTimeInterval);

    screenTimeInterval = setInterval(() => {
        const child = getActiveChild();
        if (!child || child.autoLoggedOut) return;

        // Increment 1 second of screen time usage
        child.todayTimeSpent += 1;

        // Warning at 1h 45m (6300 seconds)
        if (child.todayTimeSpent >= 6300 && child.todayTimeSpent < 6310 && !child.lastWarningShown) {
            child.lastWarningShown = true;
            showScreenTimeWarningModal(child);
        }

        // Auto Logout at Daily Limit (default 7200 seconds / 2 hours)
        if (child.todayTimeSpent >= child.dailyLimit && !child.autoLoggedOut) {
            child.autoLoggedOut = true;
            saveState();
            triggerAutoLogoutModal(child);
        }

        updateScreenTimeUI(child);
        saveState();
    }, 1000);
}

function updateScreenTimeUI(child) {
    const hours = Math.floor(child.todayTimeSpent / 3600);
    const mins = Math.floor((child.todayTimeSpent % 3600) / 60);
    const limitHours = Math.floor(child.dailyLimit / 3600);
    const limitMins = Math.floor((child.dailyLimit % 3600) / 60);

    const remainingSecs = Math.max(0, child.dailyLimit - child.todayTimeSpent);
    const timeUsedPct = Math.min(100, Math.round((child.todayTimeSpent / child.dailyLimit) * 100));

    // Dynamic Color Coding: Green (<1h / <50%), Orange (1h-1h45m / 50-87%), Red (>1h45m / >87%)
    let colorClass = 'text-emerald-600 bg-emerald-50 border-emerald-300';
    let barColor = 'bg-emerald-500';

    if (child.todayTimeSpent >= 6300) { // Red (> 1h 45m)
        colorClass = 'text-rose-600 bg-rose-50 border-rose-400 animate-pulse';
        barColor = 'bg-rose-500';
    } else if (child.todayTimeSpent >= 3600) { // Orange (1h to 1h 45m)
        colorClass = 'text-amber-600 bg-amber-50 border-amber-300';
        barColor = 'bg-amber-500';
    }

    const timerWidgetHtml = `
        <div onclick="openScreenTimeDetailModal()" class="cursor-pointer flex items-center space-x-2 border-2 px-3 py-1.5 rounded-2xl shadow-sm transition-all hover:scale-105 ${colorClass}">
            <span class="text-base">⏱️</span>
            <div class="text-left leading-tight">
                <p class="font-child font-bold text-xs sm:text-sm">⏱️ ${hours}h ${mins}m / ${limitHours}h${limitMins ? ' ' + limitMins + 'm' : ''}</p>
                <div class="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                    <div class="${barColor} h-full transition-all duration-500" style="width: ${timeUsedPct}%"></div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('screen-time-widget-container').innerHTML = timerWidgetHtml;
}

function openScreenTimeDetailModal() {
    const child = getActiveChild();
    const hours = Math.floor(child.todayTimeSpent / 3600);
    const mins = Math.floor((child.todayTimeSpent % 3600) / 60);
    const remainingSecs = Math.max(0, child.dailyLimit - child.todayTimeSpent);
    const remHours = Math.floor(remainingSecs / 3600);
    const remMins = Math.floor((remainingSecs % 3600) / 60);

    document.getElementById('modal-screentime-detail-body').innerHTML = `
        <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-sm">
                ⏳
            </div>
            <h2 class="font-bouncy text-2xl font-extrabold text-slate-900">Today's Screen Time Usage</h2>
            <div class="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 grid grid-cols-2 gap-4">
                <div class="text-center">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Time Spent</span>
                    <p class="font-child text-2xl font-extrabold text-brand-blue">${hours}h ${mins}m</p>
                </div>
                <div class="text-center">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Time Remaining</span>
                    <p class="font-child text-2xl font-extrabold text-emerald-600">${remHours}h ${remMins}m</p>
                </div>
            </div>
            <p class="text-xs font-bold text-slate-500">
                Daily Limit: <strong>${Math.floor(child.dailyLimit / 3600)} Hours</strong> (Resets at 12:00 AM midnight).
            </p>
            <div class="p-3 bg-blue-50 text-brand-blue rounded-xl border border-blue-200 text-xs font-bold">
                💡 Parents can extend time anytime from the Parent Portal!
            </div>
            <button onclick="closeModal('modal-screentime-detail')" class="w-full py-3 bg-brand-blue text-white font-child font-bold rounded-2xl">
                Got it! Back to Learning 🚀
            </button>
        </div>
    `;
    openModal('modal-screentime-detail');
}

function showScreenTimeWarningModal(child) {
    openModal('modal-screentime-warning');
}

function triggerAutoLogoutModal(child) {
    document.getElementById('logout-summary-stats').innerHTML = `
        <div class="bg-yellow-50 p-3 rounded-xl border border-yellow-200 font-bold text-xs text-amber-900">⏱️ Today's Learning: <strong>${Math.floor(child.todayTimeSpent / 3600)} Hours</strong></div>
        <div class="bg-blue-50 p-3 rounded-xl border border-blue-200 font-bold text-xs text-blue-900">🎯 Questions Completed: <strong>${child.dailyQuota.completed * 3 + 12}</strong></div>
        <div class="bg-purple-50 p-3 rounded-xl border border-purple-200 font-bold text-xs text-purple-900">🎁 Stickers Earned: <strong>${child.stickers.length}</strong></div>
        <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-bold text-xs text-emerald-900">🔥 Current Streak: <strong>${child.streakDays} Days</strong></div>
    `;

    openModal('modal-screentime-logout');

    // Countdown auto-exit redirect
    let count = 10;
    const btn = document.getElementById('logout-exit-btn');
    const interval = setInterval(() => {
        count--;
        if (btn) btn.textContent = `Exit to Home (${count}s) →`;
        if (count <= 0) {
            clearInterval(interval);
            closeModal('modal-screentime-logout');
            logout();
        }
    }, 1000);
}

function parentExtendScreenTime(childId, addMinutes) {
    const child = state.children[childId];
    if (!child) return;

    if (child.extensionsCount >= 3) {
        alert('Maximum of 3 time extensions reached for today!');
        return;
    }

    child.dailyLimit += (addMinutes * 60);
    child.extensionsCount += 1;
    child.autoLoggedOut = false;
    saveState();

    updateUI();
    showToast(`🎉 Extended ${child.name}'s learning time by ${addMinutes} minutes!`);
}

// ==========================================
// FEATURE 2: LOGIN STREAK SYSTEM
// ==========================================
function updateStreakUI(child) {
    let milestoneBadge = '';
    if (child.streakDays >= 365) milestoneBadge = 'Yearly Legend 🎖️';
    else if (child.streakDays >= 100) milestoneBadge = 'Century Champion 👑';
    else if (child.streakDays >= 30) milestoneBadge = 'Monthly Master 🌟';
    else if (child.streakDays >= 7) milestoneBadge = 'Week Warrior 🏆';

    const streakHtml = `
        <div onclick="openStreakModal()" class="cursor-pointer flex items-center space-x-1.5 bg-orange-100 border-2 border-orange-300 px-3 py-1.5 rounded-2xl shadow-sm text-orange-800 font-child font-bold text-xs sm:text-sm hover:scale-105 transition-all">
            <span class="text-xl animate-bounce">🔥</span>
            <span>${child.streakDays} Day Streak!</span>
            ${milestoneBadge ? `<span class="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">${milestoneBadge}</span>` : ''}
        </div>
    `;

    document.getElementById('streak-widget-container').innerHTML = streakHtml;
}

function openStreakModal() {
    const child = getActiveChild();
    const nextGoalDays = child.streakDays < 7 ? 7 : (child.streakDays < 30 ? 30 : (child.streakDays < 100 ? 100 : 365));
    const daysNeeded = Math.max(1, nextGoalDays - child.streakDays);

    let historyGridHtml = '';
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Generate recent calendar view
    Object.keys(child.history).slice(0, 14).forEach((dateStr) => {
        const status = child.history[dateStr];
        let color = 'bg-emerald-400 text-white';
        let icon = '✅';
        if (status === 'missed') { color = 'bg-rose-400 text-white'; icon = '❌'; }
        if (status === 'freeze') { color = 'bg-amber-400 text-white'; icon = '❄️'; }

        historyGridHtml += `
            <div class="${color} p-3 rounded-2xl text-center shadow-sm font-child font-bold text-xs flex flex-col items-center justify-center">
                <span class="text-base">${icon}</span>
                <span class="text-[10px] opacity-90 mt-1">${dateStr.substring(5)}</span>
            </div>
        `;
    });

    document.getElementById('modal-streak-body').innerHTML = `
        <div class="space-y-5">
            <div class="text-center space-y-2">
                <div class="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-md animate-wiggle">
                    🔥
                </div>
                <h2 class="font-bouncy text-3xl font-extrabold text-slate-900">${child.streakDays} Day Learning Streak!</h2>
                <p class="font-child text-xs font-bold text-slate-500">Keep answering at least 10 questions every day to keep your flame burning!</p>
            </div>

            <div class="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 space-y-3">
                <div class="flex justify-between items-center text-xs font-bold">
                    <span class="text-amber-800">Next Milestone: ${nextGoalDays}-Day Badge 🏆</span>
                    <span class="text-brand-blue">${daysNeeded} days left!</span>
                </div>
                <div class="w-full bg-amber-200 h-3 rounded-full overflow-hidden">
                    <div class="bg-amber-500 h-full transition-all duration-500" style="width: ${Math.min(100, Math.round((child.streakDays / nextGoalDays) * 100))}%"></div>
                </div>
            </div>

            <div>
                <h4 class="font-child font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">Streak History Calendar</h4>
                <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    ${historyGridHtml}
                </div>
            </div>

            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs font-bold">
                <div class="flex items-center space-x-2">
                    <span class="text-xl">❄️</span>
                    <span>Streak Freeze: <strong>${child.streakFreezesAvailable} Available</strong></span>
                </div>
                <button onclick="useStreakFreeze('${child.id}')" ${child.streakFreezesAvailable <= 0 ? 'disabled' : ''} class="px-3 py-1.5 bg-brand-blue text-white rounded-xl disabled:opacity-50">
                    Use Freeze ❄️
                </button>
            </div>

            <button onclick="closeModal('modal-streak')" class="w-full py-3 bg-brand-blue text-white font-child font-bold text-base rounded-2xl shadow-md">
                Keep the Streak Going! 🚀
            </button>
        </div>
    `;

    openModal('modal-streak');
}

function useStreakFreeze(childId) {
    const child = state.children[childId];
    if (child && child.streakFreezesAvailable > 0) {
        child.streakFreezesAvailable -= 1;
        saveState();
        showToast('❄️ Streak Freeze activated! Your streak is protected.');
        openStreakModal();
    }
}

// ==========================================
// FEATURE 3: EXTENDED GRADES (LKG, UKG, Class 1-3)
// ==========================================
function renderGradeSelectOptions(targetSelectId, selectedValue = 'Class 3') {
    const select = document.getElementById(targetSelectId);
    if (!select) return;

    select.innerHTML = GRADES.map(g => `
        <option value="${g.label}" ${g.label === selectedValue ? 'selected' : ''}>
            ${g.emoji} ${g.label} (${g.age}) - ${g.desc}
        </option>
    `).join('');
}

// ==========================================
// FEATURE 5: INTEREST SELECTION DURING SIGNUP
// ==========================================
function initInterestSelector() {
    renderGradeSelectOptions('signup-grade', 'Class 3');

    const dropdown = document.getElementById('preset-interest-dropdown');
    if (dropdown) {
        dropdown.innerHTML = '<option value="" disabled selected>✨ Choose an interest (Up to 3)</option>' +
            PRESET_INTERESTS.map(i => `<option value="${i}">${i}</option>`).join('');
    }

    renderSelectedInterestTags();
}

function handlePresetInterestSelect(e) {
    const val = e.target.value;
    if (!val) return;

    if (selectedSignupInterests.length >= 3) {
        showToast('⚠️ Maximum 3 interests allowed!');
        e.target.value = '';
        return;
    }

    if (!selectedSignupInterests.includes(val)) {
        selectedSignupInterests.push(val);
        renderSelectedInterestTags();
    }
    e.target.value = '';
}

function addCustomInterest() {
    const input = document.getElementById('custom-interest-input');
    const val = input.value.trim();
    if (!val) return;

    if (selectedSignupInterests.length >= 3) {
        showToast('⚠️ Maximum 3 interests allowed!');
        return;
    }

    const formatted = `✏️ ${val}`;
    if (!selectedSignupInterests.includes(formatted)) {
        selectedSignupInterests.push(formatted);
        renderSelectedInterestTags();
    }
    input.value = '';
}

function removeSignupInterest(index) {
    selectedSignupInterests.splice(index, 1);
    renderSelectedInterestTags();
}

function renderSelectedInterestTags() {
    const container = document.getElementById('selected-interests-tags');
    const countEl = document.getElementById('selected-interests-count');

    if (countEl) countEl.textContent = `${selectedSignupInterests.length}/3 selected`;

    if (!container) return;

    if (selectedSignupInterests.length === 0) {
        container.innerHTML = `<span class="text-xs text-slate-400 italic">No interests selected yet. Pick up to 3 above!</span>`;
        return;
    }

    container.innerHTML = selectedSignupInterests.map((interest, idx) => `
        <span class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-child font-bold text-xs shadow-sm">
            <span>${interest}</span>
            <button type="button" onclick="removeSignupInterest(${idx})" class="w-4 h-4 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors">×</button>
        </span>
    `).join('');
}

// ==========================================
// AUTH & SIGNUP HANDLERS
// ==========================================
// ============================================
// CREATE CHILD ACCOUNT
// ============================================
// ============================================
// PARENT SIGNUP
// ============================================

async function handleParentSignup(e) {

    e.preventDefault();


    const name =
        document
            .getElementById(
                'parent-signup-name'
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                'parent-signup-email'
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                'parent-signup-password'
            )
            .value;


    if (!name || !email || !password) {

        showToast(
            '⚠️ Please fill all fields.'
        );

        return;
    }


    const {
        data,
        error
    } = await supabaseClient.auth.signUp({

        email,

        password,

        options: {

            data: {

                full_name:
                    name

            }

        }

    });


    if (error) {

        console.error(error);

        showToast(
            `❌ ${error.message}`
        );

        return;
    }


    if (!data.user) {

        showToast(
            '❌ Account could not be created.'
        );

        return;
    }


    // Create parent profile

    const {
        error: profileError
    } = await supabaseClient

        .from('parent_profiles')

        .insert({

            id: data.user.id,

            full_name: name

        });


    if (profileError) {

        console.error(
            profileError
        );

        showToast(
            'Account created, but profile setup failed.'
        );

        return;
    }


    state.parentVerified = true;


    showToast(
        '🎉 Parent account created!'
    );


    // Go to child registration

    showAuthStep(
        'signup'
    );

}
// ============================================
// PARENT EMAIL LOGIN
// ============================================

async function handleParentLoginEmail(e) {

    e.preventDefault();

    // --------------------------------
    // Get parent login details
    // --------------------------------

    const email =
        document
            .getElementById('parent-login-email')
            .value
            .trim();

    const password =
        document
            .getElementById('parent-login-password')
            .value;

    const childCode =
        document
            .getElementById('parent-login-child-code')
            .value
            .trim()
            .toUpperCase();

    const errorElement =
        document.getElementById(
            'parent-email-login-error'
        );

    errorElement.classList.add('hidden');


    // --------------------------------
    // Validate child code
    // --------------------------------

    if (!childCode) {

        errorElement.textContent =
            '⚠️ Please enter your child\'s student code.';

        errorElement.classList.remove('hidden');

        return;
    }


    // --------------------------------
    // Login parent with Supabase
    // --------------------------------

    const {
        data,
        error
    } =
        await supabaseClient.auth
            .signInWithPassword({

                email: email,

                password: password

            });


    if (error) {

        console.error(
            'Parent login error:',
            error
        );

        errorElement.textContent =
            '❌ Invalid email or password.';

        errorElement.classList.remove(
            'hidden'
        );

        return;
    }


    // --------------------------------
    // Find the child
    // --------------------------------

    const {
        data: child,
        error: childError
    } =
        await supabaseClient
            .from('children')
            .select('*')
            .eq(
                'student_code',
                childCode
            )
            .maybeSingle();


    if (childError) {

        console.error(
            'Child lookup error:',
            childError
        );

        errorElement.textContent =
            '❌ Could not verify the child code.';

        errorElement.classList.remove(
            'hidden'
        );

        return;
    }


    if (!child) {

        errorElement.textContent =
            '❌ Invalid student code.';

        errorElement.classList.remove(
            'hidden'
        );

        return;
    }


    // --------------------------------
    // Make sure this child belongs
    // to the logged-in parent
    // --------------------------------

    const loggedInParent =
        data.user.id;


    if (
        child.parent_id !==
        loggedInParent
    ) {

        errorElement.textContent =
            '❌ This child code does not belong to your account.';

        errorElement.classList.remove(
            'hidden'
        );

        return;
    }


    // --------------------------------
    // Save child into application state
    // --------------------------------

    state.activeChildId =
        child.id;

    state.parentVerified =
        true;


    state.children[child.id] = {

        id: child.id,

        name: child.name,

        avatar: child.avatar,

        grade: child.grade,

        board: child.board,

        code: child.student_code,

        interests:
            child.interests || [],

        stars:
            child.stars || 0,

        todayTimeSpent:
            child.today_time_spent || 0,

        dailyLimit:
            child.daily_limit_seconds ||
            7200,

        streakDays:
            child.streak_days || 0,

        longestStreak:
            child.longest_streak || 0,

        autoLoggedOut: false,

        dailyQuota: {

            completed: 0,

            total: 10

        },

        stickers: [],

        curriculum: {

            hasCurriculum: false,

            schoolName: '',

            gradeTerm:
                `${child.grade} Curriculum`,

            subjects: [],

            lastUpdated:
                'Not uploaded'

        }

    };


    // --------------------------------
    // Save role
    // --------------------------------

    sessionStorage.setItem(
        'learnwithme_portal_role',
        'parent'
    );


    // --------------------------------
    // Hide authentication
    // --------------------------------

    document
        .getElementById(
            'auth-container'
        )
        .classList.add('hidden');


    // --------------------------------
    // Open Parent Portal
    // --------------------------------

    switchPortal(
        'parent'
    );

    updatePortalButtons();

    updateUI();


    showToast(
        `👋 Welcome! Managing ${child.name}'s learning.`
    );

}


// ============================================
// CHILD LOGIN USING STUDENT CODE
// ============================================

async function handleChildLogin() {

    const input =
        document
            .getElementById(
                'child-code-input'
            );


    if (!input) {

        console.error(
            'child-code-input not found'
        );

        return;
    }


    const code =
        input.value
            .trim()
            .toUpperCase();


    if (!code) {

        showToast(
            '⚠️ Enter your student code.'
        );

        return;
    }


    const {
        data: child,
        error
    } = await supabaseClient

        .from('children')

        .select('*')

        .eq(
            'student_code',
            code
        )

        .maybeSingle();


    if (error) {

        console.error(error);

        showToast(
            '❌ Could not verify code.'
        );

        return;
    }


    if (!child) {

        showToast(
            '❌ Invalid student code.'
        );

        return;
    }


    state.activeChildId =
        child.id;


    state.children[child.id] = {

        id: child.id,

        name: child.name,

        avatar: child.avatar,

        grade: child.grade,

        board: child.board,

        code:
            child.student_code,

        interests:
            child.interests || [],

        stars:
            child.stars || 0,

        todayTimeSpent:
            child.today_time_spent || 0,

        dailyLimit:
            child.daily_limit_seconds || 7200,

        streakDays:
            child.streak_days || 0,

        longestStreak:
            child.longest_streak || 0,

        autoLoggedOut: false,

        dailyQuota: {
            completed: 0,
            total: 10
        },

        stickers: [],

        curriculum: {
            hasCurriculum: false,
            schoolName: '',
            gradeTerm:
                `${child.grade} Curriculum`,
            subjects: [],
            lastUpdated:
                'Not uploaded'
        }

    };


    sessionStorage.setItem(
        'learnwithme_portal_role',
        'kid'
    );


    document
        .getElementById(
            'auth-container'
        )
        .classList.add('hidden');


    switchPortal(
        'kid'
    );


    updatePortalButtons();

    updateUI();


    showToast(
        `👋 Welcome ${child.name}!`
    );

}
async function handleChildSignUp(e) {

    e.preventDefault();


    // -----------------------------
    // Get form values
    // -----------------------------

    const name =
        document
            .getElementById('signup-name')
            .value
            .trim();


    const grade =
        document
            .getElementById('signup-grade')
            .value;


    const board =
        document
            .getElementById('signup-board')
            .value;


    // -----------------------------
    // Validate interests
    // -----------------------------

    if (selectedSignupInterests.length === 0) {

        showToast(
            '⚠️ Please select at least 1 interest!'
        );

        return;
    }


    // -----------------------------
    // Check parent login
    // -----------------------------

    const {
        data: {
            user
        }
    } = await supabaseClient
        .auth
        .getUser();


    if (!user) {

        showToast(
            '⚠️ Please create a parent account first.'
        );

        showAuthStep('login-select');

        return;
    }


    // -----------------------------
    // Generate student code
    // -----------------------------

    const code =
        generateStudentCode(name);


    // -----------------------------
    // Save child to Supabase
    // -----------------------------

    const {
        data: child,
        error
    } = await supabaseClient

        .from('children')

        .insert({

            parent_id: user.id,

            name: name,

            avatar: '👦',

            grade: grade,

            board: board,

            student_code: code,

            interests:
                [...selectedSignupInterests],

            stars: 100,

            daily_limit_seconds: 7200,

            today_time_spent: 0,

            streak_days: 1,

            longest_streak: 1

        })

        .select()

        .single();


    if (error) {

        console.error(
            'Child creation error:',
            error
        );

        showToast(
            '❌ Could not create child account.'
        );

        return;
    }


    // -----------------------------
    // Add to frontend state
    // -----------------------------

    state.children[child.id] = {

        id: child.id,

        name: child.name,

        avatar: child.avatar,

        grade: child.grade,

        board: child.board,

        code: child.student_code,

        interests: child.interests,

        stars: child.stars,

        todayTimeSpent:
            child.today_time_spent,

        dailyLimit:
            child.daily_limit_seconds,

        streakDays:
            child.streak_days,

        longestStreak:
            child.longest_streak,

        autoLoggedOut: false,

        dailyQuota: {
            completed: 0,
            total: 10
        },

        stickers: [],

        curriculum: {
            hasCurriculum: false,

            schoolName: '',

            gradeTerm:
                `${child.grade} Curriculum`,

            subjects: [],

            lastUpdated:
                'Not uploaded'
        }

    };


    state.activeChildId =
        child.id;


    // -----------------------------
    // Display generated code
    // -----------------------------

    document
        .getElementById(
            'generated-code-display'
        )
        .textContent =
        child.student_code;


    // -----------------------------
    // Show success screen
    // -----------------------------

    showAuthStep(
        'code-generated'
    );


    showToast(
        `🎉 ${name}'s account created!`
    );
}
// ============================================
// GENERATE UNIQUE STUDENT CODE
// ============================================

function generateStudentCode(name) {

    const prefix =
        name
            .replace(/[^a-zA-Z]/g, '')
            .substring(0, 3)
            .toUpperCase();


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return `${prefix}-${new Date().getFullYear()}-${random}`;
}
function handleParentLogin(e) {
    e.preventDefault();
    const inputCode = document.getElementById('parent-code-input').value.trim().toUpperCase();
    const errEl = document.getElementById('parent-login-error');

    const matchedChild = Object.values(state.children).find(c => c.code === inputCode);

    if (matchedChild || inputCode === 'ARJ-2026-X8' || inputCode === 'ANA-2026-K3') {
        errEl.classList.add('hidden');
        if (matchedChild) state.activeChildId = matchedChild.id;
        state.parentVerified = true;
        sessionStorage.setItem("learnwithme_portal_role", "parent");
        updatePortalButtons();
        saveState();

        document.getElementById('auth-container').classList.add('hidden');
        switchPortal('parent');
        updateUI();
    } else {
        errEl.classList.remove('hidden');
    }
}


function loginAsChild() {
    const child = getActiveChild();
    if (child && child.autoLoggedOut) {
        alert("You've reached your 2-hour learning limit for today. Come back tomorrow! 🌙");
        return;
    }
    sessionStorage.setItem("learnwithme_portal_role", "kid");
    updatePortalButtons();
    document.getElementById('auth-container').classList.add('hidden');
    switchPortal('kid');
    updateUI();
}

// ============================================
// LOGOUT
// ============================================

async function logout() {

    await supabaseClient.auth.signOut({
        scope: 'local'
    });


    state.parentVerified = false;

    state.activeChildId = null;


    sessionStorage.removeItem(
        'learnwithme_portal_role'
    );


    document
        .getElementById(
            'auth-container'
        )
        .classList.remove(
            'hidden'
        );


    showAuthStep(
        'login-select'
    );


    showToast(
        '👋 Logged out successfully.'
    );

}

// ==========================================
// FEATURE 4: CURRICULUM UPLOAD PER CHILD
// ==========================================
function renderParentChildTabs() {
    const container = document.getElementById('parent-child-tabs-container');
    if (!container) return;

    let html = Object.values(state.children).map(child => {
        const isActive = child.id === state.activeChildId;
        return `
            <button onclick="switchActiveChild('${child.id}')" class="px-5 py-3 rounded-2xl border-2 ${isActive ? 'border-brand-blue bg-blue-50 text-brand-blue font-bold shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'} flex items-center space-x-3 transition-all">
                <span class="w-10 h-10 rounded-2xl bg-yellow-200 flex items-center justify-center font-child text-2xl border-2 border-yellow-400">${child.avatar}</span>
                <div class="text-left">
                    <p class="font-child text-base leading-none text-slate-900">${child.name}</p>
                    <span class="text-xs font-bold ${isActive ? 'text-brand-blue' : 'text-slate-400'}">${child.grade} • ${child.board}</span>
                </div>
            </button>
        `;
    }).join('');

    html += `
        <button onclick="openModal('modal-add-child')" class="px-4 py-3 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-brand-blue hover:text-brand-blue font-child font-bold text-xs flex items-center space-x-2">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>+ Add Child</span>
        </button>
    `;

    container.innerHTML = html;
    lucide.createIcons();
}

function switchActiveChild(childId) {
    state.activeChildId = childId;
    saveState();
    updateUI();
}

function renderCurriculumSection(child) {
    const container = document.getElementById('curriculum-display-area');
    if (!container) return;

    if (child.curriculum && child.curriculum.hasCurriculum) {
        container.innerHTML = `
            <div class="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-sm space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">
                            📚
                        </div>
                        <div>
                            <h3 class="font-child text-xl font-bold text-slate-900">${child.curriculum.schoolName}</h3>
                            <p class="text-xs font-bold text-slate-500">${child.curriculum.gradeTerm}</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 w-fit">
                        ✅ Active Curriculum
                    </span>
                </div>

                <div>
                    <h4 class="font-child font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">Target Subjects & Topics:</h4>
                    <div class="flex flex-wrap gap-2">
                        ${child.curriculum.subjects.map(s => `<span class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">📖 ${s}</span>`).join('')}
                    </div>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-slate-500">
                    <span>${child.curriculum.lastUpdated}</span>
                    <div class="space-x-2">
                        <button onclick="openCurriculumUploadModal()" class="px-4 py-2 bg-brand-blue text-white rounded-xl">Update</button>
                        <button onclick="removeCurriculum('${child.id}')" class="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100">Remove</button>
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="bg-amber-50/60 p-8 rounded-3xl border-2 border-dashed border-amber-300 text-center space-y-4">
                <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-sm">
                    📚
                </div>
                <div>
                    <h3 class="font-bouncy text-2xl font-extrabold text-slate-900">No Curriculum Uploaded Yet</h3>
                    <p class="font-child text-xs font-bold text-slate-500 max-w-md mx-auto mt-1">
                        Upload ${child.name}'s school syllabus to allow Kiko AI to generate exact school-aligned daily lessons!
                    </p>
                </div>
                <button onclick="openCurriculumUploadModal()" class="px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-child font-bold text-sm rounded-2xl shadow-md">
                    Upload Curriculum for ${child.name.split(' ')[0]} →
                </button>
            </div>
        `;
    }
}

function openCurriculumUploadModal() {
    const child = getActiveChild();
    document.getElementById('curriculum-modal-child-name').textContent = child.name;
    openModal('modal-curriculum-upload');
}

function handleCurriculumSubmit(e) {
    e.preventDefault();
    const child = getActiveChild();
    const schoolName = document.getElementById('curr-school-name').value.trim();
    const subjectsInput = document.getElementById('curr-subjects-input').value.trim();

    child.curriculum = {
        hasCurriculum: true,
        schoolName: schoolName || 'Uploaded School Curriculum',
        gradeTerm: `${child.grade} - Term 1`,
        subjects: subjectsInput ? subjectsInput.split(',').map(s => s.trim()) : ['Mathematics', 'Science', 'English'],
        lastUpdated: 'Updated: ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    saveState();
    closeModal('modal-curriculum-upload');
    updateUI();
    showToast(`✅ Uploaded curriculum for ${child.name}!`);
}

function loadBoardPresetCurriculum(boardName) {
    const child = getActiveChild();
    child.curriculum = {
        hasCurriculum: true,
        schoolName: `${boardName} Standard Curriculum`,
        gradeTerm: `${child.grade} Syllabus`,
        subjects: [`${boardName} Mathematics`, `${boardName} Science & EVS`, `${boardName} English Language`],
        lastUpdated: 'Loaded: ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    saveState();
    closeModal('modal-curriculum-upload');
    updateUI();
    showToast(`✅ Loaded ${boardName} preset for ${child.name}!`);
}

function removeCurriculum(childId) {
    if (confirm('Are you sure you want to remove this child\'s curriculum?')) {
        state.children[childId].curriculum = { hasCurriculum: false };
        saveState();
        updateUI();
    }
}

// ==========================================
// FEATURE 6: DAILY ACHIEVEMENT SYSTEM & QUIZ
// ==========================================
function updateDailyQuotaUI(child) {
    const quota = child.dailyQuota;
    const pct = Math.min(100, Math.round((quota.completed / quota.total) * 100));

    document.getElementById('daily-completed-count').textContent = quota.completed;
    document.getElementById('daily-total-count').textContent = quota.total;
    document.getElementById('daily-quota-progress-bar').style.width = `${pct}%`;

    const rewardText = document.getElementById('daily-quota-reward-text');
    if (quota.completed >= quota.total) {
        rewardText.innerHTML = `✅ Daily goal completed! Sticker earned! 🎉`;
    } else {
        rewardText.innerHTML = `Complete <strong>${quota.total - quota.completed} more questions</strong> to earn today's sticker!`;
    }
}

function generateNewQuestion() {
    const child = getActiveChild();
    const interest = child.interests[Math.floor(Math.random() * child.interests.length)] || 'Cricket';
    const grade = child.grade;

    // Interest-tailored dynamic questions based on grade
    const questionBank = [
        {
            q: `In a ${interest} match, Arjun scored 15 runs in over 1 and 25 runs in over 2. What is his total score?`,
            options: ['30 Runs', '40 Runs', '45 Runs', '50 Runs'],
            correct: 1,
            exp: 'Great job! 15 + 25 = 40 runs!'
        },
        {
            q: `A ${interest} spaceship travels 100 km per second. How far does it travel in 3 seconds?`,
            options: ['200 km', '300 km', '400 km', '100 km'],
            correct: 1,
            exp: 'Awesome! 100 × 3 = 300 km!'
        },
        {
            q: `If you have 12 ${interest} stickers and give 4 to your friend, how many are left?`,
            options: ['6 Stickers', '8 Stickers', '10 Stickers', '16 Stickers'],
            correct: 1,
            exp: 'Correct! 12 - 4 = 8 stickers!'
        },
        {
            q: `Which fraction represents 2 out of 4 ${interest} items?`,
            options: ['1/4', '1/2', '3/4', '2/3'],
            correct: 1,
            exp: 'Spot on! 2/4 simplifies to 1/2!'
        }
    ];

    currentQuizQuestion = questionBank[currentQuestionIndex % questionBank.length];

    document.getElementById('quiz-question-title').textContent = `Question ${child.dailyQuota.completed + 1} of 10`;
    document.getElementById('quiz-question-text').textContent = currentQuizQuestion.q;

    const optionsContainer = document.getElementById('quiz-options-container');
    optionsContainer.innerHTML = currentQuizQuestion.options.map((opt, idx) => `
        <button onclick="submitQuizAnswer(${idx})" class="w-full p-4 rounded-2xl border-4 border-slate-200 bg-white hover:border-brand-blue hover:bg-blue-50 text-slate-800 font-child font-bold text-base text-left transition-all kid-card flex items-center justify-between">
            <span>${opt}</span>
            <span class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-sm">${String.fromCharCode(65 + idx)}</span>
        </button>
    `).join('');

    document.getElementById('quiz-feedback-box').classList.add('hidden');
}

function submitQuizAnswer(selectedIdx) {
    const child = getActiveChild();
    const feedbackBox = document.getElementById('quiz-feedback-box');
    feedbackBox.classList.remove('hidden');

    if (selectedIdx === currentQuizQuestion.correct) {
        child.stars += 10;
        child.dailyQuota.completed += 1;
        currentQuestionIndex++;

        feedbackBox.className = 'p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-900 font-child font-bold text-sm text-center space-y-2';
        feedbackBox.innerHTML = `
            <p class="text-base">🎉 Correct! ${currentQuizQuestion.exp} (+10 Stars ⭐)</p>
            <button onclick="nextQuizQuestion()" class="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md">Next Question →</button>
        `;

        // Check if 10th question daily quota met!
        if (child.dailyQuota.completed === child.totalQuota || child.dailyQuota.completed === 10) {
            setTimeout(() => {
                unlockDailySticker(child);
            }, 600);
        }
    } else {
        feedbackBox.className = 'p-4 rounded-2xl bg-rose-100 border-2 border-rose-300 text-rose-900 font-child font-bold text-sm text-center space-y-2';
        feedbackBox.innerHTML = `
            <p class="text-base">😅 Oops! Give it another try!</p>
            <button onclick="generateNewQuestion()" class="px-6 py-2 bg-rose-600 text-white font-bold rounded-xl shadow-md">Try Again 🔄</button>
        `;
    }

    saveState();
    updateUI();
}

function nextQuizQuestion() {
    generateNewQuestion();
}

// ==========================================
// STICKER UNLOCK & CONFETTI REVEAL
// ==========================================
function unlockDailySticker(child) {
    // Pick sticker from database
    const unearned = STICKER_DATABASE.filter(s => !child.stickers.some(st => st.id === s.id));
    const stickerToEarn = unearned.length > 0 ? unearned[0] : STICKER_DATABASE[Math.floor(Math.random() * STICKER_DATABASE.length)];

    // Add to child collection
    const existing = child.stickers.find(s => s.id === stickerToEarn.id);
    if (existing) {
        existing.count += 1;
    } else {
        child.stickers.push({ id: stickerToEarn.id, earnedDate: new Date().toISOString().split('T')[0], count: 1 });
    }
    saveState();

    // Trigger Canvas Confetti Blast
    if (window.confetti) {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
        });
    }

    // Render Sticker Reveal Modal
    document.getElementById('sticker-reveal-card-front-emoji').textContent = '❓';
    document.getElementById('sticker-reveal-name').textContent = stickerToEarn.name;
    document.getElementById('sticker-reveal-emoji').textContent = stickerToEarn.emoji;
    document.getElementById('sticker-reveal-rarity').textContent = stickerToEarn.rarity.toUpperCase();
    document.getElementById('sticker-reveal-desc').textContent = stickerToEarn.desc;

    const rarityBadge = document.getElementById('sticker-reveal-rarity');
    if (stickerToEarn.rarity === 'legendary') rarityBadge.className = 'px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-xs uppercase';
    else if (stickerToEarn.rarity === 'epic') rarityBadge.className = 'px-3 py-1 rounded-full bg-purple-600 text-white font-bold text-xs uppercase';
    else if (stickerToEarn.rarity === 'rare') rarityBadge.className = 'px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs uppercase';
    else rarityBadge.className = 'px-3 py-1 rounded-full bg-slate-500 text-white font-bold text-xs uppercase';

    openModal('modal-sticker-reveal');

    // Auto Flip Card Effect
    setTimeout(() => {
        const card = document.getElementById('sticker-flip-card-el');
        if (card) card.classList.add('flipped');
    }, 500);
}

// ==========================================
// STICKER COLLECTION ALBUM PAGE
// ==========================================
function renderStickerCollection(child) {
    const container = document.getElementById('sticker-collection-sets-container');
    if (!container) return;

    let totalEarnedCount = child.stickers.length;

    let setsHtml = STICKER_SETS.map(set => {
        const setItems = STICKER_DATABASE.filter(s => s.theme === set.name);
        const earnedInSet = setItems.filter(s => child.stickers.some(st => st.id === s.id)).length;
        const setPct = Math.round((earnedInSet / setItems.length) * 100);

        const cardsHtml = setItems.map(sticker => {
            const childEarned = child.stickers.find(st => st.id === sticker.id);
            const isEarned = !!childEarned;

            return `
                <div class="p-4 rounded-3xl border-4 ${isEarned ? 'rarity-' + sticker.rarity + ' kid-card' : 'border-slate-200 bg-slate-50 opacity-70'} text-center space-y-2 relative">
                    ${childEarned && childEarned.count > 1 ? `<span class="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">×${childEarned.count}</span>` : ''}
                    <div class="w-16 h-16 ${isEarned ? 'bg-white' : 'bg-slate-200'} rounded-2xl flex items-center justify-center text-4xl mx-auto shadow-sm">
                        ${isEarned ? sticker.emoji : '🔒'}
                    </div>
                    <div>
                        <h5 class="font-child font-bold text-sm text-slate-900">${sticker.name}</h5>
                        <span class="text-[10px] font-bold uppercase tracking-wider ${isEarned ? 'text-brand-blue' : 'text-slate-400'}">${sticker.rarity}</span>
                    </div>
                    <p class="text-[10px] text-slate-500 font-bold leading-tight">${isEarned ? sticker.desc : 'Hint: ' + sticker.hint}</p>
                </div>
            `;
        }).join('');

        return `
            <div class="bg-white p-6 rounded-3xl border-2 border-amber-200 space-y-4 shadow-sm">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div class="flex items-center space-x-3">
                        <span class="text-3xl">${set.theme}</span>
                        <div>
                            <h4 class="font-bouncy text-xl font-extrabold text-slate-900">${set.name}</h4>
                            <p class="text-xs font-bold text-slate-500">${earnedInSet} of ${setItems.length} Stickers Collected</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-child font-bold text-xs">
                        Reward: ${set.reward}
                    </span>
                </div>

                <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div class="bg-amber-400 h-full" style="width: ${setPct}%"></div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    ${cardsHtml}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = setsHtml;
}

// ==========================================
// MODAL & NAVIGATION CONTROLLERS
// ==========================================
function showAuthStep(step) {

    const steps = [

        'auth-step-signup',

        'auth-step-code-generated',

        'auth-step-login-select',

        'auth-step-parent-code',

        'auth-step-parent-signup',

        'auth-step-parent-login'

    ];


    steps.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {

            element.classList.add(
                'hidden'
            );

        }

    });


    const selected =
        document.getElementById(
            `auth-step-${step}`
        );


    if (selected) {

        selected.classList.remove(
            'hidden'
        );

    }

}
// ============================================
// OPEN PARENT PORTAL
// ============================================

async function openParentPortal() {

    const {
        data: {
            user
        }
    } = await supabaseClient.auth.getUser();


    if (!user) {

        document
            .getElementById(
                'auth-container'
            )
            .classList.remove('hidden');


        showAuthStep(
            'parent-login'
        );


        return;
    }


    state.parentVerified = true;


    sessionStorage.setItem(
        'learnwithme_portal_role',
        'parent'
    );


    await loadChildrenFromSupabase();


    switchPortal(
        'parent'
    );


    updateUI();
}
// ============================================
// LOAD CHILDREN FROM SUPABASE
// ============================================

async function loadChildrenFromSupabase() {

    const {
        data: {
            user
        }
    } = await supabaseClient.auth.getUser();


    if (!user) {

        state.children = {};

        return;
    }


    const {
        data: children,
        error
    } = await supabaseClient

        .from('children')

        .select('*')

        .order(
            'created_at',
            {
                ascending: true
            }
        );


    if (error) {

        console.error(error);

        showToast(
            '❌ Could not load children.'
        );

        return;
    }


    state.children = {};


    children.forEach(child => {

        state.children[child.id] = {

            id: child.id,

            name: child.name,

            avatar: child.avatar,

            grade: child.grade,

            board: child.board,

            code:
                child.student_code,

            interests:
                child.interests || [],

            stars:
                child.stars || 0,

            todayTimeSpent:
                child.today_time_spent || 0,

            dailyLimit:
                child.daily_limit_seconds || 7200,

            streakDays:
                child.streak_days || 0,

            longestStreak:
                child.longest_streak || 0,

            autoLoggedOut: false,

            dailyQuota: {
                completed: 0,
                total: 10
            },

            stickers: [],

            curriculum: {
                hasCurriculum: false,
                schoolName: '',
                gradeTerm:
                    `${child.grade} Curriculum`,
                subjects: [],
                lastUpdated:
                    'Not uploaded'
            }

        };

    });


    // Select first child

    const childList =
        Object.values(
            state.children
        );


    if (
        childList.length &&
        !state.activeChildId
    ) {

        state.activeChildId =
            childList[0].id;

    }

}


function switchPortal(portal) {
    const parentEl = document.getElementById('portal-parent');
    const kidEl = document.getElementById('portal-kid');
    const btnParent = document.getElementById('btn-portal-parent');
    const btnKid = document.getElementById('btn-portal-kid');

    if (portal === 'parent') {
        parentEl.classList.remove('hidden');
        kidEl.classList.add('hidden');
        btnParent.className = 'px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 bg-white text-slate-900 shadow-sm flex items-center space-x-1.5';
        btnKid.className = 'px-4 py-2 rounded-2xl text-xs sm:text-sm font-child font-bold transition-all duration-200 text-slate-600 hover:text-slate-900 flex items-center space-x-1.5';
    } else {
        parentEl.classList.add('hidden');
        kidEl.classList.remove('hidden');
        btnKid.className = 'px-4 py-2 rounded-2xl text-xs sm:text-sm font-child font-bold transition-all duration-200 bg-white text-slate-900 shadow-sm flex items-center space-x-1.5';
        btnParent.className = 'px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 text-slate-600 hover:text-slate-900 flex items-center space-x-1.5';
    }
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('hidden');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl font-child font-bold text-sm border border-slate-700 animate-bounce';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// ==========================================
// CHART.JS ANALYTICS INITIALIZATION
// ==========================================
function initCharts() {
    const ctxCoverage = document.getElementById('coverageChart')?.getContext('2d');
    if (ctxCoverage) {
        coverageChartInstance = new Chart(ctxCoverage, {
            type: 'doughnut',
            data: {
                labels: ['Mastered', 'In Progress', 'Not Started'],
                datasets: [{
                    data: [14, 8, 10],
                    backgroundColor: ['#10B981', '#FFD166', '#CBD5E1'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '70%' }
        });
    }

    const ctxBar = document.getElementById('subjectBarChart')?.getContext('2d');
    if (ctxBar) {
        subjectChartInstance = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Math', 'Science', 'English', 'EVS'],
                datasets: [{
                    label: 'Mastery %',
                    data: [75, 88, 65, 80],
                    backgroundColor: ['#3B82F6', '#9B51E0', '#FF6B6B', '#FFD166'],
                    borderRadius: 12
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { max: 100, beginAtZero: true } } }
        });
    }
}// ========================================================
// KIKO AI SUBJECT SELECTION
// INSERT AFTER LINE 1153
// ========================================================

let selectedAISubject = null;


// ========================================================
// 1. OPEN SUBJECT SELECTION
// ========================================================

function openChildLearning() {

    const child = getActiveChild();

    if (!child) return;

    const subjectContainer =
        document.getElementById('kid-subject-buttons');

    if (!subjectContainer) return;


    // Get subjects from child's curriculum
    let subjects = [];

    if (
        child.curriculum &&
        child.curriculum.hasCurriculum &&
        child.curriculum.subjects &&
        child.curriculum.subjects.length > 0
    ) {

        subjects = child.curriculum.subjects;

    } else {

        // Default subjects
        subjects = [
            'Mathematics',
            'Science',
            'English',
            'EVS'
        ];

    }


    // Subject icons
    const subjectIcons = {

        'Mathematics': '📐',
        'Math': '📐',

        'Science': '🔬',

        'English': '📖',

        'EVS': '🌱',

        'Social Science': '🌍',

        'Computer Science': '💻'

    };


    // Create subject buttons
    subjectContainer.innerHTML = subjects.map(subject => {

        const cleanSubject =
            subject
                .replace(/\(.*?\)/g, '')
                .trim();


        let icon = '📚';


        for (const key in subjectIcons) {

            if (
                cleanSubject
                    .toLowerCase()
                    .includes(key.toLowerCase())
            ) {

                icon = subjectIcons[key];

                break;

            }

        }


        return `

            <button
                onclick="selectAISubject('${cleanSubject.replace(/'/g, "\\'")}')"
                class="p-6 bg-gradient-to-br from-yellow-50 to-white
                       border-4 border-yellow-200 rounded-3xl
                       hover:border-blue-400 hover:scale-105
                       transition-all duration-200
                       text-center shadow-sm">

                <div class="text-5xl mb-3">
                    ${icon}
                </div>

                <h3 class="font-bouncy text-xl font-extrabold text-slate-900">
                    ${cleanSubject}
                </h3>

                <p class="font-child text-xs font-bold text-slate-500 mt-2">
                    Learn with Kiko AI ✨
                </p>

            </button>

        `;

    }).join('');


    // Show subject selection
    document
        .getElementById('kid-subject-selection')
        .classList.remove('hidden');


    // Hide AI class
    document
        .getElementById('ai-class-container')
        .classList.add('hidden');

}


// ========================================================
// 2. SUBJECT SELECTED
// ========================================================

function selectAISubject(subject) {

    selectedAISubject = subject;


    // Hide subjects
    document
        .getElementById('kid-subject-selection')
        .classList.add('hidden');


    // Show AI class
    document
        .getElementById('ai-class-container')
        .classList.remove('hidden');


    // Generate class
    generateAIClass(subject);

}


// ========================================================
// 3. GENERATE PERSONALIZED AI CLASS
// ========================================================

async function generateAIClass(subject) {

    const child = getActiveChild();

    if (!child) return;


    const interest =
        child.interests &&
        child.interests.length
            ? child.interests[0]
            : 'games';


    document
        .getElementById('ai-class-title')
        .textContent =
        `🤖 Kiko is preparing your ${subject} adventure...`;


    document
        .getElementById('ai-class-content')
        .innerHTML = `

            <div class="text-center p-10">

                <div class="text-6xl animate-bounce">
                    🦉
                </div>

                <p class="mt-4 font-bold">
                    Kiko is creating your
                    ${subject} class...
                </p>

            </div>

        `;


        try {

        const {
            data,
            error
        } = await supabaseClient.functions.invoke();
            'generate-class',
            {
                body: {
                    childName:
                        child.name,

                    grade:
                        child.grade,

                    subject,

                    interest,

                    syllabus:
                        child.curriculum
                            ?.subjects
                            ?.join(', ') || ''
                }
            }
    


        if (error) {

            throw error;
        }


        const lesson =
            JSON.parse(data.lesson);


        document
            .getElementById('ai-class-title')
            .textContent =
            lesson.title;


        document
            .getElementById('ai-class-content')
            .innerHTML = `

            <div class="space-y-5">

                <div class="bg-blue-50 p-5 rounded-2xl">

                    <h3 class="text-xl font-bold mb-2">
                        👋 Let's Begin!
                    </h3>

                    <p>
                        ${lesson.introduction}
                    </p>

                </div>


                <div class="bg-yellow-50 p-5 rounded-2xl">

                    <h3 class="text-xl font-bold mb-2">
                        📚 Learn
                    </h3>

                    <p>
                        ${lesson.lesson}
                    </p>

                </div>


                <div class="bg-green-50 p-5 rounded-2xl">

                    <h3 class="text-xl font-bold mb-2">
                        ✨ Examples
                    </h3>

                    <ul class="list-disc pl-5">

                        ${lesson.examples
                            .map(
                                example =>
                                `<li>${example}</li>`
                            )
                            .join('')
                        }

                    </ul>

                </div>


                <div class="bg-purple-50 p-5 rounded-2xl">

                    <h3 class="text-xl font-bold mb-2">
                        🧠 Your Challenge
                    </h3>

                    <p>
                        ${lesson.challenge}
                    </p>

                </div>


                <div class="bg-pink-50 p-5 rounded-2xl">

                    <p class="font-bold">
                        🌟 ${lesson.encouragement}
                    </p>

                </div>

            </div>

        `;


    } catch (error) {

        console.error(error);


        document
            .getElementById('ai-class-content')
            .innerHTML = `

                <div class="text-center p-8">

                    <div class="text-5xl">
                        😕
                    </div>

                    <p class="mt-4 font-bold">
                        Kiko couldn't prepare the
                        lesson right now.
                    </p>

                    <button
                        onclick="generateAIClass('${subject}')"
                        class="mt-4 px-5 py-3 bg-blue-500 text-white rounded-xl font-bold">

                        🔄 Try Again

                    </button>

                </div>

            `;
    }
}


// ========================================================
// 4. BACK TO SUBJECTS
// ========================================================

function backToSubjects() {

    document
        .getElementById('ai-class-container')
        .classList.add('hidden');


    document
        .getElementById('kid-subject-selection')
        .classList.remove('hidden');

}


// ========================================================
// 5. START PRACTICE
// ========================================================
function startAIQuiz() {

    // Make sure a subject was selected
    if (!selectedAISubject) {

        showToast(
            '📚 Please choose a subject first!'
        );

        return;
    }


    // Generate the practice question
    generateNewQuestion();


    // Find the practice quiz section
    const quiz =
        document.getElementById(
            'practice-quiz'
        );


    // Scroll to the practice quiz
    if (quiz) {

        setTimeout(() => {

            quiz.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

        }, 100);

    }


    // Tell the child the practice is ready
    showToast(
        `🎮 Your ${selectedAISubject} practice is ready!`
    );
}


// ========================================================
// 6. OPEN SUBJECT SELECTION WHEN KID WORLD OPENS
// ========================================================

const originalSwitchPortalForAI =
    window.switchPortal;


window.switchPortal = function(portal) {

    // Keep your existing switchPortal functionality
    originalSwitchPortalForAI(portal);


    // If Kid World is selected
    if (portal === 'kid') {

        setTimeout(function() {

            openChildLearning();

        }, 100);

    }

};

// ==========================================
// PORTAL BUTTON VISIBILITY
// ==========================================

function updatePortalButtons() {
    const parentBtn = document.getElementById("btn-portal-parent");
    const kidBtn = document.getElementById("btn-portal-kid");

    if (!parentBtn || !kidBtn) return;

    const role = sessionStorage.getItem("learnwithme_portal_role");

    if (role === "parent") {
        parentBtn.style.display = "flex";
        kidBtn.style.display = "none";
    }
    else if (role === "kid") {
        parentBtn.style.display = "none";
        kidBtn.style.display = "flex";
    }
    else {
        parentBtn.style.display = "none";
        kidBtn.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    updatePortalButtons();
});
// ==========================================
// DELETE CHILD ACCOUNT
// ==========================================

function deleteActiveChild() {

    // Only allow deletion from the Parent Portal
    if (!state.parentVerified) {
        alert("Please verify the Parent Portal first.");
        return;
    }

    const child = getActiveChild();

    if (!child) {
        alert("No child account is currently selected.");
        return;
    }

    // Don't allow deleting the final child account
    const childCount = Object.keys(state.children).length;

    if (childCount <= 1) {
        alert("You cannot delete the last child account.");
        return;
    }

    // Confirmation
    const confirmed = confirm(
        `Are you sure you want to delete ${child.name}'s account?\n\n` +
        `This will remove their learning progress, stars, stickers, ` +
        `curriculum and account information from this device.`
    );

    if (!confirmed) {
        return;
    }

    const childId = child.id;

    // Delete the child
    delete state.children[childId];

    // Select another remaining child
    const remainingChildren = Object.values(state.children);

    if (remainingChildren.length > 0) {
        state.activeChildId = remainingChildren[0].id;
    } else {
        state.activeChildId = null;
    }

    // Reset quiz state
    currentQuizQuestion = null;
    currentQuestionIndex = 0;

    // Save changes
    saveState();

    // Refresh the interface
    updateUI();

    showToast(
        `🗑️ ${child.name}'s account has been deleted.`
    );
}
