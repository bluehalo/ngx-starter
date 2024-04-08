export enum MessageType {
	MOTD = 'MOTD' as any,
	INFO = 'INFO' as any,
	WARN = 'WARN' as any,
	ERROR = 'ERROR' as any
}

export class Message {
	public _id: string;
	public title: string;
	public type: MessageType;
	public body: string;
	public updated: string;
	public created: string;
	public creator: any;

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
