const BkashGateway = require('bkash-payment-gateway');

const bkash = new BkashGateway({
	baseURL: 'https://checkout.sandbox.bka.sh/v1.2.0-beta',
	key: '5tunt4masn6pv2hnvte1sb5n3j',
	username: 'sandboxTestUser',
	password: 'hWD@8vtzw0',
	secret: '1vggbqd4hqk9g96o9rrrp2jftvek578v7d2bnerim12a87dbrrka',
});

module.exports = bkash;
