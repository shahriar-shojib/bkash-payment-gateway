import { IHeaders } from './interfaces/headers.interface';
import { diffSeconds } from './utils/diffSeconds';
import { get, post } from './utils/request';

import {
	IBkashCreatePaymentResponse,
	IBkashExecutePaymentResponse,
	IBkashQueryPaymentResponse,
	IBkashRefundResponse,
	IBkashRefundStatusResponse,
	IBkashSearchTransactionResponse,
	IBkashTokenResponse,
} from './interfaces/bkashResponse.interface';

import { BkashException } from './exceptions/bkashException';
import { ICreatePayment } from './interfaces/createPayment.interface';
import { IBkashConstructor, IRefundArgs } from './interfaces/main.interface';

/**
 * Bkash Payment Gateway Main Entrypoint
 * @example
 * ```javascript
 * const BkashGateway = require('bkash-payment-gateway');
 * const bkash = new BkashGateway({
 *		baseURL: process.env.BKASH_BASEURL,
 *		key: process.env.BKASH_API_KEY,
 *		secret: process.env.BKASH_API_SECRET,
 *		username: process.env.BKASH_USERNAME,
 *		password: process.env.BKASH_PASSWORD,
 * });
 * ```
 */
export class BkashGateway {
	private token!: string;
	private refreshToken!: string;
	private tokenIssueTime!: number;
	private readonly secret: string;
	private readonly key: string;
	private readonly baseURL: string;
	private headers: IHeaders;
	/**
	 *
	 * @param config config object required by the `bkash-payment-gateway` package
	 * @example
	 * ```
	 * const bkashConfig = {
	 *   baseURL: 'https://checkout.sandbox.bka.sh/v1.2.0-beta/',
	 *   key: 'abcdxx2369',
	 *   username: 'bkashTest',
	 *   password: 'bkashPassword1',
	 *   secret: 'bkashSup3rS3cRet',
	 * }
	 * const bkash = new BkashGateway(config)
	 * ```
	 *
	 */

	constructor(config: IBkashConstructor) {
		// validations
		if (Object.keys(config).length !== 5) throw new BkashException('Invalid Configuration provided');
		this.validateConfig(config);

		//main task
		const { baseURL, key, password, secret, username } = config;
		this.baseURL = baseURL;
		this.key = key;
		this.secret = secret;
		this.headers = {
			username,
			password,
		};
	}

	/**
	 * Start the initial payment request
	 *
	 * @param paymentDetails Information required to start a payment flow
	 *
	 * @returns Promise of Bkash Create payment Response
	 * @example
	 * ```
	 * const result = await bkash.createPayment({
	 *   amount: 1000,
	 *   orderID: 'ORD1020069',
	 *   intent: 'sale',
	 * });
	 * ```
	 */
	public createPayment = async (paymentDetails: ICreatePayment): Promise<IBkashCreatePaymentResponse> => {
		const { amount, intent, orderID, merchantAssociationInfo } = paymentDetails;

		const payload = {
			amount,
			intent,
			currency: 'BDT',
			merchantInvoiceNumber: orderID,
			merchantAssociationInfo: merchantAssociationInfo ?? '',
		};

		const headers = await this.createTokenHeader();
		return await post<IBkashCreatePaymentResponse>(`${this.baseURL}/checkout/payment/create`, payload, headers);
	};

	/**
	 * Execute a payment after a user has completed bkash auth flow
	 * @param paymentID - Payment ID to Execute
	 * @example
	 * ```
	 * const result = await bkash.executePayment(paymentID);
	 * ```
	 */
	public executePayment = async (paymentID: string): Promise<IBkashExecutePaymentResponse> => {
		try {
			const headers = await this.createTokenHeader();
			return await post<IBkashExecutePaymentResponse>(
				`${this.baseURL}/checkout/payment/execute/${paymentID}`,
				undefined,
				headers
			);
		} catch (error) {
			if (error instanceof BkashException) {
				throw error;
			}

			throw new BkashException('Timeout of 30 Seconds Exceeded While Executing Payment, Please Query the Payment');
		}
	};

	/**
	 * Query Payment From Bkash
	 * @param paymentID - Payment ID to Query
	 *
	 * @example
	 * ```
	 * const result = await bkash.queryPayment(paymentID);
	 * ```
	 */
	public queryPayment = async (paymentID: string): Promise<IBkashQueryPaymentResponse> => {
		const headers = await this.createTokenHeader();
		return await get<IBkashQueryPaymentResponse>(`${this.baseURL}/checkout/payment/query/${paymentID}`, headers);
	};

