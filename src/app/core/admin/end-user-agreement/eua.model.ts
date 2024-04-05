export class EndUserAgreement {
	_id: string;
	title = '';
	text = '';
	published: string;
	created: string;
	updated: string;

	constructor(model?: unknown) {
		this.setFromModel(model);
	}

	private setFromModel(model: unknown) {
		if (!model) {
			return;
		}
		Object.assign(this, model);
	}
}
