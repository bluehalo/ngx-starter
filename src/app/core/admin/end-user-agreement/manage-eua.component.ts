import { Router } from '@angular/router';

import { ModalService } from '../../../common/modal.module';
import { EndUserAgreement } from './eua.model';

export abstract class ManageEuaComponent {
	error?: string;
	eua = new EndUserAgreement();

	protected constructor(
		protected router: Router,
		protected modalService: ModalService,
		public title: string,
		public subtitle: string,
		public submitText: string
	) {}

	abstract submitEua(): any;

	previewEua() {
		this.modalService.alert(this.eua.euaModel.title, this.eua.euaModel.text);
	}
}
