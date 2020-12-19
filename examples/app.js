require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

//controllers
const { bkashController } = require('./bkashController');

//app and middleware setup
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

//setup routing
app.use('/bkash', bkashController);

//start the app
app.listen(port, () => console.log('Server started @' + port));
