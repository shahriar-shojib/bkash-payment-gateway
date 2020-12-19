const BkashGateway = require('bkash-payment-gateway');

const bkash = new BkashGateway({
	baseURL: process.env.BKASH_BASEURL,
	key: process.env.BKASH_API_KEY,
	secret: process.env.BKASH_API_SECRET,
	username: process.env.BKASH_USERNAME,
	password: process.env.BKASH_PASSWORD,
});

module.exports = bkash;
