import isEmpty from 'lodash/isEmpty';

export class Team {
	numResources: any = {};

	_id: string;
	name: string;
	description: string;
	created: number;
	implicitMembers: boolean;
	requiresExternalRoles: string[] = [];
	requiresExternalTeams: string[] = [];
	parent?: Team;
	ancestors: Team[] = [];

	constructor() {}

	setFromModel(model: any): Team {
		if (null != model) {
			this._id = model._id;
			this.name = model.name;
			this.description = model.description;
			this.created = model.created;
			this.implicitMembers = model.implicitMembers;
			this.requiresExternalRoles = model.requiresExternalRoles || [];
			this.requiresExternalTeams = model.requiresExternalTeams || [];
			this.numResources = model.numResources;
			this.ancestors = model.ancestors;

			if (model.parent) {
				this.parent = new Team().setFromModel(model.parent);
			}
		}

		return this;
	}

	hasResourcesOfType(type: string): boolean {
		if (!isEmpty(this.numResources) && this.numResources.hasOwnProperty(type)) {
			return this.numResources[type] > 0;
		}

		return false;
	}
}
