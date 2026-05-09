const express    = require('express');
const controller = require('./pluggy.controller');

const router = express.Router();

router.post('/connect-token', controller.connectToken);
router.get('/accounts',       controller.accounts);
router.get('/transactions',   controller.transactions);

module.exports = router;
