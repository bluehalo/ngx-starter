export class CacheEntry {
	date: Date;

	constructor(
		public key: string,
		public value: any,
		public ts: number
	) {
		this.date = new Date(ts);
	}
}
