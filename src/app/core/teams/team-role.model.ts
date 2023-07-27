export class TeamRole {
	public static MEMBER: TeamRole = new TeamRole(
		'Member',
		'This user can view resources within this team.',
		'member'
	);
	public static EDITOR: TeamRole = new TeamRole(
		'Editor',
		'This user has member privileges and can also create and manage resources within this team',
		'editor'
	);
	public static ADMIN: TeamRole = new TeamRole(
		'Admin',
		'This user has editor privileges and can also manage team membership',
		'admin'
	);
	public static BLOCKED: TeamRole = new TeamRole(
		'Blocked',
		'This user has been blocked from accessing resources within this team',
		'blocked'
	);

	constructor(
		public label: string,
		public description: string,
		public role: string
	) {}

	public static get ROLES(): TeamRole[] {
		return [this.MEMBER, this.EDITOR, this.ADMIN, this.BLOCKED];
	}

	static getDisplay(role: string): string {
		return TeamRole.ROLES.find((tr: TeamRole) => tr.role === role)?.label ?? 'Unknown';
	}
}
