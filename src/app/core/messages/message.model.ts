export enum MessageType {
	MOTD = 'MOTD',
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR'
}

export class Message {
	public _id: string;
	public title: string;
	public type: MessageType;
	public body: string;
	public updated: string;
	public created: string;

	constructor(model?: unknown) {
		this.setFromModel(model);
	}

	private setFromModel(model: unknown) {
		if (!model) {
			return;
		}
		Object.assign(this, model);
	}
}
