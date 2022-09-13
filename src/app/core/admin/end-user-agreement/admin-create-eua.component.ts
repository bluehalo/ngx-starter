import { Component } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

import { EuaService } from './eua.service';
import { ManageEuaComponent } from './manage-eua.component';

@UntilDestroy()
@Component({
	selector: 'admin-create-eua',
	templateUrl: './manage-eua.component.html'
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
