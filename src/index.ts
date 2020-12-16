import { get, post } from './utils/request';
import { diffSeconds } from './utils/diffSeconds';
import { IHeaders } from './interfaces/headers.interface';

import {
	IBkashCreatePaymentResponse,
	IBkashExecutePaymentResponse,
	IBkashQueryPaymentResponse,
	IBkashTokenResponse,
} from './interfaces/bkashResponse.interface';

import { BkashException } from './exceptions/bkashException';
import { ICreatePayment } from './interfaces/createPayment.interface';
import { IBkashConstructor } from './interfaces/main.interface';

/**
 * Bkash Payment Gateway Main Entrypoint
 */
class BkashGateway {
	private token: string;
	private refreshToken: string;
	private tokenIssueTime: number;
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
	createPayment = async (paymentDetails: ICreatePayment): Promise<IBkashCreatePaymentResponse> => {
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
	 * Execute a payment after an user has completed bkash auth flow
	 * @param paymentID - Payment ID to Execute
	 * @example
	 * ```
	 * const result = await bkash.executePayment(paymentID);
	 * ```
	 */
	executePayment = async (paymentID: string): Promise<IBkashExecutePaymentResponse> => {
		try {
			const headers = await this.createTokenHeader();
			return await post<IBkashExecutePaymentResponse>(`${this.baseURL}/checkout/payment/execute/${paymentID}`, null, headers);
		} catch (error) {
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
	queryPayment = async (paymentID: string): Promise<IBkashQueryPaymentResponse> => {
		const headers = await this.createTokenHeader();
		return await get<IBkashQueryPaymentResponse>(`${this.baseURL}/checkout/payment/query/${paymentID}`, headers);
	};

	private createTokenHeader = async (): Promise<IHeaders> => {
		const token = await this.getToken();
		return {
			authorization: token,
			'x-app-key': this.key,
		};
	};
	private getToken = async (): Promise<string> => {
		if (this.token) {
			const diff = diffSeconds(this.tokenIssueTime);
			if (diff > 3500) {
				//request a new token if expired
				const { id_token, refresh_token, msg, status } = await this.newToken(this.refreshToken);

				//throw error if bkash sends status [only happens when request fails]
				if (status) throw new BkashException(msg);

				this.token = id_token;
				this.refreshToken = refresh_token;
				this.tokenIssueTime = Date.now();
			}

			return this.token;
		} else {
			//first time?
			const { id_token, refresh_token, msg, status } = await this.getInitialToken();

			//throw error if bkash sends status [only happens when request fails]
			if (status) throw new BkashException(msg);

			this.token = id_token;
			this.refreshToken = refresh_token;
			this.tokenIssueTime = Date.now();
			return this.token;
		}
	};

	private getInitialToken = (): Promise<IBkashTokenResponse> => {
		return post<IBkashTokenResponse>(
			`${this.baseURL}/checkout/token/grant`,
			{
				app_key: this.key,
				app_secret: this.secret,
			},
			this.headers
		);
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
}

export default BkashGateway;
