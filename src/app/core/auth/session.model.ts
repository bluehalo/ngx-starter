import { User } from './user.model';

export class Session {
	constructor(public user: User) {}

	public get name() {
		return this.user?.name;
	}
}
