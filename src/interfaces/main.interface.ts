export interface IBkashConstructor {
	baseURL: string;
	key: string;
	secret: string;
	username: string;
	password: string;
}

export interface IRefundArgs extends Record<string, string> {
	paymentID: string;
	/**
	 * Must not contain more than 2 decimal points
	 * @example
	 * ```
	 * {
	 *   ...
	 *   amount: '25.69'
	 *   ...
	 * }
	 * ```
	 */
	amount: string;
	trxID: string;
	sku: string;
}
