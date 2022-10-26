fs = require('fs')
https = require('https')
const cors = require('cors')

const express = require('express');
const app = express();
app.use(cors())

var bodyParser = require('body-parser');

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const dataReceiver = require('./data_receiver.js');
app.post('/add_drugs', cors(), (req, res) => {
  dataReceiver.handleData(req, res);
})

const dataSender = require('./data_sender.js');
app.get('/get_drugs', cors(), (req, res) => {
  dataSender.sendData(req, res);
})

var privateKey = fs.readFileSync('certificates/privkey.pem');
var certificate = fs.readFileSync('certificates/fullchain.pem');

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(3000);