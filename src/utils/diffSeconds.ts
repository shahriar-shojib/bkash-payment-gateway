/**
 *
 * @param date - Date in Milliseconds
 * @returns
 */
export function diffSeconds(date: number): number {
	const diff = Date.now() - date;
	return diff / 1000;
}
