export class EndUserAgreement {
	_id: string;
	title: string = '';
	text: string = '';
	published: string;
	created: string;
	updated: string;

	public setFromModel(model: any): EndUserAgreement {
		if (null == model) {
			return this;
		}

		Object.assign(this, model);

		return this;
	}
}
