require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//controllers
const { bkashController } = require('./bkashController');

//app and middleware setup
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true, preflightContinue: true }));
const port = process.env.PORT || 3000;

//setup routing
app.use('/bkash', bkashController);

//start the app
app.listen(port, () => console.log('Server started @' + port));
