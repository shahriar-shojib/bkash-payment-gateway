export interface IBkashTokenResponse {
	expires_in: string;
	id_token: string;
	refresh_token: string;
	token_type: string;
	status?: string;
	msg?: string;
}

export interface IBkashCreatePaymentResponse {
	paymentID: string;
	createTime: string;
	orgLogo: string;
	orgName: string;
	transactionStatus: string;
	amount: string;
	currency: string;
	intent: string;
	merchantInvoiceNumber: string;
	//need to implement error cases here
}

export interface IBkashExecutePaymentResponse {
	paymentID: string;
	createTime: string;
	updateTime: string;
	trxID: string;
	transactionStatus: string;
	amount: string;
	currency: string;
	intent: string;
	merchantInvoiceNumber: string;
}

export interface IBkashQueryPaymentResponse {
	paymentID: string;
	createTime: string;
	updateTime: string;
	trxID: string;
	transactionStatus: string;
	amount: string;
	currency: string;
	intent: string;
	merchantInvoiceNumber: string;
	refundAmount: string;
}
