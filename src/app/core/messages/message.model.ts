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

	public setFromModel(model: any): Message {
		if (model == null) {
			return this;
		}

		Object.assign(this, model);

		return this;
	}
}
