export enum MessageType {
	MOTD = 'MOTD' as any,
	INFO = 'INFO' as any,
	WARN = 'WARN' as any,
	ERROR = 'ERROR' as any
}
export class Message {
	public _id: string;
	public title: string;
	public tearline: string;
	public type: MessageType;
	public body: string;
	public updated: number;
	public created: number;
	public creator: any;

	public setFromModel(model: any): Message {
		this._id = model._id;
		this.title = model.title;
		this.tearline = model.tearline;
		this.type = model.type;
		this.body = model.body;
		this.updated = model.updated;
		this.created = model.created;
		this.creator = model.creator;

		return this;
	}
}
