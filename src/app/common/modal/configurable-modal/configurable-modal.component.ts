import { LowerCasePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AbstractModalDirective } from '../abstract-modal.directive';
import { ModalAction, ModalCloseEvent, ModalInput } from '../modal.model';
import { ModalComponent } from '../modal/modal.component';

@Component({
	templateUrl: 'configurable-modal.component.html',
	styleUrls: ['configurable-modal.component.scss'],
	standalone: true,
	imports: [ModalComponent, NgIf, FormsModule, NgFor, LowerCasePipe]
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
