export class Role {
	public static USER: Role = new Role(
		'User',
		'Account is enabled, has access to the system',
		'user'
	);
	public static EDITOR: Role = new Role(
		'Editor',
		'Can create and manage resources in the system',
		'editor'
	);
	public static AUDITOR: Role = new Role(
		'Auditor',
		'Has the ability to view auditing, logging, and metrics information',
		'auditor'
	);
	public static ADMIN: Role = new Role(
		'Admin',
		'Has full, unrestricted access to the system',
		'admin'
	);

	constructor(
		public label: string,
		public description: string,
		public role: string
	) {}

	public static get ROLES(): Role[] {
		return [this.USER, this.EDITOR, this.AUDITOR, this.ADMIN];
	}
}
