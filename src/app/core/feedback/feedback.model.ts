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
	id: string;

	text: string;

	type: string;

	subType: string;

	otherText: string;

	classification?: Classification;

	currentRoute: string;

	status: FeedbackStatusOption;

	assignee?: string;

	updated: Date;

	creator: {
		email: string;
		name: string;
		username: string;
		organization: string;
	};

	constructor() {}
}
