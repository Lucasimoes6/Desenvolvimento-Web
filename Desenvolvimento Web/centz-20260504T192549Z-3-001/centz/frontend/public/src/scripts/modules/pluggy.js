// Credenciais ficam APENAS no backend — nunca neste arquivo
const PLUGGY_CATEGORY_MAP = {
    FOOD_AND_BEVERAGE:   'Alimentação',
    TRANSPORT:           'Transporte',
    HOUSING:             'Moradia',
    HEALTH_AND_WELLNESS: 'Saúde',
    ENTERTAINMENT:       'Lazer',
    INCOME:              'Receita',
    SUBSCRIPTION:        'Lazer',
    TRANSFER:            'Outros',
    SHOPPING:            'Outros',
    EDUCATION:           'Outros',
};

async function openPluggyConnect() {
    const btn = document.getElementById('btn-connect-bank');
    btn.disabled  = true;
    btn.innerHTML = `<span class="material-symbols-outlined text-sm" style="animation:spin 1s linear infinite">sync</span> Conectando...`;

    try {
        const res = await fetch('/api/pluggy/connect-token', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ clientUserId: currentUser?.email || 'centz-user' }),
        });
        if (!res.ok) throw new Error(`Backend retornou ${res.status}`);
        const { connectToken } = await res.json();
        if (!connectToken) throw new Error('Connect token não retornado.');
        openPluggyIframe(connectToken);
    } catch (e) {
        console.error('Pluggy:', e.message);
        showToast(`Erro: ${e.message}`, 'info');
        resetConnectButton();
    }
}

function openPluggyIframe(connectToken) {
    document.getElementById('pluggy-modal')?.remove();

    const modal = document.createElement('div');
    modal.id        = 'pluggy-modal';
    modal.className = 'fixed inset-0 z-[200] flex items-center justify-center';
    modal.style.cssText = 'background:rgba(0,0,0,0.7);backdrop-filter:blur(4px)';
    modal.innerHTML = `
        <div style="position:relative;width:100%;max-width:480px;height:620px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,0.4)">
            <button onclick="document.getElementById('pluggy-modal').remove();resetConnectButton();"
                    style="position:absolute;top:12px;right:12px;z-index:10;background:#f1f5f9;border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">✕</button>
            <iframe
                src="https://connect.pluggy.ai?connectToken=${connectToken}"
                style="width:100%;height:100%;border:none;"
                allow="camera; microphone; clipboard-write">
            </iframe>
        </div>`;
    document.body.appendChild(modal);

    function onMessage(event) {
        const { type, data } = event.data || {};
        if (type === 'pluggy:connect:success' || type === 'pluggy-connect-success') {
            const itemId = data?.item?.id || data?.itemId;
            if (!itemId) return;
            modal.remove();
            window.removeEventListener('message', onMessage);
            showToast('Banco conectado! Importando transações...', 'info');
            importPluggyTransactions(itemId);
        }
        if (type === 'pluggy:connect:close' || type === 'pluggy-connect-close') {
            modal.remove();
            window.removeEventListener('message', onMessage);
            resetConnectButton();
        }
    }
    window.addEventListener('message', onMessage);
}

function resetConnectButton() {
    const btn = document.getElementById('btn-connect-bank');
    if (!btn) return;
    btn.disabled  = false;
    btn.innerHTML = `<span class="material-symbols-outlined text-sm">account_balance</span> Conectar Banco`;
}

async function importPluggyTransactions(itemId) {
    try {
        const accRes = await fetch(`/api/pluggy/accounts?itemId=${itemId}`);
        if (!accRes.ok) throw new Error('Falha ao buscar contas');
        const { results: accounts } = await accRes.json();

        const existingIds = new Set(transactions.filter(t => t.pluggyId).map(t => t.pluggyId));
        let imported = 0;

        for (const account of accounts) {
            const txRes = await fetch(`/api/pluggy/transactions?accountId=${account.id}&pageSize=100`);
            if (!txRes.ok) continue;
            const { results: list } = await txRes.json();

            for (const tx of list) {
                if (existingIds.has(tx.id)) continue;
                const isIncome = tx.amount > 0;
                transactions.push({
                    id:        Date.now() + Math.random(),
                    pluggyId:  tx.id,
                    type:      isIncome ? 'income' : 'expense',
                    value:     Math.abs(tx.amount),
                    desc:      tx.description || tx.descriptionRaw || 'Transação importada',
                    category:  PLUGGY_CATEGORY_MAP[tx.category] || (isIncome ? 'Receita' : 'Outros'),
                    date:      tx.date.split('T')[0],
                    recurring: false,
                });
                imported++;
            }
        }

        saveData();
        resetConnectButton();
        showToast(`${imported} transação(ões) importada(s) com sucesso!`);
        switchTab('transactions');
    } catch (e) {
        console.error(e);
        showToast('Erro ao importar transações.', 'info');
        resetConnectButton();
    }
}
