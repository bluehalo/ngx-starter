export class CacheEntry {
	isRefreshing = false;
	date: number;

	constructor(public key: string, public value: any, public ts: number) {}
}
