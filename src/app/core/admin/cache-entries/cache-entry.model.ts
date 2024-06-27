export class CacheEntry {
	isRefreshing = false;

	constructor(
		public key: string,
		public value: any,
		public ts: number
	) {}
}
