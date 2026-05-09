function renderGoals() {
    const container = document.getElementById('goals-container');
    if (!container) return;

    if (savingsGoals.length === 0) {
        container.innerHTML = `
            <div class="col-span-full bg-white dark:bg-brand-darkCard p-10 rounded-2xl border border-gray-100 dark:border-brand-darkBorder text-center">
                <span class="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">savings</span>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Nenhuma meta criada</h3>
                <p class="text-sm text-gray-500 mt-1">Defina objetivos financeiros para manter o foco.</p>
            </div>`;
        return;
    }

    container.innerHTML = savingsGoals.map(goal => {
        const pct       = Math.min((goal.current / goal.target) * 100, 100);
        const remaining = Math.max(goal.target - goal.current, 0);
        const done      = goal.current >= goal.target;
        return `
            <div class="bg-white dark:bg-brand-darkCard p-6 rounded-2xl border border-gray-100 dark:border-brand-darkBorder shadow-sm">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="font-bold text-gray-900 dark:text-white">${goal.name}</h3>
                    <button onclick="deleteGoal(${goal.id})" class="text-gray-400 hover:text-red-500 transition-colors">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
                <div class="flex items-end justify-between mb-3">
                    <div>
                        <p class="text-2xl font-bold" style="color:${goal.color}">${formatCurrency(goal.current)}</p>
                        <p class="text-xs text-gray-500 mt-0.5">de ${formatCurrency(goal.target)}</p>
                    </div>
                    <span class="text-2xl font-bold text-gray-300 dark:text-gray-600">${Math.round(pct)}%</span>
                </div>
                <div class="w-full bg-gray-100 dark:bg-[#0B1121] rounded-full h-2.5 mb-3">
                    <div class="h-2.5 rounded-full transition-all duration-700" style="width:${pct}%;background:${goal.color}"></div>
                </div>
                ${done
                    ? `<p class="text-xs font-semibold text-brand-green flex items-center gap-1 mb-3"><span class="material-symbols-outlined text-[14px]">check_circle</span> Meta atingida!</p>`
                    : `<p class="text-xs text-gray-500 mb-3">Faltam <span class="font-semibold text-gray-900 dark:text-white">${formatCurrency(remaining)}</span></p>`
                }
                <div class="flex gap-2">
                    <input type="text" id="add-val-${goal.id}" placeholder="R$ 0,00" oninput="maskCurrency(this)"
                           class="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-brand-darkBorder bg-gray-50 dark:bg-[#0B1121] outline-none focus:ring-2 focus:ring-brand-green dark:text-white transition-all">
                    <button onclick="addToGoal(${goal.id})"
                            class="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                            style="background:${goal.color}">
                        + Adicionar
                    </button>
                </div>
            </div>`;
    }).join('');
}

function addToGoal(id) {
    const input = document.getElementById(`add-val-${id}`);
    const val   = parseCurrency(input.value);
    if (val <= 0) { showToast('Insira um valor válido.', 'info'); return; }
    const goal  = savingsGoals.find(g => g.id === id);
    if (!goal) return;
    goal.current = Math.min(goal.current + val, goal.target);
    input.value  = '';
    saveData();
    showToast(`${formatCurrency(val)} adicionado à meta!`);
}

function deleteGoal(id) {
    showConfirm('Excluir esta meta de poupança?', () => {
        savingsGoals = savingsGoals.filter(g => g.id !== id);
        saveData();
        showToast('Meta excluída.', 'info');
    });
}

function openGoalModal() {
    document.getElementById('goal-form').reset();
    document.getElementById('goal-color').value = '#059669';
    showOverlay('goal-modal-overlay', 'goal-modal-box');
}

function closeGoalModal() {
    hideOverlay('goal-modal-overlay', 'goal-modal-box');
}

document.getElementById('goal-form').addEventListener('submit', e => {
    e.preventDefault();
    const target  = parseCurrency(document.getElementById('goal-target').value);
    const current = parseCurrency(document.getElementById('goal-current').value);
    if (target <= 0) return alert('Insira um valor alvo válido.');

    savingsGoals.push({
        id:      Date.now(),
        name:    document.getElementById('goal-name').value.trim(),
        target,
        current: Math.min(current, target),
        color:   document.getElementById('goal-color').value,
    });

    saveData();
    closeGoalModal();
    showToast('Meta criada com sucesso!');
});
