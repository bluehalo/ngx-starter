import { Component } from '@angular/core';

import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { ModalAction } from './modal.model';

@Component({
	templateUrl: 'modal.component.html'
})

export class ModalComponent {

	title: string;

	message: string;

	okText = 'OK';

	cancelText = 'Cancel';

	onClose: Subject<ModalAction> = new Subject();

	constructor(
		public modalRef: BsModalRef
	) {}

	ok() {
		this.modalRef.hide();
		this.onClose.next(ModalAction.OK);
	}

	cancel() {
		this.modalRef.hide();
		this.onClose.next(ModalAction.CANCEL);
	}
}
