function filterTx(type) {
    currentTxFilter = type;
    renderAllTransactions();
}

function renderAllTransactions() {
    const tbody  = document.getElementById('all-tx-table-body');
    let filtered = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (currentTxFilter !== 'all')
        filtered = filtered.filter(t => t.type === currentTxFilter);

    if (searchQuery)
        filtered = filtered.filter(t =>
            t.desc.toLowerCase().includes(searchQuery) ||
            t.category.toLowerCase().includes(searchQuery)
        );

    tbody.innerHTML = filtered.length === 0
        ? `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">${searchQuery ? 'Nenhum resultado para "' + searchQuery + '".' : 'Nenhuma transação encontrada.'}</td></tr>`
        : filtered.map(generateTxRow).join('');
}

function generateTxRow(tx) {
    const isIncome   = tx.type === 'income';
    const colorClass = isIncome ? 'text-brand-green' : 'text-gray-900 dark:text-white';
    const prefix     = isIncome ? '+' : '-';
    const catColor   = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS['Outros'];
    const recurBadge = tx.recurring
        ? `<span class="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-500 border border-blue-200 dark:border-blue-800">↻ FIXO</span>`
        : '';

    return `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-[#0B1121]">
                        <span class="material-symbols-outlined text-[18px] ${isIncome ? 'text-brand-green' : 'text-gray-500'}">${isIncome ? 'south_west' : 'north_east'}</span>
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">${tx.desc}</span>${recurBadge}
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-semibold border" style="color:${catColor};border-color:${catColor}40;background-color:${catColor}10">${tx.category}</span>
            </td>
            <td class="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">${formatDate(tx.date)}</td>
            <td class="px-6 py-4 text-right font-semibold ${colorClass}">${prefix} ${formatCurrency(tx.value)}</td>
            <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="editTx(${tx.id})" class="text-gray-400 hover:text-brand-green">
                        <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onclick="deleteTx(${tx.id})" class="text-gray-400 hover:text-red-500">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            </td>
        </tr>`;
}

function editTx(id) {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    editingTxId = id;

    setTxType(tx.type);
    document.getElementById('tx-val').value      = formatCurrency(tx.value);
    document.getElementById('tx-desc').value     = tx.desc;
    document.getElementById('tx-cat').value      = tx.category;
    document.getElementById('tx-date').value     = tx.date;
    document.getElementById('tx-recurring').checked = !!tx.recurring;
    document.getElementById('modal-title').textContent  = 'Editar Transação';
    document.getElementById('tx-submit-btn').textContent = 'Atualizar';
    openModal(true);
}

function deleteTx(id) {
    showConfirm('Excluir esta transação? Esta ação não pode ser desfeita.', () => {
        transactions = transactions.filter(t => t.id !== id);
        saveData();
        showToast('Transação excluída.', 'info');
    });
}
