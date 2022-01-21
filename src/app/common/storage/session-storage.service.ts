import { StorageService } from './storage.service';

export class SessionStorageService extends StorageService {
	constructor() {
		super(sessionStorage);
	}
}
