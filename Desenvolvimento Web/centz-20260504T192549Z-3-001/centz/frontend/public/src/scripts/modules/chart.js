function switchChartTab(tab) {
    activeChartTab = tab;
    document.getElementById('wrap-trend').classList.toggle('hidden', tab !== 'trend');
    document.getElementById('wrap-bar').classList.toggle('hidden', tab !== 'bar');
    document.getElementById('tab-trend').className = tab === 'trend' ? activeTabCls() : inactiveTabCls();
    document.getElementById('tab-bar').className   = tab === 'bar'   ? activeTabCls() : inactiveTabCls();
    tab === 'trend' ? renderChart() : renderBarChart();
}

function activeTabCls()   { return 'px-3 py-1 rounded-md text-xs font-semibold bg-brand-green text-white transition-all'; }
function inactiveTabCls() { return 'px-3 py-1 rounded-md text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'; }

function renderChart() {
    const ctx    = document.getElementById('trendChart').getContext('2d');
    const isDark = document.documentElement.classList.contains('dark');
    const labels = [], dataPoints = [];
    const now    = new Date();

    for (let i = 6; i >= 0; i--) {
        const d      = new Date(now);
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase());
        const dayStr = d.toISOString().split('T')[0];
        dataPoints.push(
            transactions.filter(t => t.type === 'expense' && t.date === dayStr).reduce((a, t) => a + t.value, 0)
        );
    }

    if (trendChartInstance) trendChartInstance.destroy();
    trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: 'Gastos', data: dataPoints, borderColor: '#059669', backgroundColor: isDark ? 'rgba(5,150,105,0.1)' : 'rgba(5,150,105,0.05)', borderWidth: 2, pointBackgroundColor: '#059669', pointBorderColor: isDark ? '#151E32' : '#fff', pointBorderWidth: 2, pointRadius: 4, fill: true, tension: 0.4 }] },
        options: chartBaseOptions(isDark)
    });
}

function renderBarChart() {
    const ctx    = document.getElementById('barChart').getContext('2d');
    const isDark = document.documentElement.classList.contains('dark');
    const labels = [], incData = [], expData = [];

    for (let i = 5; i >= 0; i--) {
        const m = selectedMonth - i;
        const y = selectedYear + (m < 0 ? -1 : 0);
        const month = ((m % 12) + 12) % 12;
        const d   = new Date(y, month, 1);
        labels.push(d.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase());
        let inc = 0, exp = 0;
        transactions.forEach(tx => {
            const td = new Date(tx.date + 'T00:00:00');
            if (td.getMonth() === month && td.getFullYear() === y) {
                tx.type === 'income' ? (inc += tx.value) : (exp += tx.value);
            }
        });
        incData.push(inc);
        expData.push(exp);
    }

    if (barChartInstance) barChartInstance.destroy();
    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Receitas', data: incData, backgroundColor: 'rgba(5,150,105,0.8)', borderRadius: 4 },
                { label: 'Despesas', data: expData, backgroundColor: 'rgba(239,68,68,0.8)',  borderRadius: 4 },
            ]
        },
        options: { ...chartBaseOptions(isDark), plugins: { legend: { display: true, labels: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 10 } } } } }
    });
}

function renderDonutChart(sorted) {
    const ctx    = document.getElementById('donutChart').getContext('2d');
    const top    = sorted.slice(0, 5);
    const labels = top.map(([c]) => c);
    const data   = top.map(([, v]) => v);
    const colors = top.map(([c]) => CATEGORY_COLORS[c] || CATEGORY_COLORS['Outros']);

    if (donutChartInstance) donutChartInstance.destroy();
    donutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: document.documentElement.classList.contains('dark') ? '#151E32' : '#fff' }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${formatCurrency(ctx.raw)}` } } } }
    });
}

function chartBaseOptions(isDark) {
    return {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, grid: { color: isDark ? '#2A364D' : '#f1f5f9', drawBorder: false }, ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { size: 10 } } },
            x: { grid: { display: false, drawBorder: false }, ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { size: 10 } } }
        }
    };
}
