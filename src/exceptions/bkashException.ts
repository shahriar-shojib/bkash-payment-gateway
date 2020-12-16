export class BkashException extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'BkashException';
		this.stack = this.stack ?? new Error().stack;
	}
}
