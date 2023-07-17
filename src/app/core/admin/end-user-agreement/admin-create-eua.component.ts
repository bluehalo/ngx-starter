import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { EuaService } from './eua.service';
import { ManageEuaComponent } from './manage-eua.component';

@UntilDestroy()
@Component({
	selector: 'admin-create-eua',
	templateUrl: './manage-eua.component.html',
	standalone: true,
	imports: [RouterLink, SystemAlertComponent, FormsModule, NgIf]
})
export class AdminCreateEuaComponent extends ManageEuaComponent {
	constructor(protected euaService: EuaService) {
		super('Create EUA', 'Provide the required information to create a new eua', 'Create');
	}

	submitEua() {
		this.euaService
			.create(this.eua)
			.pipe(untilDestroyed(this))
			.subscribe((eua) => {
				if (eua) {
					this.router.navigate(['/admin/euas', { clearCachedFilter: true }]);
				}
			});
	}
}
