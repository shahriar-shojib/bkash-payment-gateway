export type Intent = 'sale' | 'authorization';
export interface ICreatePayment {
	amount: number;
	orderID: string;
	intent: Intent;
	merchantAssociationInfo?: string;
}