	/**
	 * Search with a transaction ID
	 * @param trxID - Transaction ID to Search
	 *
	 * @example
	 * ```
	 * const result = await bkash.searchTransaction('TRX22347463XX');
	 * ```
	 */
	public searchTransaction = async (trxID: string): Promise<IBkashSearchTransactionResponse> => {
		return await get<IBkashSearchTransactionResponse>(
			`${this.baseURL}/checkout/payment/query/${trxID}`,
			await this.createTokenHeader()
		);
	};

	/**
	 * Refund a transaction
	 * @param trxID - Transaction ID to Search
	 *
	 * @example
	 * ```
	 * const refunTransactionData = {
	 *  paymentID: '22423169',
	 *  amount: '25.69', //do not add more than two decimal points
	 *  trxID: 'TRX22347463XX',
	 *  sku: 'SK256519',
	 * };
	 *
	 * const result = await bkash.refundTransaction(refunTransactionData);
	 * ```
	 */
	public refundTransaction = async (refundInfo: IRefundArgs): Promise<IBkashRefundResponse> => {
		return post<IBkashRefundResponse>(
			`${this.baseURL}/checkout/payment/refund`,
			refundInfo,
			await this.createTokenHeader()
		);
	};

	/**
	 * Check Refund Status for a given paymentID and transaction ID
	 * @param trxID transaction ID
	 * @param paymentID payment ID
	 * @example
	 * ```
	 * const result = await bkash.refundStatus('TRX22347463XX', '12437969');
	 * ```
	 */

	public refundStatus = async (trxID: string, paymentID: string): Promise<IBkashRefundStatusResponse> => {
		return await post<IBkashRefundStatusResponse>(
			`${this.baseURL}/checkout/payment/refund`,
			{ trxID, paymentID },
			await this.createTokenHeader()
		);
	};

	private createTokenHeader = async (): Promise<IHeaders> => {
		const token = await this.getToken();
		return {
			authorization: token,
			'x-app-key': this.key,
		};
	};
	private getToken = async (): Promise<string> => {
		if (!this.token) {
			const { id_token, refresh_token, msg, status } = await this.getInitialToken();

			//throw error if bkash sends status [only happens when request fails]
			if (status && msg) throw new BkashException(msg);

			this.token = id_token;
			this.refreshToken = refresh_token;
			this.tokenIssueTime = Date.now();
			return this.token;
		}

		const diff = diffSeconds(this.tokenIssueTime);

		if (diff < 3500) {
			return this.token;
		}

		//token is expired, refresh it
		const { id_token, refresh_token, msg, status } = await this.newToken(this.refreshToken);

		//throw error if bkash sends status [only happens when request fails]
		if (status && msg) throw new BkashException(msg);

		this.token = id_token;
		this.refreshToken = refresh_token;
		this.tokenIssueTime = Date.now();
		return this.token;
	};

	private getInitialToken = async (): Promise<IBkashTokenResponse> => {
		const response = await post<IBkashTokenResponse>(
			`${this.baseURL}/checkout/token/grant`,
			{
				app_key: this.key,
				app_secret: this.secret,
			},
			this.headers
		);
		if (response.status === 'fail') throw new BkashException('Invalid API Credentials Provided');
		return response;
	};

	private newToken = (refresh: string): Promise<IBkashTokenResponse> => {
		return post<IBkashTokenResponse>(
			`${this.baseURL}/checkout/token/refresh`,
			{
				app_key: this.key,
				app_secret: this.secret,
				refresh_token: refresh,
			},
			this.headers
		);
	};

	private validateConfig = (config: IBkashConstructor): void => {
		const { baseURL, key, password, secret, username } = config;

		if (!baseURL || baseURL === '') throw new BkashException('Invalid BaseURL provided');
		if (!key || key === '') throw new BkashException('Invalid API Key provided');
		if (!secret || secret === '') throw new BkashException('Invalid API secret provided');
		if (!username || username === '') throw new BkashException('Invalid API username provided');
		if (!password || password === '') throw new BkashException('Invalid API password provided');
	};
}

export default BkashGateway;
