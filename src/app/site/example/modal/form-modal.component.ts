import { Component, inject } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AbstractModalizableDirective } from '../../../common/modal/abstract-modalizable.directive';

@UntilDestroy()
@Component({
	templateUrl: 'form-modal.component.html'
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
