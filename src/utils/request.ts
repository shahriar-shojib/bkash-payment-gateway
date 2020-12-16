import fetch from 'node-fetch';

import { IHeaders } from '../interfaces/headers.interface';
import AbortController from 'abort-controller';

interface IPayload {
	[key: string]: unknown;
}

export function get<T>(url: string, additionalHeaders: IHeaders, returnsJSON = true): Promise<T> {
	return fetch(url, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Accept: 'application/json',
			...additionalHeaders,
		},
	}).then((r) => (returnsJSON ? r.json() : r.text()));
}

export async function post<T>(url: string, payload: IPayload = {}, additionalHeaders: IHeaders): Promise<T> {
	const controller = new AbortController();
	const timeout = setTimeout(() => {
		controller.abort();
	}, 30 * 1000);
	const response = await fetch(url, {
		headers: {
			'content-type': 'application/json',
			Accept: 'application/json',
			...additionalHeaders,
		},
		body: JSON.stringify(payload),
		method: 'POST',
		signal: controller.signal,
	});

	clearTimeout(timeout);
	return await response.json();
}
