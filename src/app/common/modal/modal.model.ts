export enum ModalAction {
	OK = 0,
	CANCEL
}

export interface ModalCloseEvent {
	action: ModalAction;
	inputData?: any;
}

export interface ModalConfig {
	title: string;
	message?: string;
	okText?: string;
	cancelText?: string;
	inputs?: ModalInput[];
}

export interface ModalInput {
	type: 'textarea' | 'text';
	label: string;
	key: string;
	required: boolean;
}
