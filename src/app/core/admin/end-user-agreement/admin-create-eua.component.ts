import { NgIf } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { EuaService } from './eua.service';
import { ManageEuaComponent } from './manage-eua.component';

@Component({
	selector: 'admin-create-eua',
	templateUrl: './manage-eua.component.html',
	standalone: true,
	imports: [RouterLink, SystemAlertComponent, FormsModule, NgIf]
})
export class AdminCreateEuaComponent extends ManageEuaComponent {
	private destroyRef = inject(DestroyRef);
	protected euaService = inject(EuaService);

	constructor() {
		super('Create EUA', 'Provide the required information to create a new eua', 'Create');
	}

	submitEua() {
		this.euaService
			.create(this.eua)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((eua) => {
				if (eua) {
					this.router.navigate(['/admin/euas', { clearCachedFilter: true }]);
				}
			});
	}
}
