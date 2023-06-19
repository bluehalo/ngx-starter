import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs';

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
	constructor(protected euaService: EuaService, protected route: ActivatedRoute) {
		super('Edit EUA', "Make changes to the EUA's information", 'Save');
	}

	ngOnInit() {
		this.route.params
			.pipe(
				switchMap((params: Params) => this.euaService.read(params['id'])),
				isNotNullOrUndefined(),
				untilDestroyed(this)
			)
			.subscribe((eua) => {
				setTimeout(() => {
					this.eua = eua;
				}, 3000);
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
