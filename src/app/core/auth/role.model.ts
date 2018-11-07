export class Role {

	constructor(
		public label: string,
		public description: string,
		public role: string
	) {}

	public static get ROLES(): Role[] {
		return [
			new Role('User', 'Account is enabled, has access to the system', 'user'),
			new Role('Editor', 'Can create and manage resources in the system', 'editor'),
			new Role('Auditor', 'Has the ability to view auditing, logging, and metrics information', 'auditor'),
			new Role('Admin', 'Has full, unrestricted access to the system', 'admin')
		];
	}

}
