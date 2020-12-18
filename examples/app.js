const express = require('express');
const { bkashController } = require('./bkashController');

const app = express();
const port = process.env.PORT || 3000;
app.use('/bkash', bkashController);
app.listen(port, () => console.log('Server started @' + port));
