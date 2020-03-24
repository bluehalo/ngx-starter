import { Component } from '@angular/core';

import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { ModalAction, ModalCloseEvent, ModalInput } from './modal.model';

@Component({
	templateUrl: 'modal.component.html'
})
export class ModalComponent {
	title: string;

	message: string;

	inputs: ModalInput[];

	okText: string;

	cancelText: string;

	formData: any = {};

	onClose: Subject<ModalCloseEvent> = new Subject();

	constructor(public modalRef: BsModalRef) {}

	ok() {
		this.modalRef.hide();
		const event: ModalCloseEvent = { action: ModalAction.OK };
		if (this.inputs) {
			event.inputData = this.formData;
		}
		this.onClose.next(event);
	}

	cancel() {
		this.modalRef.hide();
		this.onClose.next({ action: ModalAction.CANCEL });
	}
}
