import { Component } from '@angular/core';

import { AbstractModalDirective } from '../abstract-modal.directive';
import { ModalAction, ModalCloseEvent, ModalInput } from '../modal.model';

@Component({
	templateUrl: 'configurable-modal.component.html',
	styleUrls: ['configurable-modal.component.scss']
})
export class ConfigurableModalComponent extends AbstractModalDirective {
	message = '';

	inputs: ModalInput[] = [];

	formData: any = {};

	override ok() {
		this.modalRef.hide();
		const event: ModalCloseEvent = { action: ModalAction.OK };
		if (this.inputs) {
			event.inputData = this.formData;
		}
		this.onClose.next(event);
	}
}
