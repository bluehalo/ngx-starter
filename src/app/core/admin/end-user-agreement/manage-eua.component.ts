import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { DialogService } from '../../../common/dialog';
import { EndUserAgreement } from './eua.model';

export abstract class ManageEuaComponent {
	error?: string;
	eua = new EndUserAgreement();

	protected router = inject(Router);
	protected dialogService = inject(DialogService);

	protected constructor(
		public title: string,
		public subtitle: string,
		public submitText: string
	) {}

	abstract submitEua(): any;

	previewEua() {
		this.dialogService.alert(this.eua.title, this.eua.text);
	}
}
