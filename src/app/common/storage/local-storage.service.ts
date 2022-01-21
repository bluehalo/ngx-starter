import { StorageService } from './storage.service';

export class LocalStorageService extends StorageService {
	constructor() {
		super(localStorage);
	}
}
