export class EndUserAgreement {

	constructor(
		public euaModel: any = {
			title: '',
			text: '',
		}
	) {}

	public setFromEuaModel(euaModel: any): EndUserAgreement {

		if (null == euaModel || null == euaModel.title) {
			euaModel = null;
		}

		this.euaModel = euaModel;
		return this;
	}
}
