import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs';

import { ModalService } from '../../../common/modal/modal.service';
import { isNotNullOrUndefined } from '../../../common/rxjs-utils';
import { EndUserAgreement } from './eua.model';
import { EuaService } from './eua.service';
import { ManageEuaComponent } from './manage-eua.component';

@UntilDestroy()
@Component({
	selector: 'admin-update-eua',
	templateUrl: './manage-eua.component.html'
})
export class AdminUpdateEuaComponent extends ManageEuaComponent implements OnInit {
	constructor(
		router: Router,
		modalService: ModalService,
		protected euaService: EuaService,
		protected route: ActivatedRoute
	) {
		super(router, modalService, 'Edit EUA', "Make changes to the EUA's information", 'Save');
	}

	ngOnInit() {
		this.route.params
			.pipe(
				untilDestroyed(this),
				switchMap((params: Params) => this.euaService.read(params['id'])),
				isNotNullOrUndefined()
			)
			.subscribe((eua) => {
				this.eua = eua;
			});
	}

	submitEua() {
		const _eua = new EndUserAgreement().setFromModel(this.eua);
		this.euaService
			.update(_eua)
			.pipe(untilDestroyed(this))
			.subscribe(() => this.router.navigate(['/admin/euas', { clearCachedFilter: true }]));
	}
}
