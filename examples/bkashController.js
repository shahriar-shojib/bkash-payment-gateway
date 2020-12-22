const express = require('express');
const bkash = require('./modules/bkash');
const bkashController = express.Router();

bkashController.post('/create', async (req, res) => {
	try {
		const paymentInfo = req.body; //validate body here

		const result = await bkash.createPayment({
			//check bkash response here and store paymentID to Database if needed
			amount: paymentInfo.amount,
			orderID: paymentInfo.orderID,
			intent: 'sale',
		});

		return res.status(201).json(result);
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message });
	}
});

bkashController.post('/execute', async (req, res) => {
	try {
		const { paymentID } = req.body;
		if (!paymentID || paymentID === '') throw new Error('Invalid Payment ID provided');
		const result = await bkash.executePayment(paymentID);
		return res.json(result);
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message });
	}
});

bkashController.get('/query/:paymentID', async (req, res) => {
	try {
		const paymentID = req.params.paymentID;
		if (!paymentID || paymentID === '') throw new Error('Invalid Payment ID provided');
		const result = await bkash.queryPayment(paymentID);
		return res.json({ success: true, data: result });
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message });
	}
});

bkashController.get('/search/:trxID', async (req, res) => {
	try {
		const trxID = req.params.trxID;
		if (!trxID || trxID === '') throw new Error('Invalid Transaction ID provided');
		const result = await bkash.searchTransaction(trxID);
		return res.json({ success: true, data: result });
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message });
	}
});

bkashController.post('/refund', async (req, res) => {
	try {
		const { paymentID, amount, trxID, sku } = req.body; //validate input here
		const refunTransactionData = {
			paymentID,
			amount,
			trxID,
			sku,
		};
		const result = await bkash.refundTransaction(refunTransactionData);
		return res.status(201).json({ success: true, data: result });
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message });
	}
});
module.exports = { bkashController };
