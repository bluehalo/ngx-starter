export class AuditEntry {
	_id: string;
	created: string;
	audit: {
		action: string;
		auditType: string;
		object: { title: string; after?: unknown; before?: unknown };
		actor: { username: string };
	};

	constructor(model?: unknown) {
		this.setFromModel(model);
	}

	private setFromModel(model: unknown = {}) {
		Object.assign(this, model);
	}
}
