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
