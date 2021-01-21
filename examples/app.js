require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//controllers
const { bkashController } = require('./bkashController');
const { test } = require('./test');

//app and middleware setup
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true, preflightContinue: true }));
const port = process.env.PORT || 3000;

//setup routing
app.use('/bkash', bkashController);
app.get('/', (_, res) => {
	return res.send('hello world');
});
//start the app
app.listen(port, () => {
	console.log('Server started @' + port);
	test();
});
