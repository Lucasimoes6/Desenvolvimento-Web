function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    const isSuccess = type === 'success';
    const icon    = isSuccess ? 'check_circle' : 'info';
    const color   = isSuccess ? 'text-brand-green' : 'text-blue-500';
    const bgColor = isSuccess
        ? 'bg-emerald-50 dark:bg-emerald-900/20'
        : 'bg-blue-50 dark:bg-blue-900/20';

    toast.className = `flex items-center gap-3 bg-white dark:bg-brand-darkCard border border-gray-100 dark:border-brand-darkBorder shadow-lg rounded-xl p-4 toast-enter`;
    toast.innerHTML = `
        <div class="w-8 h-8 rounded-full ${bgColor} flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined ${color} text-[18px]">${icon}</span>
        </div>
        <p class="text-sm font-medium text-gray-900 dark:text-white">${message}</p>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.replace('toast-enter', 'toast-leave');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
