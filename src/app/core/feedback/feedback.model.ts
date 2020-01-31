export class Classification {
	prefix: string;
	level: string;
}

export class Feedback {
	text: string;

	type: string;

	subType: string;

	otherText: string;

	classification?: Classification;

	currentRoute: string;

	constructor() {}
}
