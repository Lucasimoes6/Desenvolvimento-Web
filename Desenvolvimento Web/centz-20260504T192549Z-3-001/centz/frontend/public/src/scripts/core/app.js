function switchTab(tabId) {
    document.querySelectorAll('.page-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`page-${tabId}`).classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-900', 'dark:text-white');
        btn.classList.add('text-gray-500', 'dark:text-gray-400');
    });
    const btn = document.getElementById(`nav-${tabId}`);
    btn.classList.remove('text-gray-500', 'dark:text-gray-400');
    btn.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-900', 'dark:text-white');

    closeSidebar();
    if (tabId === 'dashboard') { if (activeChartTab === 'trend') renderChart(); else renderBarChart(); }
}

function updateAllViews() {
    updateDashboard();
    renderAllTransactions();
    renderBudgets();
    renderGoals();
}

// ── Sidebar mobile ──────────────────────────────────────────────────────────
function toggleSidebar() {
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('sidebar-overlay');
    const isHidden = sidebar.classList.contains('-translate-x-full');
    sidebar.classList.toggle('-translate-x-full', !isHidden);
    overlay.classList.toggle('hidden', !isHidden);
}

function closeSidebar() {
    document.getElementById('sidebar').classList.add('-translate-x-full');
    document.getElementById('sidebar-overlay').classList.add('hidden');
}

// ── Confirmation modal ───────────────────────────────────────────────────────
function showConfirm(message, onConfirm) {
    document.getElementById('confirm-msg').textContent = message;
    document.getElementById('confirm-yes').onclick = () => { hideOverlay('confirm-modal', 'confirm-box'); onConfirm(); };
    document.getElementById('confirm-no').onclick  = () => hideOverlay('confirm-modal', 'confirm-box');
    showOverlay('confirm-modal', 'confirm-box');
}

// ── Search ───────────────────────────────────────────────────────────────────
function handleSearch(query) {
    searchQuery = query.toLowerCase().trim();
    if (searchQuery && document.getElementById('page-transactions').classList.contains('hidden'))
        switchTab('transactions');
    renderAllTransactions();
}

// ── Theme ────────────────────────────────────────────────────────────────────
function checkTheme() {
    const saved       = localStorage.getItem('centz_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-icon').textContent = 'light_mode';
    } else {
        document.documentElement.classList.remove('dark');
        document.getElementById('theme-icon').textContent = 'dark_mode';
    }
}

function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('centz_theme', 'light');
        document.getElementById('theme-icon').textContent = 'dark_mode';
    } else {
        html.classList.add('dark');
        localStorage.setItem('centz_theme', 'dark');
        document.getElementById('theme-icon').textContent = 'light_mode';
    }
    if (activeChartTab === 'trend') renderChart(); else renderBarChart();
    if (donutChartInstance) { donutChartInstance.destroy(); donutChartInstance = null; }
}

// ── Init ─────────────────────────────────────────────────────────────────────
window.onload = () => {
    checkTheme();
    checkAuth();
};
