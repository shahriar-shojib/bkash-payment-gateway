# bkash-payment-gateway

Nodejs library to accept bkash payments on your backend application

![CodeQL](https://github.com/shahriar-shojib/bkash-payment-gateway/workflows/CodeQL/badge.svg)
![Test for linting and formatting](https://github.com/shahriar-shojib/bkash-payment-gateway/workflows/Test%20for%20linting%20and%20formatting/badge.svg)
![Publish to NPM and Github Packages](https://github.com/shahriar-shojib/bkash-payment-gateway/workflows/Publish%20to%20NPM%20and%20Github%20Packages/badge.svg)

## Examples

- [Express](https://github.com/shahriar-shojib/bkash-payment-gateway/tree/main/examples)

## Features

- Implements all the methods required to get accepted as a merchant on bKash
- Written in typescript
- Get intellisense in when interacting with the library `vscode`
- Get Documentation and examples right inside your code editor `vscode`
- Get Bkash Response Intellisense
- Abort Request when an executePayment request exceeds `30 seconds` and get an error so that you can query the payment
- Get Human Readable exceptions when some error response is returned from bKash `in progress`

---

# How to use

## Installing the library

### `npm`

> `npm install bkash-payment-gateway`

### `yarn`

> `yarn add bkash-payment-gateway`

---

## Initializing the library

### `javascript`

> file `bkash.js`

```javascript
const BkashGateway = require('bkash-payment-gateway');

const bkashConfig = {
	baseURL: 'https://checkout.sandbox.bka.sh/v1.2.0-beta', //do not add a trailing slash
	key: 'abcdxx2369',
	username: 'bkashTest',
	password: 'bkashPassword1',
	secret: 'bkashSup3rS3cRet',
};

const bkash = new BkashGateway(config);
module.exports = bkash;
```

### `typescript`

> file `bkash.ts`

```typescript
import BkashGateway, { ICreatePayment } from 'bkash-payment-gatway';

const bkashConfig: ICreatePayment = {
	//get intellisense here
	baseURL: 'https://checkout.sandbox.bka.sh/v1.2.0-beta', //do not add a trailing slash
	key: 'abcdxx2369',
	username: 'bkashTest',
	password: 'bkashPassword1',
	secret: 'bkashSup3rS3cRet',
};

const bkash = new BkashGateway(config);
export default bkash;
```

---

## Create a payment

```javascript
const paymentRequest = {
	amount: 1000,
	orderID: 'ORD1020069',
	intent: 'sale',
};

const result = await bkash.createPayment(paymentRequest);
console.log(result);
```

---

## Execute a payment with payment ID

```javascript
const result = await bkash.executePayment('<Payment ID returned by bkash>');
```

---

## Query a payment with payment ID

```javascript
const result = await bkash.queryPayment('<Payment ID returned by bkash>');
```

---

## Search Transaction

```javascript
const result = await bkash.searchTransaction('TRX22347463XX');
```

---

## Refund a transaction

```javascript
const refundTransactionData = {
	paymentID: '22423169',
	amount: '25.69', //do not add more than two decimal points
 	trxID: 'TRX22347463XX';
 	sku: 'SK256519';
}

const result = await bkash.refundTransaction(refundTransactionData);
```

---

## Check Refund Status

```javascript
const result = await bkash.refundStatus('TRX22347463XX', '12437969');
```

---

### Contributing

- Please Follow the code style and use the prettier config and eslint config provided in the repository
- Feel free to open `issues` or `pull request` for any issues and bugfixes
- If you want to implement new features or write documentation about existing features feel free to do it as well
- To see a list of missing features or to-do's, please visit the `project` section of the github repository

---

### License

> MIT

> DISCLAIMER: This software comes with absolutely no warranty and is not affiliated with the company **`Bkash`** in any way. Use at your own risk. Author and Contributors are not responsible for any financial damages, outages etc.

### Author

[Shahriar Shojib](https://github.com/shahriar-shojib)
