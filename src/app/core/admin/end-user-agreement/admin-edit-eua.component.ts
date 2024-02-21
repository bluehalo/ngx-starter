import { NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { switchMap } from 'rxjs';

import { isNotNullOrUndefined } from '../../../common/rxjs-utils';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { EndUserAgreement } from './eua.model';
import { EuaService } from './eua.service';
import { ManageEuaComponent } from './manage-eua.component';

@Component({
	selector: 'admin-update-eua',
	templateUrl: './manage-eua.component.html',
	standalone: true,
	imports: [RouterLink, SystemAlertComponent, FormsModule, NgIf]
})
export class AdminUpdateEuaComponent extends ManageEuaComponent implements OnInit {
	private destroyRef = inject(DestroyRef);
	protected euaService = inject(EuaService);
	protected route = inject(ActivatedRoute);

	constructor() {
		super('Edit EUA', "Make changes to the EUA's information", 'Save');
	}

	ngOnInit() {
		this.route.params
			.pipe(
				switchMap((params: Params) => this.euaService.read(params['id'])),
				isNotNullOrUndefined(),
				takeUntilDestroyed(this.destroyRef)
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
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => this.router.navigate(['/admin/euas', { clearCachedFilter: true }]));
	}
}
