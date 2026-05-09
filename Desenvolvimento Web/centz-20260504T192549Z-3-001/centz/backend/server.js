require('dotenv').config();
const app  = require('./app');
const { port } = require('./src/config/env');

app.listen(port, () =>
    console.log(`CENTZ backend rodando em http://localhost:${port}`)
);
