export function diffSeconds(date: number): number {
	const diff = new Date(Date.now()).getTime() - new Date(date).getTime();
	return diff / 1000;
}
