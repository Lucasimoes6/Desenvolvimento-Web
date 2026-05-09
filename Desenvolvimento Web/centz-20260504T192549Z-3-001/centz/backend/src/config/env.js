module.exports = {
    pluggy: {
        clientId:     process.env.PLUGGY_CLIENT_ID,
        clientSecret: process.env.PLUGGY_CLIENT_SECRET,
        apiUrl:       'https://api.pluggy.ai',
    },
    port: process.env.PORT || 3001,
};
