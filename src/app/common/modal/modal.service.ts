import { Injectable } from '@angular/core';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContainerModalComponent } from './container-modal/container-modal.component';
import { ContainerModalConfig, ModalAction, ModalCloseEvent, ModalConfig } from './modal.model';
import { ModalComponent } from './modal/modal.component';
import { AbstractModalizableDirective } from './abstract-modalizable.directive';

@Injectable()
export class ModalService {
	private modalRef: BsModalRef;

	constructor(private modalService: BsModalService) {}

	alert(
		title: string,
		message: string,
		okText = 'OK',
		modalOptions?: ModalOptions
	): Observable<ModalAction> {
		return this.show(
			{
				title,
				message,
				okText
			},
			modalOptions
		).pipe(map(event => event.action));
	}

	confirm(
		title: string,
		message: string,
		okText = 'OK',
		cancelText = 'Cancel',
		modalOptions?: ModalOptions
	): Observable<ModalAction> {
		return this.show(
			{
				title,
				message,
				okText,
				cancelText
			},
			modalOptions
		).pipe(map(event => event.action));
	}

	prompt(
		title: string,
		message: string,
		inputLabel: string,
		okText = 'OK',
		cancelText = 'Cancel',
		modalOptions?: ModalOptions
	): Observable<ModalCloseEvent> {
		return this.show(
			{
				title,
				message,
				okText,
				cancelText,
				inputs: [{ type: 'text', label: inputLabel, key: 'prompt', required: true }]
			},
			modalOptions
		);
	}

	/**
	 * The show method will display a modal that can include a message and a form
	 */
	show(contentConfig: ModalConfig, modalOptions: ModalOptions = {}): Observable<ModalCloseEvent> {
		const config = Object.assign(
			{
				ignoreBackdropClick: true,
				keyboard: false,
				class: 'modal-lg'
			},
			modalOptions
		);

		config.initialState = contentConfig;
		this.modalRef = this.modalService.show(ModalComponent, config);
		return this.modalRef.content.onClose;
	}

	/**
	 * The showContainerModal method will display a modal containing any modalized component of your choosing.
	 */
	showContainerModal<T extends AbstractModalizableDirective>(
		contentConfig: ContainerModalConfig<T>,
		modalOptions: ModalOptions = {}
	): Observable<ModalCloseEvent> {
		const config = Object.assign(
			{
				ignoreBackdropClick: true,
				keyboard: false,
				class: 'modal-dialog-scrollable modal-lg'
			},
			modalOptions
		);

		config.initialState = contentConfig;
		this.modalRef = this.modalService.show(ContainerModalComponent, config);
		return this.modalRef.content.onClose;
	}
}
