export class User {
	public _id: string;
	public name: string;
	public username: string;
	public email: string;
	public phone: string;
	public organization: string;
	public acceptedEua: string;
	public lastLogin: string;
	public created: string;
	public updated: string;

	public externalRoles: string[] = [];
	public externalGroups: string[] = [];
	public teams: any[] = [];
	public canMasquerade = false;
	public bypassAccessCheck = false;

	public providerData: { dn?: string } & Record<string, unknown> = {};
	public roles: Record<string, boolean> = {};

	public eua?: any;

	constructor(model?: unknown) {
		this.setFromModel(model);
	}

	private setFromModel(model: unknown) {
		if (!model) {
			return;
		}
		Object.assign(this, model);

		// Default to empty arrays if Object.assign wrote null/undefined
		this.externalRoles ??= [];
		this.externalGroups ??= [];
		this.teams ??= [];

		// Default to empty object if Object.assign wrote null/undefined
		this.providerData ??= {};
		this.roles ??= {};
	}

	public setEua(eua: any) {
		this.eua = eua;
	}
}

export class EditUser extends User {
	password: string;
	verifyPassword: string;

	externalRolesDisplay: string;
	externalGroupsDisplay: string;
}
