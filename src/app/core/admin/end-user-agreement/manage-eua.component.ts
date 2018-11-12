import { Router } from '@angular/router';

import { EndUserAgreement } from './eua.model';
import { ModalService } from '../../../common/modal.module';

export abstract class ManageEuaComponent {
	error: any;

	mode: string;
	id: string;
	eua: EndUserAgreement;
	preview: boolean;
	title: string;
	subtitle: string;
	submitText: string;

	constructor(
		public router: Router,
		public modalService: ModalService
	) {
		this.eua = new EndUserAgreement();
	}

	abstract submitEua(): any;

	previewEua() {
		this.modalService.alert(this.eua.euaModel.title, this.eua.euaModel.text);
	}
}
