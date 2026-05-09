const { pluggy } = require('../../config/env');

async function getApiKey() {
    const res = await fetch(`${pluggy.apiUrl}/auth`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ clientId: pluggy.clientId, clientSecret: pluggy.clientSecret }),
    });
    if (!res.ok) throw new Error(`Auth falhou: ${res.status}`);
    return (await res.json()).apiKey;
}

async function getConnectToken(clientUserId) {
    const apiKey = await getApiKey();
    const res    = await fetch(`${pluggy.apiUrl}/connect_token`, {
        method:  'POST',
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ clientUserId }),
    });
    if (!res.ok) throw new Error(`Connect token falhou: ${res.status}`);
    return (await res.json()).accessToken;
}

async function getAccounts(itemId) {
    const apiKey = await getApiKey();
    const res    = await fetch(`${pluggy.apiUrl}/accounts?itemId=${itemId}`, {
        headers: { 'X-API-KEY': apiKey },
    });
    if (!res.ok) throw new Error(`Contas falhou: ${res.status}`);
    return res.json();
}

async function getTransactions(accountId, pageSize = 100) {
    const apiKey = await getApiKey();
    const res    = await fetch(`${pluggy.apiUrl}/transactions?accountId=${accountId}&pageSize=${pageSize}`, {
        headers: { 'X-API-KEY': apiKey },
    });
    if (!res.ok) throw new Error(`Transações falhou: ${res.status}`);
    return res.json();
}

module.exports = { getConnectToken, getAccounts, getTransactions };
