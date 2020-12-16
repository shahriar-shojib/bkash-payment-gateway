# bkash-payment-gateway

Nodejs library to accept bkash payments on your backend application

---

# How to use

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

const result = await bkash.createPayment();
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

### Contributing

-   Please Follow the code style and use the prettier config and eslint config provided in the repository
-   Feel free to open `issues` or `pull request` for any issues and bugfixes
-   If you want to implement new features or write documentation about existing features feel free to do it as well
-   To see a list of missing features or to-do's, please visit the `project` section of the github repository

---

### License

> MIT

> DISCLAIMER: This software comes with absolutely no warranty and is not affiliated with the company **`Bkash`** in any way. Use at your own risk. Author and Contributors are not responsible for any financial damages, outages etc.

### Author

[Shahriar Shojib](https://github.com/shahriar-shojib)
