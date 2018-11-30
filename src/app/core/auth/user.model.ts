import { Credentials } from './credentials.model';

export class User {
	constructor(
		public userModel: any = {}, // raw User model object,
		public credentials: Credentials = new Credentials(),
		public eua?: any) {
	}

	public setEua(eua: any) {
		this.eua = eua;
	}

	public setFromUserModel(userModel: any): User {
		if (null == userModel || null == userModel.username) {
			userModel = null;
		}

		this.userModel = userModel;

		return this;
	}
}
