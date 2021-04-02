import { Type } from '@angular/core';

import { AbstractModalizableDirective } from './abstract-modalizable.directive';

export enum ModalAction {
	OK = 0,
	CANCEL
}

export interface ModalCloseEvent {
	action: ModalAction;
	inputData?: any;
}

interface BaseModalConfig {
	title: string;
	okText?: string;
	cancelText?: string;
	focusFirstElement?: boolean;
}

export interface ModalConfig extends BaseModalConfig {
	message?: string;
	inputs?: ModalInput[];
}

export interface ContainerModalConfig extends BaseModalConfig {
	modalizableComponent: Type<AbstractModalizableDirective>;
	modalizableComponentProperties?: object;
}

export interface ModalInput {
	type: 'textarea' | 'text';
	label: string;
	key: string;
	required: boolean;
}
