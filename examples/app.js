const express = require('express');
const bodyParser = require('body-parser');
const { bkashController } = require('./bkashController');

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.use('/bkash', bkashController);
app.listen(port, () => console.log('Server started @' + port));
