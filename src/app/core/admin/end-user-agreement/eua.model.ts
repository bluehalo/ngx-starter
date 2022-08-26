export class EndUserAgreement {
	_id: string;
	title: string = '';
	text: string = '';
	published: number;
	created: number;
	updated: number;

	public setFromModel(model: any): EndUserAgreement {
		if (null == model) {
			return this;
		}

		Object.assign(this, model);

		return this;
	}
}
