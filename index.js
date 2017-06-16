const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config/database');
const authentication = require('./routes/authentication')(router);

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err) {
        console.log('Cannot connect to database ' + err);
    } else {
        //console.log(config.secret);
        console.log('Connected to database ' + config.db);
    }
});

//cors
app.use(cors());

//body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/client/src/'));
app.use('/authentication', authentication);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/src/index.html'));
});

app.listen(8080, () => {
    console.log('Server Listening on 8080');
});