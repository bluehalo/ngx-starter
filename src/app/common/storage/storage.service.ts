export class StorageService {
	constructor(private storage: Storage) {}

	setValue<T>(key: string, data: T): T {
		if (data) {
			this.storage.setItem(key, JSON.stringify(data));
		} else {
			this.storage.removeItem(key);
		}
		return data;
	}
	getValue<T>(key: string): T | undefined;
	getValue<T>(key: string, defaultValue: T): T;
	getValue<T>(key: string, defaultValue?: T): T | undefined {
		try {
			const item = this.storage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		} catch (error) {
			return defaultValue;
		}
	}

	removeValue(key: string) {
		this.storage.removeItem(key);
	}
}
