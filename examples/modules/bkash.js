const BkashGateway = require('bkash-payment-gateway');

const bkash = new BkashGateway({
	baseURL: 'https://checkout.sandbox.bka.sh/v1.2.0-beta/',
	key: 'abcdxx2369',
	username: 'bkashTest',
	password: 'bkashPassword1',
	secret: 'bkashSup3rS3cRet',
});

module.exports = bkash;
