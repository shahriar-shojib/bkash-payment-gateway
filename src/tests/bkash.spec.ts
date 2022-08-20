import { config } from 'dotenv';
import BkashGateway from '..';
import { BkashException } from '../exceptions/bkashException';

config();

jest.setTimeout(30000);

describe('Bkash API', () => {
	const bkash = new BkashGateway({
		baseURL: process.env.BKASH_BASEURL!,
		key: process.env.BKASH_API_KEY!,
		secret: process.env.BKASH_API_SECRET!,
		password: process.env.BKASH_PASSWORD!,
		username: process.env.BKASH_USERNAME!,
	});

	it('should create a payment', async () => {
		const payment = await bkash.createPayment({
			amount: 100,
			intent: 'sale',
			orderID: 'ORD1020069',
		});

		expect(payment).toBeDefined();
		expect(payment.amount).toBe('100');
		expect(payment.intent).toBe('sale');
		expect(payment.paymentID).toBeDefined();
	});

	it('should be able to query a payment by paymentID', async () => {
		const payment = await bkash.createPayment({
			amount: 100,
			intent: 'sale',
			orderID: 'ORD1020069',
		});

		const paymentQuery = await bkash.queryPayment(payment.paymentID);

		expect(paymentQuery).toBeDefined();

		expect(paymentQuery.amount).toBe('100');
		expect(paymentQuery.intent).toBe('sale');

		expect(paymentQuery.transactionStatus).toBe('Initiated');
		expect(paymentQuery.merchantInvoiceNumber).toBe('ORD1020069');
	});

	it('should fail to execute payment if invalid payment ID was provided', async () => {
		let success = false;
		try {
			await bkash.executePayment('PAYMENT_ID');
			success = true;
		} catch (error) {
			expect(error).toStrictEqual(new BkashException('Invalid Payment ID'));
		}
		expect(success).toBe(false);
	});

	it('should be fail to execute payment if the user did not authorize the payment', async () => {
		const payment = await bkash.createPayment({
			amount: 100,
			intent: 'sale',
			orderID: 'ORD1020069',
		});

		let success = false;
		try {
			await bkash.executePayment(payment.paymentID);
			success = true;
		} catch (error) {
			expect(error).toStrictEqual(new BkashException('Invalid Payment ID'));
		}
		expect(success).toBe(false);
	});
});
