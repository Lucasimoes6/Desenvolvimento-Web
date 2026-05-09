function openModal(keepValues = false) {
    if (!keepValues) {
        editingTxId = null;
        document.getElementById('tx-form').reset();
        document.getElementById('tx-date').valueAsDate = new Date();
        document.getElementById('modal-title').textContent   = 'Nova Transação';
        document.getElementById('tx-submit-btn').textContent = 'Salvar Transação';
        setTxType('expense');
    }

    showOverlay('modal-overlay', 'modal-box');
}

function closeModal() {
    hideOverlay('modal-overlay', 'modal-box');
    setTimeout(() => { editingTxId = null; }, 300);
}

function setTxType(type) {
    currentTxType   = type;
    const activeCls   = 'flex-1 py-1.5 text-sm font-semibold rounded-md bg-white dark:bg-brand-darkCard text-gray-900 dark:text-white shadow-sm transition-all';
    const inactiveCls = 'flex-1 py-1.5 text-sm font-semibold rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 transition-all';
    const catSelect   = document.getElementById('tx-cat');

    document.getElementById('btn-type-expense').className = type === 'expense' ? activeCls : inactiveCls;
    document.getElementById('btn-type-income').className  = type === 'income'  ? activeCls : inactiveCls;

    catSelect.innerHTML = type === 'expense'
        ? CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')
        : `<option value="Receita">Receita / Salário</option>`;
}

document.getElementById('tx-form').addEventListener('submit', e => {
    e.preventDefault();
    const value = parseCurrency(document.getElementById('tx-val').value);
    if (value <= 0) return alert('Insira um valor válido.');

    const txData = {
        type:      currentTxType,
        value,
        desc:      document.getElementById('tx-desc').value.trim(),
        category:  document.getElementById('tx-cat').value,
        date:      document.getElementById('tx-date').value,
        recurring: document.getElementById('tx-recurring').checked,
    };

    if (editingTxId !== null) {
        const idx = transactions.findIndex(t => t.id === editingTxId);
        if (idx !== -1) transactions[idx] = { ...transactions[idx], ...txData };
        showToast('Transação atualizada!');
    } else {
        transactions.push({ id: Date.now(), ...txData });
        showToast('Transação salva com sucesso!');
    }

    saveData();
    closeModal();
});
