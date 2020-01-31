import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ModalAction } from './modal.model';
import { ModalComponent } from './modal.component';

@Injectable()
export class ModalService {
	private modalRef: BsModalRef;

	constructor(private modalService: BsModalService) {}

	alert(title: string, message: string, okText?: string): Observable<ModalAction> {
		this.showModalHelper(title, message, okText);
		this.modalRef.content.cancelText = null;
		return this.modalRef.content.onClose;
	}

	confirm(title: string, message: string, okText?: string): Observable<ModalAction> {
		this.showModalHelper(title, message, okText);
		return this.modalRef.content.onClose;
	}

	private showModalHelper(title: string, message: string, okText?: string) {
		this.modalRef = this.modalService.show(ModalComponent, {
			ignoreBackdropClick: true,
			class: 'modal-lg'
		});
		this.modalRef.content.title = title;
		this.modalRef.content.message = message;

		if (null != okText) {
			this.modalRef.content.okText = okText;
		}
	}
}
