export class AuditOption {
	constructor(
		public display?: string,
		public selected: boolean = false
	) {}
}

export class AuditObjectTypes {
	public static objects: any = {};

	public static registerType(typeName: string, type: any) {
		AuditObjectTypes.objects[typeName] = type;
	}
}

export class AuditActionTypes {
	private static viewDetailsActions: string[] = ['create', 'delete'];

	private static viewChangesActions: string[] = ['update', 'admin update'];

	public static isViewDetailsAction(action: string) {
		return this.viewDetailsActions.includes(action);
	}

	public static registerViewDetailsAction(action: string) {
		this.viewDetailsActions.push(action);
	}

	public static isViewChangesAction(action: string) {
		return this.viewChangesActions.includes(action);
	}

	public static registerViewChangesAction(action: string) {
		this.viewChangesActions.push(action);
	}
}
