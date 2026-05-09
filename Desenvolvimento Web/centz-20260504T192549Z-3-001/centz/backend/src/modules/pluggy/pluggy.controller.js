const pluggyService = require('./pluggy.service');

const connectToken = async (req, res, next) => {
    try {
        const clientUserId = req.body?.clientUserId || 'centz-user';
        const token        = await pluggyService.getConnectToken(clientUserId);
        res.json({ connectToken: token });
    } catch (e) { next(e); }
};

const accounts = async (req, res, next) => {
    try {
        const { itemId } = req.query;
        if (!itemId) return res.status(400).json({ error: 'itemId obrigatório' });
        res.json(await pluggyService.getAccounts(itemId));
    } catch (e) { next(e); }
};

const transactions = async (req, res, next) => {
    try {
        const { accountId, pageSize } = req.query;
        if (!accountId) return res.status(400).json({ error: 'accountId obrigatório' });
        res.json(await pluggyService.getTransactions(accountId, pageSize));
    } catch (e) { next(e); }
};

module.exports = { connectToken, accounts, transactions };
