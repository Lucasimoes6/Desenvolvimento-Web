function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatCurrencyWithSign(value) {
    const f = formatCurrency(Math.abs(value));
    return value < 0 ? `- ${f}` : f;
}

function parseCurrency(str) {
    return parseFloat(str.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}

function maskCurrency(input) {
    let v = input.value.replace(/\D/g, '');
    if (!v) { input.value = ''; return; }
    v = (parseInt(v) / 100).toFixed(2);
    input.value = 'R$ ' + v.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function formatDate(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function animateCounter(el, target, formatter) {
    const duration = 650;
    const start    = performance.now();
    const tick = now => {
        const t    = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = formatter(target * ease);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = formatter(target);
    };
    requestAnimationFrame(tick);
}

function maskDocument(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 14);
    if (v.length <= 11) {
        // CPF: 000.000.000-00
        v = v.replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        // CNPJ: 00.000.000/0000-00
        v = v.replace(/(\d{2})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d)/, '$1/$2')
             .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    input.value = v;
}

// Generic modal helpers — used by all modal open/close functions
function showOverlay(overlayId, boxId) {
    const overlay = document.getElementById(overlayId);
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        document.getElementById(boxId).classList.remove('scale-95');
    }, 10);
}

function hideOverlay(overlayId, boxId) {
    const overlay = document.getElementById(overlayId);
    overlay.classList.add('opacity-0');
    document.getElementById(boxId).classList.add('scale-95');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

function exportCSV() {
    const headers = ['Descrição', 'Categoria', 'Tipo', 'Valor', 'Data', 'Recorrente'];
    const rows = transactions
        .filter(tx => {
            const d = new Date(tx.date + 'T00:00:00');
            return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        })
        .map(tx => [
            `"${tx.desc}"`,
            tx.category,
            tx.type === 'income' ? 'Receita' : 'Despesa',
            tx.value.toFixed(2).replace('.', ','),
            tx.date,
            tx.recurring ? 'Sim' : 'Não',
        ]);

    const csv  = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: `centz_${selectedYear}_${String(selectedMonth + 1).padStart(2, '0')}.csv` });
    a.click();
    URL.revokeObjectURL(url);
}
