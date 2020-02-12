import isEmpty from 'lodash/isEmpty';

export class Team {
	numResources: any = {};

	constructor(
		public _id?: string,
		public name?: string,
		public description?: string,
		public created?: number,
		public implicitMembers?: boolean,
		public requiresExternalRoles?: string[],
		public requiresExternalTeams?: string[]
	) {
		this.requiresExternalRoles = requiresExternalRoles || [];
		this.requiresExternalTeams = requiresExternalTeams || [];
	}

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
