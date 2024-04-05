export enum FeedbackStatusOption {
	NEW = 'New',
	OPEN = 'Open',
	CLOSED = 'Closed'
}

export class Classification {
	prefix: string;
	level: string;
}

export class Feedback {
	_id: string;

	body: string;

	type: string;

	subType: string;

	otherText: string;

	classification?: Classification;

	url: string;

	os: string;

	browser: string;

	status: FeedbackStatusOption;

	assignee?: string;

	created: Date;

	updated: Date;

	creator: {
		email: string;
		name: string;
		username: string;
		organization: string;
	};

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
