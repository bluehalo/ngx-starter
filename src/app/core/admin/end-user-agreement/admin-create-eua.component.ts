import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

import { ModalService } from '../../../common/modal/modal.service';
import { EndUserAgreement } from './eua.model';
import { EuaService } from './eua.service';
import { ManageEuaComponent } from './manage-eua.component';

@UntilDestroy()
@Component({
	selector: 'admin-create-eua',
	templateUrl: './manage-eua.component.html'
})
export class AdminCreateEuaComponent extends ManageEuaComponent {
	constructor(router: Router, modalService: ModalService, protected euaService: EuaService) {
		super(
			router,
			modalService,
			'Create EUA',
			'Provide the required information to create a new eua',
			'Create'
		);
	}

	submitEua() {
		const _eua = new EndUserAgreement();
		_eua.euaModel = {
			title: this.eua.euaModel.title,
			text: this.eua.euaModel.text
		};
		this.euaService
			.create(_eua)
			.pipe(untilDestroyed(this))
			.subscribe(() => this.router.navigate(['/admin/euas', { clearCachedFilter: true }]));
	}
}
