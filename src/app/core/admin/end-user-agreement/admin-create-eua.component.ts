import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EndUserAgreement } from './eua.model';
import { EuaService } from './eua.service';
import { ManageEuaComponent } from './manage-eua.component';
import { ModalService } from '../../../common/modal.module';

@Component({
	selector: 'admin-create-eua',
	templateUrl: './manage-eua.component.html'
})
export class AdminCreateEuaComponent extends ManageEuaComponent implements OnInit {

	constructor(
		router: Router,
		public modalService: ModalService,
		protected euaService: EuaService

	) {
		super(router, modalService);
	}

	ngOnInit() {
		// Admin create mode
		this.title = 'Create EUA';
		this.subtitle = 'Provide the required information to create a new eua';
		this.submitText = 'Create';
	}

	submitEua() {
		let _eua = new EndUserAgreement();
		_eua.euaModel = {
			title: this.eua.euaModel.title,
			text: this.eua.euaModel.text
		};
		this.euaService.create(_eua).subscribe(() => this.router.navigate(['/admin/euas', {clearCachedFilter: true}]));
	}
}
