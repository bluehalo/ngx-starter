import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { ModalService } from '../../../common/modal/modal.service';
import { EndUserAgreement } from './eua.model';

export abstract class ManageEuaComponent {
	error?: string;
	eua = new EndUserAgreement();

	protected router = inject(Router);
	protected modalService = inject(ModalService);

	protected constructor(
		public title: string,
		public subtitle: string,
		public submitText: string
	) {}

	abstract submitEua(): any;

	previewEua() {
		this.modalService.alert(this.eua.title, this.eua.text);
	}
}
