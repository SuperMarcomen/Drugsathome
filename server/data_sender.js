const database = require('./database.js')

module.exports = {
    sendData: async function(req, res) {
        const drugs = await database.getDrugs();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(JSON.stringify(drugs));
    }
};