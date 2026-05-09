function loadData() {
    transactions = JSON.parse(localStorage.getItem(`centz_tx_${currentUser.email}`)    || '[]');
    budgets      = JSON.parse(localStorage.getItem(`centz_bdg_${currentUser.email}`)   || '{}');
    savingsGoals = JSON.parse(localStorage.getItem(`centz_goals_${currentUser.email}`) || '[]');
    updateAllViews();
}

function saveData() {
    localStorage.setItem(`centz_tx_${currentUser.email}`,    JSON.stringify(transactions));
    localStorage.setItem(`centz_bdg_${currentUser.email}`,   JSON.stringify(budgets));
    localStorage.setItem(`centz_goals_${currentUser.email}`, JSON.stringify(savingsGoals));
    updateAllViews();
}
