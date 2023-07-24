import { Component, inject } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AbstractModalizableDirective } from '../../../common/modal/abstract-modalizable.directive';
import { FormsComponent } from '../forms/forms.component';

@UntilDestroy()
@Component({
	templateUrl: 'form-modal.component.html',
	standalone: true,
	imports: [FormsComponent]
})
export class FormModalComponent extends AbstractModalizableDirective {
	modalRef = inject(BsModalRef);

	onOk() {
		this.modalRef.hide();
	}
	onCancel() {
		this.modalRef.hide();
	}
}
