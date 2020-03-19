import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { ModalAction, ModalCloseEvent, ModalConfig } from './modal.model';
import { ModalComponent } from './modal.component';
import { map } from 'rxjs/operators';

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

	show(contentConfig: ModalConfig, modalOptions: ModalOptions = {}): Observable<ModalCloseEvent> {
		const config = Object.assign(
			{
				ignoreBackdropClick: true,
				keyboard: false,
				class: 'modal-lg'
			},
			modalOptions
		);

		this.modalRef = this.modalService.show(ModalComponent, config);

		Object.assign(this.modalRef.content, contentConfig);

		return this.modalRef.content.onClose;
	}
}
