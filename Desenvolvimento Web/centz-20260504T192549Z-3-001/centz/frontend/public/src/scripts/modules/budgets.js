function renderBudgets() {
    const container = document.getElementById('budgets-container');
    const spentByCategory = {};

    transactions.forEach(tx => {
        const d = new Date(tx.date + 'T00:00:00');
        if (tx.type === 'expense' && d.getMonth() === selectedMonth && d.getFullYear() === selectedYear)
            spentByCategory[tx.category] = (spentByCategory[tx.category] || 0) + tx.value;
    });

    const active = Object.keys(budgets).filter(c => budgets[c] > 0);

    if (active.length === 0) {
        container.innerHTML = `
            <div class="col-span-full bg-white dark:bg-brand-darkCard p-10 rounded-2xl border border-gray-100 dark:border-brand-darkBorder text-center">
                <span class="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">pie_chart</span>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Nenhum orçamento definido</h3>
                <p class="text-sm text-gray-500 mt-1">Crie limites de gastos para manter sua saúde financeira.</p>
            </div>`;
        return;
    }

    container.innerHTML = active.map(cat => {
        const limit    = budgets[cat];
        const spent    = spentByCategory[cat] || 0;
        const pct      = Math.min((spent / limit) * 100, 100);
        const isOver   = spent > limit;
        const barColor = isOver ? '#ef4444' : (CATEGORY_COLORS[cat] || CATEGORY_COLORS['Outros']);

        return `
            <div class="bg-white dark:bg-brand-darkCard p-6 rounded-2xl border border-gray-100 dark:border-brand-darkBorder shadow-sm">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-gray-900 dark:text-white">${cat}</h3>
                    <div class="flex items-center gap-3">
                        <span class="text-xs font-semibold ${isOver ? 'text-red-500' : 'text-gray-500'}">${Math.round(pct)}%</span>
                        <button onclick="removeBudget('${cat}')" class="text-gray-300 hover:text-red-500 transition-colors">
                            <span class="material-symbols-outlined text-[16px]">close</span>
                        </button>
                    </div>
                </div>
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-500">Gasto: <span class="font-semibold text-gray-900 dark:text-white">${formatCurrency(spent)}</span></span>
                    <span class="text-gray-500">Limite: ${formatCurrency(limit)}</span>
                </div>
                <div class="w-full bg-gray-100 dark:bg-[#0B1121] rounded-full h-2">
                    <div class="h-2 rounded-full transition-all duration-500" style="width:${pct}%;background-color:${barColor}"></div>
                </div>
                ${isOver ? `<p class="text-xs text-red-500 mt-3 font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">warning</span> Limite ultrapassado em ${formatCurrency(spent - limit)}!</p>` : ''}
            </div>`;
    }).join('');
}

function removeBudget(cat) {
    showConfirm(`Remover o orçamento de ${cat}?`, () => {
        delete budgets[cat];
        saveData();
        showToast(`Orçamento de ${cat} removido.`, 'info');
    });
}

function openBudgetModal() {
    document.getElementById('budget-form').innerHTML = CATEGORIES.map(cat => `
        <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">${cat}</label>
            <input type="text" id="bdg-${cat}" placeholder="Sem limite"
                   value="${budgets[cat] ? formatCurrency(budgets[cat]) : ''}"
                   oninput="maskCurrency(this)"
                   class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-brand-darkBorder bg-gray-50 dark:bg-[#0B1121] focus:ring-2 focus:ring-brand-green outline-none dark:text-white transition-all">
        </div>`).join('');
    showOverlay('budget-modal-overlay', 'budget-modal-box');
}

function closeBudgetModal() {
    hideOverlay('budget-modal-overlay', 'budget-modal-box');
}

function saveBudgets() {
    CATEGORIES.forEach(cat => {
        const val = parseCurrency(document.getElementById(`bdg-${cat}`).value);
        if (val > 0) budgets[cat] = val;
        else delete budgets[cat];
    });
    saveData();
    closeBudgetModal();
    showToast('Orçamentos atualizados!');
}
