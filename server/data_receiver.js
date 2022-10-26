const database = require('./database.js')

module.exports = {
    handleData: function(req, res) {
        res.status(200).send("Ok");
        const pzn = req.body['pzn'];
        console.log(`Reiceved the drug with the PZN ${pzn}`);
        database.addDrug(pzn);
    }
};