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

class BkashGateway {
	private token: string;
	private refreshToken: string;
	private tokenIssueTime: number;
	private readonly secret: string;
	private readonly key: string;
	private readonly baseURL: string;
	private headers: IHeaders;

	constructor(baseURL: string, key: string, secret: string, username: string, password: string) {
		this.baseURL = baseURL;
		this.key = key;
		this.secret = secret;
		this.headers = {
			username,
			password,
		};
	}

	async createPayment(paymentDetails: ICreatePayment): Promise<IBkashCreatePaymentResponse> {
		const token = await this.getToken();
		const { amount, intent, orderID, merchantAssociationInfo } = paymentDetails;

		const payload = {
			amount,
			intent,
			currency: 'BDT',
			merchantInvoiceNumber: orderID,
			merchantAssociationInfo: merchantAssociationInfo ?? '',
		};

		const headers = {
			authorization: token,
			'x-app-key': this.key,
		};
		return await post<IBkashCreatePaymentResponse>(`${this.baseURL}/checkout/payment/create`, payload, headers);
	}

	async executePayment(paymentID: string): Promise<IBkashExecutePaymentResponse> {
		try {
			const token = await this.getToken();
			const headers = {
				authorization: token,
				'x-app-key': this.key,
			};

			return await post<IBkashExecutePaymentResponse>(`${this.baseURL}/checkout/payment/execute/${paymentID}`, null, headers);
		} catch (error) {
			throw new BkashException('Timeout of 30 Seconds Exceeded While Executing Payment, Please Query the Payment');
		}
	}

	async queryPayment(paymentID: string): Promise<IBkashQueryPaymentResponse> {
		const token = await this.getToken();
		const headers = {
			authorization: token,
			'x-app-key': this.key,
		};
		return await get<IBkashQueryPaymentResponse>(`${this.baseURL}/checkout/payment/query/${paymentID}`, headers);
	}

	async getToken(): Promise<string> {
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
	}

	private getInitialToken(): Promise<IBkashTokenResponse> {
		return post<IBkashTokenResponse>(
			`${this.baseURL}/checkout/token/grant`,
			{
				app_key: this.key,
				app_secret: this.secret,
			},
			this.headers
		);
	}

	private newToken(refresh: string): Promise<IBkashTokenResponse> {
		return post<IBkashTokenResponse>(
			`${this.baseURL}/checkout/token/refresh`,
			{
				app_key: this.key,
				app_secret: this.secret,
				refresh_token: refresh,
			},
			this.headers
		);
	}
}
export default BkashGateway;
