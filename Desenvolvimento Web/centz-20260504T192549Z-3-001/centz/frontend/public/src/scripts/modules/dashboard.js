function navigateMonth(dir) {
    selectedMonth += dir;
    if (selectedMonth > 11) { selectedMonth = 0; selectedYear++; }
    if (selectedMonth < 0)  { selectedMonth = 11; selectedYear--; }
    updateAllViews();
}

function updateMonthLabel() {
    const label = new Date(selectedYear, selectedMonth, 1)
        .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    document.getElementById('month-label').textContent = label.charAt(0).toUpperCase() + label.slice(1);

    const now = new Date();
    const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();
    document.getElementById('btn-next-month').disabled = isCurrentMonth;
    document.getElementById('btn-next-month').classList.toggle('opacity-30', isCurrentMonth);
}

function calculateHealthScore(income, expense, spentByCategory) {
    if (income === 0) return 0;
    const savingsRate  = Math.max(0, (income - expense) / income);
    const expenseRatio = Math.min(expense / income, 1);
    const active       = Object.keys(budgets).filter(c => budgets[c] > 0);
    const budgetScore  = active.length === 0
        ? 1
        : active.filter(c => (spentByCategory[c] || 0) <= budgets[c]).length / active.length;
    return Math.min(100, Math.max(0, Math.round(savingsRate * 50 + budgetScore * 30 + (1 - expenseRatio) * 20)));
}

function updateDashboard() {
    updateMonthLabel();

    let totalIncome = 0, totalExpense = 0, totalBalance = 0;
    const categoryTotals = {};

    transactions.forEach(tx => {
        const d              = new Date(tx.date + 'T00:00:00');
        const isSelected     = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        if (tx.type === 'income') {
            totalBalance += tx.value;
            if (isSelected) totalIncome += tx.value;
        } else {
            totalBalance -= tx.value;
            if (isSelected) {
                totalExpense += tx.value;
                categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.value;
            }
        }
    });

    // Animate cards
    const saldoEl = document.getElementById('card-saldo');
    saldoEl.className = `text-3xl font-bold mb-4 ${totalBalance < 0 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`;
    animateCounter(saldoEl, totalBalance, v => formatCurrencyWithSign(v));
    animateCounter(document.getElementById('card-receitas-mini'), totalIncome,  formatCurrency);
    animateCounter(document.getElementById('card-despesas-mini'), totalExpense, formatCurrency);
    animateCounter(document.getElementById('card-income'),        totalIncome,  formatCurrency);
    animateCounter(document.getElementById('card-expense'),       totalExpense, formatCurrency);

    const expensePct = totalIncome > 0 ? Math.min((totalExpense / totalIncome) * 100, 100) : 0;
    document.getElementById('expense-bar').style.width      = `${expensePct}%`;
    document.getElementById('expense-pct-text').textContent = `${Math.round(expensePct)}% da sua renda gasta`;

    const statusEl = document.getElementById('expense-status');
    if (expensePct > 80) { statusEl.textContent = 'Crítico';   statusEl.className = 'text-xs font-semibold text-red-500'; }
    else if (expensePct > 50) { statusEl.textContent = 'Atenção'; statusEl.className = 'text-xs font-semibold text-amber-500'; }
    else { statusEl.textContent = 'Saudável'; statusEl.className = 'text-xs font-semibold text-brand-green'; }

    // Health score
    const score     = calculateHealthScore(totalIncome, totalExpense, categoryTotals);
    const scoreEl   = document.getElementById('health-score');
    const scoreLbl  = document.getElementById('health-label');
    const scoreBar  = document.getElementById('health-bar');
    animateCounter(scoreEl, score, v => Math.round(v).toString());
    scoreBar.style.width = `${score}%`;
    if (score >= 70) { scoreBar.style.backgroundColor = '#059669'; scoreLbl.textContent = 'Excelente'; scoreLbl.className = 'text-xs font-semibold text-brand-green'; }
    else if (score >= 40) { scoreBar.style.backgroundColor = '#f59e0b'; scoreLbl.textContent = 'Regular'; scoreLbl.className = 'text-xs font-semibold text-amber-500'; }
    else { scoreBar.style.backgroundColor = '#ef4444'; scoreLbl.textContent = 'Crítico'; scoreLbl.className = 'text-xs font-semibold text-red-500'; }

    renderRecentTransactions();
    renderCategories(categoryTotals, totalExpense);
    if (activeChartTab === 'trend') renderChart();
    else renderBarChart();
}

function renderRecentTransactions() {
    const tbody   = document.getElementById('tx-table-body');
    const recent  = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    tbody.innerHTML = recent.length === 0
        ? `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">Nenhuma transação recente.</td></tr>`
        : recent.map(generateTxRow).join('');
}

function renderCategories(totals, totalExpense) {
    const container  = document.getElementById('category-list');
    const sorted     = Object.entries(totals).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
        if (donutChartInstance) { donutChartInstance.destroy(); donutChartInstance = null; }
        document.getElementById('donut-wrap').classList.add('hidden');
        container.innerHTML = '<p class="text-sm text-gray-500 text-center py-6">Nenhum gasto registrado.</p>';
        return;
    }

    document.getElementById('donut-wrap').classList.remove('hidden');
    renderDonutChart(sorted);

    container.innerHTML = sorted.map(([cat, val]) => {
        const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS['Outros'];
        const pct   = totalExpense > 0 ? ((val / totalExpense) * 100).toFixed(0) : 0;
        return `
            <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full shrink-0" style="background:${color}"></span>
                    <span class="text-gray-600 dark:text-gray-300">${cat}</span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-gray-400">${pct}%</span>
                    <span class="font-semibold text-gray-900 dark:text-white">${formatCurrency(val)}</span>
                </div>
            </div>`;
    }).join('');
}
