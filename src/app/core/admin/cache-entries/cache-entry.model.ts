export class CacheEntry {
	isRefreshing = false;
	date: Date;

	constructor(
		public key: string,
		public value: any,
		public ts: number
	) {
		this.date = new Date(ts);
	}
}
