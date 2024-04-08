import isEmpty from 'lodash/isEmpty';

export class Team {
	numResources: any = {};

	_id: string;
	name: string;
	description: string;
	created: string;
	implicitMembers: boolean;
	requiresExternalRoles: string[] = [];
	requiresExternalTeams: string[] = [];
	parent?: Team;

	constructor(model?: unknown) {
		this.setFromModel(model);
	}

	private setFromModel(model: unknown) {
		if (typeof model !== 'object') {
			return;
		}
		Object.assign(this, model);

		// Default to empty arrays if Object.assign wrote null/undefined
		this.requiresExternalRoles ??= [];
		this.requiresExternalTeams ??= [];

		// Replace raw objects (from Object.assign) with class instances
		if (this.parent) {
			this.parent = new Team(this.parent);
		}
	}

	hasResourcesOfType(type: string): boolean {
		if (!isEmpty(this.numResources) && this.numResources.hasOwnProperty(type)) {
			return this.numResources[type] > 0;
		}

		return false;
	}
}
