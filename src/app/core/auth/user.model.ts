import { Credentials } from './credentials.model';

export class User {
	constructor(
		public userModel: any = {}, // raw User model object,
		public credentials: Credentials = new Credentials(),
		public eua?: any) {
	}

	public setFromUserModel(userModel: any): User {
		if (null == userModel || null == userModel.username) {
			userModel = null;
		}

		console.log(`Got user model ${JSON.stringify(userModel, null, '\t')}`);
		this.userModel = userModel;

		return this;
	}
}
