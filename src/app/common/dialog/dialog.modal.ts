export enum DialogAction {
	OK,
	CANCEL
}

export class DialogReturn<T> {
	action: DialogAction;
	data?: T;
}
