export class CacheEntry {
	isRefreshing = false;

	constructor(
		public key: string,
		public value: unknown,
		public ts: number
	) {}
}
