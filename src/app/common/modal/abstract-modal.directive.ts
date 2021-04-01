import { AfterViewInit, Directive } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { DOMUtils } from '../dom-utils.service';
import { ModalAction, ModalCloseEvent } from './modal.model';

/**
 * The AbstractModalDirective serves as the base for the ModalComponent and ContainerModalComponent and contains
 * the class properties and functions common to both.
 */
@Directive()
export abstract class AbstractModalDirective implements AfterViewInit {
	/**
	 * Title to display in the modal header
	 */
	title: string;

	/**
	 * Text to display on the modal 'ok' button
	 */
	okText: string;

	/**
	 * Text to display on the modal 'cancel' button
	 */
	cancelText: string;

	/**
	 * Whether or not to focus the first element
	 */
	focusFirstElement = false;

	/**
	 * ModalCloseEvent Subject that emits when the modal is closed for any reason
	 */
	onClose: Subject<ModalCloseEvent> = new Subject();

	constructor(public modalRef: BsModalRef) {}

	ok() {
		this.modalRef.hide();
		this.onClose.next({ action: ModalAction.OK });
	}

	cancel() {
		this.modalRef.hide();
		this.onClose.next({ action: ModalAction.CANCEL });
	}

	ngAfterViewInit(): void {
		window.setTimeout(() => {
			const modalQuerySelector = 'modal-container';
			DOMUtils.trapFocus(document, modalQuerySelector);
			if (this.focusFirstElement) {
				// Focus the second focusable element, as the first is the 'Close' button
				DOMUtils.getFocusableElements(document, modalQuerySelector)[1].focus();
			}
		}, 0);
	}
}
