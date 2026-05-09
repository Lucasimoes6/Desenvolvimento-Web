const express      = require('express');
const path         = require('path');
const cors         = require('./src/middlewares/cors.middleware');
const errorHandler = require('./src/middlewares/error.middleware');
const pluggyRoutes = require('./src/modules/pluggy/pluggy.routes');

const app = express();

app.use(cors);
app.use(express.json());

// ── Rotas da API ──────────────────────────────────────────────────────────────
app.use('/api/pluggy', pluggyRoutes);

// ── Frontend estático ─────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'))
);

app.use(errorHandler);
module.exports = app;
